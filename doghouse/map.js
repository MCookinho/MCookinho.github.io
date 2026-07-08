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
   MAPA 01 — QUARTO (Bedroom)
   Cama, criado-mudo, escrivaninha, guarda-roupa, tapete, brinquedos,
   abajur, ventilador, planta, quadro, espelho, cortinas, estante
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 20; x++)
      if (y < 2 || y >= 13 || x < 2 || x >= 18)
        { wall[y][x] = 5; coll[y][x] = true; }
      else
        tiles[y][x] = 1;

  // cama (2x2) no canto inferior esquerdo
  tiles[10][3] = 14; tiles[10][4] = 14;
  tiles[11][3] = 14; tiles[11][4] = 14;
  coll[10][3] = true; coll[10][4] = true;
  coll[11][3] = true; coll[11][4] = true;
  // criado-mudo ao lado direito da cama
  tiles[10][5] = 45; coll[10][5] = true;
  // abajur sobre o criado-mudo
  tiles[9][5] = 29; coll[9][5] = true;
  // guarda-roupa (3 tiles altura) na parede esquerda
  tiles[3][2] = 24; tiles[4][2] = 24; tiles[5][2] = 24;
  coll[3][2] = true; coll[4][2] = true; coll[5][2] = true;
  // escrivaninha com PC na parede direita
  tiles[4][15] = 53; tiles[4][16] = 53;
  coll[4][15] = true; coll[4][16] = true;
  // cadeira da escrivaninha
  tiles[5][15] = 28; coll[5][15] = true;
  // tapete vermelho no centro
  tiles[7][6] = 48; tiles[7][7] = 48; tiles[7][8] = 48;
  tiles[8][6] = 48; tiles[8][7] = 48; tiles[8][8] = 48;
  // ventilador no canto
  tiles[11][16] = 65; coll[11][16] = true;
  // planta perto da janela
  tiles[3][6] = 27;
  // brinquedos no canto inferior direito
  tiles[11][14] = 42;
  // estante na parede direita
  wall[3][17] = 25; wall[4][17] = 25;
  coll[3][17] = true; coll[4][17] = true;
  // quadro acima da cama
  wall[2][6] = 26; wall[2][7] = 26;
  // espelho acima do criado-mudo
  wall[2][5] = 63;
  // cortinas
  wall[2][2] = 31; wall[2][17] = 31;
  // relógio na parede
  wall[2][12] = 66;
  // porta para corredor
  wall[7][18] = 10; coll[7][18] = true;

  const objects = [
    { type:'item', x:6, y:10, item:'lanterna', collected:false },
    { type:'door', x:18, y:7, targetMap:'corredor', targetX:1, targetY:7 },
  ];

  window.MAP_DATA_quarto = makeMapData('quarto', 'Quarto', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.2, playerStart:{ x:9*16, y:10*16 }
  });
})();

/* ================================================================
   MAPA 02 — CORREDOR (Hallway em L)
   Passagem livre em L: horizontal (y=6..8, x=0..9) e
   vertical (y=3..10, x=9..11). Junção completamente aberta.
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // piso: L aberto — braço horizontal y=6..8, braço vertical y=3..10, x=9..11
  for (let y = 3; y <= 10; y++) {
    for (let x = 0; x <= 11; x++) {
      const inH = (y >= 6 && y <= 8 && x >= 0 && x <= 9);
      const inV = (y >= 3 && y <= 10 && x >= 9 && x <= 11);
      if (inH || inV) tiles[y][x] = 1;
    }
  }

  // paredes externas
  for (let x = 0; x <= 8; x++) { wall[5][x] = 5; coll[5][x] = true; }  // topo do braço horizontal
  for (let x = 0; x <= 8; x++) { wall[9][x] = 5; coll[9][x] = true; }  // base do braço horizontal
  wall[6][0] = 5; coll[6][0] = true;   // esquerda (acima da porta)
  wall[8][0] = 5; coll[8][0] = true;   // esquerda (abaixo da porta)
  for (let y = 3; y <= 10; y++) { wall[y][12] = 5; coll[y][12] = true; } // direita do vertical
  for (let x = 9; x <= 11; x++) { wall[2][x] = 5; coll[2][x] = true; }  // topo do vertical
  for (let x = 9; x <= 11; x++) { wall[11][x] = 5; coll[11][x] = true; } // base do vertical

  // portas
  wall[7][0] = 10; coll[7][0] = true;   // → quarto (esquerda do horizontal)
  wall[5][12] = 10; coll[5][12] = true;  // → sala (direita do vertical)
  wall[11][10] = 10; coll[11][10] = true; // fundo (futuro)

  // sapateira perto da entrada do quarto
  tiles[6][2] = 51; tiles[6][3] = 51; coll[6][2] = true; coll[6][3] = true;
  // cabideiro
  tiles[6][5] = 52; coll[6][5] = true;
  // vaso com planta
  tiles[7][5] = 27;
  // quadro na parede direita
  wall[6][12] = 26;
  // tapete no corredor horizontal
  tiles[7][7] = 48; tiles[7][8] = 48;
  // tapete no vertical
  tiles[4][10] = 48; tiles[5][10] = 48;
  // espelho na parede direita
  wall[8][12] = 63;
  // planta grande no canto do L
  tiles[6][10] = 60; coll[6][10] = true;
  // relógio na parede
  wall[4][12] = 66;

  const objects = [
    { type:'door', x:0, y:7, targetMap:'quarto', targetX:17, targetY:7 },
    { type:'door', x:12, y:5, targetMap:'sala', targetX:1, targetY:7 },
    { type:'shiva_event', x:10, y:7, eventId:'silhueta_corredor', triggered:false },
  ];

  window.MAP_DATA_corredor = makeMapData('corredor', 'Corredor', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.15, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 03 — SALA + COZINHA + GARAGEM
   Sala: sofá, poltrona, TV, mesa centro, tapete, quadro, estante, rádio
   Cozinha: fogão, geladeira, pia, micro-ondas, forno, armário, mesa
   Garagem: máquina lavar, bancada, caixotes, estante
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // Sala (x=0..9): piso de madeira
  for (let y = 3; y <= 11; y++)
    for (let x = 0; x <= 9; x++)
      tiles[y][x] = 1;

  // Cozinha (x=7..13): cerâmica (tile 47)
  for (let y = 3; y <= 11; y++)
    for (let x = 7; x <= 13; x++)
      tiles[y][x] = 47;

  // Garagem (x=13..18): concreto (tile 2)
  for (let y = 3; y <= 11; y++)
    for (let x = 13; x <= 18; x++)
      tiles[y][x] = 2;

  // Paredes externas
  for (let x = 0; x <= 18; x++) { wall[3][x] = 5; coll[3][x] = true; }
  for (let x = 0; x <= 18; x++) { wall[11][x] = 5; coll[11][x] = true; }
  for (let y = 3; y <= 11; y++) { wall[y][0] = 5; coll[y][0] = true; }
  for (let y = 3; y <= 11; y++) { wall[y][18] = 5; coll[y][18] = true; }

  // Parede divisória sala/cozinha (x=6, y=3..6)
  for (let y = 3; y <= 6; y++) { wall[y][6] = 5; coll[y][6] = true; }
  // Parede divisória cozinha/garagem (x=13, y=3..6 e 9..11)
  for (let y = 3; y <= 6; y++) { wall[y][13] = 5; coll[y][13] = true; }
  for (let y = 9; y <= 11; y++) { wall[y][13] = 5; coll[y][13] = true; }

  // SALA
  // sofá (2 tiles) na parede esquerda
  tiles[5][2] = 18; tiles[5][3] = 18; coll[5][2] = true; coll[5][3] = true;
  // poltrona ao lado
  tiles[5][4] = 57; coll[5][4] = true;
  // TV na parede
  tiles[5][5] = 19; coll[5][5] = true;
  // mesa de centro
  tiles[7][3] = 15; coll[7][3] = true;
  // tapete
  tiles[8][2] = 48; tiles[8][3] = 48; tiles[8][4] = 48;
  // rádio
  tiles[9][5] = 64; coll[9][5] = true;
  // quadro na parede
  wall[3][2] = 26; wall[3][4] = 26;
  // estante na parede esquerda
  tiles[10][2] = 25; tiles[10][3] = 25; coll[10][2] = true; coll[10][3] = true;
  // vaso
  tiles[10][5] = 27;
  // relógio
  wall[3][7] = 66;

  // COZINHA
  // bancada com eletrodomésticos
  tiles[4][7] = 33; coll[4][7] = true;   // microondas
  tiles[4][8] = 21; tiles[4][9] = 21; coll[4][8] = true; coll[4][9] = true; // fogão
  tiles[4][10] = 46; coll[4][10] = true; // forno
  tiles[4][11] = 22; coll[4][11] = true; // pia
  tiles[4][12] = 20; coll[4][12] = true; // geladeira
  // armário
  tiles[10][7] = 56; coll[10][7] = true;
  // mesa com cadeiras
  tiles[7][9] = 54; tiles[7][10] = 54; coll[7][9] = true; coll[7][10] = true;
  tiles[8][9] = 55; tiles[8][10] = 55; coll[8][9] = true; coll[8][10] = true;
  // lixeira
  tiles[10][11] = 32; coll[10][11] = true;
  // planta
  tiles[10][8] = 60;

  // GARAGEM
  // máquina de lavar
  tiles[5][16] = 43; coll[5][16] = true;
  // bancada (2 tiles)
  tiles[4][14] = 15; tiles[4][15] = 15; coll[4][14] = true; coll[4][15] = true;
  // estante
  tiles[8][16] = 25; tiles[9][16] = 25; coll[8][16] = true; coll[9][16] = true;
  // caixotes
  tiles[10][14] = 61; coll[10][14] = true;
  tiles[10][15] = 61; coll[10][15] = true;
  tiles[10][16] = 61; coll[10][16] = true;
  // barril
  tiles[9][14] = 62; coll[9][14] = true;

  // Portas
  wall[7][0] = 10; coll[7][0] = true;   // → corredor
  wall[7][18] = 10; coll[7][18] = true;  // → calçada

  const objects = [
    { type:'door', x:0, y:7, targetMap:'corredor', targetX:11, targetY:5 },
    { type:'door', x:18, y:7, targetMap:'calcada', targetX:2, targetY:3 },
    { type:'note', x:5, y:4, noteId:'peu_bilhete', read:false },
    { type:'puzzle', x:15, y:10, puzzleId:'cadeado_joao', solved:false },
    { type:'shiva_event', x:7, y:8, eventId:'rabo_porta', triggered:false },
  ];

  window.MAP_DATA_sala = makeMapData('sala', 'Sala', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.25, playerStart:{ x:5*16, y:9*16 }
  });
})();

/* ================================================================
   MAPA 04 — CALÇADA (Sidewalk)
   Fachada, poste, bancos, arbustos, lixeira, placa, floreira
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 20; x++) {
      if (y < 2) tiles[y][x] = 4;        // grama
      else if (y < 6) tiles[y][x] = 2;   // calçada
      else if (y < 11) tiles[y][x] = 3;  // asfalto
      else tiles[y][x] = 4;              // grama
    }

  // fachada da casa
  for (let x = 0; x <= 4; x++) {
    if (x === 2) { wall[2][2] = 10; coll[2][2] = true; }
    else { wall[2][x] = 5; coll[2][x] = true; }
  }

  // poste de luz
  wall[4][13] = 8; coll[4][13] = true;

  // banco na calçada
  tiles[4][9] = 38; tiles[4][10] = 38; coll[4][9] = true; coll[4][10] = true;

  // floreiras na grama
  tiles[1][2] = 68;
  tiles[1][6] = 68;
  tiles[1][14] = 68;
  tiles[13][3] = 68;
  tiles[13][10] = 68;

  // arbustos
  tiles[1][8] = 27; tiles[1][16] = 27;
  tiles[12][6] = 27; tiles[12][15] = 27;

  // placa de rua
  wall[2][6] = 40;

  // lixeira
  tiles[4][7] = 32; coll[4][7] = true;

  // cerca viva (hedge) no jardim
  wall[12][8] = 49; wall[12][9] = 49; wall[12][10] = 49;

  const objects = [
    { type:'door', x:2, y:2, targetMap:'sala', targetX:17, targetY:7 },
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
   MAPA 05 — RUA (Street)
   Postes, bancos, bueiros, semáforo, muros, arbustos, placas
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 20; x++) {
      if (y < 2 || y >= 13) tiles[y][x] = 4;
      else if (y < 5 || y >= 10) tiles[y][x] = 2;
      else tiles[y][x] = 3;
    }

  // postes de luz
  [[3,4],[10,4],[17,4],[3,11],[10,11],[17,11]].forEach(([px, py]) => {
    wall[py][px] = 8; coll[py][px] = true;
  });

  // bancos
  tiles[4][7] = 38; tiles[4][8] = 38; coll[4][7] = true; coll[4][8] = true;
  tiles[10][12] = 38; tiles[10][13] = 38; coll[10][12] = true; coll[10][13] = true;

  // bueiros
  tiles[6][5] = 69;
  tiles[7][12] = 69;
  tiles[8][8] = 69;

  // semáforo
  wall[4][15] = 70; coll[4][15] = true;
  wall[10][5] = 70; coll[10][5] = true;

  // arbustos
  tiles[1][5] = 27; tiles[1][13] = 27;
  tiles[13][6] = 27; tiles[13][14] = 27;

  // placas
  wall[2][12] = 40;

  // muros/fachadas
  for (let x = 0; x < 3; x++) { wall[2][x] = 5; coll[2][x] = true; }
  for (let x = 7; x < 10; x++) { wall[2][x] = 5; coll[2][x] = true; }
  for (let x = 14; x < 17; x++) { wall[2][x] = 5; coll[2][x] = true; }
  for (let x = 4; x < 7; x++) { wall[12][x] = 5; coll[12][x] = true; }
  for (let x = 11; x < 14; x++) { wall[12][x] = 5; coll[12][x] = true; }

  // lixeiras
  tiles[4][3] = 32; coll[4][3] = true;
  tiles[10][16] = 32; coll[10][16] = true;

  // cerca viva
  wall[2][4] = 49; wall[2][5] = 49; wall[2][6] = 49;

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
   MAPA 06 — PORTÃO (Gate)
   Gradil, postes, arbustos, floreiras, placa, hedge
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

  // gradil lateral
  for (let y = 2; y < 13; y++) {
    if (y === 7) continue;
    wall[y][9] = 6; coll[y][9] = true;
  }
  wall[7][9] = 7; coll[7][9] = true; // portão

  // postes de luz
  wall[4][4] = 8; coll[4][4] = true;
  wall[10][14] = 72; coll[10][14] = true;

  // hedge (cerca viva)
  for (let y = 2; y < 7; y++) { wall[y][3] = 49; coll[y][3] = true; }
  for (let y = 8; y < 13; y++) { wall[y][15] = 49; coll[y][15] = true; }

  // floreiras
  tiles[1][5] = 68;
  tiles[1][12] = 68;
  tiles[13][6] = 68;

  // arbustos
  tiles[1][8] = 27; tiles[13][11] = 27;
  tiles[2][1] = 60; tiles[12][17] = 60;

  // placa
  wall[2][14] = 40;

  // banco
  tiles[4][13] = 38; tiles[4][14] = 38; coll[4][13] = true; coll[4][14] = true;

  // árvores
  wall[12][4] = 9; coll[12][4] = true;
  wall[2][17] = 9; coll[2][17] = true;

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
   MAPA 07 — PRAÇA (Square)
   Playground, bancos, postes, floreiras, árvores, bebedouro, fonte
   ================================================================ */
(function() {
  const tiles = makeGrid(4);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminhos (cruz)
  for (let y = 4; y < 11; y++)
    for (let x = 7; x < 13; x++)
      tiles[y][x] = 2;
  for (let y = 6; y < 9; y++)
    for (let x = 4; x < 7; x++)
      tiles[y][x] = 2;
  for (let y = 6; y < 9; y++)
    for (let x = 13; x < 16; x++)
      tiles[y][x] = 2;

  // playground cercado
  for (let y = 2; y < 6; y++)
    for (let x = 14; x < 18; x++) {
      tiles[y][x] = 2;
      if (y === 2 || y === 5 || x === 14 || x === 17)
        { wall[y][x] = 6; coll[y][x] = true; }
    }
  tiles[3][15] = 34; tiles[3][16] = 34; coll[3][15] = true; coll[3][16] = true;
  wall[4][14] = 0; coll[4][14] = false; // entrada

  // fonte
  tiles[7][10] = 39; coll[7][10] = true;

  // postes de luz do parque
  [[3,2],[8,3],[8,17],[12,5],[11,11],[6,1],[6,18]].forEach(([ax, ay]) => {
    wall[ay][ax] = 72; coll[ay][ax] = true;
  });

  // árvores
  [[4,8],[2,12],[12,8],[5,2],[5,17],[9,17]].forEach(([ax, ay]) => {
    wall[ay][ax] = 9; coll[ay][ax] = true;
  });

  // bancos
  tiles[5][10] = 38; tiles[5][11] = 38; coll[5][10] = true; coll[5][11] = true;
  tiles[9][5] = 38; tiles[9][6] = 38; coll[9][5] = true; coll[9][6] = true;
  tiles[4][12] = 38; tiles[4][13] = 38; coll[4][12] = true; coll[4][13] = true;

  // floreiras
  tiles[3][7] = 68;
  tiles[12][10] = 68;
  tiles[8][4] = 68;
  tiles[8][16] = 68;

  // bebedouro / chafariz
  tiles[10][10] = 39; coll[10][10] = true;

  // placa
  wall[7][15] = 40;

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
   MAPA 08 — BECO (Alley)
   Caixotes, barris, lixeiras, bueiro, poste, contêiner, hedge
   ================================================================ */
(function() {
  const tiles = makeGrid(2);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // paredes laterais
  for (let x = 0; x < 20; x++) {
    wall[1][x] = 5; coll[1][x] = true;
    wall[13][x] = 5; coll[13][x] = true;
  }

  // caixotes empilhados
  [[4,4],[6,9],[14,4],[16,9],[3,12]].forEach(([lx, ly]) => {
    wall[ly][lx] = 17; coll[ly][lx] = true;
  });

  // barris
  [[7,6],[11,10],[5,15]].forEach(([bx, by]) => {
    tiles[by][bx] = 62; coll[by][bx] = true;
  });

  // lixeiras
  tiles[6][7] = 32; coll[6][7] = true;
  tiles[10][11] = 32; coll[10][11] = true;

  // bueiro
  tiles[8][5] = 69;

  // poste
  wall[3][8] = 8; coll[3][8] = true;

  // contêiner de lixo grande (canto)
  wall[10][3] = 17; wall[11][3] = 17; coll[10][3] = true; coll[11][3] = true;

  // caixa grande
  tiles[4][15] = 61; coll[4][15] = true;

  // placa
  wall[1][15] = 40;

  // hedge no topo do muro
  wall[1][3] = 49; wall[1][7] = 49; wall[1][11] = 49;

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
   MAPA 09 — IGREJA (Church)
   Altar, púlpito, bancos, castiçais, velas, vitrais, candelabro
   ================================================================ */
(function() {
  const tiles = makeGrid(1);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // paredes
  for (let y = 2; y < 13; y++) {
    wall[y][1] = 5; coll[y][1] = true;
    wall[y][18] = 5; coll[y][18] = true;
  }
  for (let x = 1; x < 19; x++) {
    wall[2][x] = 5; coll[2][x] = true;
    wall[12][x] = 5; coll[12][x] = true;
  }

  // altar (centro, fundo)
  tiles[4][9] = 35; tiles[4][10] = 35; coll[4][9] = true; coll[4][10] = true;
  // cruz na parede atrás do altar
  wall[3][9] = 36; wall[3][10] = 36;
  // candelabro ao lado do altar
  tiles[5][8] = 67; tiles[5][11] = 67; coll[5][8] = true; coll[5][11] = true;
  // velas nos cantos do altar
  tiles[5][7] = 37; tiles[5][12] = 37; coll[5][7] = true; coll[5][12] = true;

  // púlpito
  tiles[7][10] = 71; coll[7][10] = true;

  // bancos (2 fileiras de 2 tiles cada lado)
  tiles[6][4] = 16; tiles[6][5] = 16; coll[6][4] = true; coll[6][5] = true;
  tiles[8][4] = 16; tiles[8][5] = 16; coll[8][4] = true; coll[8][5] = true;
  tiles[6][14] = 16; tiles[6][15] = 16; coll[6][14] = true; coll[6][15] = true;
  tiles[8][14] = 16; tiles[8][15] = 16; coll[8][14] = true; coll[8][15] = true;

  // castiçais de pé
  tiles[5][3] = 37; tiles[5][16] = 37; coll[5][3] = true; coll[5][16] = true;
  tiles[9][3] = 37; tiles[9][16] = 37; coll[9][3] = true; coll[9][16] = true;

  // vitrais nas paredes laterais
  wall[5][1] = 26; wall[7][1] = 26;
  wall[5][18] = 26; wall[7][18] = 26;

  // cortinas
  wall[2][3] = 31; wall[2][16] = 31;

  // portas
  wall[9][1] = 10; coll[9][1] = true;
  wall[9][18] = 10; coll[9][18] = true;
  wall[3][10] = 10; coll[3][10] = true;

  const objects = [
    { type:'puzzle', x:10, y:6, puzzleId:'velas_elaine', solved:false },
    { type:'door', x:1, y:9, targetMap:'beco', targetX:18, targetY:7 },
    { type:'door', x:18, y:9, targetMap:'beco', targetX:1, targetY:7 },
    { type:'door', x:10, y:3, targetMap:'cemiterio', targetX:10, targetY:2 },
  ];

  window.MAP_DATA_igreja = makeMapData('igreja', 'Igreja', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.35, playerStart:{ x:5*16, y:10*16 }
  });
})();

/* ================================================================
   MAPA 10 — CEMITÉRIO (Cemetery)
   Lápides, cruzes, velas, muros, árvores, floreiras, portão
   ================================================================ */
(function() {
  const tiles = makeGrid(4);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminho central de paralelepípedos (tile 50)
  for (let y = 2; y < 13; y++)
    for (let x = 7; x < 13; x++)
      tiles[y][x] = 50;

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
  [[3,3],[3,6],[3,10],[3,14],[6,4],[6,7],[6,11],[6,14],
   [9,3],[9,7],[9,11],[9,14]].forEach(([ly, lx]) => {
    wall[ly][lx] = 8; coll[ly][lx] = true;
  });

  // cruzes entre as lápides
  [[4,5],[4,12],[7,5],[7,12],[10,5],[10,12]].forEach(([cy, cx]) => {
    wall[cy][cx] = 36; coll[cy][cx] = true;
  });

  // velas em lápides
  tiles[3][14] = 37; tiles[6][11] = 37; tiles[9][7] = 37;
  coll[3][14] = true; coll[6][11] = true; coll[9][7] = true;

  // floreiras nos túmulos
  tiles[4][6] = 68; tiles[7][10] = 68; tiles[10][3] = 68;

  // árvores
  [[1,1],[1,18],[13,1],[13,18],[2,8],[2,11],[11,4],[11,15]].forEach(([tx, ty]) => {
    wall[ty][tx] = 9; coll[ty][tx] = true;
  });

  // portões
  wall[7][0] = 10; coll[7][0] = true;
  wall[1][10] = 10; coll[1][10] = true;

  // postes de luz
  wall[4][10] = 72; coll[4][10] = true;
  wall[9][9] = 72; coll[9][9] = true;

  const objects = [
    { type:'puzzle', x:10, y:9, puzzleId:'lapides_giulia', solved:false },
    { type:'door', x:0, y:7, targetMap:'parque', targetX:10, targetY:7 },
    { type:'door', x:10, y:1, targetMap:'igreja', targetX:11, targetY:3 },
  ];

  window.MAP_DATA_cemiterio = makeMapData('cemiterio', 'Cemitério', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'rua', light:0.25, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 11 — PARQUE (Park — Final)
   Árvores, caminho, portal dourado, bancos, postes, floreiras
   ================================================================ */
(function() {
  const tiles = makeGrid(4);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminho
  for (let y = 3; y < 12; y++)
    for (let x = 7; x < 13; x++)
      tiles[y][x] = 50;

  // bancos
  tiles[10][5] = 38; tiles[10][6] = 38; coll[10][5] = true; coll[10][6] = true;
  tiles[4][5] = 38; tiles[4][6] = 38; coll[4][5] = true; coll[4][6] = true;

  // postes de luz do parque
  [[5,5],[5,14],[9,5],[9,14]].forEach(([px, py]) => {
    wall[py][px] = 72; coll[py][px] = true;
  });

  // floreiras
  tiles[3][8] = 68; tiles[12][10] = 68;
  tiles[7][4] = 68; tiles[7][15] = 68;

  // árvores (muitas)
  [[2,2],[2,8],[2,15],[5,2],[5,17],[9,2],[9,17],
   [12,2],[12,8],[12,15],[2,18],[6,5],[6,14],[8,4],[8,15]].forEach(([ax, ay]) => {
    wall[ay][ax] = 9; coll[ay][ax] = true;
  });

  // portal dourado
  wall[7][10] = 7; coll[7][10] = true;
  wall[7][9] = 7; coll[7][9] = true;
  tiles[7][10] = 50; tiles[7][9] = 50;

  // portão de entrada
  wall[7][0] = 10; coll[7][0] = true;

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
