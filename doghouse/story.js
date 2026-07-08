const STORY={
  intro:[
    'Você acorda em um quarto escuro. Não sabe seu nome. Não sabe quanto tempo passou. Só sabe que precisa sair.',
    'Há uma coleira no seu pescoço. O metal é frio. O nome gravado está gasto — ilegível.',
    'À sua frente, uma porta de aço com três fechaduras. Do outro lado, alguém — ou algo — respira.',
    'Você sente seis presenças. Seis consciências presas como você. Seis celas. Esse é o número do seu castigo.',
    'Shiva não fala. Shiva apenas observa. Filha de Cérbero — ciumenta, vigilante, punitiva. Você precisa provar seu valor.',
    'Para escapar, você precisa de seis chaves. Mas chaves não bastam. Precisa de proteção. Precisa de memória.',
    'Colete notas. Elas contêm os símbolos que você perdeu. Encontre proteção. E não deixe a lanterna apagar.',
    '— O Passeio está prestes a começar.'
  ],
  endings:{
    bone:{
      title:'O OSSO',
      text:[
        'Você escapou. As correntes se romperam. A porta cedeu.',
        'Mas você estava nu. Sem proteção. Sem memória.',
        'Shiva olha para você. Seu olhar não é de julgamento — é de piedade.',
        'Na sua mão, apenas um osso roído. Você é um animal de estimação. Sempre foi.',
        'No mundo lá fora, seus pulmões queimam. Você nunca foi feito para a liberdade.',
        'Você se arrasta de volta para a casinha. O osso range entre os dentes. A coleira está intacta.',
        'O Passeio acabou antes de começar.',
        'FINAL: O OSSO.'
      ]
    },
    collar:{
      title:'A COLEIRA',
      text:[
        'Você conseguiu as chaves. Conseguiu proteção.',
        'Mas faltava alguma coisa. As notas. A memória.',
        'Shiva te observa passar. Seus olhos dizem: "Você ainda não entendeu."',
        'Lá fora, o cemitério se estende até o horizonte. Você está livre?',
        'Você olha para baixo. A coleira ainda está lá. O nome ainda está gasto.',
        'Você nunca saberá quem era. A coleira é sua identidade agora.',
        'Você anda. As correntes arrastam atrás de você. Shiva observa do portão.',
        'Talvez no próximo passeio você lembre.',
        'FINAL: A COLEIRA.'
      ]
    },
    walk:{
      title:'O PASSEIO',
      text:[
        'Todas as portas se abrem. Seis chaves. Cinco proteções. Seis notas.',
        'Shiva se levanta. Pela primeira vez, algo muda em seu rosto.',
        'Ela não está brava. Ela está... satisfeita.',
        '"Você lembrou." A voz não sai da boca dela. Sai de dentro de você.',
        'O túnel se ilumina. Do outro lado, o mundo. O mundo real.',
        'Você tira a coleira. Ela cai na poeira.',
        'Antes de sair, você olha para trás. Shiva está de pé. Seis pares de olhos brilham na escuridão.',
        'Você acena. Ela não acena de volta. Mas um dos olhos — o olho do meio — parece piscar.',
        'Você sai. O ar é fresco. O céu está limpo.',
        'O Passeio finalmente começou.',
        'FINAL: O PASSEIO.'
      ]
    }
  },
  notes:{
    cellar:{
      title:'NOTA 1 — O PORÃO',
      text:'A primeira cela fica no ponto mais fundo. Onde a água acumula e as paredes suam. Procure no escuro, onde a luz não alcança. O primeiro símbolo está na umidade, na ferrugem, no silêncio. Toque a parede. Sinta a textura. O símbolo é uma curva que se morde — como uma cobra sem cabeça nem cauda.',
      symbol:'⦿'
    },
    kitchen:{
      title:'NOTA 2 — A COZINHA',
      text:'O fogo guarda segredos que a água não pode lavar. Não procure na panela. Não procure no armário. O fogo está apagado, mas a cinza ainda guarda a forma da chama. Sopre as cinzas. O símbolo aparece: três linhas que se encontram no centro, como pegadas de um pássaro que nunca pousou.',
      symbol:'⫸'
    },
    church:{
      title:'NOTA 3 — A CAPELA',
      text:'O tempo está enferrujado neste lugar. O sino não toca há décadas. Mas há uma ordem nas coisas, mesmo na decadência. O banco. O altar. A confissão. Três oferendas para três cabeças. Coloque cada coisa em seu lugar. O símbolo aparece na luz que passa pelo vitral quebrado: um triângulo que contém um círculo que contém nada.',
      symbol:'◈'
    },
    graveyard:{
      title:'NOTA 4 — O CEMITÉRIO',
      text:'Os mortos guardam o que os vivos esqueceram. Seis túmulos, seis nomes apagados. Um deles é seu. Como saber qual? Siga a ordem do sofrimento. O primeiro a chegar, o primeiro a partir. O símbolo está na terra fofa do túmulo mais novo: um "X" com uma linha atravessando — como ossos cruzados quebrados ao meio.',
      symbol:'⚔'
    },
    mansion:{
      title:'NOTA 5 — O SALÃO',
      text:'A vaidade é o pecado mais antigo. O espelho mostra o que você quer ver, não o que está lá. Desvie o olhar do seu reflexo. Olhe através. O que está atrás de você no reflexo não está atrás de você na realidade. O símbolo está gravado no caixilho do espelho: uma espiral que se desfaz em ondas.',
      symbol:'꩜'
    },
    tower:{
      title:'NOTA 6 — A TORRE',
      text:'O ponto mais alto. Shiva mora aqui. Não nos aposentos dela — no topo, onde o vento uiva e o céu toca o chão. Suba os degraus que não existem. Conte as batidas que você não ouve. O símbolo está no piso onde o círculo se fecha com o quadrado, onde o quadrado engole o triângulo: um olho dentro de outro olho.',
      symbol:'◎'
    }
  },
  descriptions:{
    cellar_door:'Uma porta enferrujada. Há uma fechadura estranha — símbolos em vez de dentes.',
    cellar_water:'Poço escuro. A superfície da água reflete algo... não é seu rosto.',
    cellar_wall:'Parede de pedra úmida. Uma inscrição está gravada aqui.',
    cellar_chain:'Corrente grossa presa na parede. A outra ponta desaparece na escuridão.',
    cellar_vent:'Uma ventilação estreita. Não dá para passar. Mas algo brilha lá dentro.',
    kitchen_stove:'Fogão antigo a lenha. Cinzas frias. Algo está enterrado nelas.',
    kitchen_cabinet:'Armário de madeira rangendo. Pratos empilhados, todos trincados.',
    kitchen_door:'Porta para a cela 2. A maçaneta está fria.',
    kitchen_sink:'Pia de ferro. A água nunca para de pingar. Toc... toc... toc...',
    kitchen_radio:'Rádio antigo. O dial está solto.',
    kitchen_knife:'Uma faca cravada na tábua. O cabo tem forma de osso.',
    church_altar:'Altar de pedra. Três marcas circulares — como se algo estivesse ali antes.',
    church_pew:'Banco rachado. Alguém gravou "Lembre-se" no encosto.',
    church_statue:'Estátua de um cão de três cabeças. Uma das cabeças está quebrada.',
    church_door:'Porta pesada de madeira. O som do outro lado é... respiração.',
    church_window:'Vitral quebrado. A luz forma padrões no chão.',
    church_offering:'Uma bandeja de oferendas vazia.',
    graveyard_fence:'Cercado de ferro. Os ganchos têm formato de dedos.',
    graveyard_door:'Portal do cemitério. Uma caveira está entalhada na chave.',
    graveyard_grave1:'Túmulo: "Aqui jaz a memória".',
    graveyard_grave2:'Túmulo: "Aqui jaz o tempo".',
    graveyard_grave3:'Túmulo: "Aqui jaz o nome".',
    graveyard_grave4:'Túmulo: "Aqui jaz o medo".',
    graveyard_grave5:'Túmulo: "Aqui jaz o desejo".',
    graveyard_grave6:'Túmulo sem inscrição.',
    graveyard_tree:'Árvore seca. Os galhos parecem braços.',
    mansion_door:'Porta do salão. Madeira escura com entalhes de videiras.',
    mansion_mirror:'Espelho enorme em moldura dourada. Seu reflexo está desfazado no tempo.',
    mansion_portrait:'Retrato de uma mulher com três cães. O rosto dela está raspado.',
    mansion_cabinet:'Armário com gavetas. Algo range dentro.',
    mansion_lamp:'Abajur de pé. A luz é fraca e azulada.',
    mansion_clock:'Relógio de pêndulo. O pêndulo não se move. Mas o tic-tac continua.',
    tower_stairs:'Escada em espiral. Não há degraus — apenas sombras.',
    tower_door:'Porta forrada de veludo. Há um buraco de fechadura.',
    tower_window:'Janela alta. O céu está cheio de olhos.',
    tower_bed:'Cama com dossel. Os lençóis estão quentes, como se alguém tivesse acabado de sair.',
    tower_shrine:'Santinho com velas. A imagem é de uma mulher com cabeça de cadela.',
    tunnel_path:'Um túnel escuro. Lá longe, uma luz.',
    tunnel_wall:'As paredes do túnel são cobertas de runas.',
    tunnel_chain:'Corrente pesada no chão. Você segue ela.',
    tunnel_light:'Uma luz fraca no fim do túnel.',
    tunnel_offer:'Uma pequena abertura na parede. Como um nicho de oferendas.',
    tunnel_altar:'Altar de pedra com três cavidades.',
    tunnel_eye:'Um olho enorme abre na parede. Ele te encara.',
    obj_rusty_key:'Chave enferrujada. Ela range.',
    obj_cellar_key:'Chave do porão. Está fria e úmida.',
    obj_kitchen_key:'Chave da cozinha. Cheira a gordura.',
    obj_church_key:'Chave da capela. Tem forma de cruz.',
    obj_graveyard_key:'Chave do cemitério. A ponta parece um osso.',
    obj_mansion_key:'Chave do salão. Entalhada com folhas.',
    obj_tower_key:'Chave da torre. É quente ao toque.',
    obj_match:'Fósforos. Só resta um.',
    obj_wax:'Pedaço de vela. Meio derretido.',
    obj_photo:'Fotografia antiga. Uma mulher, um homem, três cães. Os rostos estão borrados.',
    obj_medallion:'Medalhão. Dentro, um fio de cabelo negro e uma inscrição: "Para Shiva".',
    obj_bell:'Sino pequeno de bronze. O som é estranhamente grave.',
    obj_feather:'Pena preta. Muito grande para ser de um pássaro normal.',
    obj_skull:'Caveira pequena. Na testa, três marcas de dentes.',
    obj_collar:'Coleira de couro. A argola está quebrada.',
    obj_ribbon:'Fita vermelha. Manchada de terra.',
    obj_shard:'Caco de espelho. O reflexo mostra outra época.',
    obj_flower:'Flor preta. As pétalas são frias como metal.',
    obj_ring:'Anel de prata. Dentro: "Sempre sua."',
    obj_mirror:'Espelho de mão. A moldura tem forma de olho.',
    obj_candle:'Vela inteira. A cera é preta.',
    obj_lantern:'Lanterna a óleo. A chama está quase apagando.',
    obj_rope:'Corda de sisal. Manchas escuras.',
    obj_key6:'Chave dourada. A cabeça tem três dentes.',
    obj_heart:'Coração de pedra. Ainda pulsa.',
    radio_message:'...estático... "Shiva... guardiã... três cabeças..." ...estático... "...a hora do passeio se aproxima..."',
    shiva_appear:'Uma presença. Um peso no ar. Ela está aqui.',
    shiva_watch:'Você sente os olhos de Shiva na sua nuca.',
    shiva_leave:'O peso se foi. Por enquanto.',
    memory_fill:'Uma memória retorna. Imagens fragmentadas de uma vida anterior.',
    default_look:'Não há nada de especial aqui.',
    default_use:'Nada acontece.',
    locked:'Trancado. Você precisa de uma chave.',
    wrong_key:'A chave não encaixa.',
    no_lantern:'Está escuro demais. Sua lanterna não tem combustível.',
    hint_generic:'Explore cada canto. Olhe para tudo. As respostas estão no ambiente.'
  }
}
