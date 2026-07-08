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
    this.worldWidth = width;
    this.worldHeight = height;
    this.shakeTimer = 0;
    this.shakeIntensity = 0;
  }
  follow(px, py, mapW, mapH) {
    this.targetX = px - CANVAS_W / 2 + TILE_SIZE / 2;
    this.targetY = py - CANVAS_H / 2 + TILE_SIZE / 2;
    this.worldWidth = mapW * TILE_SIZE;
    this.worldHeight = mapH * TILE_SIZE;
  }
  update(dt) {
    this.x += (this.targetX - this.x) * Math.min(1, 10 * dt);
    this.y += (this.targetY - this.y) * Math.min(1, 10 * dt);
    this.x = Math.max(0, Math.min(this.worldWidth - CANVAS_W, this.x));
    this.y = Math.max(0, Math.min(this.worldHeight - CANVAS_H, this.y));
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
        this._drawTile(ctx, sprites, tileId, sx, sy);
      }
    }
    // parede
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const wallId = this.wall[row] && this.wall[row][col];
        if (!wallId || wallId === 0) continue;
        const sx = col * TILE_SIZE - camera.x;
        const sy = row * TILE_SIZE - camera.y;
        this._drawTile(ctx, sprites, wallId, sx, sy);
      }
    }
  }
  _drawTile(ctx, sprites, id, sx, sy) {
    const tileSprite = sprites.getTileSprite(id);
    if (!tileSprite) return;
    if (typeof tileSprite === 'function') {
      tileSprite(ctx, sx, sy);
    } else if (Array.isArray(tileSprite)) {
      for (let row = 0; row < TILE_SIZE; row++) {
        for (let col = 0; col < TILE_SIZE; col++) {
          const ci = tileSprite[row] && tileSprite[row][col];
          if (ci === undefined || ci === null || ci === 0) continue;
          ctx.fillStyle = PALETTE_16[ci];
          ctx.fillRect(sx + col, sy + row, 1, 1);
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
    this.camera.follow(
      this.player ? this.player.x : map.playerStart.x,
      this.player ? this.player.y : map.playerStart.y,
      map.width, map.height
    );
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
    // camera
    if (this.player) {
      this.camera.follow(this.player.x, this.player.y,
        this.currentMap.width, this.currentMap.height);
    }
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

    this.currentMap.render(ctx, this.camera, this.sprites);
    // player
    if (this.player) this.player.render(ctx, this.camera);
    // shiva
    if (this.shivaSystem) this.shivaSystem.render(ctx, this.camera);
    // darkness overlay
    this._renderDarkness(ctx);
  }
  _renderDarkness(ctx) {
    if (!this.player) return;
    const px = this.player.x - this.camera.x + TILE_SIZE / 2;
    const py = this.player.y - this.camera.y + TILE_SIZE / 2;
    const radius = this.state.lanternOn ? 80 : 48;
    const gradient = ctx.createRadialGradient(px, py, 8, px, py, radius);
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
    this.ambientNode = null;
    this.ambientGain = null;
    this.masterGain = null;
    this._unlock();
  }
  _unlock() {
    const unlock = () => {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
  }
  getCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }
  playNoise(freq, duration, type) {
    try {
      const ctx = this.getCtx();
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = freq;
      filter.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.value = 0.4;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      source.start();
      source.stop(ctx.currentTime + duration);
    } catch(e) {}
  }
  playTone(freq, duration, type) {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch(e) {}
  }
  setAmbient(type) {
    this.stopAmbient();
    if (type === 'casa') this._startDrone(40, 60);
    else if (type === 'rua' || type === 'externa') this._startWind();
  }
  _startDrone(f1, f2) {
    try {
      const ctx = this.getCtx();
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.value = 0.08;
      this.ambientGain.connect(this.masterGain);
      const o1 = ctx.createOscillator();
      o1.type = 'sine'; o1.frequency.value = f1;
      const o2 = ctx.createOscillator();
      o2.type = 'sine'; o2.frequency.value = f2;
      o1.connect(this.ambientGain);
      o2.connect(this.ambientGain);
      o1.start(); o2.start();
      this.ambientNode = [o1, o2];
    } catch(e) {}
  }
  _startWind() {
    try {
      const ctx = this.getCtx();
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.value = 0.06;
      this.ambientGain.connect(this.masterGain);
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.02) * 0.5;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      const lfo = ctx.createOscillator();
      lfo.type = 'sine'; lfo.frequency.value = 0.3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 800;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      source.connect(filter);
      filter.connect(this.ambientGain);
      source.start();
      lfo.start();
      this.ambientNode = [source, lfo];
    } catch(e) {}
  }
  stopAmbient() {
    if (this.ambientNode) {
      this.ambientNode.forEach(n => {
        try { n.stop(); } catch(e) {}
        try { n.disconnect(); } catch(e) {}
      });
      this.ambientNode = null;
    }
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = null;
    }
  }
  playFootstep(surface) {
    if (surface === 'casa') this.playNoise(500, 0.06, 'noise');
    else if (surface === 'grama') this.playNoise(200, 0.08, 'noise');
    else this.playNoise(500, 0.06, 'noise');
  }
  playShivaGrowl() {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 1);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      const noise = this._makeNoiseBuffer(0.3);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noise;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 200;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.15;
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(); osc.stop(ctx.currentTime + 1);
      noiseSource.start(); noiseSource.stop(ctx.currentTime + 0.3);
    } catch(e) {}
  }
  playPuzzleSolved() {
    [400, 600, 800].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.1, 'sine'), i * 120);
    });
  }
  playItemCollect() {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.08);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(); osc.stop(ctx.currentTime + 0.08);
    } catch(e) {}
  }
  playDoorOpen() {
    this.playNoise(2000, 0.3, 'noise');
  }
  playLanternToggle() {
    this.playTone(3000, 0.04, 'square');
  }
  playHowl() {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 1);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 2.5);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 3);
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.3;
      const delayGain = ctx.createGain();
      delayGain.gain.value = 0.3;
      osc.connect(gain);
      gain.connect(this.masterGain);
      gain.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(this.masterGain);
      osc.start(); osc.stop(ctx.currentTime + 3);
    } catch(e) {}
  }
  _makeNoiseBuffer(duration) {
    const ctx = this.getCtx();
    const size = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
}
