/* ===== GAME.JS ===== */
/* Player, sistemas de Shiva, colisão, inventário, game loop */

const PLAYER_SPEED = 48;
const PLAYER_SPRINT = 72;
const PLAYER_W = 12;
const PLAYER_H = 12;

/* ===== PLAYER ===== */
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dir = 'down';
    this.moving = false;
    this.walkFrame = 0;
    this.walkTimer = 0;
    this.inventory = [];
    this.hasLantern = false;
    this.interacting = false;
  }

  update(dt, engine) {
    const input = engine.input;
    const map = engine.currentMap;
    if (!map) return;

    if (engine.state.phase === 'dialogue' || engine.state.phase === 'puzzle' ||
        engine.state.phase === 'note' || engine.state.phase === 'final') {
      this.moving = false;
      return;
    }

    const speed = input.isDown('shift') ? PLAYER_SPRINT : PLAYER_SPEED;
    let dx = 0, dy = 0;

    if (input.isDown('w') || input.isDown('arrowup')) { dy = -1; this.dir = 'up'; }
    else if (input.isDown('s') || input.isDown('arrowdown')) { dy = 1; this.dir = 'down'; }
    else if (input.isDown('a') || input.isDown('arrowleft')) { dx = -1; this.dir = 'left'; }
    else if (input.isDown('d') || input.isDown('arrowright')) { dx = 1; this.dir = 'right'; }

    this.moving = (dx !== 0 || dy !== 0);
    if (this.moving) {
      this.walkTimer += dt;
      if (this.walkTimer > 0.2) {
        this.walkFrame = (this.walkFrame + 1) % 2;
        this.walkTimer = 0;
      }
      // move X
      const nx = this.x + dx * speed * dt;
      if (!this._collides(nx, this.y, map)) this.x = nx;
      // move Y
      const ny = this.y + dy * speed * dt;
      if (!this._collides(this.x, ny, map)) this.y = ny;

      // footsteps
      if (Math.random() < 0.3) {
        const surface = map.ambient === 'casa' ? 'casa' : 'externa';
        engine.audio.playFootstep(surface);
      }
    }

    // check connections (borda do mapa)
    if (map.connections) {
      const tx = Math.floor((this.x + PLAYER_W/2) / TILE_SIZE);
      const ty = Math.floor((this.y + PLAYER_H/2) / TILE_SIZE);
      for (const conn of map.connections) {
        let shouldTransition = false;
        if (conn.dir === 'right' && tx >= 19) shouldTransition = true;
        else if (conn.dir === 'left' && tx <= 0) shouldTransition = true;
        else if (conn.dir === 'down' && ty >= 14) shouldTransition = true;
        else if (conn.dir === 'up' && ty <= 0) shouldTransition = true;
        if (shouldTransition) {
          const targetMap = engine.maps[conn.map];
          if (targetMap) {
            let px, py;
            if (conn.dir === 'right') { px = 1 * TILE_SIZE; py = this.y; }
            else if (conn.dir === 'left') { px = (targetMap.width - 2) * TILE_SIZE; py = this.y; }
            else if (conn.dir === 'down') { px = this.x; py = 1 * TILE_SIZE; }
            else { px = this.x; py = (targetMap.height - 2) * TILE_SIZE; }
            engine.transitionToMap(conn.map, px, py);
            return;
          }
        }
      }
    }

    // check interact prompt
    this._checkInteractPrompt(engine);

    // E to interact
    if (input.wasPressed('e')) {
      this._interact(engine);
    }
    // F for lantern
    if (input.wasPressed('f') && this.hasLantern) {
      engine.state.lanternOn = !engine.state.lanternOn;
      if (engine.state.lanternOn && engine.state.lanternBattery <= 0) {
        engine.state.lanternOn = false;
      } else {
        engine.audio.playLanternToggle();
      }
    }
  }

  _collides(nx, ny, map) {
    const margin = 1;
    const left = nx + margin;
    const right = nx + PLAYER_W - margin;
    const top = ny + margin;
    const bottom = ny + PLAYER_H - margin;

    const tiles = [
      { x: Math.floor(left / TILE_SIZE), y: Math.floor(top / TILE_SIZE) },
      { x: Math.floor(right / TILE_SIZE), y: Math.floor(top / TILE_SIZE) },
      { x: Math.floor(left / TILE_SIZE), y: Math.floor(bottom / TILE_SIZE) },
      { x: Math.floor(right / TILE_SIZE), y: Math.floor(bottom / TILE_SIZE) },
    ];

    for (const t of tiles) {
      if (t.x < 0 || t.x >= map.width || t.y < 0 || t.y >= map.height) return true;
      // check collision map
      if (map.collision[t.y] && map.collision[t.y][t.x]) return true;
      // check if it's a blocked tile in tiles
      if (map.tiles[t.y] && map.tiles[t.y][t.x] === 0) return true;
    }
    return false;
  }

  _checkInteractPrompt(engine) {
    const map = engine.currentMap;
    const tx = Math.floor((this.x + PLAYER_W/2) / TILE_SIZE) + this._facingDx();
    const ty = Math.floor((this.y + PLAYER_H/2) / TILE_SIZE) + this._facingDy();
    const obj = map.getObjectAt(tx, ty);
    engine.showInteractPrompt(!!obj);
  }

  _interact(engine) {
    const map = engine.currentMap;
    const tx = Math.floor((this.x + PLAYER_W/2) / TILE_SIZE) + this._facingDx();
    const ty = Math.floor((this.y + PLAYER_H/2) / TILE_SIZE) + this._facingDy();
    const obj = map.getObjectAt(tx, ty);
    if (!obj) return;

    if (obj.type === 'door') {
      this.interacting = true;
      engine.audio.playDoorOpen();
      engine.transitionToMap(obj.targetMap, obj.targetX, obj.targetY);
      setTimeout(() => { this.interacting = false; }, 100);
    }
    else if (obj.type === 'item' && !obj.collected) {
      obj.collected = true;
      this.inventory.push(obj.item);
      if (obj.item === 'lanterna') this.hasLantern = true;
      engine.audio.playItemCollect();
      // HUD update
      this._updateInventoryHUD(engine);

      if (window.showNote && obj.itemNote) {
        window.showNote(obj.itemNote);
      }
    }
    else if (obj.type === 'note' && !obj.read) {
      obj.read = true;
      if (window.showNote) {
        window.showNote(obj.noteId);
      }
    }
    else if (obj.type === 'puzzle' && !obj.solved) {
      if (window.openPuzzle) {
        window.openPuzzle(obj.puzzleId, (solved) => {
          obj.solved = solved;
          if (solved && window.onPuzzleSolved) {
            window.onPuzzleSolved(obj.puzzleId);
          }
        });
      }
    }
    else if (obj.type === 'shiva_event' && !obj.triggered) {
      obj.triggered = true;
      if (window.shivaSystem) {
        window.shivaSystem.triggerEvent(obj.eventId);
      }
    }
    else if (obj.type === 'golden_door') {
      this._handleGoldenDoor(engine);
    }
  }

  _facingDx() {
    if (this.dir === 'left') return -1;
    if (this.dir === 'right') return 1;
    return 0;
  }
  _facingDy() {
    if (this.dir === 'up') return -1;
    if (this.dir === 'down') return 1;
    return 0;
  }

  _handleGoldenDoor(engine) {
    const ps = window.puzzleState;
    if (!ps) return;
    const allKeys = ps.keys.every(k => k);
    if (!allKeys) {
      // BAD ending
      window.showFinal('bad');
      return;
    }
    if (ps.protectionItems.length < 5) {
      // NEUTRAL ending
      window.showFinal('neutral');
      return;
    }
    // GOOD ending (all keys + all protection items)
    window.showFinal('good');
  }

  _updateInventoryHUD(engine) {
    const container = document.getElementById('hud-inventory');
    container.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      if (this.inventory[i]) {
        slot.className += ' filled';
        slot.textContent = this.inventory[i][0].toUpperCase();
        slot.title = this.inventory[i];
      }
      container.appendChild(slot);
    }
  }

  render(ctx, camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    const sprite = spriteManager.getCharacterSprite('player', this.dir, this.moving ? this.walkFrame : undefined);
    if (sprite) {
      spriteManager.renderSprite(ctx, sprite, sx - 2, sy - 2, 1);
    }
  }
}

/* ===== SHIVA SYSTEM ===== */
class ShivaSystem {
  constructor() {
    this.currentForm = 'none';
    this.activeEvent = null;
    this.eventTimer = 0;
    this.eventData = null;
    this.watching = false;
    this.randomChance = 0.15;
    this.solvedCount = 0;
    this.triggeredEvents = {};
    this.encaradaAtiva = false;
  }

  triggerEvent(eventId, engine) {
    if (this.triggeredEvents[eventId]) return;
    this.triggeredEvents[eventId] = true;

    switch(eventId) {
      case 'silhueta_corredor':
        this._doSilhueta(engine);
        break;
      case 'rabo_porta':
        this._doRaboPorta(engine);
        break;
      case 'sombra_tres_cabecas':
        this._doSombraTresCabecas(engine);
        break;
      case 'shiva_praca':
        this._doShivaSumindo(engine);
        break;
      case 'encarada_beco':
        this._doEncarada(engine);
        break;
      default:
        this._doGeneric(engine);
    }
  }

  _doSilhueta(engine) {
    this.currentForm = 'silhouette';
    this.eventTimer = 3;
    this.eventData = { x: 16 * 16, y: 5 * 16 };
    engine.setShivaStatus('...');
    setTimeout(() => {
      this.currentForm = 'none';
      this.eventTimer = 0;
    }, 3000);
  }

  _doRaboPorta(engine) {
    this.currentForm = 'silhouette';
    this.eventTimer = 2;
    this.eventData = { x: 12 * 16, y: 5 * 16 };
    engine.setShivaStatus('...');
    setTimeout(() => {
      this.currentForm = 'none';
      this.eventTimer = 0;
    }, 2000);
  }

  _doSombraTresCabecas(engine) {
    this.currentForm = 'evil_shadow';
    this.eventTimer = 2.5;
    this.eventData = { opacity: 1, yOffset: 0 };
    engine.audio.playShivaGrowl();
    engine.setShivaStatus('...');
    engine.camera.shake(4, 0.5);
    setTimeout(() => {
      this.currentForm = 'none';
      this.eventTimer = 0;
      engine.setShivaStatus('');
      engine.setWatching(true);
    }, 2500);
  }

  _doShivaSumindo(engine) {
    this.currentForm = 'silhouette';
    this.eventTimer = 2;
    this.eventData = { x: 10 * 16, y: 3 * 16 };
    setTimeout(() => {
      this.currentForm = 'none';
      this.eventTimer = 0;
    }, 2000);
  }

  _doEncarada(engine) {
    this.encaradaAtiva = true;
    this.currentForm = 'silhouette';
    this.eventTimer = 999;
    this.eventData = { x: 10 * 16, y: 7 * 16 };
    engine.setShivaStatus('ELA ESTÁ OLHANDO');
    engine.state.shivaWatching = true;
    // to break: player precisa passar por ela
  }

  resolveEncarada(engine) {
    this.encaradaAtiva = false;
    this.currentForm = 'none';
    this.eventTimer = 0;
    engine.setShivaStatus('');
    engine.state.shivaWatching = false;
    engine.audio.playHowl();
  }

  _doGeneric(engine) {
    engine.audio.playShivaGrowl();
    engine.setWatching(true);
  }

  update(dt, engine) {
    // timer countdown
    if (this.eventTimer > 0 && !this.encaradaAtiva) {
      this.eventTimer -= dt;
      if (this.eventTimer <= 0) {
        this.currentForm = 'none';
        this.eventTimer = 0;
      }
    }

    // random events in exterior maps
    if (this.currentForm === 'none' && !engine.state.shivaWatching &&
        Math.random() < this.randomChance * dt * 0.5) {
      const exteriorMaps = ['calcada', 'rua', 'praca', 'beco', 'cemiterio'];
      if (exteriorMaps.includes(engine.currentMap.id)) {
        this._randomAppearance(engine);
      }
    }
  }

  _randomAppearance(engine) {
    const forms = ['shadow', 'eyes', 'silhouette'];
    this.currentForm = forms[Math.floor(Math.random() * forms.length)];
    this.eventTimer = 1 + Math.random() * 2;
    this.eventData = {
      x: Math.floor(Math.random() * 16 + 2) * TILE_SIZE,
      y: Math.floor(Math.random() * 10 + 2) * TILE_SIZE,
    };
    setTimeout(() => {
      if (this.currentForm !== 'none') {
        this.currentForm = 'none';
        this.eventTimer = 0;
      }
    }, this.eventTimer * 1000);
  }

  onPuzzleSolved(engine) {
    this.solvedCount++;
    this.randomChance = Math.min(0.5, 0.15 + this.solvedCount * 0.05);
    engine.audio.playHowl();
    // increase watcher
    engine.setWatching(true);
  }

  render(ctx, camera) {
    if (this.currentForm === 'none' || !this.eventData) return;
    const sx = (this.eventData.x || 0) - camera.x;
    const sy = (this.eventData.y || 0) - camera.y;

    switch(this.currentForm) {
      case 'silhouette':
        const silSprite = spriteManager.getCharacterSprite('shiva_shadow');
        if (silSprite) spriteManager.renderSprite(ctx, silSprite, sx, sy, 1);
        break;
      case 'shadow':
        const shSprite = spriteManager.getCharacterSprite('shiva_shadow');
        if (shSprite) spriteManager.renderSprite(ctx, shSprite, sx, sy, 1);
        break;
      case 'eyes':
        const eySprite = spriteManager.getCharacterSprite('shiva_eyes');
        if (eySprite) spriteManager.renderSprite(ctx, eySprite, sx, sy, 1);
        break;
      case 'evil_shadow':
        // sombra enorme que passa por cima
        const evSprite = spriteManager.getCharacterSprite('shiva_evil');
        if (evSprite) {
          ctx.globalAlpha = 0.4;
          spriteManager.renderSprite(ctx, evSprite, sx - 80, sy - 80, 2);
          ctx.globalAlpha = 1;
        }
        break;
    }
  }
}

/* ===== INICIALIZAÇÃO ===== */
const engine = new Engine('game-canvas');
const player = new Player(5*16, 7*16);
const shivaSystem = new ShivaSystem();
const puzzleState = {
  clues: [false, false, false, false, false, false],
  solved: [false, false, false, false, false, false],
  keys: [false, false, false, false, false, false],
  notesRead: [false, false, false, false, false, false],
  protectionItems: [],
  doorOpen: false,
};
const journal = {
  readCount: 0,
};

// expoe globalmente
window.engine = engine;
window.player = player;
window.shivaSystem = shivaSystem;
window.puzzleState = puzzleState;
window.journal = journal;

/* ===== APP ===== */
window.startGame = function() {
  // registra mapas
  registerAllMaps(engine);

  // inicia engine
  engine.init(spriteManager, player, shivaSystem, null, null);
  engine.setMap('quarto');
  engine.start();

  // esconde loading
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('hud').style.display = 'block';

  // init memories HUD
  const memContainer = document.getElementById('hud-memories');
  memContainer.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const m = document.createElement('span');
    memContainer.appendChild(m);
  }

  // mostra intro
  setTimeout(() => showIntro(), 300);
};

/* ===== INTRO ===== */
function showIntro() {
  const lines = [
    'Você prometeu.',
    'Uma semana.',
    'Sete dias.',
    'Ela esperou.',
    'Você dormiu.',
    '3h da manhã.',
    'O quarto está diferente.',
  ];
  engine.state.phase = 'dialogue';
  let i = 0;
  const el = document.getElementById('intro-overlay');
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.fontSize = '16px';
  el.style.lineHeight = '3';
  el.textContent = '';

  function typeLine() {
    if (i >= lines.length) {
      el.style.display = 'none';
      engine.state.phase = 'exploration';
      return;
    }
    el.textContent = '';
    let c = 0;
    const interval = setInterval(() => {
      el.textContent += lines[i][c];
      c++;
      if (c >= lines[i].length) {
        clearInterval(interval);
        i++;
        setTimeout(typeLine, 800);
      }
    }, 50);
  }
  typeLine();
}

// start when page loads
window.addEventListener('load', () => {
  // generate spritesheet for cache
  setTimeout(window.startGame, 500);
});

// F1 export spritesheet
document.addEventListener('keydown', (e) => {
  if (e.key === 'F1') {
    e.preventDefault();
    spriteManager.exportSpritesheet();
  }
});
