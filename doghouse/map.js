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

// helpers
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

  // parede externa (4x4 de grossura nas bordas)
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 20; x++) {
      if (y < 2 || y >= 13 || x < 2 || x >= 18) {
        wall[y][x] = 5;
        coll[y][x] = true;
      } else {
        tiles[y][x] = 1; // chão casa
      }
    }
  }
  // cama (canto sup esq)
  fillRect(tiles, 4, 3, 7, 5, 12);
  fillRect(wall, 4, 3, 7, 3, 5);
  // mesa (canto inf dir)
  fillRect(tiles, 14, 10, 16, 12, 12);
  // porta p/ corredor (direita)
  tiles[7][17] = 1; wall[7][17] = 10; coll[7][17] = false;
  // lanterna na mesa
  const objects = [
    { type:'item', x:15, y:11, item:'lanterna', collected:false },
    { type:'door', x:17, y:7, targetMap:'corredor', targetX:1, targetY:7 },
  ];
  // conexao borda
  const connections = [];

  window.MAP_DATA_quarto = makeMapData('quarto', 'Quarto', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'casa', light:0.2, playerStart:{ x:9*16, y:10*16 }
  });
})();

/* ================================================================
   MAPA 02 — CORREDOR
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 20; x++) {
      if (y < 3 || y >= 12) {
        wall[y][x] = 5; coll[y][x] = true;
      } else {
        tiles[y][x] = 1;
      }
    }
  }
  // divisórias
  for (let y = 3; y < 12; y++) {
    wall[y][7] = 5; coll[y][7] = true; // parede no meio
    wall[y][13] = 5; coll[y][13] = true;
  }
  // portas
  wall[7][0] = 10; coll[7][0] = false; // entrada do quarto
  wall[7][8] = 10; coll[7][8] = false; // porta p/ sala (atravessa parede)
  wall[7][14] = 10; coll[7][14] = false; // porta p/ algo

  const objects = [
    { type:'door', x:0, y:7, targetMap:'quarto', targetX:16, targetY:7 },
    { type:'door', x:8, y:7, targetMap:'sala', targetX:2, targetY:7 },
    { type:'shiva_event', x:14, y:5, eventId:'silhueta_corredor', triggered:false },
  ];

  window.MAP_DATA_corredor = makeMapData('corredor', 'Corredor', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.15, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 03 — SALA (com garagem anexa)
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // sala principal (lado esquerdo)
  for (let y = 2; y < 13; y++) {
    for (let x = 0; x < 11; x++) {
      if (y === 2 || y === 12 || x === 0 || x === 10) {
        wall[y][x] = 5; coll[y][x] = true;
      } else {
        tiles[y][x] = 1;
      }
    }
  }
  // garagem (lado direito, conectada)
  for (let y = 2; y < 13; y++) {
    for (let x = 11; x < 19; x++) {
      if (y === 2 || y === 12 || x === 18) {
        wall[y][x] = 5; coll[y][x] = true;
      } else if (x === 11) {
        wall[y][x] = 5; coll[y][x] = true;
      } else {
        tiles[y][x] = 2; // chão diferente (cimento)
      }
    }
  }
  // abertura entre sala e garagem
  wall[6][10] = 0; coll[6][10] = false;
  wall[7][10] = 0; coll[7][10] = false;
  wall[8][10] = 0; coll[8][10] = false;

  // porta da sala p/ corredor
  wall[7][0] = 10; coll[7][0] = false;
  // porta da sala p/ calçada
  wall[7][18] = 10; coll[7][18] = false;

  // objetos
  const objects = [
    { type:'door', x:0, y:7, targetMap:'corredor', targetX:9, targetY:7 },
    { type:'door', x:18, y:7, targetMap:'calcada', targetX:2, targetY:7 },
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

  // calçada (2 tiles de largura)
  for (let y = 6; y < 9; y++) {
    for (let x = 0; x < 20; x++) {
      tiles[y][x] = 2;
    }
  }
  // rua embaixo
  for (let y = 9; y < 13; y++) {
    for (let x = 0; x < 20; x++) {
      tiles[y][x] = 3;
    }
  }
  // grama em cima
  for (let y = 2; y < 6; y++) {
    for (let x = 0; x < 20; x++) {
      tiles[y][x] = 4;
    }
  }
  // porta da casa (à esquerda)
  wall[9][2] = 10; coll[9][2] = false;
  // cerca
  for (let y = 9; y < 12; y++) {
    for (let x = 14; x < 17; x++) {
      wall[y][x] = 6; coll[y][x] = true;
    }
  }

  const objects = [
    { type:'door', x:2, y:9, targetMap:'sala', targetX:17, targetY:7 },
    { type:'shiva_event', x:10, y:7, eventId:'sombra_tres_cabecas', triggered:false },
  ];
  const connections = [
    { dir:'right', map:'rua', x:0, y:7 },
    { dir:'left', map:'rua', x:19, y:7 },
  ];

  window.MAP_DATA_calcada = makeMapData('calcada', 'Calçada', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.4, playerStart:{ x:5*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 05 — RUA
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // calçada cima e baixo
  for (let y = 2; y < 5; y++) {
    for (let x = 0; x < 20; x++) tiles[y][x] = 2;
  }
  for (let y = 10; y < 13; y++) {
    for (let x = 0; x < 20; x++) tiles[y][x] = 2;
  }
  // asfalto
  for (let y = 5; y < 10; y++) {
    for (let x = 0; x < 20; x++) tiles[y][x] = 3;
  }
  // grama nas bordas
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 20; x++) tiles[y][x] = 4;
  }
  for (let y = 13; y < 15; y++) {
    for (let x = 0; x < 20; x++) tiles[y][x] = 4;
  }
  // postes
  const postes = [[4,4], [15,4], [9,11]];
  postes.forEach(([px, py]) => {
    wall[py][px] = 8; coll[py][px] = true;
  });
  // casas (bloqueadas - só fachada)
  for (let x = 0; x < 4; x++) { wall[2][x] = 5; coll[2][x] = true; }
  for (let x = 6; x < 10; x++) { wall[2][x] = 5; coll[2][x] = true; }
  for (let x = 12; x < 16; x++) { wall[2][x] = 5; coll[2][x] = true; }

  const objects = [];
  const connections = [
    { dir:'left', map:'calcada', x:19, y:4 },
    { dir:'right', map:'portao', x:0, y:7 },
    { dir:'up', map:'praca', x:7, y:14 },
  ];

  window.MAP_DATA_rua = makeMapData('rua', 'Rua', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.3, playerStart:{ x:3*16, y:6*16 }
  });
})();

/* ================================================================
   MAPA 06 — PORTÃO
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  for (let y = 3; y < 12; y++) {
    for (let x = 0; x < 20; x++) {
      tiles[y][x] = 2; // calçada
    }
  }
  // muros laterais
  for (let y = 3; y < 12; y++) {
    wall[y][0] = 13; coll[y][0] = true;
    wall[y][19] = 13; coll[y][19] = true;
  }
  // portão (no centro)
  wall[5][9] = 7; coll[5][9] = true;
  wall[5][10] = 7; coll[5][10] = true;

  const objects = [
    { type:'puzzle', x:9, y:5, puzzleId:'cadeado_joao', solved:false },
    { type:'door', x:9, y:5, targetMap:'praca', targetX:10, targetY:7 },
  ];
  const connections = [
    { dir:'left', map:'rua', x:19, y:7 },
  ];

  window.MAP_DATA_portao = makeMapData('portao', 'Portão', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.3, playerStart:{ x:5*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 07 — PRAÇA
   ================================================================ */
(function() {
  const tiles = makeGrid(4); // grama
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminho de calçada
  for (let y = 5; y < 10; y++) {
    for (let x = 7; x < 13; x++) tiles[y][x] = 2;
  }
  // playground (canto sup dir)
  for (let y = 2; y < 6; y++) {
    for (let x = 13; x < 18; x++) {
      tiles[y][x] = 2;
      if ((y === 2 || y === 5 || x === 13 || x === 17)) {
        wall[y][x] = 6; coll[y][x] = true; // cerca
      }
    }
  }
  // árvores
  const trees = [[2,2], [2,6], [2,10], [8,2], [8,18], [12,2]];
  trees.forEach(([tx, ty]) => {
    wall[ty][tx] = 9; coll[ty][tx] = true;
  });

  const objects = [
    { type:'puzzle', x:15, y:4, puzzleId:'desenhos_enzo', solved:false },
    { type:'shiva_event', x:10, y:7, eventId:'shiva_praca', triggered:false },
  ];
  const connections = [
    { dir:'down', map:'rua', x:10, y:0 },
    { dir:'right', map:'beco', x:0, y:7 },
    { dir:'left', map:'portao', x:10, y:5 },
  ];

  window.MAP_DATA_praca = makeMapData('praca', 'Praça', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.5, playerStart:{ x:10*16, y:8*16 }
  });
})();

/* ================================================================
   MAPA 08 — BECO
   ================================================================ */
(function() {
  const tiles = makeGrid(2); // calçada
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // paredes dos prédios
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 20; x++) {
      if (x < 3 || x > 16) continue;
      wall[y][x] = 5; coll[y][x] = true;
    }
  }
  for (let y = 12; y < 15; y++) {
    for (let x = 0; x < 20; x++) {
      if (x < 3 || x > 16) continue;
      wall[y][x] = 5; coll[y][x] = true;
    }
  }
  // caixotes/lixo
  const lixo = [[4,4], [6,9], [14,4], [16,9]];
  lixo.forEach(([lx, ly]) => {
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
  const tiles = makeGrid(1); // chão igreja
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // paredes da igreja
  for (let y = 1; y < 14; y++) {
    for (let x of [1, 18]) {
      wall[y][x] = 5; coll[y][x] = true;
    }
  }
  for (let x = 1; x < 19; x++) {
    wall[1][x] = 5; coll[1][x] = true;
    wall[13][x] = 5; coll[13][x] = true;
  }
  // altar
  for (let y = 4; y < 10; y++) {
    for (let x = 9; x < 11; x++) {
      wall[y][x] = 5; coll[y][x] = true;
    }
  }
  // bancos
  const bancos = [[5,3], [5,5], [5,13], [5,15], [10,3], [10,5], [10,13], [10,15]];
  bancos.forEach(([by, bx]) => {
    tiles[by][bx] = 12;
  });
  // porta
  wall[7][18] = 10; coll[7][18] = false;

  const objects = [
    { type:'puzzle', x:10, y:7, puzzleId:'velas_elaine', solved:false },
    { type:'door', x:18, y:7, targetMap:'beco', targetX:1, targetY:7 },
  ];
  const connections = [];

  window.MAP_DATA_igreja = makeMapData('igreja', 'Igreja', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'casa', light:0.35, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 10 — CEMITÉRIO
   ================================================================ */
(function() {
  const tiles = makeGrid(4); // grama
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminho central
  for (let y = 2; y < 13; y++) {
    for (let x = 8; x < 12; x++) tiles[y][x] = 2;
  }
  // muros
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 20; x++) { wall[y][x] = 13; coll[y][x] = true; }
  }
  for (let y = 13; y < 15; y++) {
    for (let x = 0; x < 20; x++) { wall[y][x] = 13; coll[y][x] = true; }
  }
  for (let y = 2; y < 13; y++) {
    wall[y][0] = 13; coll[y][0] = true;
    wall[y][19] = 13; coll[y][19] = true;
  }
  // lápides (objetos decorativos)
  const lapides = [[3,3], [3,6], [3,9], [3,12], [6,4], [6,7], [6,10], [6,13],
    [10,3], [10,6], [10,10], [10,13]];
  lapides.forEach(([ly, lx]) => {
    tiles[ly][lx] = 2;
    wall[ly][lx] = 8; // poste como lapide placeholder
  });
  // portão
  wall[7][0] = 10; coll[7][0] = false;

  const objects = [
    { type:'puzzle', x:10, y:8, puzzleId:'lapides_giulia', solved:false },
    { type:'door', x:0, y:7, targetMap:'parque', targetX:10, targetY:7 },
  ];
  const connections = [];

  window.MAP_DATA_cemiterio = makeMapData('cemiterio', 'Cemitério', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.25, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 11 — PARQUE (FINAL)
   ================================================================ */
(function() {
  const tiles = makeGrid(4); // grama
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminho
  for (let y = 3; y < 12; y++) {
    for (let x = 7; x < 13; x++) tiles[y][x] = 2;
  }
  // árvores
  const arvores = [[1,1], [1,5], [1,10], [1,15], [1,18],
    [5,1], [5,18], [8,1], [8,18], [11,1], [11,18],
    [14,1], [14,5], [14,10], [14,15], [14,18]];
  arvores.forEach(([ax, ay]) => {
    wall[ay][ax] = 9; coll[ay][ax] = true;
  });
  // porta dourada no centro
  tiles[7][10] = 2;
  tiles[7][9] = 2;
  tiles[8][10] = 2;
  tiles[8][9] = 2;

  // portão de entrada
  wall[7][0] = 10; coll[7][0] = false;

  const objects = [
    { type:'door', x:0, y:7, targetMap:'cemiterio', targetX:1, targetY:7 },
    { type:'golden_door', x:10, y:7, puzzleId:'golden_door' },
  ];
  const connections = [];

  window.MAP_DATA_parque = makeMapData('parque', 'Parque', {
    tiles, wall, collision: coll, objects, connections,
    ambient:'rua', light:0.6, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ===== REGISTRO GLOBAL DOS MAPAS ===== */
function registerAllMaps(engine) {
  const mapIds = [
    'quarto', 'corredor', 'sala', 'calcada',
    'rua', 'portao', 'praca', 'beco',
    'igreja', 'cemiterio', 'parque'
  ];
  mapIds.forEach(id => {
    const data = window['MAP_DATA_' + id];
    if (data) engine.loadMap(id, data);
  });
}
