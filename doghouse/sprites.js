/* ===== SPRITES.JS ===== */
/* Pixel arrays + gerador spritesheet */
/* Placeholder shapes — refinar depois */

const PALETTE_16 = [
  '#0a0505', '#1a0a0a', '#2a1010', '#3a1a1a',
  '#5a2a2a', '#8a3a3a', '#a85a3a', '#a87850',
  '#8a7a5a', '#5a3a5a', '#2a2a3a', '#6a6a4a',
  '#1a1820', '#3a3a1a', '#5a5a3a', '#aaa878'
];

// helpers
function rect(w, h, color) {
  const r = [];
  for (let y = 0; y < h; y++) {
    r[y] = [];
    for (let x = 0; x < w; x++) {
      r[y][x] = color;
    }
  }
  return r;
}

function borderRect(w, h, fill, border) {
  const r = [];
  for (let y = 0; y < h; y++) {
    r[y] = [];
    for (let x = 0; x < w; x++) {
      if (y === 0 || y === h-1 || x === 0 || x === w-1) r[y][x] = border;
      else r[y][x] = fill;
    }
  }
  return r;
}

/* ===== TILES ===== */
const T_SPRITES = {
  // 0: void - não renderiza
  1: rect(16, 16, 3), // chão casa - #3a1a1a
  2: rect(16, 16, 4), // calçada - #5a2a2a
  3: rect(16, 16, 10), // asfalto - #2a2a3a
  4: rect(16, 16, 11), // grama - #6a6a4a
  5: rect(16, 16, 5), // parede casa - #8a3a3a
  6: borderRect(16, 16, 0, 9), // cerca - roxo noturno
  7: borderRect(16, 16, 14, 7), // portão - caramelo
  8: rect(16, 16, 12), // poste - escuro frio
  9: rect(16, 16, 11), // árvore - verde musgo (placeholder)
  10: rect(16, 16, 7), // porta - caramelo claro
  11: rect(16, 16, 5), // topo parede - #8a3a3a
  12: rect(16, 16, 1), // teto - #1a0a0a
  13: rect(16, 16, 9), // muro - #5a3a5a
};

/* ===== CHARACTERS ===== */

// Player (16x16) - silhouette genérica
function makePlayerSprite(direction) {
  const s = rect(16, 16, 1); // fundo transparente (0)
  // corpo (12x12 centrado)
  for (let y = 2; y < 14; y++) {
    for (let x = 2; x < 14; x++) {
      if (y < 4) s[y][x] = 0; // espaço vazio cabeça
      else if (y < 8) s[y][x] = 2; // torso - marrom escuro
      else s[y][x] = 10; // pernas - azul meia-noite
    }
  }
  // cabeça (6x6)
  for (let y = 1; y < 5; y++) {
    for (let x = 5; x < 11; x++) {
      s[y][x] = 8; // pele
    }
  }
  // olhos
  if (direction === 'down' || direction === 'up') {
    s[2][7] = 1; s[2][8] = 1;
  } else if (direction === 'left') {
    s[2][6] = 1; s[2][7] = 1;
  } else if (direction === 'right') {
    s[2][8] = 1; s[2][9] = 1;
  }
  return s;
}

const PLAYER_DOWN = makePlayerSprite('down');
const PLAYER_UP = makePlayerSprite('up');
const PLAYER_LEFT = makePlayerSprite('left');
const PLAYER_RIGHT = makePlayerSprite('right');

// walk frames - ligeira variação nas pernas
function makePlayerWalk(direction, frame) {
  const s = makePlayerSprite(direction);
  if (frame === 1) {
    // perna esquerda pra frente
    s[12][5] = 0; s[12][6] = 0;
    s[13][5] = 0; s[13][6] = 0;
    s[12][9] = 0; s[12][10] = 0;
    s[13][9] = 0; s[13][10] = 0;
  }
  return s;
}

const PLAYER_WALK_DOWN = [PLAYER_DOWN, makePlayerWalk('down', 1)];
const PLAYER_WALK_UP = [PLAYER_UP, makePlayerWalk('up', 1)];
const PLAYER_WALK_LEFT = [PLAYER_LEFT, makePlayerWalk('left', 1)];
const PLAYER_WALK_RIGHT = [PLAYER_RIGHT, makePlayerWalk('right', 1)];

// Shiva (16x16) - golden retriever
function makeShivaSprite(direction) {
  const s = rect(16, 16, 0);
  // corpo (12x10 centrado)
  for (let y = 4; y < 14; y++) {
    for (let x = 2; x < 14; x++) {
      if (y < 6) s[y][x] = 7; // dorso claro
      else s[y][x] = 6; // dorso escuro
    }
  }
  // cabeça (8x6)
  for (let y = 1; y < 6; y++) {
    for (let x = 4; x < 12; x++) {
      if (y < 2) s[y][x] = 0; // espaço
      else s[y][x] = 7;
    }
  }
  // orelhas
  s[1][4] = 7; s[1][5] = 7; s[1][10] = 7; s[1][11] = 7;
  // olhos
  if (direction === 'down' || direction === 'up') {
    s[3][6] = 1; s[3][9] = 1;
  } else if (direction === 'left') {
    s[3][5] = 1; s[3][6] = 1;
  } else {
    s[3][9] = 1; s[3][10] = 1;
  }
  // nariz
  s[4][7] = 1; s[4][8] = 1;
  return s;
}

const SHIVA_DOWN = makeShivaSprite('down');
const SHIVA_UP = makeShivaSprite('up');
const SHIVA_LEFT = makeShivaSprite('left');
const SHIVA_RIGHT = makeShivaSprite('right');

const SHIVA_WALK_DOWN = [SHIVA_DOWN, SHIVA_DOWN];
const SHIVA_WALK_UP = [SHIVA_UP, SHIVA_UP];
const SHIVA_WALK_LEFT = [SHIVA_LEFT, SHIVA_LEFT];
const SHIVA_WALK_RIGHT = [SHIVA_RIGHT, SHIVA_RIGHT];

// Shiva evil (32x32) - 3 cabeças
function makeShivaEvil() {
  const s = [];
  for (let y = 0; y < 32; y++) {
    s[y] = [];
    for (let x = 0; x < 32; x++) {
      s[y][x] = 0;
    }
  }
  // corpo grande (24x20 centrado)
  for (let y = 10; y < 30; y++) {
    for (let x = 4; x < 28; x++) {
      s[y][x] = 1;
    }
  }
  // 3 cabeças (8x8 cada)
  const heads = [
    {cx: 8, cy: 4},  // esquerda
    {cx: 16, cy: 2}, // centro (mais alta)
    {cx: 24, cy: 4}, // direita
  ];
  heads.forEach(h => {
    for (let dy = 0; dy < 8; dy++) {
      for (let dx = 0; dx < 8; dx++) {
        const px = h.cx + dx - 4;
        const py = h.cy + dy - 4;
        if (px >= 0 && px < 32 && py >= 0 && py < 32) {
          s[py][px] = 1;
        }
      }
    }
    // olhos vermelhos
    s[h.cy - 1][h.cx - 1] = 5;
    s[h.cy - 1][h.cx + 1] = 5;
    s[h.cy][h.cx - 1] = 5;
    s[h.cy][h.cx + 1] = 5;
  });
  return s;
}

const SHIVA_EVIL = makeShivaEvil();

// Shiva shadow (silhueta preta com olhos vermelhos)
function makeShivaShadow() {
  const s = rect(16, 16, 0);
  for (let y = 1; y < 14; y++) {
    for (let x = 3; x < 13; x++) {
      s[y][x] = 1;
    }
  }
  s[4][6] = 5; s[4][9] = 5; // olhos
  return s;
}
const SHIVA_SHADOW = makeShivaShadow();

// Shiva eyes (só olhos no escuro)
function makeShivaEyes() {
  const s = rect(16, 16, 0);
  s[7][6] = 5; s[7][7] = 5; s[7][8] = 5; s[7][9] = 5;
  s[8][6] = 0; s[8][7] = 5; s[8][8] = 5; s[8][9] = 0;
  return s;
}
const SHIVA_EYES = makeShivaEyes();

/* ===== ITEMS ===== */
const I_LANTERN = borderRect(8, 12, 6, 7); // laranja + caramelo
const I_KEY = borderRect(4, 10, 7, 1); // caramelo
const I_HERBS = borderRect(8, 8, 11, 3); // verde musgo
const I_SALT = borderRect(10, 6, 14, 3); // branco
const I_AMULET = borderRect(8, 8, 7, 9); // caramelo
const I_CHALK = borderRect(2, 12, 15, 3); // branco
const I_MIRROR = borderRect(8, 10, 8, 15);
const I_NOTE = rect(10, 12, 8);
// memória
function makeMemory() {
  const s = rect(10, 10, 0);
  for (let y = 1; y < 9; y++) {
    for (let x = 1; x < 9; x++) {
      if (Math.random() > 0.3) s[y][x] = 15;
    }
  }
  return s;
}
const I_MEMORY = makeMemory();

/* ===== UI ===== */
const UI_SLOT = borderRect(14, 14, 1, 3);
const UI_MEMORY_EMPTY = borderRect(8, 8, 0, 14);
const UI_MEMORY_FILLED = borderRect(8, 8, 15, 14);

/* ===== SPRITES MANAGER ===== */
class Sprites {
  constructor() {
    this.cache = {};
    this.spritesheetLoaded = false;
  }

  getTileSprite(id) {
    return T_SPRITES[id] || null;
  }

  getCharacterSprite(name, direction, walkFrame) {
    const key = `${name}_${direction}_${walkFrame || 0}`;
    if (this.cache[key]) return this.cache[key];

    let sprite;
    if (name === 'player') {
      if (walkFrame !== undefined) {
        const anim = PLAYER_WALK_DOWN; // fallback
        switch(direction) {
          case 'down': sprite = PLAYER_WALK_DOWN[walkFrame % 2]; break;
          case 'up': sprite = PLAYER_WALK_UP[walkFrame % 2]; break;
          case 'left': sprite = PLAYER_WALK_LEFT[walkFrame % 2]; break;
          case 'right': sprite = PLAYER_WALK_RIGHT[walkFrame % 2]; break;
        }
      } else {
        switch(direction) {
          case 'down': sprite = PLAYER_DOWN; break;
          case 'up': sprite = PLAYER_UP; break;
          case 'left': sprite = PLAYER_LEFT; break;
          case 'right': sprite = PLAYER_RIGHT; break;
        }
      }
    } else if (name === 'shiva') {
      switch(direction) {
        case 'down': sprite = SHIVA_DOWN; break;
        case 'up': sprite = SHIVA_UP; break;
        case 'left': sprite = SHIVA_LEFT; break;
        case 'right': sprite = SHIVA_RIGHT; break;
      }
    } else if (name === 'shiva_evil') {
      sprite = SHIVA_EVIL;
    } else if (name === 'shiva_shadow') {
      sprite = SHIVA_SHADOW;
    } else if (name === 'shiva_eyes') {
      sprite = SHIVA_EYES;
    }

    this.cache[key] = sprite;
    return sprite;
  }

  getItemSprite(name) {
    const items = {
      lantern: I_LANTERN, key: I_KEY, herbs: I_HERBS, salt: I_SALT,
      amulet: I_AMULET, chalk: I_CHALK, mirror: I_MIRROR, note: I_NOTE,
      memory: I_MEMORY
    };
    return items[name] || null;
  }

  getUISprite(name) {
    const ui = {
      slot: UI_SLOT, memory_empty: UI_MEMORY_EMPTY, memory_filled: UI_MEMORY_FILLED
    };
    return ui[name] || null;
  }

  // renderiza um sprite pixel array no canvas
  renderSprite(ctx, sprite, x, y, scale) {
    if (!sprite) return;
    scale = scale || 1;
    const h = sprite.length;
    const w = sprite[0].length;
    for (let row = 0; row < h; row++) {
      for (let col = 0; col < w; col++) {
        const ci = sprite[row][col];
        if (ci === undefined || ci === null) continue;
        ctx.fillStyle = PALETTE_16[ci];
        ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
      }
    }
  }

  // gera spritesheet PNG em canvas oculto
  generateSpritesheet() {
    const allSprites = [
      { name:'player_down', sprite:PLAYER_DOWN, w:16, h:16 },
      { name:'player_up', sprite:PLAYER_UP, w:16, h:16 },
      { name:'player_left', sprite:PLAYER_LEFT, w:16, h:16 },
      { name:'player_right', sprite:PLAYER_RIGHT, w:16, h:16 },
      { name:'shiva_down', sprite:SHIVA_DOWN, w:16, h:16 },
      { name:'shiva_up', sprite:SHIVA_UP, w:16, h:16 },
      { name:'shiva_left', sprite:SHIVA_LEFT, w:16, h:16 },
      { name:'shiva_right', sprite:SHIVA_RIGHT, w:16, h:16 },
      { name:'shiva_evil', sprite:SHIVA_EVIL, w:32, h:32 },
      { name:'shiva_shadow', sprite:SHIVA_SHADOW, w:16, h:16 },
      { name:'shiva_eyes', sprite:SHIVA_EYES, w:16, h:16 },
    ];
    // tiles
    for (let id = 1; id <= 13; id++) {
      if (T_SPRITES[id]) {
        allSprites.push({ name:'tile_'+id, sprite:T_SPRITES[id], w:16, h:16 });
      }
    }
    // items
    const items = { lantern:I_LANTERN, key:I_KEY, herbs:I_HERBS, salt:I_SALT,
      amulet:I_AMULET, chalk:I_CHALK, mirror:I_MIRROR, note:I_NOTE };
    for (const [name, sprite] of Object.entries(items)) {
      allSprites.push({ name:'item_'+name, sprite, w:16, h:16 });
    }

    const cols = 10;
    const rows = Math.ceil(allSprites.length / cols);
    const cellW = 32;
    const cellH = 32;
    const canvas = document.createElement('canvas');
    canvas.width = cols * cellW;
    canvas.height = rows * cellH;
    const ctx = canvas.getContext('2d');

    allSprites.forEach((s, i) => {
      const cx = (i % cols) * cellW;
      const cy = Math.floor(i / cols) * cellH;
      ctx.fillStyle = '#0a0505';
      ctx.fillRect(cx, cy, cellW, cellH);
      this.renderSprite(ctx, s.sprite, cx + (cellW - s.w)/2, cy + (cellH - s.h)/2, 2);
    });

    return canvas.toDataURL('image/png');
  }

  exportSpritesheet() {
    const dataUrl = this.generateSpritesheet();
    const link = document.createElement('a');
    link.download = 'spritesheet.png';
    link.href = dataUrl;
    link.click();
  }
}

// instancia global
const spriteManager = new Sprites();
