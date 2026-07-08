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
   Cama, criado-mudo, escrivaninha, guarda-roupa, tapete, brinquedos
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

  // cama (2 tiles) contra a parede inferior (canto inferior esquerdo)
  tiles[11][3] = 14; tiles[11][4] = 14; coll[11][3] = true; coll[11][4] = true;
  // criado-mudo ao lado direito da cama
  tiles[11][5] = 45; coll[11][5] = true;
  // abajur sobre o criado-mudo
  tiles[10][5] = 29; coll[10][5] = true;
  // guarda-roupa (2 tiles altura) na parede esquerda
  tiles[3][2] = 24; tiles[4][2] = 24; coll[3][2] = true; coll[4][2] = true;
  // escrivaninha (2 tiles) na parede direita
  tiles[4][15] = 15; tiles[4][16] = 15; coll[4][15] = true; coll[4][16] = true;
  // cadeira da escrivaninha
  tiles[5][15] = 28; coll[5][15] = true;
  // tapete (2 tiles) no centro do quarto
  tiles[8][9] = 30; tiles[8][10] = 30;
  // brinquedos no canto inferior direito
  tiles[11][15] = 42;
  // quadro na parede acima da cama
  wall[2][9] = 26;
  // cortina na janela (canto superior esquerdo/direito)
  wall[2][2] = 31; wall[2][17] = 31;
  // porta para corredor (na parede direita)
  wall[7][18] = 10; coll[7][18] = true;

  const objects = [
    { type:'item', x:16, y:4, item:'lanterna', collected:false },
    { type:'door', x:18, y:7, targetMap:'corredor', targetX:1, targetY:7 },
  ];

  window.MAP_DATA_quarto = makeMapData('quarto', 'Quarto', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.2, playerStart:{ x:9*16, y:10*16 }
  });
})();

/* ================================================================
   MAPA 02 — CORREDOR (Hallway em L)
   Formato L: braço curto horizontal, braço longo vertical.
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // corredor horizontal (braço curto): y=7, x=0..9
  // corredor vertical (braço longo): x=10, y=2..11
  // formando um L

  // piso de madeira em todo o corredor
  for (let y = 2; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      // Horizontal: y=5..8, x=0..9  (4 tiles de altura)
      // Vertical: y=2..11, x=9..11  (3 tiles de largura)
      const inH = (y >= 5 && y <= 8 && x >= 0 && x <= 9);
      const inV = (y >= 2 && y <= 11 && x >= 9 && x <= 11);
      if (inH || inV) {
        tiles[y][x] = 1;
      }
    }
  }

  // paredes externas do L
  // parede superior horizontal
  for (let x = 0; x <= 9; x++) { wall[5][x] = 5; coll[5][x] = true; }
  // parede inferior horizontal
  for (let x = 0; x <= 9; x++) { wall[8][x] = 5; coll[8][x] = true; }
  // parede esquerda horizontal
  for (let y = 5; y <= 8; y++) { wall[y][0] = 5; coll[y][0] = true; }
  // parede direita horizontal (incluindo acima da porta)
  for (let y = 2; y <= 6; y++) { wall[y][9] = 5; coll[y][9] = true; }
  // parede inferior vertical
  for (let y = 8; y <= 11; y++) { wall[y][9] = 5; coll[y][9] = true; }
  // parede direita vertical
  for (let y = 2; y <= 11; y++) { wall[y][11] = 5; coll[y][11] = true; }
  // parede superior vertical
  for (let x = 9; x <= 11; x++) { wall[2][x] = 5; coll[2][x] = true; }
  // parede inferior vertical
  for (let x = 9; x <= 11; x++) { wall[11][x] = 5; coll[11][x] = true; }

  // portas
  wall[7][0] = 10; coll[7][0] = true;   // → quarto (esquerda)
  wall[7][9] = 10; coll[7][9] = true;   // → sala (direita do braço horizontal)
  wall[11][10] = 10; coll[11][10] = true; // fundo do vertical → (futuro, bloqueada)

  // vaso decorativo no chão (não bloqueia passagem)
  tiles[6][5] = 27;
  // quadro na parede
  wall[5][5] = 26;

  const objects = [
    { type:'door', x:0, y:7, targetMap:'quarto', targetX:17, targetY:7 },
    { type:'door', x:9, y:7, targetMap:'sala', targetX:1, targetY:7 },
    { type:'shiva_event', x:10, y:5, eventId:'silhueta_corredor', triggered:false },
  ];

  window.MAP_DATA_corredor = makeMapData('corredor', 'Corredor', {
    tiles, wall, collision: coll, objects, connections:[],
    ambient:'casa', light:0.15, playerStart:{ x:3*16, y:7*16 }
  });
})();

/* ================================================================
   MAPA 03 — SALA + GARAGEM (Living Room + Kitchen + Garage)
   Sala à esquerda (sofá, TV, estante), cozinha no centro,
   garagem/área de serviço à direita.
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // Espaço total amplo: x=0..18, y=2..12 (aberturas internas)

  // Sala (x=0..9, aberto): piso de madeira
  for (let y = 3; y <= 11; y++)
    for (let x = 0; x <= 9; x++)
      tiles[y][x] = 1;

  // Cozinha (x=7..13, aberto): piso de concreto/cerâmica (tile 2)
  for (let y = 3; y <= 11; y++)
    for (let x = 7; x <= 13; x++)
      tiles[y][x] = 2;

  // Garagem (x=13..18): piso de concreto (tile 2)
  for (let y = 3; y <= 11; y++)
    for (let x = 13; x <= 18; x++)
      tiles[y][x] = 2;

  // Paredes externas
  // Superior
  for (let x = 0; x <= 18; x++) { wall[3][x] = 5; coll[3][x] = true; }
  // Inferior
  for (let x = 0; x <= 18; x++) { wall[11][x] = 5; coll[11][x] = true; }
  // Esquerda
  for (let y = 3; y <= 11; y++) { wall[y][0] = 5; coll[y][0] = true; }
  // Direita (garagem)
  for (let y = 3; y <= 11; y++) { wall[y][18] = 5; coll[y][18] = true; }

  // Parede divisória sala/cozinha parcial (x=6, y=3..6)
  for (let y = 3; y <= 6; y++) { wall[y][6] = 5; coll[y][6] = true; }
  // Parede divisória cozinha/garagem parcial (x=13, y=3..11)
  for (let y = 3; y <= 6; y++) { wall[y][13] = 5; coll[y][13] = true; }
  for (let y = 9; y <= 11; y++) { wall[y][13] = 5; coll[y][13] = true; }
  // Abertura na cozinha/garagem (y=7..8, x=13 está aberto)

  // SALA — móveis contra paredes, circulação livre
  // SOFÁ (2 tiles) na parede esquerda
  tiles[5][2] = 18; tiles[5][3] = 18; coll[5][2] = true; coll[5][3] = true;
  // TV na parede da sala (entre sofá e divisória)
  tiles[5][5] = 19; coll[5][5] = true;
  // MESA DE CENTRO
  tiles[7][3] = 15; coll[7][3] = true;
  // CADEIRA
  tiles[7][4] = 28; coll[7][4] = true;
  // TAPETE (2 tiles)
  tiles[8][4] = 30; tiles[8][5] = 30;
  // QUADROS NA PAREDE
  wall[3][2] = 26;
  wall[3][5] = 26;
  // VASO
  tiles[10][3] = 27;

  // COZINHA — eletrodomésticos enfileirados na parede superior
  // MICROONDAS
  tiles[4][7] = 33; coll[4][7] = true;
  // FOGÃO (2 tiles)
  tiles[4][8] = 21; tiles[4][9] = 21; coll[4][8] = true; coll[4][9] = true;
  // FORNO
  tiles[4][10] = 46; coll[4][10] = true;
  // PIA
  tiles[4][11] = 22; coll[4][11] = true;
  // GELADEIRA
  tiles[4][12] = 20; coll[4][12] = true;
  // LIXEIRA
  tiles[8][12] = 32; coll[8][12] = true;
  // PLANTA
  tiles[10][12] = 27;

  // GARAGEM — área de serviço / estoque
  // MÁQUINA DE LAVAR
  tiles[5][16] = 43; coll[5][16] = true;
  // BANCADA (2 tiles)
  tiles[4][15] = 15; coll[4][15] = true;
  tiles[5][15] = 15; coll[5][15] = true;
  // ESTANTE (2 tiles) na parede direita
  tiles[8][16] = 25; tiles[9][16] = 25; coll[8][16] = true; coll[9][16] = true;
  // CAIXOTES
  tiles[10][15] = 17; coll[10][15] = true;
  tiles[10][16] = 17; coll[10][16] = true;

  // Portas
  wall[7][0] = 10; coll[7][0] = true;   // → corredor
  wall[7][18] = 10; coll[7][18] = true;  // → calçada

  const objects = [
    { type:'door', x:0, y:7, targetMap:'corredor', targetX:8, targetY:7 },
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
   MAPA 04 — CALÇADA (Sidewalk outside the house)
   Porta da casa, poste, arbustos, placa de rua, lixeira
   ================================================================ */
(function() {
  const tiles = makeGrid(0);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 20; x++) {
      if (y < 2) tiles[y][x] = 4;        // grama superior
      else if (y < 6) tiles[y][x] = 2;   // calçada
      else if (y < 11) tiles[y][x] = 3;  // asfalto
      else tiles[y][x] = 4;              // grama inferior
    }

  // fachada da casa (parede na divisa com o jardim)
  for (let x = 0; x < 5; x++) {
    if (x === 2) { wall[2][2] = 10; coll[2][2] = true; }
    else { wall[2][x] = 5; coll[2][x] = true; }
  }

  // poste de luz
  wall[4][13] = 8; coll[4][13] = true;

  // arbustos na grama
  tiles[1][3] = 27; tiles[1][8] = 27; tiles[1][15] = 27;
  tiles[12][3] = 27; tiles[12][10] = 27; tiles[12][16] = 27;

  // placa de rua
  wall[2][6] = 40;

  // lixeira na calçada
  tiles[4][7] = 32; coll[4][7] = true;

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
   Postes, muros, fachadas, puzzle radios_ulisses
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

  // arbustos na grama
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

  // lixeira
  tiles[4][7] = 32; coll[4][7] = true;
  tiles[10][14] = 32; coll[10][14] = true;

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
   Portão com grade que verifica chave_praca no inventário.
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

  // poste ao lado
  wall[4][4] = 8; coll[4][4] = true;

  // placa
  wall[2][14] = 40;

  // arbustos
  tiles[1][5] = 27; tiles[13][14] = 27;

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
   Playground cercado, bancos, bebedouro, árvores, puzzle desenhos_enzo
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

  // playground (cercado)
  for (let y = 2; y < 6; y++)
    for (let x = 14; x < 18; x++) {
      tiles[y][x] = 2;
      if (y === 2 || y === 5 || x === 14 || x === 17)
        { wall[y][x] = 6; coll[y][x] = true; }
    }
  // playground equipment
  tiles[3][15] = 34; coll[3][15] = true;
  tiles[3][16] = 34; coll[3][16] = true;
  // entrada do playground (abertura na cerca à esquerda)
  wall[4][14] = 0; coll[4][14] = false;

  // árvores
  [[3,2],[4,8],[2,12],[8,3],[8,17],[12,5],[11,11],[6,1],[6,18]].forEach(([ax, ay]) => {
    wall[ay][ax] = 9; coll[ay][ax] = true;
  });

  // bancos da praça
  tiles[5][10] = 38; tiles[5][11] = 38; coll[5][10] = true; coll[5][11] = true;
  tiles[9][5] = 38; tiles[9][6] = 38; coll[9][5] = true; coll[9][6] = true;
  tiles[4][12] = 38; tiles[4][13] = 38; coll[4][12] = true; coll[4][13] = true;

  // bebedouro
  tiles[8][10] = 39; coll[8][10] = true;

  // placas
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
   Caixotes, lixeiras, puzzle patas_sandalia, shiva event
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

  // caixotes
  [[4,4],[6,9],[14,4],[16,9],[3,12],[10,3],[15,12]].forEach(([lx, ly]) => {
    wall[ly][lx] = 17; coll[ly][lx] = true;
  });

  // lixeiras
  tiles[6][7] = 32; coll[6][7] = true;
  tiles[10][11] = 32; coll[10][11] = true;

  // poste
  wall[3][8] = 8; coll[3][8] = true;

  // contêiner de lixo grande (canto)
  wall[10][3] = 17; wall[11][3] = 17; coll[10][3] = true; coll[11][3] = true;

  // placa
  wall[1][15] = 40;

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
   Altar com cruz, bancos, castiçais, velas
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
  // cruz NA PAREDE atrás do altar
  wall[3][9] = 36; wall[3][10] = 36;
  // velas nos cantos do altar
  tiles[5][8] = 37; tiles[5][11] = 37; coll[5][8] = true; coll[5][11] = true;

  // bancos (pews, 2 fileiras de 2 tiles)
  tiles[6][4] = 16; tiles[6][5] = 16; coll[6][4] = true; coll[6][5] = true;
  tiles[8][4] = 16; tiles[8][5] = 16; coll[8][4] = true; coll[8][5] = true;
  tiles[6][14] = 16; tiles[6][15] = 16; coll[6][14] = true; coll[6][15] = true;
  tiles[8][14] = 16; tiles[8][15] = 16; coll[8][14] = true; coll[8][15] = true;

  // castiçais de pé (ao lado do altar)
  tiles[5][7] = 37; tiles[5][12] = 37; coll[5][7] = true; coll[5][12] = true;

  // vitrais nas paredes laterais
  wall[5][1] = 26; wall[7][1] = 26;
  wall[5][18] = 26; wall[7][18] = 26;

  // portas
  wall[9][1] = 10; coll[9][1] = true;   // entrada lateral (vinda do beco)
  wall[9][18] = 10; coll[9][18] = true;  // → beco (lado oposto)
  wall[3][10] = 10; coll[3][10] = true;   // → cemitério (atrás do altar)

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
   Lápides, cruzes, caminho central, muros de pedra
   ================================================================ */
(function() {
  const tiles = makeGrid(4);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminho central
  for (let y = 2; y < 13; y++)
    for (let x = 7; x < 13; x++)
      tiles[y][x] = 2;

  // muros de pedra
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

  // lápides (post/wall types)
  [[3,3],[3,6],[3,10],[3,14],[6,4],[6,7],[6,11],[6,14],[9,3],[9,7],[9,11],[9,14]].forEach(([ly, lx]) => {
    wall[ly][lx] = 8; coll[ly][lx] = true;
  });

  // cruzes de madeira entre as lápides
  [[4,5],[4,12],[7,5],[7,12],[10,5],[10,12]].forEach(([cy, cx]) => {
    wall[cy][cx] = 36; coll[cy][cx] = true;
  });

  // velas em algumas lápides
  tiles[3][14] = 37; tiles[6][11] = 37; tiles[9][7] = 37; coll[3][14] = true; coll[6][11] = true; coll[9][7] = true;

  // árvores nos cantos
  [[1,1],[1,18],[13,1],[13,18],[2,8],[2,11],[11,4],[11,15]].forEach(([tx, ty]) => {
    wall[ty][tx] = 9; coll[ty][tx] = true;
  });

  // portão (→ parque) e porta (→ igreja)
  wall[7][0] = 10; coll[7][0] = true;
  wall[1][10] = 10; coll[1][10] = true;

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
   Árvores, caminho, portal dourado, final do jogo
   ================================================================ */
(function() {
  const tiles = makeGrid(4);
  const wall = makeGrid(0);
  const coll = makeGrid(false);

  // caminho
  for (let y = 3; y < 12; y++)
    for (let x = 7; x < 13; x++)
      tiles[y][x] = 2;

  // banco do parque
  tiles[10][6] = 38; tiles[10][7] = 38; coll[10][6] = true; coll[10][7] = true;

  // árvores (muitas)
  [[2,2],[2,8],[2,15],[5,2],[5,17],[9,2],[9,17],[12,2],[12,8],[12,15],[2,18],[6,5],[6,14],[8,4],[8,15]].forEach(([ax, ay]) => {
    wall[ay][ax] = 9; coll[ay][ax] = true;
  });

  // portal dourado (centro)
  wall[7][10] = 7; coll[7][10] = true;
  wall[7][9] = 7; coll[7][9] = true;
  tiles[7][10] = 2; tiles[7][9] = 2;

  // portão de entrada (vindo do cemitério)
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
