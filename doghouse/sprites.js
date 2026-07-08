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

/* ===== FURNITURE (tiles 18-42) ===== */

function makeSofa() {
  const s = empty(16,16);
  fill(s, 1,7, 14,14, 5);     // seat cushion
  fill(s, 2,8, 13,13, 7);     // seat top
  fill(s, 1,3, 3,14, 5);      // left armrest
  fill(s, 12,3, 14,14, 5);    // right armrest
  fill(s, 0,2, 3,4, 5); fill(s, 12,2, 15,4, 5);
  fill(s, 4,2, 11,7, 7);      // backrest
  fill(s, 5,3, 10,6, 8);
  fill(s, 1,14, 14,15, 3);    // base
  set(s, 2,14, 2); set(s, 13,14, 2);
  return s;
}

function makeTV() {
  const s = empty(16,16);
  fill(s, 2,2, 13,11, 1);     // screen bg
  fill(s, 3,3, 12,10, 10);    // screen
  fill(s, 4,4, 11,9, 12);     // screen glow
  set(s, 7,5, 14); set(s, 8,5, 14);
  // stand
  fill(s, 6,11, 9,12, 2);
  fill(s, 7,12, 8,14, 2);
  fill(s, 5,14, 10,15, 3);
  return s;
}

function makeFridge() {
  const s = empty(16,16);
  fill(s, 1,0, 14,15, 14);    // body
  fill(s, 2,1, 13,14, 15);
  // freezer door
  fill(s, 3,1, 12,5, 14);
  fill(s, 4,2, 11,4, 15);
  // main door
  fill(s, 3,6, 12,14, 14);
  fill(s, 4,7, 11,13, 15);
  // handle
  fill(s, 12,3, 13,4, 1);
  fill(s, 12,9, 13,12, 1);
  // bottom vent
  fill(s, 4,14, 11,15, 1);
  return s;
}

function makeStove() {
  const s = empty(16,16);
  fill(s, 1,0, 14,15, 2);     // body
  fill(s, 2,1, 13,14, 1);
  // burners
  fill(s, 3,1, 6,3, 0); set(s, 4,2, 3); set(s, 5,2, 3);
  fill(s, 9,1, 12,3, 0); set(s, 10,2, 3); set(s, 11,2, 3);
  // oven door
  fill(s, 3,7, 12,12, 2);
  fill(s, 4,8, 11,11, 3);
  // knob
  set(s, 4,5, 7); set(s, 6,5, 7); set(s, 8,5, 7); set(s, 10,5, 7);
  // legs
  set(s, 2,15, 2); set(s, 13,15, 2);
  return s;
}

function makeSink() {
  const s = empty(16,16);
  fill(s, 1,2, 14,13, 2);     // counter
  fill(s, 2,3, 13,12, 14);
  // basin
  fill(s, 4,4, 11,9, 1);
  fill(s, 5,5, 10,8, 0);
  // faucet
  fill(s, 7,1, 8,3, 7);
  set(s, 7,0, 7); set(s, 8,0, 7);
  // cabinet doors
  fill(s, 3,10, 7,12, 3);
  fill(s, 8,10, 12,12, 3);
  set(s, 5,11, 7); set(s, 10,11, 7);
  return s;
}

function makeToilet() {
  const s = empty(16,16);
  // tank
  fill(s, 5,1, 10,4, 14);
  fill(s, 6,2, 9,3, 15);
  // bowl
  fill(s, 4,4, 11,11, 14);
  fill(s, 5,5, 10,10, 15);
  fill(s, 6,6, 9,9, 1);  // water
  // seat
  fill(s, 5,4, 10,4, 15);
  fill(s, 4,4, 4,11, 15);
  fill(s, 11,4, 11,11, 15);
  // base
  fill(s, 5,11, 10,14, 14);
  set(s, 6,14, 2); set(s, 9,14, 2);
  return s;
}

function makeWardrobe() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 4);     // body
  fill(s, 1,1, 14,14, 5);
  // doors
  fill(s, 2,1, 7,14, 7);
  fill(s, 8,1, 13,14, 7);
  // door panels
  fill(s, 3,2, 6,6, 8);
  fill(s, 9,2, 12,6, 8);
  fill(s, 3,8, 6,13, 8);
  fill(s, 9,8, 12,13, 8);
  // handles
  set(s, 7,7, 15); set(s, 8,7, 15);
  // base
  fill(s, 0,14, 15,15, 3);
  return s;
}

function makeBookshelf() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 4);     // frame
  fill(s, 1,1, 14,14, 2);
  // shelves
  fill(s, 1,3, 14,3, 4);
  fill(s, 1,7, 14,7, 4);
  fill(s, 1,11, 14,11, 4);
  // books
  set(s, 2,1, 6); set(s, 3,1, 6); set(s, 5,1, 8); set(s, 6,1, 5);
  set(s, 8,1, 6); set(s, 9,1, 8); set(s, 11,1, 5); set(s, 12,1, 6);
  set(s, 2,4, 5); set(s, 3,4, 8); set(s, 5,4, 6); set(s, 6,4, 6);
  set(s, 8,4, 8); set(s, 9,4, 5); set(s, 11,4, 6);
  set(s, 2,8, 8); set(s, 3,8, 6); set(s, 5,8, 5); set(s, 6,8, 8);
  set(s, 8,8, 6); set(s, 9,8, 6); set(s, 11,8, 5); set(s, 12,8, 8);
  // vase on top
  set(s, 13,1, 11); set(s, 14,1, 11); set(s, 13,2, 3); set(s, 14,2, 3);
  return s;
}

function makePainting() {
  const s = empty(16,16);
  fill(s, 2,1, 13,14, 4);     // frame
  fill(s, 3,2, 12,13, 8);
  // landscape
  fill(s, 3,8, 12,13, 11);    // grass
  fill(s, 3,4, 12,8, 12);     // sky
  set(s, 5,5, 15); set(s, 6,5, 15); // cloud
  fill(s, 7,6, 9,10, 3);      // tree
  fill(s, 6,5, 10,7, 11);
  // wire
  set(s, 1,0, 1); set(s, 2,0, 1);
  return s;
}

function makePlant() {
  const s = empty(16,16);
  // pot
  fill(s, 4,10, 11,14, 5);
  fill(s, 5,11, 10,13, 6);
  fill(s, 5,14, 10,15, 3);
  // leaves
  set(s, 7,3, 11); set(s, 8,3, 11);
  set(s, 6,4, 11); set(s, 7,4, 11); set(s, 8,4, 11); set(s, 9,4, 11);
  set(s, 5,5, 11); set(s, 6,5, 3); set(s, 7,5, 3); set(s, 8,5, 3); set(s, 9,5, 3); set(s, 10,5, 11);
  set(s, 5,6, 3); set(s, 6,6, 11); set(s, 7,6, 3); set(s, 8,6, 3); set(s, 9,6, 11); set(s, 10,6, 3);
  set(s, 6,7, 3); set(s, 7,7, 11); set(s, 8,7, 11); set(s, 9,7, 3);
  set(s, 7,8, 3); set(s, 8,8, 3);
  // stem
  set(s, 7,9, 3); set(s, 8,9, 3);
  return s;
}

function makeChair() {
  const s = empty(16,16);
  fill(s, 3,2, 12,5, 4);      // backrest
  fill(s, 4,3, 11,4, 7);
  fill(s, 2,5, 13,6, 4);      // seat
  fill(s, 3,6, 12,6, 7);
  // legs
  fill(s, 2,6, 3,14, 3);
  fill(s, 12,6, 13,14, 3);
  fill(s, 7,6, 8,14, 3);
  set(s, 2,14, 2); set(s, 12,14, 2); set(s, 7,14, 2); set(s, 8,14, 2);
  return s;
}

function makeLamp() {
  const s = empty(16,16);
  // base
  fill(s, 6,13, 9,14, 7);
  fill(s, 5,14, 10,15, 3);
  // pole
  fill(s, 7,4, 8,13, 7);
  // shade
  fill(s, 4,1, 11,4, 5);
  fill(s, 5,2, 10,3, 7);
  // light glow
  set(s, 7,2, 15); set(s, 8,2, 15);
  set(s, 6,3, 15); set(s, 9,3, 15);
  return s;
}

function makeRug() {
  const s = empty(16,16);
  fill(s, 0,2, 15,13, 6);     // rug body
  fill(s, 1,3, 14,12, 5);
  // border
  fill(s, 0,2, 15,2, 3);
  fill(s, 0,13, 15,13, 3);
  fill(s, 0,2, 0,13, 3);
  fill(s, 15,2, 15,13, 3);
  // pattern
  set(s, 4,5, 15); set(s, 5,5, 15); set(s, 10,5, 15); set(s, 11,5, 15);
  set(s, 4,6, 15); set(s, 11,6, 15);
  set(s, 7,8, 15); set(s, 8,8, 15);
  set(s, 7,9, 15); set(s, 8,9, 15);
  set(s, 4,10, 15); set(s, 11,10, 15);
  set(s, 4,11, 15); set(s, 5,11, 15); set(s, 10,11, 15); set(s, 11,11, 15);
  return s;
}

function makeCurtain() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 6);     // curtain
  fill(s, 1,1, 14,14, 5);
  // folds
  for (let x = 2; x < 14; x += 3) {
    fill(s, x,1, x,14, 4);
  }
  // rod
  fill(s, 0,0, 15,0, 3);
  fill(s, 0,0, 0,2, 3);
  fill(s, 15,0, 15,2, 3);
  return s;
}

function makeTrash() {
  const s = empty(16,16);
  fill(s, 4,2, 11,13, 10);    // bin body
  fill(s, 3,1, 12,2, 10);
  fill(s, 5,3, 10,12, 9);
  // lid
  fill(s, 3,0, 12,0, 10);
  fill(s, 4,0, 11,0, 9);
  // handle
  set(s, 7,0, 7); set(s, 8,0, 7);
  // base rim
  fill(s, 4,13, 11,14, 2);
  return s;
}

function makeMicrowave() {
  const s = empty(16,16);
  fill(s, 1,2, 14,12, 14);    // body
  fill(s, 2,3, 13,11, 15);
  // window
  fill(s, 3,3, 12,7, 1);
  fill(s, 4,4, 11,6, 0);
  // panel
  fill(s, 3,8, 12,11, 2);
  set(s, 4,9, 7); set(s, 6,9, 7); set(s, 8,9, 7);
  set(s, 10,9, 7);
  return s;
}

function makePlayground() {
  const s = empty(16,16);
  // structure
  fill(s, 1,1, 2,10, 7);      // left post
  fill(s, 13,1, 14,10, 7);    // right post
  // top bar
  fill(s, 1,0, 14,1, 7);
  // swing chains
  set(s, 5,2, 7); set(s, 5,3, 7); set(s, 5,4, 7); set(s, 5,5, 7);
  set(s, 10,2, 7); set(s, 10,3, 7); set(s, 10,4, 7); set(s, 10,5, 7);
  // swing seat
  fill(s, 4,6, 6,6, 3);
  fill(s, 9,6, 11,6, 3);
  // slide
  fill(s, 8,7, 14,10, 6);
  fill(s, 8,8, 13,9, 7);
  // ground
  fill(s, 0,11, 15,15, 2);
  fill(s, 1,12, 14,14, 3);
  return s;
}

function makeAltar() {
  const s = empty(16,16);
  fill(s, 2,4, 13,12, 8);     // table top
  fill(s, 3,5, 12,11, 7);
  // cloth
  fill(s, 4,5, 11,11, 6);
  fill(s, 5,6, 10,10, 5);
  // cross on altar
  fill(s, 7,2, 8,6, 7);
  fill(s, 6,3, 9,4, 7);
  // candle holders
  set(s, 4,4, 7); set(s, 5,4, 7);
  set(s, 10,4, 7); set(s, 11,4, 7);
  // base
  fill(s, 4,12, 11,13, 3);
  set(s, 2,12, 3); set(s, 13,12, 3);
  return s;
}

function makeCross() {
  const s = empty(16,16);
  // cross
  fill(s, 6,1, 9,14, 7);      // vertical
  fill(s, 3,3, 12,6, 7);      // horizontal
  // outline
  fill(s, 6,0, 9,0, 4);
  fill(s, 6,14, 9,15, 4);
  fill(s, 5,1, 5,14, 4);
  fill(s, 10,1, 10,14, 4);
  fill(s, 3,3, 3,6, 4);
  fill(s, 12,3, 12,6, 4);
  fill(s, 3,3, 12,3, 4);
  fill(s, 3,6, 12,6, 4);
  // corpus detail
  set(s, 7,4, 14); set(s, 8,4, 14); // hands
  set(s, 7,9, 8); set(s, 8,9, 8);   // feet
  return s;
}

function makeCandle() {
  const s = empty(16,16);
  // candle body
  fill(s, 7,4, 8,12, 14);
  fill(s, 7,4, 8,12, 15);
  // wax drips
  set(s, 6,8, 15); set(s, 9,10, 15);
  // holder
  fill(s, 6,12, 9,13, 7);
  fill(s, 5,13, 10,14, 3);
  // flame
  set(s, 7,3, 6); set(s, 8,3, 6);
  set(s, 7,2, 15); set(s, 8,2, 15);
  set(s, 7,1, 15); set(s, 8,1, 15);
  return s;
}

function makeParkBench() {
  const s = empty(16,16);
  // seat
  fill(s, 1,7, 14,8, 4);
  fill(s, 2,7, 13,7, 7);
  // backrest
  fill(s, 1,3, 14,6, 4);
  fill(s, 2,4, 13,5, 7);
  // legs
  fill(s, 2,8, 3,14, 3);
  fill(s, 12,8, 13,14, 3);
  fill(s, 5,8, 6,11, 3);
  fill(s, 9,8, 10,11, 3);
  set(s, 2,14, 2); set(s, 12,14, 2);
  return s;
}

function makeFountain() {
  const s = empty(16,16);
  // base
  fill(s, 3,10, 12,14, 9);
  fill(s, 4,11, 11,13, 8);
  // column
  fill(s, 7,5, 8,10, 9);
  fill(s, 7,5, 8,10, 8);
  // upper basin
  fill(s, 4,4, 11,5, 9);
  fill(s, 5,4, 10,4, 8);
  // water
  fill(s, 5,11, 10,12, 12);
  set(s, 6,11, 14); set(s, 7,11, 14);
  set(s, 8,12, 14); set(s, 9,12, 14);
  // water stream
  set(s, 7,3, 12); set(s, 8,3, 12);
  set(s, 7,2, 14); set(s, 8,2, 14);
  return s;
}

function makeSign() {
  const s = empty(16,16);
  // post
  fill(s, 7,6, 8,15, 7);
  fill(s, 7,6, 8,15, 8);
  // sign board
  fill(s, 2,1, 13,5, 4);
  fill(s, 3,2, 12,4, 7);
  // text lines
  fill(s, 4,2, 11,2, 1);
  fill(s, 4,3, 9,3, 1);
  // arrow
  set(s, 10,3, 6); set(s, 11,3, 6);
  return s;
}

function makeCrib() {
  const s = empty(16,16);
  fill(s, 1,4, 14,12, 7);     // body
  fill(s, 2,5, 13,11, 8);
  // bars
  for (let x = 2; x < 14; x += 2) {
    fill(s, x,4, x,13, 7);
  }
  // mattress
  fill(s, 3,9, 12,11, 15);
  fill(s, 4,10, 11,10, 14);
  // canopy top
  fill(s, 1,1, 14,3, 5);
  fill(s, 2,2, 13,2, 7);
  // legs
  set(s, 2,12, 3); set(s, 13,12, 3);
  set(s, 2,13, 3); set(s, 13,13, 3);
  set(s, 2,15, 3); set(s, 13,15, 3);
  return s;
}

function makeToys() {
  const s = empty(16,16);
  fill(s, 1,8, 14,14, 1);     // floor shadow
  // block
  fill(s, 2,6, 5,9, 6);
  fill(s, 3,7, 4,8, 5);
  // ball
  fill(s, 7,7, 10,10, 6);
  fill(s, 8,8, 9,9, 5);
  // teddy bear
  fill(s, 11,6, 14,10, 7);
  fill(s, 12,7, 13,9, 8);
  set(s, 12,7, 0); set(s, 13,7, 0); // eyes
  set(s, 12,8, 1); set(s, 13,8, 1);
  // car
  fill(s, 3,10, 7,12, 6);
  fill(s, 4,11, 6,11, 5);
  set(s, 3,12, 0); set(s, 7,12, 0); // wheels
  return s;
}

function makeWashingMachine() {
  const s = empty(16,16);
  fill(s, 1,0, 14,15, 14);    // body
  fill(s, 2,1, 13,14, 15);
  // door
  fill(s, 3,2, 12,10, 12);
  fill(s, 4,3, 11,9, 0);
  fill(s, 5,4, 10,8, 10);
  // control panel
  fill(s, 3,11, 12,14, 2);
  set(s, 4,12, 15); set(s, 6,12, 15);
  set(s, 8,12, 15); set(s, 10,12, 15);
  // bottom
  fill(s, 1,14, 14,15, 1);
  return s;
}

function makeShower() {
  const s = empty(16,16);
  // drain
  fill(s, 6,13, 9,14, 0);
  set(s, 7,13, 2); set(s, 8,13, 2);
  // pipe
  fill(s, 13,0, 14,8, 7);
  // shower head
  fill(s, 12,0, 15,0, 7);
  fill(s, 13,1, 14,1, 7);
  // water drops
  set(s, 13,3, 12); set(s, 12,5, 12);
  set(s, 13,7, 12); set(s, 14,9, 12);
  set(s, 12,11, 12); set(s, 13,13, 12);
  // wall tile pattern
  fill(s, 0,0, 11,15, 14);
  for (let x = 0; x < 12; x += 2)
    for (let y = 0; y < 16; y += 2)
      set(s, x, y, 15);
  return s;
}

function makeBedside() {
  const s = empty(16,16);
  // small table
  fill(s, 2,6, 13,12, 4);
  fill(s, 3,7, 12,11, 7);
  // drawer
  fill(s, 4,7, 11,8, 7);
  set(s, 7,7, 5); set(s, 8,7, 5);
  fill(s, 4,9, 11,10, 7);
  set(s, 7,9, 5); set(s, 8,9, 5);
  // top surface
  fill(s, 3,6, 12,6, 7);
  // legs
  set(s, 3,11, 3); set(s, 12,11, 3);
  set(s, 3,12, 3); set(s, 12,12, 3);
  set(s, 3,15, 3); set(s, 12,15, 3);
  return s;
}

function makeOven() {
  const s = empty(16,16);
  fill(s, 1,0, 14,15, 2);     // body
  fill(s, 2,1, 13,14, 1);
  // oven window
  fill(s, 4,6, 11,11, 0);
  fill(s, 5,7, 10,10, 6);
  // controls
  set(s, 4,2, 7); set(s, 6,2, 7); set(s, 8,2, 7);
  set(s, 10,2, 7); set(s, 12,2, 7);
  // handle
  fill(s, 4,4, 11,4, 7);
  // legs
  set(s, 3,15, 2); set(s, 12,15, 2);
  return s;
}

/* ================================================================
   NOVOS TILES (47–80)
   ================================================================ */

function makeTileFloor() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 14);
  for (let y = 0; y < 16; y += 2)
    for (let x = 0; x < 16; x += 2)
      fill(s, x, y, x, y, 15);
  return s;
}

function makeCarpet() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 6);
  fill(s, 1,1, 14,14, 5);
  for (let y = 2; y < 14; y += 3)
    for (let x = 2; x < 14; x += 3)
      set(s, x, y, 4);
  return s;
}

function makeHedge() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 11);
  fill(s, 1,1, 14,14, 6);
  for (let y = 0; y < 16; y += 3)
    for (let x = 1; x < 15; x += 4)
      set(s, x, y, 11);
  return s;
}

function makeBathtub() {
  const s = empty(16,16);
  fill(s, 1,2, 14,12, 14);
  fill(s, 2,3, 13,11, 15);
  fill(s, 3,4, 12,10, 10);
  fill(s, 1,2, 14,2, 7);
  fill(s, 1,12, 14,13, 7);
  set(s, 1,3, 7); set(s, 14,3, 7);
  set(s, 1,11, 7); set(s, 14,11, 7);
  fill(s, 5,1, 10,1, 7);
  set(s, 7,0, 7); set(s, 8,0, 7);
  set(s, 5,2, 7); set(s, 10,2, 7);
  set(s, 3,13, 7); set(s, 12,13, 7);
  set(s, 3,14, 3); set(s, 12,14, 3);
  return s;
}

function makeShoeRack() {
  const s = empty(16,16);
  fill(s, 1,3, 14,14, 4);
  fill(s, 2,4, 13,13, 7);
  fill(s, 1,6, 14,6, 4);
  fill(s, 1,9, 14,9, 4);
  fill(s, 1,12, 14,12, 4);
  set(s, 3,5, 2); set(s, 4,5, 5); set(s, 5,5, 2); set(s, 6,5, 5);
  set(s, 8,5, 2); set(s, 9,5, 5); set(s, 10,5, 2); set(s, 11,5, 5);
  set(s, 3,8, 2); set(s, 4,8, 5); set(s, 5,8, 2);
  set(s, 9,8, 2); set(s, 10,8, 5); set(s, 11,8, 2);
  set(s, 3,11, 2); set(s, 4,11, 5);
  set(s, 10,11, 2); set(s, 11,11, 5);
  return s;
}

function makeCoatRack() {
  const s = empty(16,16);
  fill(s, 7,2, 8,14, 7);
  set(s, 7,15, 3); set(s, 8,15, 3);
  set(s, 4,1, 7); set(s, 6,1, 7);
  set(s, 8,1, 7); set(s, 10,1, 7);
  fill(s, 3,2, 5,7, 5);
  fill(s, 9,2, 11,7, 6);
  fill(s, 5,3, 7,8, 4);
  set(s, 6,0, 7); set(s, 7,0, 7); set(s, 8,0, 7);
  set(s, 9,0, 7); set(s, 5,0, 7);
  return s;
}

function makeDeskPc() {
  const s = empty(16,16);
  fill(s, 1,8, 14,12, 4);
  fill(s, 2,9, 13,11, 7);
  fill(s, 4,2, 11,7, 2);
  fill(s, 5,3, 10,6, 10);
  set(s, 7,3, 14); set(s, 8,3, 14);
  fill(s, 7,7, 8,8, 2);
  fill(s, 4,9, 8,10, 1);
  fill(s, 5,9, 7,10, 15);
  set(s, 3,12, 3); set(s, 12,12, 3);
  set(s, 3,15, 3); set(s, 12,15, 3);
  return s;
}

function makeDiningTable() {
  const s = empty(16,16);
  fill(s, 2,6, 13,9, 4);
  fill(s, 3,7, 12,8, 7);
  set(s, 7,7, 8); set(s, 8,7, 8);
  fill(s, 3,9, 4,14, 3);
  fill(s, 11,9, 12,14, 3);
  set(s, 3,15, 3); set(s, 12,15, 3);
  return s;
}

function makeStool() {
  const s = empty(16,16);
  fill(s, 3,6, 12,8, 4);
  fill(s, 4,7, 11,7, 7);
  set(s, 4,8, 3); set(s, 7,8, 3); set(s, 11,8, 3);
  fill(s, 4,9, 4,14, 3);
  fill(s, 11,9, 11,14, 3);
  set(s, 7,9, 3); fill(s, 7,10, 7,14, 3);
  return s;
}

function makeCabinet() {
  const s = empty(16,16);
  fill(s, 1,0, 14,14, 4);
  fill(s, 2,1, 13,13, 7);
  fill(s, 2,1, 6,13, 7);
  fill(s, 9,1, 13,13, 7);
  set(s, 4,7, 5); set(s, 11,7, 5);
  set(s, 6,7, 5); set(s, 9,7, 5);
  return s;
}

function makeArmchair() {
  const s = empty(16,16);
  fill(s, 1,2, 14,12, 6);
  fill(s, 2,3, 13,11, 5);
  fill(s, 1,2, 14,5, 6);
  fill(s, 2,3, 13,4, 5);
  fill(s, 1,3, 2,10, 6);
  fill(s, 13,3, 14,10, 6);
  fill(s, 3,6, 12,9, 5);
  fill(s, 4,7, 11,8, 4);
  set(s, 3,12, 3); set(s, 12,12, 3);
  set(s, 3,15, 3); set(s, 12,15, 3);
  return s;
}

function makeFloorLamp() {
  const s = empty(16,16);
  fill(s, 7,0, 8,14, 7);
  fill(s, 5,13, 10,14, 3);
  set(s, 5,15, 3); set(s, 10,15, 3);
  fill(s, 4,0, 11,1, 7);
  fill(s, 5,0, 10,0, 8);
  fill(s, 6,1, 9,3, 15);
  return s;
}

function makeVaseFlowers() {
  const s = empty(16,16);
  fill(s, 6,8, 9,13, 7);
  fill(s, 7,9, 8,12, 8);
  set(s, 6,5, 6); set(s, 5,6, 6); set(s, 7,6, 6);
  set(s, 8,5, 5); set(s, 9,6, 5); set(s, 7,4, 5);
  set(s, 6,7, 11); set(s, 8,7, 11);
  set(s, 6,6, 11); set(s, 7,5, 11); set(s, 8,6, 11);
  set(s, 7,7, 11); set(s, 8,7, 11);
  return s;
}

function makeTallPlant() {
  const s = empty(16,16);
  fill(s, 6,7, 9,14, 7);
  fill(s, 7,8, 8,13, 8);
  fill(s, 5,7, 10,7, 7);
  fill(s, 2,1, 4,8, 11);
  fill(s, 11,2, 13,9, 11);
  fill(s, 6,0, 9,2, 11);
  fill(s, 4,2, 6,6, 11);
  fill(s, 9,1, 11,5, 11);
  fill(s, 3,2, 3,5, 6);
  fill(s, 12,3, 12,6, 6);
  set(s, 7,0, 6); set(s, 8,0, 6);
  return s;
}

function makeBox() {
  const s = empty(16,16);
  fill(s, 2,2, 13,13, 4);
  fill(s, 3,3, 12,12, 7);
  fill(s, 3,5, 12,5, 4);
  fill(s, 3,8, 12,8, 4);
  fill(s, 3,11, 12,11, 4);
  set(s, 3,3, 3); set(s, 12,3, 3);
  set(s, 3,12, 3); set(s, 12,12, 3);
  return s;
}

function makeBarrel() {
  const s = empty(16,16);
  fill(s, 2,2, 13,13, 3);
  fill(s, 3,3, 12,12, 7);
  fill(s, 3,3, 12,4, 4);
  fill(s, 3,11, 12,12, 4);
  fill(s, 2,5, 13,6, 3);
  fill(s, 2,9, 13,10, 3);
  fill(s, 4,2, 11,2, 4);
  return s;
}

function makeWallMirror() {
  const s = empty(16,16);
  fill(s, 3,2, 12,13, 7);
  fill(s, 4,3, 11,12, 14);
  fill(s, 4,3, 11,12, 15);
  set(s, 7,4, 8); set(s, 8,4, 8);
  set(s, 7,8, 8); set(s, 8,8, 8);
  set(s, 6,5, 1); set(s, 9,5, 1);
  return s;
}

function makeRadio() {
  const s = empty(16,16);
  fill(s, 1,2, 14,12, 4);
  fill(s, 2,3, 13,11, 7);
  fill(s, 2,4, 7,10, 2);
  for (let y = 4; y < 11; y += 2)
    for (let x = 2; x < 8; x += 2)
      set(s, x, y, 1);
  fill(s, 9,4, 12,6, 15);
  fill(s, 10,5, 11,5, 2);
  set(s, 9,4, 2); set(s, 12,4, 2);
  set(s, 9,6, 2); set(s, 12,6, 2);
  set(s, 9,9, 5); set(s, 10,9, 5);
  set(s, 11,9, 5); set(s, 12,9, 5);
  set(s, 9,10, 5); set(s, 12,10, 5);
  set(s, 7,1, 7); set(s, 8,1, 7);
  set(s, 7,0, 7);
  set(s, 3,12, 3); set(s, 12,12, 3);
  return s;
}

function makeFan() {
  const s = empty(16,16);
  fill(s, 6,4, 9,14, 7);
  set(s, 6,15, 3); set(s, 9,15, 3);
  fill(s, 4,12, 11,13, 3);
  set(s, 5,14, 3); set(s, 10,14, 3);
  fill(s, 6,4, 9,7, 3);
  fill(s, 7,5, 8,6, 7);
  fill(s, 7,1, 8,3, 14);
  fill(s, 7,8, 8,10, 14);
  fill(s, 3,5, 5,6, 14);
  fill(s, 10,5, 12,6, 14);
  set(s, 7,1, 15); set(s, 8,1, 15);
  set(s, 7,10, 15); set(s, 8,10, 15);
  set(s, 3,5, 15); set(s, 12,5, 15);
  fill(s, 3,3, 12,8, 7);
  fill(s, 4,4, 11,7, 0);
  return s;
}

function makeWallClock() {
  const s = empty(16,16);
  fill(s, 3,2, 12,13, 7);
  fill(s, 4,3, 11,12, 15);
  fill(s, 5,4, 10,11, 14);
  set(s, 7,4, 2); set(s, 8,4, 2);
  set(s, 11,7, 2); set(s, 11,8, 2);
  set(s, 7,11, 2); set(s, 8,11, 2);
  set(s, 4,7, 2); set(s, 4,8, 2);
  fill(s, 7,5, 7,9, 2);
  fill(s, 7,7, 10,7, 2);
  set(s, 7,7, 3);
  set(s, 7,13, 7); set(s, 8,13, 7);
  set(s, 7,14, 5); set(s, 8,14, 5);
  return s;
}

function makeCandelabra() {
  const s = empty(16,16);
  fill(s, 6,6, 9,13, 7);
  fill(s, 7,7, 8,12, 8);
  fill(s, 3,6, 5,7, 7);
  fill(s, 10,6, 12,7, 7);
  fill(s, 3,3, 4,6, 15);
  fill(s, 10,3, 11,6, 15);
  fill(s, 7,2, 8,6, 15);
  set(s, 3,2, 6); set(s, 4,2, 6);
  set(s, 10,2, 6); set(s, 11,2, 6);
  set(s, 7,1, 6); set(s, 8,1, 6);
  set(s, 3,1, 15); set(s, 10,1, 15);
  set(s, 7,0, 15);
  fill(s, 5,12, 10,13, 3);
  set(s, 6,14, 3); set(s, 9,14, 3);
  return s;
}

function makeFlowerBed() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 11);
  fill(s, 0,0, 15,3, 0);
  fill(s, 0,12, 15,15, 0);
  fill(s, 0,0, 3,15, 0);
  fill(s, 12,0, 15,15, 0);
  set(s, 3,3, 6); set(s, 5,3, 5);
  set(s, 9,4, 6); set(s, 11,3, 5);
  set(s, 4,7, 15); set(s, 8,7, 15);
  set(s, 6,10, 6); set(s, 10,10, 5);
  set(s, 3,9, 8); set(s, 12,9, 15);
  set(s, 5,5, 11); set(s, 7,5, 11);
  set(s, 11,5, 11); set(s, 5,9, 11);
  return s;
}

function makeManhole() {
  const s = empty(16,16);
  fill(s, 0,0, 15,15, 1);
  fill(s, 2,2, 13,13, 2);
  fill(s, 3,3, 12,12, 3);
  set(s, 3,3, 0); set(s, 12,3, 0);
  set(s, 3,12, 0); set(s, 12,12, 0);
  fill(s, 7,3, 8,12, 2);
  fill(s, 3,7, 12,8, 2);
  set(s, 7,7, 0); set(s, 8,7, 0);
  set(s, 4,4, 7); set(s, 11,4, 7);
  set(s, 4,11, 7); set(s, 11,11, 7);
  return s;
}

function makeTrafficLight() {
  const s = empty(16,16);
  fill(s, 7,2, 8,15, 3);
  fill(s, 7,2, 8,14, 7);
  fill(s, 5,2, 10,7, 3);
  fill(s, 6,2, 9,7, 2);
  set(s, 7,3, 6); set(s, 8,3, 6);
  set(s, 7,5, 15); set(s, 8,5, 15);
  set(s, 7,7, 11); set(s, 8,7, 11);
  set(s, 7,4, 0); set(s, 8,6, 0);
  fill(s, 7,2, 8,3, 6);
  return s;
}

function makeLectern() {
  const s = empty(16,16);
  fill(s, 4,2, 11,10, 4);
  fill(s, 5,3, 10,9, 7);
  fill(s, 4,2, 11,3, 7);
  fill(s, 5,3, 10,3, 8);
  fill(s, 5,4, 10,5, 6);
  fill(s, 6,4, 9,5, 5);
  fill(s, 5,10, 10,11, 4);
  set(s, 6,12, 3); set(s, 9,12, 3);
  set(s, 6,15, 3); set(s, 9,15, 3);
  return s;
}

function makeParkLamp() {
  const s = empty(16,16);
  fill(s, 7,3, 8,14, 3);
  fill(s, 7,3, 8,13, 7);
  fill(s, 5,0, 10,2, 3);
  fill(s, 6,0, 9,2, 7);
  fill(s, 6,2, 9,2, 15);
  fill(s, 6,3, 9,4, 15);
  fill(s, 5,13, 10,14, 3);
  set(s, 5,15, 3); set(s, 10,15, 3);
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
  18: makeSofa(),
  19: makeTV(),
  20: makeFridge(),
  21: makeStove(),
  22: makeSink(),
  23: makeToilet(),
  24: makeWardrobe(),
  25: makeBookshelf(),
  26: makePainting(),
  27: makePlant(),
  28: makeChair(),
  29: makeLamp(),
  30: makeRug(),
  31: makeCurtain(),
  32: makeTrash(),
  33: makeMicrowave(),
  34: makePlayground(),
  35: makeAltar(),
  36: makeCross(),
  37: makeCandle(),
  38: makeParkBench(),
  39: makeFountain(),
  40: makeSign(),
  41: makeCrib(),
  42: makeToys(),
  43: makeWashingMachine(),
  44: makeShower(),
  45: makeBedside(),
   46: makeOven(),
  47: [makeTileFloor(), makeTileFloor()],
  48: makeCarpet(),
  49: makeHedge(),
  50: makeBathtub(),
  51: makeShoeRack(),
  52: makeCoatRack(),
  53: makeDeskPc(),
  54: makeDiningTable(),
  55: makeStool(),
  56: makeCabinet(),
  57: makeArmchair(),
  58: makeFloorLamp(),
  59: makeVaseFlowers(),
  60: makeTallPlant(),
  61: makeBox(),
  62: makeBarrel(),
  63: makeWallMirror(),
  64: makeRadio(),
  65: makeFan(),
  66: makeWallClock(),
  67: makeCandelabra(),
  68: makeFlowerBed(),
  69: makeManhole(),
  70: makeTrafficLight(),
  71: makeLectern(),
  72: makeParkLamp(),
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
  const f = frame % 4;
  if (f === 1) {
    fill(s, 5,11, 7,14, 0);
    fill(s, 8,11, 10,14, 0);
    fill(s, 5,14, 7,15, 0);
    fill(s, 8,14, 10,15, 0);
    fill(s, 4,11, 6,14, 1);
    fill(s, 9,11, 10,14, 1);
    fill(s, 4,14, 6,15, 2);
    fill(s, 9,14, 10,15, 2);
  } else if (f === 3) {
    fill(s, 5,11, 7,14, 0);
    fill(s, 8,11, 10,14, 0);
    fill(s, 5,14, 7,15, 0);
    fill(s, 8,14, 10,15, 0);
    fill(s, 5,11, 6,14, 1);
    fill(s, 9,11, 11,14, 1);
    fill(s, 5,14, 6,15, 2);
    fill(s, 9,14, 11,15, 2);
  }
  if (f === 1) {
    fill(s, 3,6, 3,9, 0);
    fill(s, 12,6, 12,9, 0);
    fill(s, 13,6, 13,8, 10);
    fill(s, 2,6, 2,7, 10);
    set(s, 2,7, 8); set(s, 13,8, 8);
  }
  if (f === 3) {
    fill(s, 3,6, 3,9, 0);
    fill(s, 12,6, 12,9, 0);
    fill(s, 2,6, 2,8, 10);
    fill(s, 13,6, 13,7, 10);
    set(s, 2,8, 8); set(s, 13,7, 8);
  }
  return s;
}

function makePlayerRun(dir, frame) {
  const s = makePlayer(dir);
  const f = frame % 4;
  // lean forward: same body position, just sleeker
  fill(s, 4,5, 11,10, 0);
  fill(s, 5,5, 10,5, 0);
  fill(s, 3,6, 3,10, 0);
  fill(s, 12,6, 12,10, 0);
  fill(s, 4,5, 11,10, 10);
  fill(s, 5,5, 10,5, 2);
  fill(s, 7,6, 8,10, 12);
  // arms pumping (bent, same x positions)
  fill(s, 3,6, 3,8, 10);
  fill(s, 12,6, 12,8, 10);
  set(s, 3,8, 8); set(s, 12,8, 8);
  // legs
  if (f === 0) {
    fill(s, 5,11, 7,14, 0);
    fill(s, 8,11, 10,14, 0);
    fill(s, 5,14, 7,15, 0);
    fill(s, 8,14, 10,15, 0);
    fill(s, 4,11, 6,14, 1);
    fill(s, 9,11, 10,14, 1);
    fill(s, 4,14, 6,15, 2);
    fill(s, 9,14, 10,15, 2);
  } else if (f === 2) {
    fill(s, 5,11, 7,14, 0);
    fill(s, 8,11, 10,14, 0);
    fill(s, 5,14, 7,15, 0);
    fill(s, 8,14, 10,15, 0);
    fill(s, 5,11, 6,14, 1);
    fill(s, 9,11, 11,14, 1);
    fill(s, 5,14, 6,15, 2);
    fill(s, 9,14, 11,15, 2);
  }
  return s;
}

const PLAYER_DOWN = makePlayer('down');
const PLAYER_UP = makePlayer('up');
const PLAYER_LEFT = makePlayer('left');
const PLAYER_RIGHT = makePlayer('right');
const PLAYER_WALK_DOWN = [makePlayerWalk('down', 0), makePlayerWalk('down', 1), makePlayerWalk('down', 2), makePlayerWalk('down', 3)];
const PLAYER_WALK_UP = [makePlayerWalk('up', 0), makePlayerWalk('up', 1), makePlayerWalk('up', 2), makePlayerWalk('up', 3)];
const PLAYER_WALK_LEFT = [makePlayerWalk('left', 0), makePlayerWalk('left', 1), makePlayerWalk('left', 2), makePlayerWalk('left', 3)];
const PLAYER_WALK_RIGHT = [makePlayerWalk('right', 0), makePlayerWalk('right', 1), makePlayerWalk('right', 2), makePlayerWalk('right', 3)];
const PLAYER_RUN_DOWN = [makePlayerRun('down', 0), makePlayerRun('down', 1), makePlayerRun('down', 2), makePlayerRun('down', 3)];
const PLAYER_RUN_UP = [makePlayerRun('up', 0), makePlayerRun('up', 1), makePlayerRun('up', 2), makePlayerRun('up', 3)];
const PLAYER_RUN_LEFT = [makePlayerRun('left', 0), makePlayerRun('left', 1), makePlayerRun('left', 2), makePlayerRun('left', 3)];
const PLAYER_RUN_RIGHT = [makePlayerRun('right', 0), makePlayerRun('right', 1), makePlayerRun('right', 2), makePlayerRun('right', 3)];

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
const SHIVA_WALK_DOWN = [SHIVA_DOWN, makeShiva('down'), SHIVA_DOWN, makeShiva('down')];
const SHIVA_WALK_UP = [SHIVA_UP, makeShiva('up'), SHIVA_UP, makeShiva('up')];
const SHIVA_WALK_LEFT = [SHIVA_LEFT, makeShiva('left'), SHIVA_LEFT, makeShiva('left')];
const SHIVA_WALK_RIGHT = [SHIVA_RIGHT, makeShiva('right'), SHIVA_RIGHT, makeShiva('right')];
const SHIVA_RUN_DOWN = SHIVA_WALK_DOWN;
const SHIVA_RUN_UP = SHIVA_WALK_UP;
const SHIVA_RUN_LEFT = SHIVA_WALK_LEFT;
const SHIVA_RUN_RIGHT = SHIVA_WALK_RIGHT;

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

const I_PHOTO = (() => {
  const s = empty(16,16);
  fill(s, 2,2, 13,13, 14);
  fill(s, 3,3, 12,12, 15);
  fill(s, 3,3, 12,5, 8);
  fill(s, 4,4, 11,4, 6);
  fill(s, 3,6, 12,8, 11);
  fill(s, 3,9, 12,12, 7);
  return s;
})();

const I_LETTER = (() => {
  const s = empty(16,16);
  fill(s, 2,3, 13,12, 15);
  fill(s, 3,4, 12,11, 14);
  // envelope flap
  fill(s, 5,3, 10,3, 8);
  fill(s, 4,4, 11,4, 8);
  set(s, 7,5, 8); set(s, 8,5, 8);
  // address lines
  set(s, 5,8, 3); set(s, 6,8, 3); set(s, 7,8, 3);
  set(s, 5,9, 3); set(s, 6,9, 3);
  // stamp
  set(s, 10,5, 6); set(s, 11,5, 6);
  set(s, 10,6, 6); set(s, 11,6, 6);
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

  getCharacterSprite(name, direction, animType, frame) {
    const key = `${name}_${direction}_${animType || 'idle'}_${frame || 0}`;
    if (this.cache[key]) return this.cache[key];

    let sprite;
    const d = direction || 'down';
    const f = frame || 0;

    if (name === 'player') {
      const anims = {
        idle: { down: PLAYER_DOWN, up: PLAYER_UP, left: PLAYER_LEFT, right: PLAYER_RIGHT },
        walk: { down: PLAYER_WALK_DOWN, up: PLAYER_WALK_UP, left: PLAYER_WALK_LEFT, right: PLAYER_WALK_RIGHT },
        run:  { down: PLAYER_RUN_DOWN, up: PLAYER_RUN_UP, left: PLAYER_RUN_LEFT, right: PLAYER_RUN_RIGHT },
      };
      const arr = (anims[animType] || anims.idle)[d] || PLAYER_WALK_DOWN;
      sprite = Array.isArray(arr) ? arr[f % arr.length] : arr;
    } else if (name === 'shiva') {
      const anims = {
        idle: { down: SHIVA_DOWN, up: SHIVA_UP, left: SHIVA_LEFT, right: SHIVA_RIGHT },
        walk: { down: SHIVA_WALK_DOWN, up: SHIVA_WALK_UP, left: SHIVA_WALK_LEFT, right: SHIVA_WALK_RIGHT },
        run:  { down: SHIVA_RUN_DOWN, up: SHIVA_RUN_UP, left: SHIVA_RUN_LEFT, right: SHIVA_RUN_RIGHT },
      };
      const arr = (anims[animType] || anims.idle)[d] || SHIVA_WALK_DOWN;
      sprite = Array.isArray(arr) ? arr[f % arr.length] : arr;
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
      memory: I_MEMORY, photo: I_PHOTO, letter: I_LETTER,
      chave_praca: I_KEY, amuleto_osso: I_AMULET, sal_grosso: I_SALT,
      giz_cera: I_CHALK, ervas: I_HERBS, espelho: I_MIRROR,
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

  _makeCanvas(sprites, cols, cellScale) {
    if (!sprites.length) return null;
    cols = cols || Math.ceil(Math.sqrt(sprites.length));
    const rows = Math.ceil(sprites.length / cols);
    const cw = 16 * cellScale + 4;
    const ch = 16 * cellScale + 4;
    const canvas = document.createElement('canvas');
    canvas.width = cols * cw;
    canvas.height = rows * ch;
    const ctx = canvas.getContext('2d');
    sprites.forEach((s, i) => {
      const cx = (i % cols) * cw + 2;
      const cy = Math.floor(i / cols) * ch + 2;
      ctx.fillStyle = '#0a0505';
      ctx.fillRect(cx - 2, cy - 2, cw, ch);
      this.renderSprite(ctx, s.sprite, cx, cy, cellScale);
    });
    return canvas;
  }

  _collectCategory(name, entries) {
    const sprites = [];
    entries.forEach(([label, data]) => {
      if (!data) return;
      if (Array.isArray(data) && (!Array.isArray(data[0]) || data[0].length === undefined)) {
        data.forEach((sprite, i) => {
          if (sprite) sprites.push({ name: `${label}_${i}`, sprite });
        });
      } else if (data) {
        sprites.push({ name: label, sprite: data });
      }
    });
    return sprites;
  }

  async exportSprites() {
    let JSZip;
    try {
      const mod = await import('https://esm.sh/jszip@3.10.1');
      JSZip = mod.default || mod.JSZip;
    } catch { /* try fallback */ }
    if (!JSZip) JSZip = window.JSZip || null;
    if (!JSZip) {
      const allSprites = [
        { sprite: PLAYER_DOWN }, { sprite: PLAYER_UP },
        { sprite: PLAYER_LEFT }, { sprite: PLAYER_RIGHT },
      ];
      for (let id = 1; id <= 72; id++) {
        const v = T_SPRITES[id];
        if (!v) continue;
        const isMulti = Array.isArray(v) && Array.isArray(v[0]) && Array.isArray(v[0][0]);
        if (isMulti) {
          v.forEach(s => { if (s) allSprites.push({ sprite: s }); });
        } else {
          allSprites.push({ sprite: v });
        }
      }
      const itemSprites = [
        I_LANTERN, I_KEY, I_HERBS, I_SALT, I_AMULET, I_CHALK,
        I_MIRROR, I_NOTE, I_MEMORY, I_PHOTO, I_LETTER,
      ];
      itemSprites.forEach(s => { if (s) allSprites.push({ sprite: s }); });
      allSprites.push({ sprite: UI_SLOT }, { sprite: UI_MEMORY_EMPTY }, { sprite: UI_MEMORY_FILLED });
      const canvas = this._makeCanvas(allSprites, 12, 2);
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'spritesheet.png';
      link.href = dataUrl;
      link.click();
      return;
    }

    const zip = new JSZip();
    const addSheet = (folder, name, sprites, cols) => {
      const canvas = this._makeCanvas(sprites, cols, 2);
      if (!canvas) return;
      folder.file(name, canvas.toDataURL('image/png').split(',')[1], { base64: true });
    };

    const chars = zip.folder('personagens');
    const allPlayer = [
      { sprite: PLAYER_DOWN }, { sprite: PLAYER_UP },
      { sprite: PLAYER_LEFT }, { sprite: PLAYER_RIGHT },
    ];
    for (let f = 0; f < 4; f++) {
      allPlayer.push(
        { sprite: makePlayerWalk('down', f) }, { sprite: makePlayerWalk('up', f) },
        { sprite: makePlayerWalk('left', f) }, { sprite: makePlayerWalk('right', f) },
      );
    }
    for (let f = 0; f < 4; f++) {
      allPlayer.push(
        { sprite: makePlayerRun('down', f) }, { sprite: makePlayerRun('up', f) },
        { sprite: makePlayerRun('left', f) }, { sprite: makePlayerRun('right', f) },
      );
    }
    addSheet(chars, 'player.png', allPlayer, 8);

    const allShiva = [
      { sprite: SHIVA_DOWN }, { sprite: SHIVA_UP },
      { sprite: SHIVA_LEFT }, { sprite: SHIVA_RIGHT },
    ];
    for (let f = 0; f < 4; f++) {
      allShiva.push(
        { sprite: SHIVA_WALK_DOWN[f] }, { sprite: SHIVA_WALK_UP[f] },
        { sprite: SHIVA_WALK_LEFT[f] }, { sprite: SHIVA_WALK_RIGHT[f] },
      );
    }
    addSheet(chars, 'shiva.png', allShiva, 8);
    addSheet(chars, 'shiva_evil.png', [{ sprite: SHIVA_EVIL }], 1);
    addSheet(chars, 'shiva_shadow.png', [{ sprite: SHIVA_SHADOW }], 1);
    addSheet(chars, 'shiva_eyes.png', [{ sprite: SHIVA_EYES }], 1);

    const moveis = zip.folder('moveis');
    const furnList = [];
    for (let id = 14; id <= 72; id++) {
      const sprite = T_SPRITES[id];
      if (!sprite) continue;
      const isMulti = Array.isArray(sprite) && Array.isArray(sprite[0]) && Array.isArray(sprite[0][0]);
      if (isMulti) {
        sprite.forEach(s => { if (s) furnList.push({ sprite: s }); });
      } else {
        furnList.push({ sprite });
      }
    }
    addSheet(moveis, 'moveis.png', furnList, 8);

    const mapa = zip.folder('mapa');
    const tileList = [];
    for (let id = 1; id <= 13; id++) {
      const sprite = T_SPRITES[id];
      if (!sprite) continue;
      const isMulti = Array.isArray(sprite) && Array.isArray(sprite[0]) && Array.isArray(sprite[0][0]);
      if (isMulti) {
        sprite.forEach(s => { if (s) tileList.push({ sprite: s }); });
      } else {
        tileList.push({ sprite });
      }
    }
    addSheet(mapa, 'pisos_paredes.png', tileList, 8);

    const itens = zip.folder('itens');
    addSheet(itens, 'itens.png', [
      I_LANTERN, I_KEY, I_HERBS, I_SALT, I_AMULET, I_CHALK,
      I_MIRROR, I_NOTE, I_MEMORY, I_PHOTO, I_LETTER,
    ].map(s => ({ sprite: s })), 5);

    const ui = zip.folder('ui');
    addSheet(ui, 'ui.png', [
      { sprite: UI_SLOT }, { sprite: UI_MEMORY_EMPTY }, { sprite: UI_MEMORY_FILLED },
    ], 3);

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sprites.zip';
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

const spriteManager = new Sprites();
