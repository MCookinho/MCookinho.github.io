#!/usr/bin/env node
/**
 * tiled-to-map.js — Converte exportação JSON do Tiled para o formato map.js
 *
 * Uso:
 *   node tools/tiled-to-map.js <arquivo.json> [id_do_mapa]
 *
 * Exemplo:
 *   node tools/tiled-to-map.js sala.json sala
 *
 * O arquivo Tiled deve ser um mapa 20×15 tiles (16×16 px).
 * Layers esperados:
 *   - "tiles"  (tile layer) → piso
 *   - "wall"   (tile layer) → paredes/móveis (auto-bloqueio)
 *   - "collision" (tile layer opcional) → bloqueios manuais
 *   - "objects" (object layer) → objetos interativos
 *
 * Objetos devem usar TYPE como tipo e custom properties conforme a tabela:
 *
 *   type         | custom properties
 *   -------------|------------------
 *   door         | targetMap (string), targetX (int), targetY (int)
 *   item         | item (string)
 *   note         | noteId (string)
 *   puzzle       | puzzleId (string)
 *   gate         | requiredItem (string), targetMap (string), targetX (int), targetY (int)
 *   golden_door  | puzzleId (string)
 *   shiva_event  | eventId (string)
 *
 *   item         | item (string), itemNote (string, opcional)
 *   note         | noteId (string)
 *   puzzle       | puzzleId (string)
 *   gate         | requiredItem (string), targetMap (string), targetX (int), targetY (int)
 *   golden_door  | puzzleId (string)
 *   shiva_event  | eventId (string)
 *   connection   | dir (string: left/right/up/down), map (string), x (int), y (int)
 *
 * Propriedades do mapa (custom properties do Tiled):
 *   ambient (string): 'casa' | 'rua'
 *   light (float): 0.0 - 1.0
 *   playerStartX (int), playerStartY (int): posição inicial em tiles
 */

const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Uso: node tools/tiled-to-map.js <arquivo.json> [id_do_mapa]');
  process.exit(1);
}

const filePath = process.argv[2];
const mapId = process.argv[3] || filePath.replace(/\.json$/i, '').split(/[/\\]/).pop();

const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const MAP_COLS = data.width;
const MAP_ROWS = data.height;
const TILE_SIZE = data.tilewidth;
const MAP_NAME = mapId.charAt(0).toUpperCase() + mapId.slice(1);

if (TILE_SIZE !== 16) {
  console.error(`Erro: tile size deve ser 16, encontrado ${TILE_SIZE}`);
  process.exit(1);
}

// --- extract layers ---
function findLayer(name) {
  return data.layers.find(l => l.name === name);
}

function tileLayerToGrid(layer) {
  if (!layer) return null;
  const grid = [];
  for (let y = 0; y < MAP_ROWS; y++) {
    grid[y] = [];
    for (let x = 0; x < MAP_COLS; x++) {
      grid[y][x] = layer.data[y * MAP_COLS + x] || 0;
    }
  }
  return grid;
}

const tilesLayer = findLayer('tiles');
const wallLayer = findLayer('wall');
const collisionLayer = findLayer('collision');
const objectsLayer = findLayer('objects');

const tiles = tilesLayer ? tileLayerToGrid(tilesLayer) : [];
const wall = wallLayer ? tileLayerToGrid(wallLayer) : [];

// --- generate collision grid ---
// Auto-block: tiles=0, wall non-zero, collision layer tiles
const collision = [];
for (let y = 0; y < MAP_ROWS; y++) {
  collision[y] = [];
  for (let x = 0; x < MAP_COLS; x++) {
    const tile = tiles[y]?.[x] || 0;
    const w = wall[y]?.[x] || 0;
    const c = collisionLayer ? (collisionLayer.data[y * MAP_COLS + x] || 0) : 0;
    collision[y][x] = !!(tile === 0 || w !== 0 || c !== 0);
  }
}

// --- map-level properties ---
const mapProps = {};
if (data.properties) {
  data.properties.forEach(p => { mapProps[p.name] = p.value; });
}

// --- extract objects ---
const objects = [];
const connections = [];

if (objectsLayer && objectsLayer.objects) {
  for (const obj of objectsLayer.objects) {
    const tx = Math.floor(obj.x / TILE_SIZE);
    const ty = Math.floor(obj.y / TILE_SIZE);
    const type = obj.type || obj.class || '';
    const props = {};
    if (obj.properties) {
      obj.properties.forEach(p => { props[p.name] = p.value; });
    }

    switch (type) {
      case 'connection':
        connections.push({
          dir: props.dir || 'right',
          map: props.map || 'quarto',
          x: props.x !== undefined ? props.x : 0,
          y: props.y !== undefined ? props.y : 0,
        });
        break;
      case 'door':
        objects.push({
          type: 'door', x: tx, y: ty,
          targetMap: props.targetMap || 'quarto',
          targetX: props.targetX || 1,
          targetY: props.targetY || 7,
        });
        break;
      case 'gate':
        objects.push({
          type: 'gate', x: tx, y: ty,
          requiredItem: props.requiredItem || 'key',
          targetMap: props.targetMap || 'quarto',
          targetX: props.targetX || 1,
          targetY: props.targetY || 7,
        });
        break;
      case 'golden_door':
        objects.push({
          type: 'golden_door', x: tx, y: ty,
          puzzleId: props.puzzleId || '',
        });
        break;
      case 'item':
        {
          const entry = {
            type: 'item', x: tx, y: ty,
            item: props.item || 'lanterna',
            collected: false,
          };
          if (props.itemNote) entry.itemNote = props.itemNote;
          if (props.requiredItem) entry.requiredItem = props.requiredItem;
          objects.push(entry);
        }
        break;
      case 'note':
        objects.push({
          type: 'note', x: tx, y: ty,
          noteId: props.noteId || '',
          read: false,
        });
        break;
      case 'puzzle':
        objects.push({
          type: 'puzzle', x: tx, y: ty,
          puzzleId: props.puzzleId || '',
          solved: false,
        });
        break;
      case 'shiva_event':
        objects.push({
          type: 'shiva_event', x: tx, y: ty,
          eventId: props.eventId || '',
          triggered: false,
        });
        break;
      default:
        // objecto genérico — preserva tipo original
        if (type) {
          const entry = { type, x: tx, y: ty };
          Object.keys(props).forEach(k => { entry[k] = props[k]; });
          objects.push(entry);
        }
    }
  }
}

// --- generate map.js code ---
let code = '';
code += `(function() {\n`;
code += `const tiles = makeGrid(0);\n`;
code += `const wall = makeGrid(0);\n`;
code += `const coll = makeGrid(false);\n\n`;

// Tiles layer
if (tilesLayer) {
  code += `// --- tiles (piso) ---\n`;
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      const t = tiles[y][x];
      if (t !== 0) {
        code += `tiles[${y}][${x}] = ${t};\n`;
      }
    }
  }
  code += '\n';
}

// Wall layer
if (wallLayer) {
  code += `// --- wall (paredes/moveis) ---\n`;
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      const w = wall[y][x];
      if (w !== 0) {
        code += `wall[${y}][${x}] = ${w};\n`;
      }
    }
  }
  code += '\n';
}

// Collision layer (only explicit collision tiles, not auto-generated)
if (collisionLayer) {
  code += `// --- colisao manual ---\n`;
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      const c = collisionLayer.data[y * MAP_COLS + x] || 0;
      if (c !== 0) {
        code += `coll[${y}][${x}] = true;\n`;
      }
    }
  }
  code += '\n';
}

// Objects
if (objects.length > 0) {
  code += `// --- objetos interativos ---\n`;
  code += `const objects = [\n`;
  objects.forEach((obj, i) => {
    const entries = Object.entries(obj).map(([k, v]) => {
      if (typeof v === 'string') return `${k}:'${v}'`;
      return `${k}:${v}`;
    });
    code += `  { ${entries.join(', ')} }${i < objects.length - 1 ? ',' : ''}\n`;
  });
  code += `];\n\n`;
} else {
  code += `const objects = [];\n\n`;
}

// Connections
if (connections.length > 0) {
  code += `// --- conexoes de borda ---\n`;
  code += `const connections = [\n`;
  connections.forEach((c, i) => {
    code += `  { dir:'${c.dir}', map:'${c.map}', x:${c.x}, y:${c.y} }${i < connections.length - 1 ? ',' : ''}\n`;
  });
  code += `];\n\n`;
} else {
  code += `const connections = [];\n\n`;
}

// Extract map-level custom properties
const ambient = (mapProps && mapProps.ambient) ? mapProps.ambient : 'casa';
const light = (mapProps && mapProps.light !== undefined) ? mapProps.light : 0.3;
const pStartX = (mapProps && mapProps.playerStartX !== undefined) ? mapProps.playerStartX : Math.floor(MAP_COLS / 2);
const pStartY = (mapProps && mapProps.playerStartY !== undefined) ? mapProps.playerStartY : Math.floor(MAP_ROWS * 0.7);

// Register map
code += `window.MAP_DATA_${mapId} = makeMapData('${mapId}', '${MAP_NAME}', {\n`;
code += `  tiles, wall, collision: coll, objects, connections,\n`;
code += `  ambient: '${ambient}',\n`;
code += `  light: ${light},\n`;
code += `  playerStart: { x: ${pStartX} * ${TILE_SIZE}, y: ${pStartY} * ${TILE_SIZE} },\n`;
code += `});\n`;
code += `})();\n`;

console.log(code);
