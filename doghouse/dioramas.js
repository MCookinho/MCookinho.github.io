const DIORAMAS = {
  corridor_1:{
    id:'corridor_1',name:'CORREDOR — ENTRADA',day:7,
    connections:{north:'cellar',south:null,east:null,west:null},
    description:'Um corredor estreito de pedra. O teto é baixo. Lampadas fracas pingam luz amarela. Há uma porta de ferro enferrujada à sua frente.',
    objects:[
      {id:'door_front',name:'PORTÃO DE FERRO',type:'locked',puzzle:'gate',target:'cellar',desc:'Portão maciço com três fechaduras. Símbolos estranhos estão gravados ao redor.',lookIndex:0},
      {id:'lamp_c1',name:'LÂMPADA',type:'decor',desc:'Uma lâmpada solitária. Ela oscila levemente, mesmo sem vento.',lookIndex:1},
      {id:'wall_c1',name:'PAREDE',type:'decor',desc:'Pedra úmida. Algo foi escrito aqui: "O passeio começa onde a luz termina."',lookIndex:2},
      {id:'ground_c1',name:'CHÃO',type:'decor',desc:'Terra batida. Pegadas recentes levam até o portão.',lookIndex:3},
    ]
  },
  cellar:{
    id:'cellar',name:'CELA 1 — O PORÃO',day:7,
    connections:{south:'corridor_1',north:'corridor_2',east:null,west:null},
    description:'O porão. A água goteja das paredes. O silêncio é pesado. Algo se move na superfície do poço.',
    objects:[
      {id:'well',name:'POÇO',type:'puzzle',puzzle:'cellar_well',desc:'Poço escuro. A água reflete uma luz que não existe.',lookIndex:4,onUse:false},
      {id:'wall_cellar',name:'PAREDE',type:'examine',desc:'Parede coberta de musgo.',lookIndex:5,onExamine:'cellar_note'},
      {id:'chain_cellar',name:'CORRENTE',type:'item',gives:'cellar_key',desc:'Corrente grossa. Uma chave está pendurada na ponta.',lookIndex:6},
      {id:'vent_cellar',name:'VENTILAÇÃO',type:'puzzle',puzzle:'cellar_vent',desc:'Grade de ventilação. Algo brilha atrás das barras.',lookIndex:7,onUse:false},
      {id:'water_cellar',name:'ÁGUA',type:'decor',desc:'A água do poço. Você vê seu reflexo? Não. Você vê Shiva.',lookIndex:8},
      {id:'door_cellar_out',name:'SUBIR',type:'exit',target:'corridor_2',desc:'Escadas de pedra.',lookIndex:9},
      {id:'door_cellar_back',name:'VOLTAR',type:'exit',target:'corridor_1',desc:'Voltar ao corredor de entrada.',lookIndex:9},
    ]
  },
  corridor_2:{
    id:'corridor_2',name:'CORREDOR — COZINHA',day:7,
    connections:{south:'cellar',north:'kitchen',east:null,west:null},
    description:'Um patamar. O cheiro de gordura velha vem de cima. Degraus de madeira rangem sob seus pés.',
    objects:[
      {id:'door_c2_back',name:'VOLTAR',type:'exit',target:'cellar',desc:'Escadas descendo.',lookIndex:10},
      {id:'door_c2',name:'PORTA DA COZINHA',type:'exit',target:'kitchen',desc:'Porta de madeira manchada de gordura.',lookIndex:10},
      {id:'step_c2',name:'DEGRAUS',type:'decor',desc:'Madeira podre. Alguns degraus parecem ceder.',lookIndex:11},
      {id:'window_c2',name:'JANELA',type:'decor',desc:'Janela alta. Lá fora, só escuridão. Mas algo passa voando.',lookIndex:12},
    ]
  },
  kitchen:{
    id:'kitchen',name:'CELA 2 — A COZINHA',day:7,
    connections:{south:'corridor_2',north:'corridor_3',east:'pantry',west:null},
    description:'A cozinha. Panelas velhas pendem do teto. O fogão está frio. Um rádio chia baixinho.',
    objects:[
      {id:'stove',name:'FOGÃO',type:'puzzle',puzzle:'kitchen_stove',desc:'Fogão a lenha. As cinzas estão frias.',lookIndex:13,onUse:false},
      {id:'radio',name:'RÁDIO',type:'puzzle',puzzle:'kitchen_radio',desc:'Rádio antigo. O dial está na frequência errada.',lookIndex:14,onUse:false},
      {id:'cabinet_kitchen',name:'ARMÁRIO',type:'examine',desc:'Armário rangendo.',lookIndex:15,onExamine:'kitchen_note'},
      {id:'sink',name:'PIA',type:'puzzle',puzzle:'kitchen_sink',desc:'Pia de ferro. A água pinga sem parar. O som parece formar um padrão.',lookIndex:16,onUse:false},
      {id:'knife',name:'FACA',type:'item',gives:'wax',desc:'Faca cravada na tábua. Tem cera grudada no cabo.',lookIndex:17},
      {id:'door_kitchen_back',name:'VOLTAR',type:'exit',target:'corridor_2',desc:'Voltar ao patamar.',lookIndex:18},
      {id:'door_kitchen',name:'SAÍDA',type:'exit',target:'corridor_3',desc:'Porta enferrujada.',lookIndex:18},
      {id:'pantry_door',name:'DESPENSA',type:'exit',target:'pantry',desc:'Porta da despensa. Está entreaberta.',lookIndex:19},
    ]
  },
  pantry:{
    id:'pantry',name:'DESPENSA',day:7,
    connections:{east:'kitchen',west:null,north:null,south:null},
    description:'Despensa estreita. Prateleiras empoeiradas. Um cheiro de comida estragada e terra molhada.',
    objects:[
      {id:'shelf',name:'PRATELEIRA',type:'examine',desc:'Potes vazios e um pano sujo.',lookIndex:20,onExamine:'pantry_find'},
      {id:'box',name:'CAIXA',type:'item',gives:'match',desc:'Caixa de madeira. Range quando você mexe.',lookIndex:21},
      {id:'jar',name:'POTE',type:'decor',desc:'Pote de vidro com um líquido escuro. Algo se mexe dentro.',lookIndex:22},
      {id:'back_door',name:'VOLTAR',type:'exit',target:'kitchen',desc:'Voltar para a cozinha.',lookIndex:23},
    ]
  },
  corridor_3:{
    id:'corridor_3',name:'CORREDOR — CAPELA',day:7,
    connections:{south:'kitchen',north:'church',east:null,west:null},
    description:'O corredor se estreita. O ar fica mais frio. Um murmúrio distante — como uma oração — ecoa das paredes.',
    objects:[
      {id:'door_c3_back',name:'VOLTAR',type:'exit',target:'kitchen',desc:'Voltar à cozinha.',lookIndex:24},
      {id:'door_c3',name:'PORTA DA CAPELA',type:'exit',target:'church',desc:'Porta de madeira escura. Uma cruz está entalhada.',lookIndex:24},
      {id:'bell_c3',name:'SINO',type:'item',gives:'bell',desc:'Sino pequeno caído no chão. Você pega.',lookIndex:25},
      {id:'candle_c3',name:'VELA',type:'item',gives:'candle',desc:'Vela largada no canto. Ainda serve.',lookIndex:26},
    ]
  },
  church:{
    id:'church',name:'CELA 3 — A CAPELA',day:7,
    connections:{south:'corridor_3',north:'corridor_4',east:null,west:null},
    description:'A capela. O teto é alto demais para o espaço. O silêncio é absoluto. Três cabeças de cão esculpidas olham do altar.',
    objects:[
      {id:'altar',name:'ALTAR',type:'puzzle',puzzle:'church_altar',desc:'Altar de pedra. Três cavidades circulares esperam oferendas.',lookIndex:27,onUse:false},
      {id:'statue',name:'ESTÁTUA',type:'examine',desc:'Cão de três cabeças. Uma inscrição: "Dê a cada cabeça o que ela deseja."',lookIndex:28,onExamine:'church_note'},
      {id:'pew',name:'BANCO',type:'item',gives:'feather',desc:'Banco de madeira rachado. Uma pena preta está sobre ele.',lookIndex:29},
      {id:'window_church',name:'VITRAL',type:'decor',desc:'Vitral quebrado. A luz forma um símbolo no chão.',lookIndex:30},
      {id:'door_church_back',name:'VOLTAR',type:'exit',target:'corridor_3',desc:'Voltar ao corredor.',lookIndex:31},
      {id:'door_church',name:'SAÍDA',type:'exit',target:'corridor_4',desc:'Porta dos fundos da capela.',lookIndex:31},
    ]
  },
  corridor_4:{
    id:'corridor_4',name:'CORREDOR — CEMITÉRIO',day:7,
    connections:{south:'church',north:'graveyard',east:null,west:null},
    description:'O corredor termina em uma porta de ferro. Lá fora, o vento uiva. O chão é de terra batida.',
    objects:[
      {id:'door_c4_back',name:'VOLTAR',type:'exit',target:'church',desc:'Voltar à capela.',lookIndex:32},
      {id:'door_c4',name:'PORTÃO DO CEMITÉRIO',type:'exit',target:'graveyard',desc:'Portão de ferro com uma caveira entalhada.',lookIndex:32},
      {id:'wind_c4',name:'CORRENTE DE AR',type:'decor',desc:'Um vento frio passa por você. Traz cheiro de terra molhada.',lookIndex:33},
    ]
  },
  graveyard:{
    id:'graveyard',name:'CELA 4 — O CEMITÉRIO',day:7,
    connections:{south:'corridor_4',north:'corridor_5',east:null,west:null},
    description:'O cemitério. Seis túmulos em fileira. Uma árvore seca no centro. O céu está coberto de nuvens que parecem ter formas humanas.',
    objects:[
      {id:'grave1',name:'TÚMULO 1',type:'puzzle',puzzle:'graveyard_1',desc:'"Aqui jaz a memória."',lookIndex:34,onUse:false},
      {id:'grave2',name:'TÚMULO 2',type:'puzzle',puzzle:'graveyard_2',desc:'"Aqui jaz o tempo."',lookIndex:35,onUse:false},
      {id:'grave3',name:'TÚMULO 3',type:'puzzle',puzzle:'graveyard_3',desc:'"Aqui jaz o nome."',lookIndex:36,onUse:false},
      {id:'grave4',name:'TÚMULO 4',type:'puzzle',puzzle:'graveyard_4',desc:'"Aqui jaz o medo."',lookIndex:37,onUse:false},
      {id:'grave5',name:'TÚMULO 5',type:'puzzle',puzzle:'graveyard_5',desc:'"Aqui jaz o desejo."',lookIndex:38,onUse:false},
      {id:'grave6',name:'TÚMULO 6',type:'examine',desc:'Túmulo sem inscrição.',lookIndex:39,onExamine:'graveyard_note'},
      {id:'tree',name:'ÁRVORE',type:'decor',desc:'Árvore seca. Os galhos parecem dedos. Um corvo pousa no mais alto.',lookIndex:40},
      {id:'fence',name:'CERCA',type:'item',gives:'graveyard_key',desc:'Cerca de ferro. Uma chave está pendurada em um dos ganchos.',lookIndex:41},
      {id:'door_graveyard_back',name:'VOLTAR',type:'exit',target:'corridor_4',desc:'Voltar ao portão de ferro.',lookIndex:42},
      {id:'door_graveyard',name:'SAÍDA',type:'exit',target:'corridor_5',desc:'Portal de pedra.',lookIndex:42},
    ]
  },
  corridor_5:{
    id:'corridor_5',name:'CORREDOR — SALÃO',day:7,
    connections:{south:'graveyard',north:'mansion',east:null,west:null},
    description:'O corredor fica mais largo. O chão é de mármore rachado. Lustres quebrados pendem do teto. Já houve riqueza aqui.',
    objects:[
      {id:'door_c5_back',name:'VOLTAR',type:'exit',target:'graveyard',desc:'Voltar ao cemitério.',lookIndex:43},
      {id:'door_c5',name:'PORTA DO SALÃO',type:'exit',target:'mansion',desc:'Porta dupla de madeira entalhada.',lookIndex:43},
      {id:'chandelier',name:'LUSTRE',type:'decor',desc:'Lustre caído. Os cristais brilham mesmo na escuridão.',lookIndex:44},
      {id:'rug',name:'TAPETE',type:'item',gives:'ribbon',desc:'Tapete vermelho puído. Uma fita está presa na franja.',lookIndex:45},
    ]
  },
  mansion:{
    id:'mansion',name:'CELA 5 — O SALÃO',day:7,
    connections:{south:'corridor_5',north:'corridor_6',east:'library',west:null},
    description:'O salão. Um espelho enorme domina a parede. Seu reflexo não se move quando você se move. Retratos de olhos seguem você.',
    objects:[
      {id:'mirror',name:'ESPELHO',type:'puzzle',puzzle:'mansion_mirror',desc:'Espelho enorme. Seu reflexo está atrasado — como se fosse de alguns segundos atrás.',lookIndex:46,onUse:false},
      {id:'portrait',name:'RETRATO',type:'examine',desc:'Retrato de família. Três pessoas, três cães. Os olhos foram arrancados da tela.',lookIndex:47,onExamine:'mansion_note'},
      {id:'cabinet_mansion',name:'ARMÁRIO',type:'puzzle',puzzle:'mansion_cabinet',desc:'Armário de gavetas. Todas trancadas. Uma fechadura de combinação.',lookIndex:48,onUse:false},
      {id:'clock_mansion',name:'RELÓGIO',type:'puzzle',puzzle:'mansion_clock',desc:'Relógio de pêndulo parado. O pêndulo está solto.',lookIndex:49,onUse:false},
      {id:'lamp_mansion',name:'ABAJUR',type:'item',gives:'mansion_key',desc:'Abajur de pé. A luz azulada revela uma chave na base.',lookIndex:50},
      {id:'door_mansion_back',name:'VOLTAR',type:'exit',target:'corridor_5',desc:'Voltar ao corredor do salão.',lookIndex:51},
      {id:'door_mansion',name:'SAÍDA',type:'exit',target:'corridor_6',desc:'Escada que sobe.',lookIndex:51},
      {id:'library_door',name:'BIBLIOTECA',type:'exit',target:'library',desc:'Porta da biblioteca.',lookIndex:52},
    ]
  },
  library:{
    id:'library',name:'BIBLIOTECA',day:7,
    connections:{west:'mansion',east:null,north:null,south:null},
    description:'A biblioteca. Estantes altas cobertas de livros empoeirados. O cheiro de papel velho e solidão.',
    objects:[
      {id:'bookshelf',name:'ESTANTE',type:'puzzle',puzzle:'library_shelf',desc:'Estante alta. Os livros estão fora de ordem. Uma sequência de cores nas lombadas.',lookIndex:53,onUse:false},
      {id:'desk',name:'ESCRIVANINHA',type:'item',gives:'shard',desc:'Escrivania de carvalho. Um caco de espelho está na gaveta.',lookIndex:54},
      {id:'book',name:'LIVRO ABERTO',type:'examine',desc:'"Cérbero: guardião do subumano. Três cabeças: ciúme, vigilância, punição. Sua filha, Shiva, herdou o dever."',lookIndex:55},
      {id:'door_library',name:'SAÍDA',type:'exit',target:'mansion',desc:'Voltar ao salão.',lookIndex:56},
    ]
  },
  corridor_6:{
    id:'corridor_6',name:'CORREDOR — TORRE',day:8,
    connections:{south:'mansion',north:'tower',east:null,west:null},
    description:'A escada em espiral. Cada degrau range. O ar fica mais rarefeito. Uma presença pesada vem do topo.',
    objects:[
      {id:'door_c6_back',name:'VOLTAR',type:'exit',target:'mansion',desc:'Escada descendo.',lookIndex:57},
      {id:'door_c6',name:'PORTA DA TORRE',type:'exit',target:'tower',desc:'Porta forrada de veludo.',lookIndex:57},
      {id:'mirror_c6',name:'ESPELHO PAREDE',type:'examine',desc:'Pequeno espelho na parede. Você está diferente. Mais magro. Mais velho.',lookIndex:58,onExamine:'memory_1'},
      {id:'symbol_c6',name:'INSÍGNIA',type:'decor',desc:'Símbolo gravado: um olho dentro de uma pirâmide.',lookIndex:59},
    ]
  },
  tower:{
    id:'tower',name:'CELA 6 — A TORRE',day:8,
    connections:{south:'corridor_6',north:'tunnel',east:null,west:null},
    description:'O quarto de Shiva. Uma cama com dossel. Um santuário. A presença dela está em toda parte. O olho no meio da testa dela brilha.',
    objects:[
      {id:'shrine',name:'SANTUÁRIO',type:'puzzle',puzzle:'tower_shrine',desc:'Santuário com velas. Seis velas, seis memórias. Acenda na ordem certa.',lookIndex:60,onUse:false},
      {id:'bed_tower',name:'CAMA',type:'examine',desc:'A cama ainda está quente. Você não está sozinho neste quarto.',lookIndex:61,onExamine:'tower_note'},
      {id:'window_tower',name:'JANELA',type:'decor',desc:'A janela mostra o céu. O céu está cheio de olhos. Todos olham para você.',lookIndex:62},
      {id:'door_tower_back',name:'VOLTAR',type:'exit',target:'corridor_6',desc:'Escada descendo.',lookIndex:63},
      {id:'door_tower',name:'PORTA DO TÚNEL',type:'exit',target:'tunnel',desc:'Porta baixa atrás do santuário.',lookIndex:63},
      {id:'tower_candle',name:'VELA NO CHÃO',type:'item',gives:'lantern',desc:'Vela caída perto da porta. A chama ainda está acesa.',lookIndex:64},
    ]
  },
  tunnel:{
    id:'tunnel',name:'O TÚNEL',day:8,
    connections:{south:'tower',north:'end',east:null,west:null},
    description:'O túnel final. As paredes pulsar. O ar está carregado. Shiva está aqui — em toda parte.',
    objects:[
      {id:'altar_tunnel',name:'ALTAR FINAL',type:'puzzle',puzzle:'final_altar',desc:'Altar de três cavidades. Três oferendas para três cabeças.',lookIndex:65,onUse:false},
      {id:'chain_tunnel',name:'CORRENTE',type:'decor',desc:'A corrente que te prendeu. Ela está quebrada.',lookIndex:66},
      {id:'wall_tunnel',name:'PAREDE VIVA',type:'decor',desc:'A parede respira. Veias pulsantes correm pela pedra.',lookIndex:67},
      {id:'eye_tunnel',name:'O OLHO',type:'examine',desc:'O olho de Shiva. Ela está em toda parte. Ela vê tudo.',lookIndex:68,onExamine:'final_eye'},
      {id:'light_tunnel',name:'A LUZ',type:'decor',desc:'Lá longe. A saída.',lookIndex:69},
    ]
  }
}

const DIORAMA_ORDER = [
  'corridor_1','cellar','corridor_2','kitchen','pantry',
  'corridor_3','church','corridor_4','graveyard',
  'corridor_5','mansion','library','corridor_6','tower','tunnel'
]
