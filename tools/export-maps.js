#!/usr/bin/env node
/**
 * export-maps.js — Exporta todos os mapas do jogo para arquivos JSON do Tiled
 *
 * Uso:
 *   node tools/export-maps.js
 *
 * Gera:
 *   tiled-maps/         tileset PNG + JSON de cada mapa
 *   tiled-maps/*.json   abrir no Tiled: File → Open
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const TILED_DIR = path.resolve(__dirname, '..', 'tiled-maps');
const SPRITES_FILE = path.resolve(__dirname, '..', 'doghouse', 'sprites.js');
const MAP_FILE = path.resolve(__dirname, '..', 'doghouse', 'map.js');
const TILE_SIZE = 16;
const MAP_COLS = 20;
const MAP_ROWS = 15;

// --- Load game data ---
const spritesCode = fs.readFileSync(SPRITES_FILE, 'utf8');
const mapCode = fs.readFileSync(MAP_FILE, 'utf8');

const ctx = vm.createContext({
  console, setTimeout, clearTimeout, setInterval, clearInterval,
  document: { createElement: () => ({}) },
  Image: class {},
  window: {},
  self: {},
});
ctx.window = ctx;
ctx.self = ctx;

const script = new vm.Script(spritesCode + '\n' + mapCode);
script.runInContext(ctx);

// --- Generate tileset PNG ---
const tilesetPath = path.join(TILED_DIR, 'doghouse-tileset.png');
const tilesetTsxPath = path.join(TILED_DIR, 'doghouse-tileset.tsx');
const TILESET_COLS = 10;
const BASE_TILES = 72;

console.log('Gerando doghouse-tileset.png...');
try {
  const mod = new Function(spritesCode + '\nreturn { PALETTE_16, T_SPRITES, empty, I_LANTERN, I_KEY, I_HERBS, I_SALT, I_AMULET, I_CHALK, I_MIRROR, I_NOTE, I_MEMORY, I_PHOTO, I_LETTER };');
  const { PALETTE_16, T_SPRITES, empty, I_LANTERN, I_KEY, I_HERBS, I_SALT, I_AMULET, I_CHALK, I_MIRROR, I_NOTE, I_MEMORY, I_PHOTO, I_LETTER } = mod();

  const ITEM_SPRITES = [I_LANTERN, I_KEY, I_HERBS, I_SALT, I_AMULET, I_CHALK, I_MIRROR, I_NOTE, I_MEMORY, I_PHOTO, I_LETTER];
  const TOTAL_TILES = BASE_TILES + ITEM_SPRITES.length; // 83
  const TILESET_ROWS = Math.ceil(TOTAL_TILES / TILESET_COLS);

  const canvas = require('/tmp/test-canvas/node_modules/canvas').createCanvas;
  const cvs = canvas(TILESET_COLS * 16, TILESET_ROWS * 16);
  const g = cvs.getContext('2d');

  // checkerboard background
  for (let y = 0; y < cvs.height; y += 8)
    for (let x = 0; x < cvs.width; x += 8)
      g.fillStyle = ((Math.floor(x/8)+Math.floor(y/8))%2===0)?'#ccc':'#999',
      g.fillRect(x,y,8,8);

  function renderSprite(g, sprite, ox, oy) {
    if (!sprite) return;
    for (let r = 0; r < sprite.length; r++)
      for (let c = 0; c < sprite[r].length; c++) {
        const ci = sprite[r][c];
        if (ci && PALETTE_16[ci]) g.fillStyle = PALETTE_16[ci], g.fillRect(ox + c, oy + r, 1, 1);
      }
  }

  function resolveSprite(v) {
    if (!v) return null;
    if (Array.isArray(v) && Array.isArray(v[0]) && Array.isArray(v[0][0])) return v[0];
    return v;
  }

  // tiles 1-72 (from T_SPRITES)
  for (let id = 1; id <= BASE_TILES; id++) {
    const col = (id - 1) % TILESET_COLS, row = Math.floor((id - 1) / TILESET_COLS);
    renderSprite(g, resolveSprite(T_SPRITES[id]), col * 16, row * 16);
  }

  // tiles 73-83 (item sprites)
  for (let i = 0; i < ITEM_SPRITES.length; i++) {
    const id = BASE_TILES + 1 + i;
    const col = (id - 1) % TILESET_COLS, row = Math.floor((id - 1) / TILESET_COLS);
    renderSprite(g, ITEM_SPRITES[i], col * 16, row * 16);
  }

  fs.writeFileSync(tilesetPath, cvs.toBuffer('image/png'));
  console.log('  -> tileset PNG salvo (' + TOTAL_TILES + ' tiles, ' + TILESET_COLS + 'x' + TILESET_ROWS + ')');

  const tsx = `<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.11" name="doghouse-tileset" tilewidth="16" tileheight="16" tilecount="${TOTAL_TILES}" columns="${TILESET_COLS}">
  <image source="doghouse-tileset.png" width="${TILESET_COLS*16}" height="${TILESET_ROWS*16}"/>
</tileset>
`;
  fs.writeFileSync(tilesetTsxPath, tsx);
  console.log('  -> tileset TSX salvo');
} catch(e) {
  console.log('  -> aviso: nao foi possivel gerar PNG (' + e.message + ')');
}

// --- Generate character spritesheet PNG ---
{
  const charsPath = path.join(TILED_DIR, 'doghouse-characters.png');
  console.log('Gerando doghouse-characters.png...');
  try {
    const mod = new Function(spritesCode + '\nreturn { PALETTE_16, empty, fill, set, PLAYER_DOWN, PLAYER_UP, PLAYER_LEFT, PLAYER_RIGHT, PLAYER_WALK_DOWN, PLAYER_WALK_UP, PLAYER_WALK_LEFT, PLAYER_WALK_RIGHT, PLAYER_RUN_DOWN, PLAYER_RUN_UP, PLAYER_RUN_LEFT, PLAYER_RUN_RIGHT, SHIVA_DOWN, SHIVA_UP, SHIVA_LEFT, SHIVA_RIGHT, SHIVA_SHADOW, SHIVA_EYES, SHIVA_EVIL };');
    const mod2 = mod();
    const { PALETTE_16, PLAYER_DOWN, PLAYER_UP, PLAYER_LEFT, PLAYER_RIGHT, PLAYER_WALK_DOWN, PLAYER_WALK_UP, PLAYER_WALK_LEFT, PLAYER_WALK_RIGHT, PLAYER_RUN_DOWN, PLAYER_RUN_UP, PLAYER_RUN_LEFT, PLAYER_RUN_RIGHT, SHIVA_DOWN, SHIVA_UP, SHIVA_LEFT, SHIVA_RIGHT, SHIVA_SHADOW, SHIVA_EYES, SHIVA_EVIL } = mod2;

    const COLS = 4;
    const ROWS = [
      [PLAYER_DOWN, PLAYER_UP, PLAYER_LEFT, PLAYER_RIGHT],
      [PLAYER_WALK_DOWN[1], PLAYER_WALK_UP[1], PLAYER_WALK_LEFT[1], PLAYER_WALK_RIGHT[1]],
      [PLAYER_WALK_DOWN[3], PLAYER_WALK_UP[3], PLAYER_WALK_LEFT[3], PLAYER_WALK_RIGHT[3]],
      [PLAYER_RUN_DOWN[0], PLAYER_RUN_UP[0], PLAYER_RUN_LEFT[0], PLAYER_RUN_RIGHT[0]],
      [PLAYER_RUN_DOWN[1], PLAYER_RUN_UP[1], PLAYER_RUN_LEFT[1], PLAYER_RUN_RIGHT[1]],
      [PLAYER_RUN_DOWN[2], PLAYER_RUN_UP[2], PLAYER_RUN_LEFT[2], PLAYER_RUN_RIGHT[2]],
      [SHIVA_DOWN, SHIVA_UP, SHIVA_LEFT, SHIVA_RIGHT],
      [SHIVA_SHADOW, SHIVA_EYES, null, null],
    ];
    const BASE_ROWS = ROWS.length; // 8
    // shiva_evil is 32x32 → split into 4 cells at rows 8-9, cols 0-1
    const EXTRA_ROWS = 2;

    const canvas = require('/tmp/test-canvas/node_modules/canvas').createCanvas;
    const cvs = canvas(COLS * 16, (BASE_ROWS + EXTRA_ROWS) * 16);
    const g = cvs.getContext('2d');

    function renderSprite(g, sprite, ox, oy) {
      if (!sprite) return;
      for (let r = 0; r < sprite.length; r++)
        for (let c = 0; c < sprite[r].length; c++) {
          const ci = sprite[r][c];
          if (ci && PALETTE_16[ci]) g.fillStyle = PALETTE_16[ci], g.fillRect(ox + c, oy + r, 1, 1);
        }
    }

    for (let row = 0; row < ROWS.length; row++) {
      for (let col = 0; col < COLS; col++) {
        const sprite = ROWS[row][col];
        if (sprite) renderSprite(g, sprite, col * 16, row * 16);
      }
    }

    // shiva evil (32x32) at rows 8-9, cols 0-1
    if (SHIVA_EVIL) {
      for (let r = 0; r < 32; r++)
        for (let c = 0; c < 32; c++) {
          const ci = SHIVA_EVIL[r] && SHIVA_EVIL[r][c];
          if (ci && PALETTE_16[ci]) {
            const cellCol = Math.floor(c / 16);
            const cellRow = Math.floor(r / 16);
            const gx = cellCol * 16 + (c % 16);
            const gy = (BASE_ROWS + cellRow) * 16 + (r % 16);
            g.fillStyle = PALETTE_16[ci];
            g.fillRect(gx, gy, 1, 1);
          }
        }
    }

    fs.writeFileSync(charsPath, cvs.toBuffer('image/png'));
    console.log('  -> doghouse-characters.png salvo (' + COLS + 'x' + (BASE_ROWS + EXTRA_ROWS) + ' cells = ' + cvs.width + 'x' + cvs.height + ')');
  } catch(e) {
    console.log('  -> aviso: nao foi possivel gerar characters PNG (' + e.message + ')');
  }
}

// --- Collect map IDs ---
const mapIds = [
  'quarto', 'corredor', 'sala', 'calcada', 'rua',
  'portao', 'praca', 'beco', 'igreja', 'cemiterio', 'parque'
];

let exported = 0;
for (const id of mapIds) {
  const mapData = ctx['MAP_DATA_' + id];
  if (!mapData) { console.log('  pulando ' + id + ' (nao encontrado)'); continue; }

  // Build objects array
  const objects = [];
  let objId = 1;

  // Assign visual tile (gid) so objects appear as sprites in Tiled
  // tile 73-83: I_LANTERN, I_KEY, I_HERBS, I_SALT, I_AMULET, I_CHALK, I_MIRROR, I_NOTE, I_MEMORY, I_PHOTO, I_LETTER
  function getObjectGid(obj) {
    if (obj.type === 'note') return 80; // I_NOTE
    if (obj.type === 'puzzle') return 81; // I_MEMORY
    if (obj.type === 'shiva_event') return 81; // I_MEMORY
    if (obj.type === 'gate') return 7; // makeGate
    if (obj.type === 'golden_door') return 10; // makeDoor
    if (obj.type === 'item') {
      const map = {
        lanterna: 73, key: 74, chave_praca: 74,
        herbs: 75, ervas: 75,
        salt: 76, sal_grosso: 76,
        amulet: 77, amuleto_osso: 77,
        chalk: 78, giz_cera: 78,
        mirror: 79, espelho: 79,
        note: 80, memory: 81,
        photo: 82, letter: 83,
      };
      return map[obj.item] || 0;
    }
    return 0;
  }

  if (mapData.objects) {
    for (const obj of mapData.objects) {
      const entry = {
        id: objId++,
        name: obj.type + '_' + obj.x + '_' + obj.y,
        type: obj.type,
        x: obj.x * TILE_SIZE,
        y: obj.y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        visible: true,
      };
      const gid = getObjectGid(obj);
      if (gid) entry.gid = gid;
      const props = [];
      switch (obj.type) {
        case 'door':
          props.push({name:'targetMap',type:'string',value:obj.targetMap||''});
          props.push({name:'targetX',type:'int',value:obj.targetX||1});
          props.push({name:'targetY',type:'int',value:obj.targetY||1});
          break;
        case 'item':
          props.push({name:'item',type:'string',value:obj.item||''});
          if (obj.itemNote) props.push({name:'itemNote',type:'string',value:obj.itemNote});
          break;
        case 'note':
          props.push({name:'noteId',type:'string',value:obj.noteId||''});
          break;
        case 'puzzle':
          props.push({name:'puzzleId',type:'string',value:obj.puzzleId||''});
          break;
        case 'gate':
          props.push({name:'requiredItem',type:'string',value:obj.requiredItem||''});
          props.push({name:'targetMap',type:'string',value:obj.targetMap||''});
          props.push({name:'targetX',type:'int',value:obj.targetX||1});
          props.push({name:'targetY',type:'int',value:obj.targetY||1});
          break;
        case 'golden_door':
          props.push({name:'puzzleId',type:'string',value:obj.puzzleId||''});
          break;
        case 'shiva_event':
          props.push({name:'eventId',type:'string',value:obj.eventId||''});
          break;
      }
      if (props.length) entry.properties = props;
      objects.push(entry);
    }
  }

  // Connections
  if (mapData.connections) {
    for (const conn of mapData.connections) {
      let cx, cy;
      const dir = conn.dir || 'right';
      switch (dir) {
        case 'left': cx = 0; cy = (conn.y||0)*TILE_SIZE; break;
        case 'right': cx = (MAP_COLS-1)*TILE_SIZE; cy = (conn.y||0)*TILE_SIZE; break;
        case 'up': cx = (conn.x||0)*TILE_SIZE; cy = 0; break;
        case 'down': cx = (conn.x||0)*TILE_SIZE; cy = (MAP_ROWS-1)*TILE_SIZE; break;
      }
      objects.push({
        id: objId++, name: 'connection_'+dir, type: 'connection',
        x: cx, y: cy, width: TILE_SIZE, height: TILE_SIZE, visible: true,
        properties: [
          {name:'dir',type:'string',value:dir},
          {name:'map',type:'string',value:conn.map||''},
          {name:'x',type:'int',value:conn.x||0},
          {name:'y',type:'int',value:conn.y||0},
        ],
      });
    }
  }

  // Map-level properties
  const mapProps = [];
  mapProps.push({name:'ambient',type:'string',value:mapData.ambient||'casa'});
  mapProps.push({name:'light',type:'float',value:mapData.light!==undefined?mapData.light:0.3});
  mapProps.push({name:'playerStartX',type:'int',value:Math.floor((mapData.playerStart?.x||0)/TILE_SIZE)});
  mapProps.push({name:'playerStartY',type:'int',value:Math.floor((mapData.playerStart?.y||0)/TILE_SIZE)});

  // Build tiles + wall data arrays
  const tilesData = [];
  const wallData = [];
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      const t = mapData.tiles[y]?.[x] || 0;
      const w = mapData.wall[y]?.[x] || 0;
      // Tiled: GID 0 = sem tile, GID 1+ = tile (1:1 com nosso ID)
      tilesData.push(t);
      wallData.push(w);
    }
  }

  const mapJson = {
    compressionlevel: -1,
    height: MAP_ROWS,
    width: MAP_COLS,
    infinite: false,
    type: 'map',
    orientation: 'orthogonal',
    renderorder: 'right-down',
    tiledversion: '1.11',
    tileheight: TILE_SIZE,
    tilewidth: TILE_SIZE,
    version: '1.10',
    nextlayerid: 4,
    nextobjectid: objId,
    properties: mapProps,
    tilesets: [{ firstgid: 1, source: 'doghouse-tileset.tsx' }],
    layers: [
      { id:1, name:'tiles', type:'tilelayer', width:MAP_COLS, height:MAP_ROWS,
        x:0, y:0, visible:true, opacity:1, data: tilesData },
      { id:2, name:'wall', type:'tilelayer', width:MAP_COLS, height:MAP_ROWS,
        x:0, y:0, visible:true, opacity:1, data: wallData },
      { id:3, name:'objects', type:'objectgroup',
        draworder:'topdown', width:MAP_COLS, height:MAP_ROWS,
        x:0, y:0, visible:true, opacity:1, objects },
    ],
  };

  const outFile = path.join(TILED_DIR, id + '.json');
  fs.writeFileSync(outFile, JSON.stringify(mapJson, null, 2));
  console.log('  ' + id + '.json exportado (' + objects.length + ' objetos)');
  exported++;
}

console.log('\n' + exported + '/' + mapIds.length + ' mapas exportados para ' + TILED_DIR);
console.log('Abra no Tiled: File > Open, selecione os .json');
