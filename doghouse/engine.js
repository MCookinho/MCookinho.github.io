/* ===== ENGINE.JS ===== */
/* Canvas renderer, câmera, tilemap, input, audio */

const TILE_SIZE = 16;
const MAP_COLS = 20;
const MAP_ROWS = 15;
const CANVAS_W = 640;
const CANVAS_H = 480;

/* ===== INPUT ===== */
class Input {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this._justPressedQueue = {};
    window.addEventListener('keydown', e => {
      const key = e.key.toLowerCase();
      if (['w','a','s','d','e','f','shift','enter','escape','1','2','3','4','5','6','7','8','9','0','arrowup','arrowdown','arrowleft','arrowright'].includes(key) || key === ' ') {
        e.preventDefault();
      }
      if (!this.keys[key]) {
        this._justPressedQueue[key] = true;
      }
      this.keys[key] = true;
      if (key === ' ') this.keys[' '] = true;
    });
    window.addEventListener('keyup', e => {
      const key = e.key.toLowerCase();
      this.keys[key] = false;
      if (key === ' ') this.keys[' '] = false;
    });
  }
  isDown(key) { return !!this.keys[key]; }
  wasPressed(key) { return !!this.justPressed[key]; }
  update() {
    this.justPressed = { ...this._justPressedQueue };
    this._justPressedQueue = {};
  }
}

/* ===== CAMERA ===== */
class Camera {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.shakeTimer = 0;
    this.shakeIntensity = 0;
  }
  follow(px, py, mapW, mapH) {
    this.targetX = 0;
    this.targetY = 0;
  }
  update(dt) {
    this.x += (this.targetX - this.x) * Math.min(1, 10 * dt);
    this.y += (this.targetY - this.y) * Math.min(1, 10 * dt);
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      const sx = (Math.random() - 0.5) * this.shakeIntensity;
      const sy = (Math.random() - 0.5) * this.shakeIntensity;
      this.x += sx;
      this.y += sy;
    }
  }
  shake(intensity, duration) {
    this.shakeIntensity = intensity;
    this.shakeTimer = duration;
  }
  getScale() { return 2; }
}

/* ===== TILEMAP ===== */
class Tilemap {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.tiles = data.tiles || [];
    this.wall = data.wall || [];
    this.collision = data.collision || [];
    this.objects = data.objects || [];
    this.connections = data.connections || [];
    this.ambient = data.ambient || 'casa';
    this.light = data.light !== undefined ? data.light : 0.5;
    this.width = MAP_COLS;
    this.height = MAP_ROWS;
    this.playerStart = data.playerStart || { x: 5 * TILE_SIZE, y: 7 * TILE_SIZE };
  }
  isBlocked(tx, ty) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return true;
    return !!this.collision[ty] && !!this.collision[ty][tx];
  }
  getTile(tx, ty) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return 0;
    return (this.tiles[ty] && this.tiles[ty][tx]) || 0;
  }
  getWall(tx, ty) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return 0;
    return (this.wall[ty] && this.wall[ty][tx]) || 0;
  }
  render(ctx, camera, sprites) {
    const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE));
    const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE));
    const endCol = Math.min(this.width, Math.ceil((camera.x + CANVAS_W) / TILE_SIZE) + 1);
    const endRow = Math.min(this.height, Math.ceil((camera.y + CANVAS_H) / TILE_SIZE) + 1);

    // chao
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tileId = this.tiles[row] && this.tiles[row][col];
        if (!tileId || tileId === 0) continue;
        const sx = col * TILE_SIZE - camera.x;
        const sy = row * TILE_SIZE - camera.y;
        this._drawTile(ctx, sprites, tileId, sx, sy, col, row);
      }
    }
    // parede
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const wallId = this.wall[row] && this.wall[row][col];
        if (!wallId || wallId === 0) continue;
        const sx = col * TILE_SIZE - camera.x;
        const sy = row * TILE_SIZE - camera.y;
        this._drawTile(ctx, sprites, wallId, sx, sy, col, row);
      }
    }
    // objetos (items, notes, puzzles, shiva events)
    this.renderObjects(ctx, camera, sprites);
  }
  renderObjects(ctx, camera, sprites) {
    const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE) - 1);
    const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE) - 1);
    const endCol = Math.min(this.width, Math.ceil((camera.x + CANVAS_W) / TILE_SIZE) + 1);
    const endRow = Math.min(this.height, Math.ceil((camera.y + CANVAS_H) / TILE_SIZE) + 1);

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const obj = this.getObjectAt(col, row);
        if (!obj) continue;
        const sx = col * TILE_SIZE - camera.x;
        const sy = row * TILE_SIZE - camera.y;

        let sprite = null;
        if (obj.type === 'item') {
          sprite = sprites.getItemSprite(obj.item);
        } else if (obj.type === 'note') {
          sprite = sprites.getItemSprite('note');
        } else if (obj.type === 'puzzle') {
          // puzzle icon - pulsing effect
          const pulse = Math.sin(Date.now() * 0.005) * 2;
          sprite = sprites.getItemSprite('memory');
          if (sprite) sprites.renderSprite(ctx, sprite, sx, sy + pulse, 1);
          continue;
        } else if (obj.type === 'shiva_event') {
          sprite = sprites.getCharacterSprite('shiva_shadow');
        }

        if (sprite) {
          sprites.renderSprite(ctx, sprite, sx, sy, 1);
        }
      }
    }
  }
  _drawTile(ctx, sprites, id, sx, sy, col, row) {
    const tileSprite = sprites.getTileSprite(id, col, row);
    if (!tileSprite) return;
    if (typeof tileSprite === 'function') {
      tileSprite(ctx, sx, sy);
    } else if (Array.isArray(tileSprite)) {
      for (let r = 0; r < TILE_SIZE; r++) {
        for (let c = 0; c < TILE_SIZE; c++) {
          const ci = tileSprite[r] && tileSprite[r][c];
          if (ci === undefined || ci === null || ci === 0) continue;
          ctx.fillStyle = PALETTE_16[ci];
          ctx.fillRect(sx + c, sy + r, 1, 1);
        }
      }
    }
  }
  getObjectAt(tx, ty) {
    return this.objects.find(o => o.x === tx && o.y === ty);
  }
  removeObject(obj) {
    const idx = this.objects.indexOf(obj);
    if (idx !== -1) this.objects.splice(idx, 1);
  }
}

/* ===== ENGINE ===== */
class Engine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;
    this._resizeCanvas();
    window.addEventListener('resize', () => this._resizeCanvas());

    this.input = new Input();
    this.camera = new Camera(CANVAS_W, CANVAS_H);
    this.currentMap = null;
    this.maps = {};
    this.sprites = null;
    this.player = null;
    this.shivaSystem = null;
    this.puzzles = null;
    this.story = null;
    this.audio = new Audio();
    this.running = false;
    this.lastTime = 0;
    this.state = {
      day: 1,
      phase: 'loading',
      gameTime: 0,
      memories: [false, false, false, false, false, false],
      lanternOn: false,
      lanternBattery: 60,
      shivaWatching: false,
      watcherTimer: 0,
    };
  }
  _resizeCanvas() {
    const scale = Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H);
    const w = Math.floor(CANVAS_W * scale);
    const h = Math.floor(CANVAS_H * scale);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
  }
  setMap(mapId) {
    const map = this.maps[mapId];
    if (!map) return;
    this.currentMap = map;
    this.camera.follow();
    // HUD day
    const dayMap = {
      quarto:1, corredor:1, sala:1, calcada:2, rua:2,
      portao:2, praca:3, beco:3, casa_iluminada:4, igreja:5,
      cemiterio:6, parque:7
    };
    this.state.day = dayMap[mapId] || 1;
    document.getElementById('hud-day').textContent = 'DIA ' + this.state.day;
    // ambient audio
    this.audio.setAmbient(map.ambient);
  }
  loadMap(mapId, data) {
    this.maps[mapId] = new Tilemap(data);
  }
  init(sprites, player, shivaSystem, puzzles, story) {
    this.sprites = sprites;
    this.player = player;
    this.shivaSystem = shivaSystem;
    this.puzzles = puzzles;
    this.story = story;
  }
  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }
  loop(timestamp) {
    if (!this.running) return;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;
    this.input.update();
    this.update(dt);
    this.render();
    requestAnimationFrame(t => this.loop(t));
  }
  update(dt) {
    this.state.gameTime += dt;
    // player
    if (this.player) this.player.update(dt, this);
    // shiva
    if (this.shivaSystem) this.shivaSystem.update(dt, this);
    // camera (fixed at origin)
    this.camera.update(dt);
    // watcher timer
    if (this.state.watcherTimer > 0) {
      this.state.watcherTimer -= dt;
      if (this.state.watcherTimer <= 0) {
        this.state.shivaWatching = false;
        document.getElementById('hud-shiva').classList.remove('watching');
      }
    }
    // lantern battery
    if (this.state.lanternOn) {
      this.state.lanternBattery -= dt;
      if (this.state.lanternBattery <= 0) {
        this.state.lanternOn = false;
        this.state.lanternBattery = 0;
        this.audio.playLanternToggle();
        this._updateLanternHUD();
      }
    } else if (this.state.lanternBattery < 60) {
      this.state.lanternBattery = Math.min(60, this.state.lanternBattery + dt * 0.5);
    }
    this._updateLanternHUD();
  }
  render() {
    const ctx = this.ctx;
    ctx.fillStyle = '#0a0505';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    if (!this.currentMap || !this.sprites) return;

    // escala 2x estilo Undertale (mundo 320x240 → canvas 640x480)
    ctx.save();
    ctx.scale(2, 2);

    this.currentMap.render(ctx, this.camera, this.sprites);
    if (this.player) this.player.render(ctx, this.camera);
    if (this.shivaSystem) this.shivaSystem.render(ctx, this.camera);

    ctx.restore();

    // escuridão em espaço da tela (não escala)
    this._renderDarkness(ctx);
  }
  _renderDarkness(ctx) {
    if (!this.player) return;
    // converte posição do player para espaço da tela (×2)
    const px = (this.player.x + TILE_SIZE / 2) * 2;
    const py = (this.player.y + TILE_SIZE / 2) * 2;
    const radius = (this.state.lanternOn ? 80 : 48) * 2;
    const gradient = ctx.createRadialGradient(px, py, 16, px, py, radius);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(10,5,5,1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
  _updateLanternHUD() {
    const el = document.getElementById('hud-lantern');
    el.innerHTML = 'LANTERNA: ' + (this.state.lanternOn ? 'ON' : 'OFF') +
      '<br><div class="battery"><span style="width:' +
      ((this.state.lanternBattery / 60) * 100) + '%"></span></div>';
  }
  transitionToMap(mapId, px, py) {
    this.fadeOut(() => {
      this.setMap(mapId);
      if (this.player) {
        this.player.x = px !== undefined ? px : this.currentMap.playerStart.x;
        this.player.y = py !== undefined ? py : this.currentMap.playerStart.y;
      }
      this.fadeIn();
    });
  }
  fadeOut(callback) {
    const el = document.getElementById('fade-overlay');
    el.classList.add('active');
    setTimeout(callback, 500);
  }
  fadeIn() {
    const el = document.getElementById('fade-overlay');
    el.classList.remove('active');
  }
  showInteractPrompt(show) {
    document.getElementById('hud-interact').classList.toggle('show', show);
  }
  setShivaStatus(text) {
    const el = document.getElementById('hud-shiva');
    el.textContent = text;
  }
  setWatching(active) {
    this.state.shivaWatching = active;
    this.state.watcherTimer = active ? 15 : 0;
    const el = document.getElementById('hud-shiva');
    if (active) {
      el.textContent = 'VOCÊ ESTÁ SENDO OBSERVADO';
      el.classList.add('watching');
    } else {
      el.classList.remove('watching');
    }
  }
}

/* ===== AUDIO ===== */
class Audio {
  constructor() {
    this.ctx = null;
    this.ambientNodes = [];
    this.ambientGain = null;
    this.masterGain = null;
    this._unlock();
  }
  _unlock() {
    const unlock = () => {
      this._ensureCtx();
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
  }
  _ensureCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }
  /* ---- noise buffer helper ---- */
  _noiseBuffer(dur) {
    const ctx = this._ensureCtx();
    const len = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }
  /* ---- burst: filtered noise with envelope ---- */
  _burst(freq, Q, dur, vol, type) {
    try {
      const ctx = this._ensureCtx();
      const src = ctx.createBufferSource();
      src.buffer = this._noiseBuffer(dur);
      const flt = ctx.createBiquadFilter();
      flt.type = type || 'bandpass';
      flt.frequency.value = freq;
      flt.Q.value = Q || 1;
      const gn = ctx.createGain();
      gn.gain.setValueAtTime(vol || 0.3, ctx.currentTime);
      gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      src.connect(flt);
      flt.connect(gn);
      gn.connect(this.masterGain);
      src.start();
      src.stop(ctx.currentTime + dur);
    } catch(e) {}
  }
  /* ---- tone ---- */
  _tone(freq, dur, vol, type) {
    try {
      const ctx = this._ensureCtx();
      const osc = ctx.createOscillator();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      const gn = ctx.createGain();
      gn.gain.setValueAtTime(vol || 0.25, ctx.currentTime);
      gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gn);
      gn.connect(this.masterGain);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch(e) {}
  }

  /* ---- AMBIENT ---- */
  setAmbient(type) {
    this.stopAmbient();
    if (type === 'casa') this._ambientCasa();
    else if (type === 'rua' || type === 'externa') this._ambientRua();
  }
  stopAmbient() {
    this.ambientNodes.forEach(n => {
      try { n.stop(); } catch(e) {}
      try { n.disconnect(); } catch(e) {}
    });
    this.ambientNodes = [];
    if (this.ambientGain) { this.ambientGain.disconnect(); this.ambientGain = null; }
  }
  _ambientCasa() {
    try {
      const ctx = this._ensureCtx();
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.value = 0.06;
      this.ambientGain.connect(this.masterGain);
      // low electrical hum
      const hum = ctx.createOscillator();
      hum.type = 'sine'; hum.frequency.value = 55;
      // slight wobble
      const lfo = ctx.createOscillator();
      lfo.type = 'sine'; lfo.frequency.value = 0.7;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 3;
      lfo.connect(lfoG); lfoG.connect(hum.frequency);
      hum.connect(this.ambientGain);
      hum.start(); lfo.start();
      this.ambientNodes = [hum, lfo];
      // occasional creak
      const _creak = () => {
        if (Math.random() < 0.3) return;
        this._burst(800, 4, 0.15, 0.04, 'bandpass');
        setTimeout(_creak, 3000 + Math.random() * 4000);
      };
      setTimeout(_creak, 2000);
    } catch(e) {}
  }
  _ambientRua() {
    try {
      const ctx = this._ensureCtx();
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.value = 0.05;
      this.ambientGain.connect(this.masterGain);
      // wind noise
      const buf = this._noiseBuffer(4);
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const wndFlt = ctx.createBiquadFilter();
      wndFlt.type = 'lowpass'; wndFlt.frequency.value = 400;
      // LFO sweeps filter
      const lfo = ctx.createOscillator();
      lfo.type = 'sine'; lfo.frequency.value = 0.15;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 300;
      lfo.connect(lfoG); lfoG.connect(wndFlt.frequency);
      src.connect(wndFlt);
      wndFlt.connect(this.ambientGain);
      src.start(); lfo.start();
      this.ambientNodes = [src, lfo];
    } catch(e) {}
  }

  /* ---- FOOTSTEPS ---- */
  playFootstep(surface) {
    if (surface === 'casa') {
      // wood floor thud
      this._burst(120, 0.8, 0.05, 0.2, 'lowpass');
      this._burst(400, 2, 0.03, 0.06, 'bandpass');
    } else if (surface === 'grama') {
      // soft rustle
      this._burst(600, 1, 0.07, 0.1, 'bandpass');
    } else {
      // concrete tap
      this._burst(800, 3, 0.04, 0.15, 'highpass');
      this._burst(200, 1, 0.05, 0.08, 'lowpass');
    }
  }

  /* ---- DOOR ---- */
  playDoorOpen() {
    // wooden creak: sweep + resonance
    try {
      const ctx = this._ensureCtx();
      const dur = 0.35;
      const buf = this._noiseBuffer(dur);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      // dual filters for creaky resonance
      const f1 = ctx.createBiquadFilter();
      f1.type = 'bandpass'; f1.frequency.value = 600; f1.Q.value = 8;
      const f2 = ctx.createBiquadFilter();
      f2.type = 'bandpass'; f2.frequency.value = 1200; f2.Q.value = 5;
      const gn = ctx.createGain();
      gn.gain.setValueAtTime(0.25, ctx.currentTime);
      gn.gain.linearRampToValueAtTime(0.1, ctx.currentTime + dur * 0.3);
      gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      src.connect(f1); f1.connect(f2); f2.connect(gn);
      gn.connect(this.masterGain);
      src.start(); src.stop(ctx.currentTime + dur);
      // low thud
      this._burst(80, 2, 0.2, 0.12, 'lowpass');
    } catch(e) {}
  }

  /* ---- SHIVA GROWL ---- */
  playShivaGrowl() {
    try {
      const ctx = this._ensureCtx();
      // deep sawtooth + noise
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 1.2);
      // waveshaper for distortion
      const ws = ctx.createWaveShaper();
      ws.curve = new Float32Array([-0.8, -0.6, -0.3, 0, 0.3, 0.6, 0.8]);
      const gn = ctx.createGain();
      gn.gain.setValueAtTime(0.15, ctx.currentTime);
      gn.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
      gn.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
      osc.connect(ws); ws.connect(gn); gn.connect(this.masterGain);
      osc.start(); osc.stop(ctx.currentTime + 1.2);
      // growly noise
      this._burst(150, 2, 0.8, 0.08, 'lowpass');
    } catch(e) {}
  }

  /* ---- PUZZLE SOLVED ---- */
  playPuzzleSolved() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this._tone(f, 0.15, 0.2, 'sine'), i * 100);
    });
  }

  /* ---- ITEM COLLECT ---- */
  playItemCollect() {
    this._tone(880, 0.08, 0.2, 'sine');
    setTimeout(() => this._tone(1320, 0.1, 0.15, 'sine'), 60);
  }

  /* ---- LANTERN ---- */
  playLanternToggle() {
    this._burst(3000, 10, 0.03, 0.12, 'bandpass');
    this._tone(2000, 0.03, 0.08, 'square');
  }

  /* ---- HOWL (distant) ---- */
  playHowl() {
    try {
      const ctx = this._ensureCtx();
      const dur = 2.5;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.8);
      osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 1.5);
      osc.frequency.linearRampToValueAtTime(260, ctx.currentTime + dur);
      // vibrato
      const vib = ctx.createOscillator();
      vib.type = 'sine'; vib.frequency.value = 5;
      const vibG = ctx.createGain();
      vibG.gain.value = 15;
      vib.connect(vibG); vibG.connect(osc.frequency);
      // envelope
      const gn = ctx.createGain();
      gn.gain.setValueAtTime(0.01, ctx.currentTime);
      gn.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.4);
      gn.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1);
      gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      // reverb via delay
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.25;
      const dGn = ctx.createGain();
      dGn.gain.value = 0.25;
      osc.connect(gn);
      gn.connect(this.masterGain);
      gn.connect(delay); delay.connect(dGn); dGn.connect(this.masterGain);
      osc.start(); osc.stop(ctx.currentTime + dur);
      vib.start(); vib.stop(ctx.currentTime + dur);
      // distant low rumble after
      setTimeout(() => this._burst(60, 1, 0.5, 0.04, 'lowpass'), 600);
    } catch(e) {}
  }

  /* ---- SHIVA APPEAR ---- */
  playShivaAppear() {
    this._burst(200, 6, 0.15, 0.1, 'bandpass');
    setTimeout(() => this._burst(100, 4, 0.2, 0.06, 'lowpass'), 100);
  }
}
