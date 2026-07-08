/* ===== SPRITES.JS ===== */
/* Pixel art definitions for all tiles, characters, items, and UI */

const PALETTE_16 = [
  '#0a0505', '#1a0a0a', '#2a1010', '#3a1a1a',
  '#5a2a2a', '#8a3a3a', '#a85a3a', '#a87850',
  '#8a7a5a', '#5a3a5a', '#2a2a3a', '#6a6a4a',
  '#1a1820', '#3a3a1a', '#5a5a3a', '#aaa878'
];

function empty(w, h) {
  const r = [];
  for (let y = 0; y < h; y++) { r[y] = []; for (let x = 0; x < w; x++) r[y][x] = 0; }
  return r;
}

function fill(r, x1, y1, x2, y2, c) {
  for (let y = y1; y <= y2; y++)
    for (let x = x1; x <= x2; x++)
      if (r[y] !== undefined) r[y][x] = c;
}

function set(r, x, y, c) { if (r[y] !== undefined) r[y][x] = c; }

/* ================================================================
   TILES (16×16)
   ================================================================ */

function makeFloor() {
  const s = empty(16,16);
  // base wood tone
  fill(s, 0,0, 15,15, 3);
  // plank dividers every 4 rows
  for (let y = 3; y < 16; y += 4) {
    for (let x = 0; x < 16; x++) { set(s, x, y, 2); set(s, x, y+1, 1); }
  }
  // wood grain lines
  for (let x = 2; x < 14; x += 3) { set(s, x, 1, 2); set(s, x+1, 5, 2); set(s, x-1, 9, 2); set(s, x+1, 13, 2); }
  // slight highlight
  for (let x = 0; x < 16; x++) { set(s, x, 0, 4); set(s, x, 4, 4); set(s, x, 8, 4); set(s, x, 12, 4); }
  return s;
}

function makeFloorB() {
  const s = makeFloor();
  // darker stain patch
  fill(s, 5,5, 10,8, 1);
  fill(s, 6,6, 9,7, 0);
  return s;
}

function makeFloorC() {
  const s = makeFloor();
  // scratch / damage
  for (let x = 3; x < 12; x++) { set(s, x, 7, 5); set(s, x+1, 7, 1); }
  return s;
}

function makeSidewalk() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 8);
  // concrete tile grid
  for (let x = 0; x < 16; x++) { set(s, x, 7, 4); set(s, x, 8, 4); }
  for (let y = 0; y < 16; y++) { set(s, 7, y, 4); set(s, 8, y, 4); }
  // some texture
  for (let i = 0; i < 6; i++) set(s, 2+i*3, 2+(i%4)*2, 5);
  return s;
}

function makeSidewalkCrack() {
  const s = makeSidewalk();
  // crack line
  for (let i = 0; i < 8; i++) set(s, 3+i, 3+i, 1);
  for (let i = 0; i < 5; i++) set(s, 8+i, 10-i, 1);
  return s;
}

function makeSidewalkStain() {
  const s = makeSidewalk();
  fill(s, 4,2, 8,6, 4);
  fill(s, 5,3, 7,5, 1);
  return s;
}

function makeStreet() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 10);
  // texture dots
  for (let i = 0; i < 20; i++) set(s, (i*7)%16, (i*5)%16, 9);
  return s;
}

function makeStreetLine() {
  const s = makeStreet();
  // painted line
  fill(s, 0,7, 15,8, 13);
  fill(s, 0,7, 15,8, 14);
  set(s, 7,7, 10); set(s, 8,7, 10); set(s, 7,8, 10); set(s, 8,8, 10);
  return s;
}

function makeStreetHole() {
  const s = makeStreet();
  // pothole
  fill(s, 5,5, 10,9, 0);
  fill(s, 6,6, 9,8, 1);
  set(s, 7,6, 0); set(s, 8,6, 0); set(s, 7,7, 0); set(s, 8,7, 0);
  return s;
}

function makeGrass() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 11);
  // grass blades
  for (let x = 1; x < 15; x += 3) {
    set(s, x, 1, 3); set(s, x, 2, 11);
    set(s, x+1, 3, 3); set(s, x+1, 4, 11);
  }
  for (let x = 0; x < 16; x += 2) { set(s, x, 14, 4); set(s, x+1, 15, 4); }
  return s;
}

function makeGrassDark() {
  const s = makeGrass();
  fill(s, 4,4, 11,11, 4);
  fill(s, 5,5, 10,10, 1);
  return s;
}

function makeGrassFlower() {
  const s = makeGrass();
  // small flower
  set(s, 8,6, 15); set(s, 9,6, 15); set(s, 8,7, 15); set(s, 9,7, 15);
  set(s, 9,5, 6); set(s, 8,5, 15); set(s, 10,6, 15); set(s, 7,6, 15);
  set(s, 9,8, 15); set(s, 8,8, 15);
  return s;
}

function makeWallBrick() {
  const s = empty(16,16);
  // mortar background
  fill(s, 0,0, 15,15, 3);
  // brick rows - offset every other row
  const rows = [
    {y:0, c:4}, {y:2, c:5}, {y:4, c:4}, {y:6, c:5},
    {y:8, c:4}, {y:10, c:5}, {y:12, c:4}, {y:14, c:5}
  ];
  rows.forEach(r => {
    const offset = (r.y % 4 === 0) ? 0 : 4;
    for (let x = -4; x < 16; x += 8) {
      fill(s, x+offset, r.y, x+offset+6, r.y+1, r.c);
    }
  });
  // darker edges
  for (let x = 0; x < 16; x++) set(s, x, 0, 2);
  for (let y = 0; y < 16; y++) set(s, 0, y, 2);
  return s;
}

function makeFence() {
  const s = empty(16,16);
  // horizontal bars
  fill(s, 0,3, 15,3, 9);
  fill(s, 0,7, 15,7, 9);
  fill(s, 0,11, 15,11, 9);
  // vertical bars
  for (let x = 2; x < 16; x += 4) {
    fill(s, x,1, x,14, 9);
    fill(s, x+1,1, x+1,14, 1);
  }
  // spikes on top
  for (let x = 2; x < 16; x += 4) { set(s, x+1, 0, 9); }
  return s;
}

function makeGate() {
  const s = empty(16,16);
  // ornate iron gate
  fill(s, 0,2, 15,13, 0);
  // frame
  fill(s, 0,0, 15,1, 7);
  fill(s, 0,14, 15,15, 7);
  fill(s, 0,0, 0,15, 7);
  fill(s, 15,0, 15,15, 7);
  // decorative scrollwork
  for (let x = 3; x < 14; x += 4) { fill(s, x,3, x,12, 7); set(s, x+1,3, 7); set(s, x+1,12, 7); }
  set(s, 7,5, 7); set(s, 8,5, 7); set(s, 7,6, 7); set(s, 8,6, 7);
  set(s, 7,9, 7); set(s, 8,9, 7); set(s, 7,10, 7); set(s, 8,10, 7);
  return s;
}

function makePost() {
  const s = empty(16,16);
  // pole
  fill(s, 7,3, 8,14, 12);
  // lamp housing
  fill(s, 5,0, 10,4, 9);
  fill(s, 6,1, 9,3, 7);
  // glow (center)
  set(s, 7,1, 15); set(s, 8,1, 15); set(s, 7,2, 14); set(s, 8,2, 14);
  // base
  fill(s, 6,13, 9,15, 9);
  fill(s, 5,14, 10,15, 1);
  return s;
}

function makeTree() {
  const s = empty(16,16);
  // trunk
  fill(s, 7,8, 8,15, 4);
  fill(s, 7,9, 8,14, 3);
  // canopy layers
  function canopy(y1, y2, w, c) {
    const cx = 8;
    for (let y = y1; y <= y2; y++) {
      const half = Math.floor(w/2);
      for (let x = cx - half; x <= cx + half; x++) {
        if (x >= 0 && x < 16) set(s, x, y, c);
      }
    }
    if (w > 4) { canopy(y1, y2, w-2, c); }
  }
  canopy(1, 3, 12, 11);
  canopy(3, 5, 14, 4);
  canopy(5, 7, 12, 11);
  canopy(7, 8, 8, 4);
  // dark spots
  set(s, 4,2, 11); set(s, 10,3, 11); set(s, 6,5, 4); set(s, 11,6, 4);
  return s;
}

function makeDoor() {
  const s = empty(16,16);
  // door base
  fill(s, 1,0, 14,15, 4);
  fill(s, 2,1, 13,14, 7);
  // frame
  fill(s, 0,0, 0,15, 3);
  fill(s, 15,0, 15,15, 3);
  fill(s, 0,0, 15,0, 3);
  fill(s, 0,15, 15,15, 3);
  // panels
  fill(s, 3,2, 12,5, 5);
  fill(s, 4,3, 11,4, 7);
  fill(s, 3,7, 12,10, 5);
  fill(s, 4,8, 11,9, 7);
  fill(s, 3,12, 12,14, 5);
  fill(s, 4,13, 11,13, 7);
  // knob
  set(s, 12,7, 6); set(s, 12,8, 6);
  set(s, 11,7, 14); set(s, 11,8, 14);
  return s;
}

function makeWallTop() {
  const s = makeWallBrick();
  // top edge / coping
  fill(s, 0,0, 15,1, 8);
  fill(s, 0,0, 15,0, 15);
  // slight overhang shadow
  fill(s, 0,2, 15,2, 2);
  return s;
}

function makeCeiling() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 1);
  // beams
  for (let x = 0; x < 16; x++) fill(s, x, 3, x, 5, 0);
  for (let x = 0; x < 16; x++) fill(s, x, 10, x, 12, 0);
  // beam highlights
  for (let x = 0; x < 16; x++) { set(s, x, 3, 2); set(s, x, 10, 2); }
  return s;
}

function makeBed() {
  const s = empty(16,16);
  // headboard
  fill(s, 0,0, 15,2, 4);
  fill(s, 0,0, 15,0, 5);
  // mattress
  fill(s, 1,2, 14,10, 14);
  fill(s, 2,3, 13,9, 15);
  // pillow
  fill(s, 2,3, 5,5, 14);
  fill(s, 3,3, 4,4, 15);
  // blanket stripe
  fill(s, 2,6, 13,6, 8);
  fill(s, 2,7, 13,7, 7);
  // footboard
  fill(s, 0,10, 15,11, 4);
  fill(s, 0,11, 15,11, 5);
  // legs
  set(s, 1,11, 3); set(s, 14,11, 3);
  set(s, 1,15, 3); set(s, 14,15, 3);
  fill(s, 0,12, 1,15, 3);
  fill(s, 14,12, 15,15, 3);
  return s;
}

function makeTable() {
  const s = empty(16,16);
  // table top
  fill(s, 1,4, 14,6, 4);
  fill(s, 2,5, 13,5, 5);
  // top surface highlight
  fill(s, 2,4, 13,4, 7);
  // legs
  fill(s, 2,6, 3,15, 3);
  fill(s, 12,6, 13,15, 3);
  fill(s, 2,15, 3,15, 4);
  fill(s, 12,15, 13,15, 4);
  // cross brace
  fill(s, 3,11, 12,12, 3);
  set(s, 3,11, 2); set(s, 12,11, 2);
  return s;
}

function makePew() {
  const s = empty(16,16);
  // back rest
  fill(s, 1,1, 14,5, 4);
  fill(s, 2,2, 13,4, 5);
  // seat
  fill(s, 1,5, 14,7, 4);
  fill(s, 2,6, 13,6, 7);
  // legs
  fill(s, 2,7, 3,15, 3);
  fill(s, 12,7, 13,15, 3);
  // front rail
  fill(s, 2,10, 13,11, 3);
  set(s, 2,10, 2); set(s, 13,10, 2);
  return s;
}

function makeMuralho() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 9);
  // large stone blocks
  const stones = [
    [0,0,7,3], [8,0,15,2], [0,4,5,7], [6,3,15,6],
    [0,8,7,11], [8,7,15,10], [0,12,7,15], [8,11,15,15]
  ];
  stones.forEach(([x1,y1,x2,y2]) => {
    fill(s, x1,y1, x2,y2, 12);
    fill(s, x1+1,y1+1, x2-1,y2-1, 9);
  });
  // mortar lines
  for (let x = 0; x < 16; x++) { set(s, x, 3, 1); set(s, x, 7, 1); set(s, x, 11, 1); }
  for (let y = 0; y < 16; y++) { set(s, 7, y, 1); }
  return s;
}

function makeCrate() {
  const s = empty(16,16);
  // wooden crate
  fill(s, 0,0, 15,15, 4);
  fill(s, 1,1, 14,14, 3);
  // horizontal planks
  fill(s, 1,3, 14,3, 2);
  fill(s, 1,7, 14,7, 2);
  fill(s, 1,11, 14,11, 2);
  // vertical supports
  fill(s, 4,0, 5,15, 2);
  fill(s, 10,0, 11,15, 2);
  // nail heads
  set(s, 2,1, 1); set(s, 2,3, 1); set(s, 13,1, 1); set(s, 13,3, 1);
  set(s, 2,7, 1); set(s, 13,7, 1);
  set(s, 2,11, 1); set(s, 13,11, 1);
  // highlight
  set(s, 5,1, 5); set(s, 11,1, 5);
  set(s, 5,3, 5); set(s, 11,3, 5);
  return s;
}

/* Tile registry with variants */
const T_SPRITES = {
  1: [makeFloor(), makeFloorB(), makeFloorC()],
  2: [makeSidewalk(), makeSidewalkCrack(), makeSidewalkStain()],
  3: [makeStreet(), makeStreetLine(), makeStreetHole()],
  4: [makeGrass(), makeGrassDark(), makeGrassFlower()],
  5: makeWallBrick(),
  6: makeFence(),
  7: makeGate(),
  8: makePost(),
  9: makeTree(),
  10: makeDoor(),
  11: makeWallTop(),
  12: makeCeiling(),
  13: makeMuralho(),
  14: makeBed(),
  15: makeTable(),
  16: makePew(),
  17: makeCrate(),
};

/* ================================================================
   CHARACTERS (16×16)
   ================================================================ */

function makePlayer(dir) {
  const s = empty(16,16);
  // === HEAD ===
  fill(s, 5,0, 10,4, 8);      // face
  set(s, 5,0, 0); set(s, 10,0, 0);
  set(s, 5,4, 0); set(s, 10,4, 0);
  fill(s, 6,0, 9,0, 1);       // hair top
  fill(s, 5,1, 5,2, 1);       // hair sides
  fill(s, 10,1, 10,2, 1);

  // eyes
  if (dir === 'down' || dir === 'up') {
    set(s, 7,2, 0); set(s, 8,2, 0);
    set(s, 7,3, 15); set(s, 8,3, 15);
  } else if (dir === 'left') {
    set(s, 6,2, 0); set(s, 7,2, 0);
    set(s, 6,3, 15); set(s, 7,3, 15);
  } else {
    set(s, 8,2, 0); set(s, 9,2, 0);
    set(s, 8,3, 15); set(s, 9,3, 15);
  }
  // mouth
  if (dir === 'down') { set(s, 7,4, 1); set(s, 8,4, 1); }

  // === BODY (jacket) ===
  fill(s, 4,5, 11,10, 10);    // jacket body
  fill(s, 5,5, 10,5, 2);      // collar line
  set(s, 4,5, 0); set(s, 11,5, 0);
  set(s, 4,10, 0); set(s, 11,10, 0);

  // jacket front line
  fill(s, 7,6, 8,10, 12);

  // arms
  fill(s, 3,6, 3,9, 10);      // left arm
  fill(s, 12,6, 12,9, 10);    // right arm
  set(s, 3,5, 0); set(s, 12,5, 0);
  set(s, 3,10, 0); set(s, 12,10, 0);
  // hands
  set(s, 3,9, 8); set(s, 12,9, 8);

  // === LEGS ===
  fill(s, 5,11, 7,14, 1);     // left leg
  fill(s, 8,11, 10,14, 1);    // right leg
  set(s, 5,11, 0); set(s, 7,11, 0);
  set(s, 8,11, 0); set(s, 10,11, 0);
  set(s, 5,14, 0); set(s, 7,14, 0);
  set(s, 8,14, 0); set(s, 10,14, 0);
  // shoes
  fill(s, 5,14, 7,15, 2);
  fill(s, 8,14, 10,15, 2);
  return s;
}

function makePlayerWalk(dir, frame) {
  const s = makePlayer(dir);
  if (frame === 1) {
    // alternate leg positions
    fill(s, 5,11, 7,14, 0);
    fill(s, 8,11, 10,14, 0);
    fill(s, 5,14, 7,15, 0);
    fill(s, 8,14, 10,15, 0);
    fill(s, 4,11, 6,14, 1);
    fill(s, 9,11, 11,14, 1);
    fill(s, 4,14, 6,15, 2);
    fill(s, 9,14, 11,15, 2);
  }
  return s;
}

const PLAYER_DOWN = makePlayer('down');
const PLAYER_UP = makePlayer('up');
const PLAYER_LEFT = makePlayer('left');
const PLAYER_RIGHT = makePlayer('right');
const PLAYER_WALK_DOWN = [PLAYER_DOWN, makePlayerWalk('down', 1)];
const PLAYER_WALK_UP = [PLAYER_UP, makePlayerWalk('up', 1)];
const PLAYER_WALK_LEFT = [PLAYER_LEFT, makePlayerWalk('left', 1)];
const PLAYER_WALK_RIGHT = [PLAYER_RIGHT, makePlayerWalk('right', 1)];

/* Shiva — golden retriever */
function makeShiva(dir) {
  const s = empty(16,16);

  // === BODY ===
  fill(s, 3,6, 12,13, 7);     // main body
  fill(s, 4,7, 11,12, 6);     // darker underside
  fill(s, 3,13, 12,13, 6);    // paws line

  // tail (varies by direction)
  if (dir === 'down') {
    set(s, 12,5, 7); set(s, 13,5, 7); set(s, 13,6, 7);
    set(s, 14,5, 7);
  } else if (dir === 'up') {
    set(s, 11,4, 7); set(s, 12,4, 7); set(s, 13,5, 7);
  } else if (dir === 'left') {
    set(s, 2,4, 7); set(s, 2,5, 7); set(s, 3,5, 7);
  } else {
    set(s, 13,4, 7); set(s, 13,5, 7); set(s, 12,5, 7);
  }

  // === HEAD ===
  let hx = 5, hy = 2;
  if (dir === 'right') hx = 8;
  else if (dir === 'left') hx = 3;

  fill(s, hx, hy, hx+4, hy+4, 7);    // head
  fill(s, hx+1, hy+1, hx+3, hy+3, 6);
  // ears
  if (dir === 'down' || dir === 'up' || dir === 'right') {
    set(s, hx, hy, 7); set(s, hx+1, hy, 7);
    set(s, hx+4, hy, 7); set(s, hx+3, hy, 7);
  }
  if (dir === 'left') {
    set(s, hx, hy, 7); set(s, hx+1, hy, 7);
    set(s, hx+4, hy, 7);
  }
  // eyes & nose
  if (dir === 'down') {
    set(s, hx+1, hy+2, 0); set(s, hx+3, hy+2, 0);
    set(s, hx+2, hy+3, 1);
  } else if (dir === 'up') {
    set(s, hx+1, hy+2, 0); set(s, hx+3, hy+2, 0);
  } else if (dir === 'left') {
    set(s, hx+1, hy+2, 0); set(s, hx+2, hy+2, 0);
    set(s, hx+2, hy+3, 1);
  } else {
    set(s, hx+3, hy+2, 0); set(s, hx+2, hy+2, 0);
    set(s, hx+2, hy+3, 1);
  }
  // tongue
  if (dir === 'down') { set(s, hx+2, hy+4, 5); }

  // === LEGS ===
  fill(s, 4,12, 5,14, 7);
  fill(s, 10,12, 11,14, 7);
  if (dir === 'left') { fill(s, 2,12, 3,14, 7); fill(s, 8,12, 9,14, 7); }
  if (dir === 'right') { fill(s, 6,12, 7,14, 7); fill(s, 12,12, 13,14, 7); }
  // paws
  if (dir === 'down' || dir === 'up') { set(s, 4,14, 6); set(s, 5,14, 6); set(s, 10,14, 6); set(s, 11,14, 6); }

  return s;
}

const SHIVA_DOWN = makeShiva('down');
const SHIVA_UP = makeShiva('up');
const SHIVA_LEFT = makeShiva('left');
const SHIVA_RIGHT = makeShiva('right');
const SHIVA_WALK_DOWN = [SHIVA_DOWN, makeShiva('down')];
const SHIVA_WALK_UP = [SHIVA_UP, makeShiva('up')];
const SHIVA_WALK_LEFT = [SHIVA_LEFT, makeShiva('left')];
const SHIVA_WALK_RIGHT = [SHIVA_RIGHT, makeShiva('right')];

/* Shiva evil (32×32) — three-headed form */
function makeShivaEvil() {
  const s = empty(32,32);
  // massive body
  fill(s, 4,10, 27,29, 1);
  fill(s, 6,12, 25,27, 0);
  // muscular shoulders
  fill(s, 2,8, 29,13, 1);
  fill(s, 0,10, 3,14, 1);
  fill(s, 28,10, 31,14, 1);

  // === THREE HEADS ===
  const heads = [
    { cx:8, cy:3, dx:-4 },
    { cx:16, cy:1, dx:0 },
    { cx:24, cy:3, dx:4 },
  ];
  heads.forEach(h => {
    // head shape
    fill(s, h.cx-3, h.cy, h.cx+3, h.cy+6, 1);
    fill(s, h.cx-2, h.cy+1, h.cx+2, h.cy+5, 0);
    // ears
    set(s, h.cx-4, h.cy, 1); set(s, h.cx-4, h.cy+1, 1);
    set(s, h.cx+4, h.cy, 1); set(s, h.cx+4, h.cy+1, 1);
    // glowing red eyes
    fill(s, h.cx-2, h.cy+2, h.cx-1, h.cy+3, 5);
    fill(s, h.cx+1, h.cy+2, h.cx+2, h.cy+3, 5);
    // teeth / jaw
    set(s, h.cx-1, h.cy+5, 15); set(s, h.cx, h.cy+5, 15); set(s, h.cx+1, h.cy+5, 15);
    set(s, h.cx-2, h.cy+6, 15); set(s, h.cx+2, h.cy+6, 15);
  });

  // front legs
  fill(s, 8,22, 11,29, 1);
  fill(s, 20,22, 23,29, 1);
  fill(s, 9,24, 10,28, 0);
  fill(s, 21,24, 22,28, 0);
  // claws
  set(s, 8,29, 15); set(s, 11,29, 15);
  set(s, 20,29, 15); set(s, 23,29, 15);

  // ambient glow rings around heads
  heads.forEach(h => {
    for (let a = 0; a < 8; a++) {
      const angle = a * Math.PI / 4;
      const gx = Math.round(h.cx + Math.cos(angle) * 5);
      const gy = Math.round(h.cy + 3 + Math.sin(angle) * 4);
      if (gx >= 0 && gx < 32 && gy >= 0 && gy < 32) set(s, gx, gy, 5);
    }
  });
  return s;
}
const SHIVA_EVIL = makeShivaEvil();

/* Shiva shadow — dark silhouette with red eyes */
function makeShivaShadow() {
  const s = empty(16,16);
  // body silhouette
  fill(s, 2,3, 13,13, 1);
  fill(s, 3,4, 12,12, 0);
  // head
  fill(s, 4,1, 11,4, 1);
  fill(s, 5,2, 10,3, 0);
  // ears
  set(s, 3,1, 1); set(s, 3,2, 1);
  set(s, 12,1, 1); set(s, 12,2, 1);
  // glowing eyes
  set(s, 6,2, 5); set(s, 7,2, 5);
  set(s, 9,2, 5); set(s, 10,2, 5);
  // tail
  set(s, 12,8, 1); set(s, 13,9, 1); set(s, 14,10, 1);
  return s;
}
const SHIVA_SHADOW = makeShivaShadow();

/* Shiva eyes — just floating red eyes */
function makeShivaEyes() {
  const s = empty(16,16);
  // eye sockets (dark)
  set(s, 5,6, 1); set(s, 6,6, 1); set(s, 7,6, 1);
  set(s, 9,6, 1); set(s, 10,6, 1); set(s, 11,6, 1);
  set(s, 5,7, 1); set(s, 6,7, 5); set(s, 7,7, 5); set(s, 8,7, 1);
  set(s, 9,7, 5); set(s, 10,7, 5); set(s, 11,7, 1);
  set(s, 5,8, 1); set(s, 6,8, 5); set(s, 7,8, 0); set(s, 8,8, 1);
  set(s, 9,8, 0); set(s, 10,8, 5); set(s, 11,8, 1);
  set(s, 5,9, 1); set(s, 6,9, 1); set(s, 7,9, 1);
  set(s, 9,9, 1); set(s, 10,9, 1); set(s, 11,9, 1);
  // pupil glow
  set(s, 6,7, 6); set(s, 7,7, 6);
  set(s, 10,7, 6); set(s, 9,7, 6);
  return s;
}
const SHIVA_EYES = makeShivaEyes();

/* ================================================================
   ITEMS (16×16)
   ================================================================ */

const I_LANTERN = (() => {
  const s = empty(16,16);
  // handle
  fill(s, 6,0, 9,1, 7);
  set(s, 7,0, 7); set(s, 8,0, 7);
  // body
  fill(s, 5,2, 10,9, 6);
  fill(s, 6,3, 9,8, 7);
  // glass
  fill(s, 6,4, 9,7, 14);
  set(s, 7,4, 15); set(s, 8,4, 15); set(s, 7,7, 15); set(s, 8,7, 15);
  // flame
  set(s, 7,5, 6); set(s, 8,5, 6); set(s, 7,6, 15); set(s, 8,6, 15);
  // base
  fill(s, 6,9, 9,10, 7);
  fill(s, 7,10, 8,11, 7);
  return s;
})();

const I_KEY = (() => {
  const s = empty(16,16);
  // bow (head)
  fill(s, 2,2, 5,5, 7);
  fill(s, 3,3, 4,4, 1);
  set(s, 2,2, 7); set(s, 5,2, 7); set(s, 2,5, 7); set(s, 5,5, 7);
  // shaft
  fill(s, 7,4, 7,12, 7);
  fill(s, 8,5, 8,11, 7);
  // teeth
  set(s, 8,10, 7); set(s, 9,10, 7);
  set(s, 8,12, 7); set(s, 9,12, 7);
  set(s, 10,12, 7);
  // highlight
  set(s, 7,4, 14); set(s, 3,2, 14);
  return s;
})();

const I_HERBS = (() => {
  const s = empty(16,16);
  // bundle of dried herbs
  fill(s, 5,3, 10,12, 11);
  fill(s, 6,4, 9,11, 4);
  // stems
  set(s, 6,3, 11); set(s, 7,3, 11); set(s, 8,3, 11); set(s, 9,3, 11);
  // string tie
  fill(s, 6,6, 9,6, 3);
  fill(s, 6,9, 9,9, 3);
  // leaves protruding
  set(s, 5,4, 3); set(s, 5,8, 3);
  set(s, 10,4, 3); set(s, 10,7, 3);
  return s;
})();

const I_SALT = (() => {
  const s = empty(16,16);
  // pouch
  fill(s, 3,3, 12,10, 14);
  fill(s, 4,4, 11,9, 15);
  // opening
  fill(s, 4,3, 11,3, 13);
  fill(s, 5,3, 10,3, 15);
  // salt grains spilling
  set(s, 4,10, 15); set(s, 5,11, 15); set(s, 3,11, 15);
  set(s, 6,10, 15); set(s, 7,11, 15);
  // string
  fill(s, 3,2, 4,2, 3);
  fill(s, 11,2, 12,2, 3);
  return s;
})();

const I_AMULET = (() => {
  const s = empty(16,16);
  // cord
  fill(s, 7,1, 8,4, 3);
  fill(s, 6,4, 9,4, 3);
  // pendant (bone shape)
  fill(s, 5,5, 10,12, 7);
  fill(s, 6,6, 9,11, 8);
  // bone detail
  set(s, 5,7, 7); set(s, 10,7, 7);
  set(s, 5,10, 7); set(s, 10,10, 7);
  // center dot
  set(s, 7,8, 5); set(s, 8,8, 5);
  return s;
})();

const I_CHALK = (() => {
  const s = empty(16,16);
  // chalk stick
  fill(s, 7,2, 8,13, 15);
  fill(s, 7,2, 8,13, 14);
  // tip
  set(s, 7,1, 15); set(s, 8,1, 15);
  set(s, 7,0, 15); set(s, 8,0, 15);
  // dust
  set(s, 6,5, 14); set(s, 9,8, 14); set(s, 6,11, 14);
  return s;
})();

const I_MIRROR = (() => {
  const s = empty(16,16);
  // oval frame
  fill(s, 4,1, 11,13, 7);
  fill(s, 5,2, 10,12, 8);
  // reflective surface
  fill(s, 6,3, 9,11, 15);
  fill(s, 6,4, 9,10, 14);
  // reflection glint
  set(s, 7,3, 15); set(s, 8,4, 15);
  set(s, 6,8, 10); set(s, 8,10, 10);
  // handle
  fill(s, 7,13, 8,14, 7);
  set(s, 7,15, 3); set(s, 8,15, 3);
  return s;
})();

const I_NOTE = (() => {
  const s = empty(16,16);
  fill(s, 2,1, 13,14, 8);
  fill(s, 3,2, 12,13, 15);
  // fold line
  fill(s, 12,2, 12,13, 3);
  // text squiggles
  set(s, 5,4, 3); set(s, 6,4, 3); set(s, 7,5, 3); set(s, 8,5, 3);
  set(s, 5,7, 3); set(s, 6,7, 3); set(s, 7,8, 3); set(s, 8,8, 3);
  set(s, 5,10, 3); set(s, 6,11, 3); set(s, 7,11, 3);
  // seal
  set(s, 4,4, 5); set(s, 4,5, 5);
  return s;
})();

const I_MEMORY = (() => {
  const s = empty(16,16);
  // luminous fragment
  fill(s, 5,4, 10,11, 15);
  fill(s, 6,5, 9,10, 14);
  // sparkle
  set(s, 7,3, 15); set(s, 8,3, 15); set(s, 5,6, 15);
  set(s, 10,9, 15); set(s, 8,11, 15);
  // core
  set(s, 7,7, 15); set(s, 8,7, 15);
  set(s, 7,8, 15); set(s, 8,8, 15);
  return s;
})();

/* ================================================================
   UI
   ================================================================ */

const UI_SLOT = (() => {
  const s = empty(14,14);
  fill(s, 0,0, 13,13, 1);
  fill(s, 1,1, 12,12, 0);
  fill(s, 2,2, 11,11, 1);
  fill(s, 3,3, 10,10, 0);
  return s;
})();

const UI_MEMORY_EMPTY = (() => {
  const s = empty(8,8);
  fill(s, 1,1, 6,6, 0);
  fill(s, 2,2, 5,5, 1);
  set(s, 1,1, 14); set(s, 6,1, 14); set(s, 1,6, 14); set(s, 6,6, 14);
  return s;
})();

const UI_MEMORY_FILLED = (() => {
  const s = empty(8,8);
  fill(s, 0,0, 7,7, 15);
  fill(s, 1,1, 6,6, 14);
  set(s, 3,2, 15); set(s, 4,2, 15); set(s, 3,5, 15); set(s, 4,5, 15);
  return s;
})();

/* ================================================================
   SPRITE MANAGER
   ================================================================ */

class Sprites {
  constructor() {
    this.cache = {};
    this.spritesheetLoaded = false;
  }

  getTileSprite(id, col, row) {
    const sprite = T_SPRITES[id];
    if (!sprite) return null;
    if (Array.isArray(sprite) && Array.isArray(sprite[0])) return sprite;
    if (Array.isArray(sprite)) {
      const seed = (col || 0) + (row || 0) * 13 + id * 7;
      const idx = Math.abs(seed % sprite.length);
      return sprite[idx];
    }
    return sprite;
  }

  getCharacterSprite(name, direction, walkFrame) {
    const key = `${name}_${direction}_${walkFrame || 0}`;
    if (this.cache[key]) return this.cache[key];

    let sprite;
    if (name === 'player') {
      if (walkFrame !== undefined) {
        const anims = { down: PLAYER_WALK_DOWN, up: PLAYER_WALK_UP, left: PLAYER_WALK_LEFT, right: PLAYER_WALK_RIGHT };
        sprite = (anims[direction] || PLAYER_WALK_DOWN)[walkFrame % 2];
      } else {
        const sprites = { down: PLAYER_DOWN, up: PLAYER_UP, left: PLAYER_LEFT, right: PLAYER_RIGHT };
        sprite = sprites[direction] || PLAYER_DOWN;
      }
    } else if (name === 'shiva') {
      const sprites = { down: SHIVA_DOWN, up: SHIVA_UP, left: SHIVA_LEFT, right: SHIVA_RIGHT };
      sprite = sprites[direction] || SHIVA_DOWN;
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
    const ui = { slot: UI_SLOT, memory_empty: UI_MEMORY_EMPTY, memory_filled: UI_MEMORY_FILLED };
    return ui[name] || null;
  }

  renderSprite(ctx, sprite, x, y, scale) {
    if (!sprite) return;
    scale = scale || 1;
    const h = sprite.length;
    const w = sprite[0] ? sprite[0].length : 0;
    for (let row = 0; row < h; row++) {
      for (let col = 0; col < w; col++) {
        const ci = sprite[row][col];
        if (ci === undefined || ci === null || ci === 0) continue;
        ctx.fillStyle = PALETTE_16[ci];
        ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
      }
    }
  }

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
    for (let id = 1; id <= 17; id++) {
      const sprite = T_SPRITES[id];
      if (!sprite) continue;
      if (Array.isArray(sprite) && Array.isArray(sprite[0])) {
        allSprites.push({ name:'tile_'+id, sprite, w:16, h:16 });
      } else if (Array.isArray(sprite)) {
        sprite.forEach((v, i) => allSprites.push({ name:'tile_'+id+'_'+i, sprite:v, w:16, h:16 }));
      }
    }
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

const spriteManager = new Sprites();
