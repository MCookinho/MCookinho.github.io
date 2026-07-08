/* ===== MAP.JS ===== */
/* Dados dos 11 mapas — tiles, colisão, objetos, transições */

function makeMapData(id, name, opts) {
  return {
    id, name,
    tiles: opts.tiles || [],
    wall: opts.wall || [],
    collision: opts.collision || [],
    objects: opts.objects || [],
    connections: opts.connections || [],
    ambient: opts.ambient || 'casa',
    light: opts.light !== undefined ? opts.light : 0.3,
    playerStart: opts.playerStart || { x: 5*16, y: 7*16 },
  };
}

function fillRect(grid, x1, y1, x2, y2, val) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      if (grid[y] !== undefined) grid[y][x] = val;
    }
  }
}

function makeGrid(fill) {
  const g = [];
  for (let y = 0; y < 15; y++) {
    g[y] = [];
    for (let x = 0; x < 20; x++) {
      g[y][x] = fill !== undefined ? fill : 0;
    }
  }
  return g;
}

/* ================================================================
   MAPA 01 — QUARTO
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // paredes externas (2 tiles de espessura)
  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 20; x++)
      if (y < 2 || y >= 13 || x < 2 || x >= 18)
        { wall[y][x] = 5; coll[y][x] = true; }
      else
        tiles[y][x] = 1;

  // cama (canto sup esq)
  fillRect(tiles, 4, 3, 7, 5, 12);
  fillRect(wall, 4, 3, 7, 3, 5);
  // mesa (canto inf dir)
  fillRect(tiles, 14, 10, 16, 12, 12);
  // porta p/ corredor na parede direita
  wall[7][17] = 10; coll[7][17] = false;

  const objects = [
    { type:'item', x:15, y:11, item:'lanterna', collected:false },
    { type:'door', x:17, y:7, targetMap:'corredor', targetX:1, targetY:7 },
  ];

  window.MAP_DATA_quarto = makeMapData('quarto', 'Quarto', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.2, playerStart:{ x:9*16, y:10*16 }
  });
})();

/* ================================================================
   MAPA 02 — CORREDOR
   Layout: corredor horizontal com portas nas paredes.
   Parede vertical em x=7 com porta no meio (y=7).
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // paredes superior e inferior
  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 20; x++)
      if (y < 2 || y >= 12)
        { wall[y][x] = 5; coll[y][x] = true; }
      else
        tiles[y][x] = 1;

  // parede vertical no meio (separa lado esquerdo do direito)
  for (let y = 2; y < 12; y++)
    if (y !== 7) { wall[y][7] = 5; coll[y][7] = true; }
  // abertura em y=7 é a porta (já é chão 1)

  // portas
  wall[7][0] = 10; coll[7][0] = false;  // esquerda → quarto
  wall[7][7] = 10; coll[7][7] = false;  // meio → sala
  wall[7][19] = 10; coll[7][19] = false; // direita → (futuro)

  const objects = [
    { type:'door', x:0, y:7, targetMap:'quarto', targetX:16, targetY:7 },
    { type:'door', x:7, y:7, targetMap:'sala', targetX:2, targetY:7 },
    { type:'shiva_event', x:14, y:4, eventId:'silhueta_corredor', triggered:false },
  ];

  window.MAP_DATA_corredor = makeMapData('corredor', 'Corredor', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.15, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 03 — SALA + GARAGEM
   Sala à esquerda, garagem à direita, abertura entre elas.
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // sala (x 0-9)
  for (let y = 2; y < 13; y++)
    for (let x = 0; x < 10; x++)
      if (y === 2 || y === 12 || x === 0 || x === 9)
        { wall[y][x] = 5; coll[y][x] = true; }
      else
        tiles[y][x] = 1;

  // garagem (x 11-18)
  for (let y = 2; y < 13; y++)
    for (let x = 11; x < 19; x++)
      if (y === 2 || y === 12 || x === 18)
        { wall[y][x] = 5; coll[y][x] = true; }
      else if (x === 11)
        { wall[y][x] = 5; coll[y][x] = true; }
      else
        tiles[y][x] = 2;

  // abertura sala ↔ garagem (x=9 e x=11 têm parede; x=10 é a abertura)
  wall[6][9] = 0; coll[6][9] = false;
  wall[7][9] = 0; coll[7][9] = false;
  wall[8][9] = 0; coll[8][9] = false;
  wall[6][11] = 0; coll[6][11] = false;
  wall[7][11] = 0; coll[7][11] = false;
  wall[8][11] = 0; coll[8][11] = false;
  tiles[6][10] = 1; tiles[7][10] = 1; tiles[8][10] = 1;

  // portas
  wall[7][0] = 10; coll[7][0] = false;   // → corredor
  wall[7][18] = 10; coll[7][18] = false;  // → calçada

  const objects = [
    { type:'door', x:0, y:7, targetMap:'corredor', targetX:8, targetY:7 },
    { type:'door', x:18, y:7, targetMap:'calcada', targetX:2, targetY:4 },
    { type:'note', x:4, y:5, noteId:'peu_bilhete', read:false },
    { type:'puzzle', x:15, y:8, puzzleId:'cadeado_joao', solved:false },
    { type:'shiva_event', x:12, y:5, eventId:'rabo_porta', triggered:false },
  ];

  window.MAP_DATA_sala = makeMapData('sala', 'Sala', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.25, playerStart:{ x:5*16, y:9*16 }
  });
})();

/* ================================================================
   MAPA 04 — CALÇADA
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 20; x++) {
      if (y < 3) tiles[y][x] = 4;        // grama
      else if (y < 6) tiles[y][x] = 2;   // calçada superior
      else if (y < 11) tiles[y][x] = 3;  // asfalto
      else tiles[y][x] = 4;              // grama inferior
    }

  // porta da casa (na calçada superior)
  wall[4][2] = 10; coll[4][2] = false;

  // poste
  wall[7][13] = 8; coll[7][13] = true;

  const objects = [
    { type:'door', x:2, y:4, targetMap:'sala', targetX:17, targetY:7 },
    { type:'shiva_event', x:10, y:5, eventId:'sombra_tres_cabecas', triggered:false },
  ];
  const connections = [
    { dir:'right', map:'rua', x:0, y:4 },
  ];

  window.MAP_DATA_calcada = makeMapData('calcada', 'Calçada', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.4, playerStart:{ x:5*16, y:4*16 }
  });
})();

/* ================================================================
   MAPA 05 — RUA
   Conexões: esquerda→calcada, direita→portao, cima→praca
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 20; x++) {
      if (y < 2 || y >= 13) tiles[y][x] = 4;  // grama
      else if (y < 5 || y >= 10) tiles[y][x] = 2; // calçada
      else tiles[y][x] = 3;  // asfalto
    }

  // postes
  [[3,4],[10,4],[17,4],[3,11],[10,11],[17,11]].forEach(([px, py]) => {
    wall[py][px] = 8; coll[py][px] = true;
  });

  // muros/fachadas
  for (let x = 0; x < 3; x++) { wall[2][x] = 5; coll[2][x] = true; }
  for (let x = 7; x < 10; x++) { wall[2][x] = 5; coll[2][x] = true; }
  for (let x = 14; x < 17; x++) { wall[2][x] = 5; coll[2][x] = true; }
  for (let x = 4; x < 7; x++) { wall[12][x] = 5; coll[12][x] = true; }
  for (let x = 11; x < 14; x++) { wall[12][x] = 5; coll[12][x] = true; }

  const connections = [
    { dir:'left', map:'calcada', x:19, y:4 },
    { dir:'right', map:'portao', x:0, y:7 },
    { dir:'up', map:'praca', x:10, y:14 },
  ];

  const objects = [
    { type:'puzzle', x:11, y:3, puzzleId:'radios_ulisses', solved:false },
  ];

  window.MAP_DATA_rua = makeMapData('rua', 'Rua', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.4, playerStart:{ x:3*16, y:5*16 }
  });
})();

/* ================================================================
   MAPA 06 — PORTÃO
   Portão que verifica se jogador tem chave_praca no inventário.
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 20; x++) {
      if (y < 2 || y >= 13) tiles[y][x] = 4;
      else if (y < 6 || y >= 9) tiles[y][x] = 2;
      else tiles[y][x] = 3;
    }

  // muros laterais + gradil
  for (let y = 2; y < 13; y++) {
    if (y === 7) continue; // abertura do portão
    wall[y][9] = 6; coll[y][9] = true;
  }
  wall[7][9] = 7; coll[7][9] = true; // portão (trancado até ter chave_praca)

  const objects = [
    { type:'gate', x:9, y:7, requiredItem:'chave_praca', targetMap:'praca', targetX:10, targetY:8 },
  ];
  const connections = [
    { dir:'left', map:'rua', x:19, y:7 },
  ];

  window.MAP_DATA_portao = makeMapData('portao', 'Portão', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.35, playerStart:{ x:5*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 07 — PRAÇA
   ================================================================ */
(function() {
  const tiles = makeGrid(4);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminhos
  for (let y = 4; y < 11; y++)
    for (let x = 7; x < 13; x++)
      tiles[y][x] = 2;

  // playground cercado
  for (let y = 2; y < 6; y++)
    for (let x = 14; x < 18; x++) {
      tiles[y][x] = 2;
      if (y === 2 || y === 5 || x === 14 || x === 17)
        { wall[y][x] = 6; coll[y][x] = true; }
    }

  // árvores
  [[3,2],[4,8],[2,12],[8,3],[8,17],[12,5],[11,11]].forEach(([ax, ay]) => {
    wall[ay][ax] = 9; coll[ay][ax] = true;
  });

  const objects = [
    { type:'puzzle', x:16, y:4, puzzleId:'desenhos_enzo', solved:false },
    { type:'shiva_event', x:10, y:6, eventId:'shiva_praca', triggered:false },
  ];
  const connections = [
    { dir:'down', map:'rua', x:10, y:0 },
    { dir:'right', map:'beco', x:0, y:7 },
    { dir:'left', map:'portao', x:10, y:8 },
  ];

  window.MAP_DATA_praca = makeMapData('praca', 'Praça', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.5, playerStart:{ x:10*16, y:9*16 }
  });
})();

/* ================================================================
   MAPA 08 — BECO
   ================================================================ */
(function() {
  const tiles = makeGrid(2);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // paredes laterais (prédios)
  for (let x = 0; x < 20; x++) {
    wall[1][x] = 5; coll[1][x] = true;
    wall[13][x] = 5; coll[13][x] = true;
  }

  // caixotes/lixo
  [[4,4],[6,9],[14,4],[16,9]].forEach(([lx, ly]) => {
    wall[ly][lx] = 12; coll[ly][lx] = true;
  });

  const objects = [
    { type:'puzzle', x:10, y:7, puzzleId:'patas_sandalia', solved:false },
    { type:'shiva_event', x:8, y:4, eventId:'encarada_beco', triggered:false },
  ];
  const connections = [
    { dir:'left', map:'praca', x:19, y:7 },
    { dir:'right', map:'igreja', x:0, y:7 },
  ];

  window.MAP_DATA_beco = makeMapData('beco', 'Beco', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.2, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 09 — IGREJA
   ================================================================ */
(function() {
  const tiles = makeGrid(1);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // paredes
  for (let y = 1; y < 14; y++) {
    wall[y][1] = 5; coll[y][1] = true;
    wall[y][18] = 5; coll[y][18] = true;
  }
  for (let x = 1; x < 19; x++) {
    wall[1][x] = 5; coll[1][x] = true;
    wall[13][x] = 5; coll[13][x] = true;
  }

  // altar central
  for (let y = 4; y < 10; y++)
    for (let x = 9; x < 11; x++)
      { wall[y][x] = 5; coll[y][x] = true; }

  // bancos
  [[5,4],[5,5],[5,14],[5,15],[10,4],[10,5],[10,14],[10,15]].forEach(([by, bx]) => {
    tiles[by][bx] = 12;
  });

  // portas
  wall[7][1] = 10; coll[7][1] = false;    // entrada lateral (vinda do beco)
  wall[7][18] = 10; coll[7][18] = false;   // → beco
  wall[3][10] = 10; coll[3][10] = false;    // → cemitério (atrás do altar)

  const objects = [
    { type:'puzzle', x:10, y:7, puzzleId:'velas_elaine', solved:false },
    { type:'door', x:1, y:7, targetMap:'beco', targetX:18, targetY:7 },
    { type:'door', x:18, y:7, targetMap:'beco', targetX:1, targetY:7 },
    { type:'door', x:10, y:3, targetMap:'cemiterio', targetX:10, targetY:2 },
  ];

  window.MAP_DATA_igreja = makeMapData('igreja', 'Igreja', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.35, playerStart:{ x:5*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 10 — CEMITÉRIO
   ================================================================ */
(function() {
  const tiles = makeGrid(4);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminho central
  for (let y = 2; y < 13; y++)
    for (let x = 8; x < 12; x++)
      tiles[y][x] = 2;

  // muros
  for (let y = 0; y < 2; y++)
    for (let x = 0; x < 20; x++)
      { wall[y][x] = 13; coll[y][x] = true; }
  for (let y = 13; y < 15; y++)
    for (let x = 0; x < 20; x++)
      { wall[y][x] = 13; coll[y][x] = true; }
  for (let y = 2; y < 13; y++) {
    wall[y][0] = 13; coll[y][0] = true;
    wall[y][19] = 13; coll[y][19] = true;
  }

  // lápides
  [[3,3],[3,6],[3,10],[3,13],[6,4],[6,7],[6,10],[6,13],[10,3],[10,6],[10,11],[10,14]].forEach(([ly, lx]) => {
    tiles[ly][lx] = 2;
    wall[ly][lx] = 8;
  });

  // portão (→ parque) e porta (→ igreja)
  wall[7][0] = 10; coll[7][0] = false;
  wall[1][10] = 10; coll[1][10] = false;

  const objects = [
    { type:'puzzle', x:10, y:9, puzzleId:'lapides_giulia', solved:false },
    { type:'door', x:0, y:7, targetMap:'parque', targetX:10, targetY:7 },
    { type:'door', x:10, y:1, targetMap:'igreja', targetX:10, targetY:3 },
  ];

  window.MAP_DATA_cemiterio = makeMapData('cemiterio', 'Cemitério', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'rua', light:0.25, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 11 — PARQUE (FINAL)
   ================================================================ */
(function() {
  const tiles = makeGrid(4);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminho
  for (let y = 3; y < 12; y++)
    for (let x = 7; x < 13; x++)
      tiles[y][x] = 2;

  // árvores
  [[2,2],[2,8],[2,15],[5,2],[5,17],[9,2],[9,17],[12,2],[12,8],[12,15],[2,18]].forEach(([ax, ay]) => {
    wall[ay][ax] = 9; coll[ay][ax] = true;
  });

  // porta dourada
  tiles[7][10] = 2; tiles[7][9] = 2;
  wall[7][0] = 10; coll[7][0] = false;

  const objects = [
    { type:'door', x:0, y:7, targetMap:'cemiterio', targetX:10, targetY:2 },
    { type:'golden_door', x:10, y:7, puzzleId:'golden_door' },
  ];

  window.MAP_DATA_parque = makeMapData('parque', 'Parque', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'rua', light:0.6, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ===== REGISTRO GLOBAL DOS MAPAS ===== */
function registerAllMaps(engine) {
  const ids = ['quarto','corredor','sala','calcada','rua','portao','praca','beco','igreja','cemiterio','parque'];
  ids.forEach(id => {
    const data = window['MAP_DATA_' + id];
    if (data) engine.loadMap(id, data);
  });
}
