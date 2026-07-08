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

// --- Generate tileset PNG if missing ---
const tilesetPath = path.join(TILED_DIR, 'doghouse-tileset.png');
const tilesetTsxPath = path.join(TILED_DIR, 'doghouse-tileset.tsx');

if (!fs.existsSync(tilesetPath)) {
  console.log('Gerando doghouse-tileset.png...');
  try {
    const mod = new Function(spritesCode + '\nreturn { PALETTE_16, T_SPRITES, empty };');
    const { PALETTE_16, T_SPRITES, empty } = mod();
    const canvas = require('/tmp/test-canvas/node_modules/canvas').createCanvas;
    const cvs = canvas(10 * 16, Math.ceil(73/10) * 16);
    const g = cvs.getContext('2d');
    for (let y = 0; y < cvs.height; y += 8)
      for (let x = 0; x < cvs.width; x += 8)
        g.fillStyle = ((Math.floor(x/8)+Math.floor(y/8))%2===0)?'#ccc':'#999',
        g.fillRect(x,y,8,8);
    for (let id = 0; id < 73; id++) {
      const col = id % 10, row = Math.floor(id / 10);
      const v = id === 0 ? empty(16,16) : T_SPRITES[id];
      const sprite = (Array.isArray(v) && Array.isArray(v[0])) ? v[0] : v;
      if (!sprite) continue;
      for (let r = 0; r < sprite.length; r++)
        for (let c = 0; c < sprite[r].length; c++) {
          const ci = sprite[r][c];
          if (ci && PALETTE_16[ci]) g.fillStyle = PALETTE_16[ci], g.fillRect(col*16+c, row*16+r, 1, 1);
        }
    }
    fs.writeFileSync(tilesetPath, cvs.toBuffer('image/png'));
    console.log('  -> tileset PNG salvo');
  } catch(e) {
    console.log('  -> aviso: nao foi possivel gerar PNG (' + e.message + ')');
  }
}

// --- Generate TSX tileset file ---
if (!fs.existsSync(tilesetTsxPath)) {
  const tsx = `<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.11" name="doghouse-tileset" tilewidth="16" tileheight="16" tilecount="80" columns="10">
  <image source="doghouse-tileset.png" width="160" height="128"/>
</tileset>
`;
  fs.writeFileSync(tilesetTsxPath, tsx);
  console.log('  -> tileset TSX salvo');
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
