const SCENES = {
  corridor_1: {
    id:'corridor_1', name:'CORREDOR', day:7,
    connections:{north:'cellar'},
    objects:[
      {id:'door_front',name:'PORTÃO',type:'puzzle',puzzle:'gate',desc:'Três fechaduras de símbolos.'},
      {id:'lamp_c1',name:'LÂMPADA',desc:'Oscila sem vento.'},
      {id:'wall_c1',name:'PAREDE',desc:'"O passeio começa onde a luz termina."'},
      {id:'ground_c1',name:'CHÃO',desc:'Pegadas recentes levam ao portão.'},
      {id:'stairs_c1',name:'ESCADARIA',type:'exit',target:'cellar',desc:'Desce para o porão.'}
    ]
  },
  cellar: {
    id:'cellar', name:'PORÃO — CELA 1', day:7,
    connections:{south:'corridor_1', north:'corridor_2'},
    objects:[
      {id:'well',name:'POÇO',type:'puzzle',puzzle:'cellar_well',desc:'A água reflete uma luz que não existe.'},
      {id:'wall_cellar',name:'PAREDE',type:'examine',desc:'Parede úmida.',note:'cellar'},
      {id:'chain_cellar',name:'CORRENTE',type:'item',gives:'cellar_key',desc:'Uma chave pendurada.'},
      {id:'vent_cellar',name:'VENTILAÇÃO',type:'puzzle',puzzle:'cellar_vent',desc:'Algo brilha atrás das barras.'},
      {id:'water_cellar',name:'ÁGUA',desc:'O reflexo não é seu. É Shiva.'},
      {id:'exit_cellar_fwd',name:'SUBIR',type:'exit',target:'corridor_2'},
      {id:'exit_cellar_back',name:'VOLTAR',type:'exit',target:'corridor_1'}
    ]
  },
  corridor_2: {
    id:'corridor_2', name:'PATAMAR', day:7,
    connections:{south:'cellar', north:'kitchen'},
    objects:[
      {id:'exit_c2_fwd',name:'SOBE',type:'exit',target:'kitchen'},
      {id:'exit_c2_back',name:'DESCE',type:'exit',target:'cellar'},
      {id:'window_c2',name:'JANELA',desc:'Algo passa voando na escuridão.'}
    ]
  },
  kitchen: {
    id:'kitchen', name:'COZINHA — CELA 2', day:7,
    connections:{south:'corridor_2', north:'corridor_3'},
    objects:[
      {id:'stove',name:'FOGÃO',type:'puzzle',puzzle:'kitchen_stove',desc:'Cinzas frias.'},
      {id:'radio',name:'RÁDIO',type:'puzzle',puzzle:'kitchen_radio',desc:'O dial está solto.'},
      {id:'cabinet_kitchen',name:'ARMÁRIO',type:'examine',desc:'Range.',note:'kitchen'},
      {id:'sink',name:'PIA',type:'puzzle',puzzle:'kitchen_sink',desc:'Água pinga sem parar.'},
      {id:'knife',name:'FACA',type:'item',gives:'wax',desc:'Cera grudada no cabo.'},
      {id:'exit_kitchen_back',name:'VOLTAR',type:'exit',target:'corridor_2'},
      {id:'exit_kitchen_fwd',name:'SAÍDA',type:'exit',target:'corridor_3'}
    ]
  },
  corridor_3: {
    id:'corridor_3', name:'CORREDOR', day:7,
    connections:{south:'kitchen', north:'church'},
    objects:[
      {id:'exit_c3_back',name:'VOLTAR',type:'exit',target:'kitchen'},
      {id:'exit_c3_fwd',name:'CAPELA',type:'exit',target:'church'},
      {id:'bell_c3',name:'SINO',type:'item',gives:'bell',desc:'Sino pequeno.'},
      {id:'candle_c3',name:'VELA',type:'item',gives:'candle',desc:'Vela largada no canto.'}
    ]
  },
  church: {
    id:'church', name:'CAPELA — CELA 3', day:7,
    connections:{south:'corridor_3', north:'corridor_4'},
    objects:[
      {id:'altar',name:'ALTAR',type:'puzzle',puzzle:'church_altar',desc:'Três cavidades.'},
      {id:'statue',name:'ESTÁTUA',type:'examine',desc:'Cão de três cabeças.',note:'church'},
      {id:'pew',name:'BANCO',type:'item',gives:'feather',desc:'Pena preta no banco.'},
      {id:'window_church',name:'VITRAL',desc:'Luz forma um símbolo no chão.'},
      {id:'exit_church_back',name:'VOLTAR',type:'exit',target:'corridor_3'},
      {id:'exit_church_fwd',name:'SAÍDA',type:'exit',target:'corridor_4'}
    ]
  },
  corridor_4: {
    id:'corridor_4', name:'CORREDOR', day:7,
    connections:{south:'church', north:'graveyard'},
    objects:[
      {id:'exit_c4_back',name:'VOLTAR',type:'exit',target:'church'},
      {id:'exit_c4_fwd',name:'CEMITÉRIO',type:'exit',target:'graveyard'},
      {id:'wind_c4',name:'VENTO',desc:'Uivo distante.'}
    ]
  },
  graveyard: {
    id:'graveyard', name:'CEMITÉRIO — CELA 4', day:7,
    connections:{south:'corridor_4', north:'corridor_5'},
    objects:[
      {id:'grave_all',name:'TÚMULOS',type:'puzzle',puzzle:'graveyard_tomb',desc:'Seis túmulos em fileira.'},
      {id:'tree',name:'ÁRVORE',desc:'Galhos como dedos.'},
      {id:'fence',name:'CERCA',type:'item',gives:'graveyard_key',desc:'Chave pendurada.'},
      {id:'exit_grave_back',name:'VOLTAR',type:'exit',target:'corridor_4'},
      {id:'exit_grave_fwd',name:'SAÍDA',type:'exit',target:'corridor_5'}
    ]
  },
  corridor_5: {
    id:'corridor_5', name:'CORREDOR', day:7,
    connections:{south:'graveyard', north:'mansion'},
    objects:[
      {id:'exit_c5_back',name:'VOLTAR',type:'exit',target:'graveyard'},
      {id:'exit_c5_fwd',name:'SALÃO',type:'exit',target:'mansion'},
      {id:'rug',name:'TAPETE',type:'item',gives:'ribbon',desc:'Fita vermelha na franja.'}
    ]
  },
  mansion: {
    id:'mansion', name:'SALÃO — CELA 5', day:7,
    connections:{south:'corridor_5', north:'corridor_6'},
    objects:[
      {id:'mirror',name:'ESPELHO',type:'puzzle',puzzle:'mansion_mirror',desc:'Reflexo atrasado.'},
      {id:'portrait',name:'RETRATO',type:'examine',desc:'Olhos arrancados.',note:'mansion'},
      {id:'cabinet_mansion',name:'ARMÁRIO',type:'puzzle',puzzle:'mansion_cabinet',desc:'Gavetas trancadas.'},
      {id:'clock_mansion',name:'RELÓGIO',type:'puzzle',puzzle:'mansion_clock',desc:'Pêndulo parado.'},
      {id:'lamp_mansion',name:'ABAJUR',type:'item',gives:'mansion_key',desc:'Luz azulada revela chave.'},
      {id:'exit_mansion_back',name:'VOLTAR',type:'exit',target:'corridor_5'},
      {id:'exit_mansion_fwd',name:'SOBE',type:'exit',target:'corridor_6'}
    ]
  },
  corridor_6: {
    id:'corridor_6', name:'ESCADA', day:8,
    connections:{south:'mansion', north:'library'},
    objects:[
      {id:'exit_c6_back',name:'DESCE',type:'exit',target:'mansion'},
      {id:'exit_c6_fwd',name:'BIBLIOTECA',type:'exit',target:'library'},
      {id:'mirror_c6',name:'ESPELHO',desc:'Você está diferente. Mais velho.'}
    ]
  },
  library: {
    id:'library', name:'BIBLIOTECA', day:8,
    connections:{south:'corridor_6', north:'tower'},
    objects:[
      {id:'shelf_main',name:'ESTANTE',type:'puzzle',puzzle:'library_shelf',desc:'Livros em ordem.'},
      {id:'book_table',name:'MESA',desc:'Cérbero: Guardião do Subumano'},
      {id:'exit_library_back',name:'VOLTAR',type:'exit',target:'corridor_6'},
      {id:'exit_library_fwd',name:'TORRE',type:'exit',target:'tower'}
    ]
  },
  tower: {
    id:'tower', name:'TORRE — CELA 6', day:8,
    connections:{south:'corridor_6', north:'tunnel'},
    objects:[
      {id:'shrine',name:'SANTUÁRIO',type:'puzzle',puzzle:'tower_shrine',desc:'Seis velas.'},
      {id:'bed_tower',name:'CAMA',type:'examine',desc:'Ainda quente.',note:'tower'},
      {id:'window_tower',name:'JANELA',desc:'O céu está cheio de olhos.'},
      {id:'tower_candle',name:'VELA',type:'item',gives:'lantern',desc:'Chama ainda acesa.'},
      {id:'exit_tower_back',name:'DESCE',type:'exit',target:'corridor_6'},
      {id:'exit_tower_fwd',name:'TÚNEL',type:'exit',target:'tunnel'}
    ]
  },
  tunnel: {
    id:'tunnel', name:'O TÚNEL', day:8,
    connections:{south:'tower', north:'end'},
    objects:[
      {id:'altar_tunnel',name:'ALTAR FINAL',type:'puzzle',puzzle:'final_altar',desc:'Três cavidades.'},
      {id:'eye_tunnel',name:'OLHO',desc:'Shiva vê tudo.'},
      {id:'light_tunnel',name:'LUZ',type:'exit',target:'end',desc:'Lá longe — a saída.'},
      {id:'chain_tunnel',name:'CORRENTE',desc:'A corrente que te prendeu — quebrada.'},
      {id:'exit_tunnel_back',name:'VOLTAR',type:'exit',target:'tower'}
    ]
  }
}

const ROOM_GRID = {
  corridor_1:[0,0], cellar:[1,0],
  corridor_2:[1,1], kitchen:[1,2],
  corridor_3:[0,2], church:[0,3],
  corridor_4:[1,3], graveyard:[1,4],
  corridor_5:[0,4], mansion:[0,5],
  corridor_6:[1,5], library:[1,6],
  tower:[0,6], tunnel:[0,7]
}
const GRID_ROOMS={};for(const[id,[x,y]]of Object.entries(ROOM_GRID))GRID_ROOMS[x+','+y]=id
function getNeighbor(id,dx,dy){
  const p=ROOM_GRID[id];if(!p)return null
  return GRID_ROOMS[(p[0]+dx)+','+(p[1]+dy)]||null
}

const HITBOXES = {
  door_front:{x:280,y:150,w:240,h:330},
  lamp_c1:{x:380,y:20,w:40,h:80},
  wall_c1:{x:80,y:240,w:180,h:180},
  ground_c1:{x:0,y:400,w:800,h:200},
  stairs_c1:{x:500,y:400,w:200,h:100},
  well:{x:300,y:300,w:200,h:200},
  wall_cellar:{x:60,y:80,w:180,h:280},
  chain_cellar:{x:500,y:120,w:60,h:180},
  vent_cellar:{x:600,y:200,w:60,h:60},
  water_cellar:{x:350,y:350,w:100,h:100},
  exit_cellar_fwd:{x:350,y:450,w:100,h:80},
  exit_cellar_back:{x:50,y:450,w:80,h:80},
  exit_c2_fwd:{x:350,y:150,w:100,h:200},
  exit_c2_back:{x:50,y:300,w:80,h:100},
  window_c2:{x:620,y:100,w:60,h:80},
  stove:{x:60,y:200,w:140,h:200},
  radio:{x:550,y:270,w:110,h:70},
  cabinet_kitchen:{x:500,y:120,w:80,h:120},
  sink:{x:280,y:300,w:100,h:100},
  knife:{x:600,y:300,w:30,h:50},
  exit_kitchen_back:{x:50,y:450,w:80,h:80},
  exit_kitchen_fwd:{x:350,y:450,w:100,h:80},
  exit_c3_back:{x:50,y:450,w:80,h:80},
  exit_c3_fwd:{x:350,y:130,w:100,h:250},
  bell_c3:{x:580,y:350,w:40,h:30},
  candle_c3:{x:640,y:360,w:30,h:35},
  altar:{x:340,y:280,w:120,h:80},
  statue:{x:340,y:380,w:120,h:100},
  pew:{x:80,y:350,w:120,h:60},
  window_church:{x:600,y:100,w:80,h:100},
  exit_church_back:{x:50,y:450,w:80,h:80},
  exit_church_fwd:{x:350,y:450,w:100,h:80},
  exit_c4_back:{x:50,y:450,w:80,h:80},
  exit_c4_fwd:{x:350,y:120,w:100,h:250},
  wind_c4:{x:100,y:200,w:100,h:100},
  grave_all:{x:40,y:300,w:720,h:100},
  tree:{x:250,y:330,w:100,h:130},
  fence:{x:100,y:200,w:80,h:100},
  exit_grave_back:{x:50,y:450,w:80,h:80},
  exit_grave_fwd:{x:350,y:50,w:100,h:80},
  exit_c5_back:{x:50,y:450,w:80,h:80},
  exit_c5_fwd:{x:350,y:110,w:100,h:250},
  rug:{x:200,y:420,w:400,h:30},
  mirror:{x:270,y:70,w:260,h:310},
  portrait:{x:40,y:180,w:60,h:70},
  cabinet_mansion:{x:600,y:350,w:80,h:100},
  clock_mansion:{x:560,y:110,w:55,h:75},
  lamp_mansion:{x:40,y:280,w:40,h:70},
  exit_mansion_back:{x:50,y:450,w:80,h:80},
  exit_mansion_fwd:{x:350,y:450,w:100,h:80},
  exit_c6_back:{x:50,y:450,w:80,h:80},
  exit_c6_fwd:{x:350,y:70,w:100,h:200},
  mirror_c6:{x:600,y:120,w:50,h:70},
  shelf_main:{x:40,y:90,w:720,h:310},
  book_table:{x:270,y:250,w:160,h:100},
  exit_library_back:{x:50,y:450,w:80,h:80},
  exit_library_fwd:{x:350,y:450,w:100,h:80},
  shrine:{x:260,y:130,w:280,h:260},
  bed_tower:{x:100,y:250,w:180,h:140},
  window_tower:{x:550,y:80,w:100,h:100},
  tower_candle:{x:600,y:400,w:40,h:45},
  exit_tower_back:{x:50,y:450,w:80,h:80},
  exit_tower_fwd:{x:350,y:450,w:100,h:80},
  altar_tunnel:{x:340,y:270,w:120,h:120},
  eye_tunnel:{x:350,y:150,w:100,h:90},
  light_tunnel:{x:680,y:100,w:80,h:200},
  chain_tunnel:{x:100,y:280,w:80,h:180},
  exit_tunnel_back:{x:50,y:450,w:80,h:80}
}

const ITEMS_ICONS = {
  cellar_key:'🗝️',kitchen_key:'🗝️',church_key:'🗝️',graveyard_key:'🦴',
  mansion_key:'🗝️',tower_key:'🔑',key6:'⚜️',match:'🔥',wax:'🕯️',
  photo:'📷',medallion:'📿',bell:'🔔',feather:'🪶',skull:'💀',
  collar:'⛓️',ribbon:'🎀',shard:'🪞',flower:'🌺',ring:'💍',
  mirror:'🪞',candle:'🕯️',lantern:'🏮',rope:'🪢',heart:'❤️'
}
const ITEMS_NAMES = {
  cellar_key:'Chave do Porão',kitchen_key:'Chave da Cozinha',church_key:'Chave da Capela',
  graveyard_key:'Chave do Cemitério',mansion_key:'Chave do Salão',tower_key:'Chave da Torre',
  key6:'Chave Dourada',match:'Fósforo',wax:'Vela',photo:'Fotografia',
  medallion:'Medalhão',bell:'Sino',feather:'Pena',skull:'Caveira',
  collar:'Coleira',ribbon:'Fita',shard:'Caco',flower:'Flor',ring:'Anel',
  mirror:'Espelho',candle:'Vela',lantern:'Lanterna',rope:'Corda',heart:'Coração'
}

class Game {
  constructor(){
    window.__game=this
    this.engine=new Engine()
    this.a=new AudioSys()
    this.inventory=[]
    this.notes=[]
    this.obtainedItems=[]
    this.selectedItem=null
    this.flags={}
    this.sceneId='corridor_1'
    this.prevScene=null
    this.day=7
    this.engine.scene='corridor_1'
    this.engine.state=S.INTRO
    this.a.init()
    this.initHUD()
    this.showingWatching=false
    this.watchTimer=null
    this.loop()
    setTimeout(()=>{this.startIntro();this.a.startDrone('corridor_1')},100)
  }
  startIntro(){
    this.engine.showIntro(STORY.intro)
    document.getElementById('intro-overlay').querySelector('.intro-text').textContent=STORY.intro[0]
  }
  initHUD(){
    const mem=document.getElementById('hud-memories')
    mem.innerHTML=''
    for(let i=0;i<6;i++){
      const d=document.createElement('div');d.className='mem-slot';d.id='mem-'+i;d.textContent='○';mem.appendChild(d)
    }
    this.renderInventory()
  }
  renderInventory(){
    const bar=document.getElementById('inventory-bar')
    bar.innerHTML=''
    for(let i=0;i<7;i++){
      const s=document.createElement('div');s.className='slot'
      if(i<this.inventory.length){
        const it=this.inventory[i]
        s.textContent=ITEMS_ICONS[it]||'·'
        s.title=ITEMS_NAMES[it]||it
        if(this.selectedItem===i)s.classList.add('selected')
        s.addEventListener('click',()=>this.selectItem(i))
      }else{
        s.textContent='·';s.style.color='#1a0a0a'
      }
      bar.appendChild(s)
    }
    this.updateMemories()
  }
  selectItem(i){
    this.selectedItem=this.selectedItem===i?null:i
    this.renderInventory()
    if(this.selectedItem!==null){
      const it=this.inventory[this.selectedItem]
      this.engine.tooltip(ITEMS_NAMES[it]+' selecionado')
    }
  }
  hasItem(id){return this.inventory.includes(id)}
  addItem(id,silent){
    if(!this.obtainedItems.includes(id))this.obtainedItems.push(id)
    if(this.inventory.length<7&&!this.hasItem(id)){
      this.inventory.push(id)
      this.a.pickup()
      this.renderInventory()
      if(!silent)this.engine.tooltip(ITEMS_NAMES[id]+' — pego.')
    }else if(!this.hasItem(id)){
      if(!silent)this.engine.tooltip('Inventário cheio.')
    }
  }
  removeItem(id){
    const i=this.inventory.indexOf(id)
    if(i>-1){
      this.inventory.splice(i,1)
      if(this.selectedItem===i)this.selectedItem=null
      else if(this.selectedItem>i)this.selectedItem--
      this.renderInventory()
    }
  }
  obtained(id){if(!this.obtainedItems.includes(id))this.obtainedItems.push(id)}
  addNote(id){
    if(!this.notes.includes(id)){
      this.notes.push(id)
      this.obtainedItems.push('note_'+id)
      this.a.paper()
      const n=STORY.notes[id]
      this.engine.showNote(n.symbol,n.text)
      this.updateMemories()
    }
  }
  updateMemories(){
    const ids=['cellar','kitchen','church','graveyard','mansion','tower']
    for(let i=0;i<6;i++){
      const el=document.getElementById('mem-'+i)
      if(el){
        if(i<this.notes.length){
          el.textContent=STORY.notes[ids[i]].symbol
          el.className='mem-slot filled'
        }else{el.textContent='○';el.className='mem-slot'}
      }
    }
  }
  handleClick(x,y){
    const obj=this.engine.findHit(x,y)
    if(!obj){this.engine.tooltip('...');return}
    this.engine.clearTooltip()
    this._interact(obj)
  }
  _interact(obj){
    if(obj.type==='exit'){
      this.goTo(obj.target)
    }else if(obj.type==='puzzle'){
      this.startPuzzle(obj)
    }else if(obj.type==='item'){
      if(obj.gives){
        this.obtained(obj.gives)
        this.addItem(obj.gives,true)
        this.engine.tooltip(obj.desc||'Pego.')
      }
    }else if(obj.type==='examine'){
      if(obj.note)this.addNote(obj.note)
      else this.engine.tooltip(obj.desc||'...')
    }else{
      this.engine.tooltip(obj.desc||'...')
    }
  }
  startPuzzle(obj){
    if(!obj.puzzle)return
    const p=PUZZLES[obj.puzzle]
    if(!p)return
    if(p.solved){this.engine.tooltip('Já resolveu isso.');return}
    if(!p.inited){p.init?p.init():p.inited=true}
    if(p.onOpen)p.onOpen(this.engine,this)
    this.engine.openPuzzle(p)
  }
  flashWatching(dur){
    this.showingWatching=true
    if(this.watchTimer)clearTimeout(this.watchTimer)
    this.watchTimer=setTimeout(()=>{this.showingWatching=false},dur||3000)
  }
  showWatching(){
    this.showingWatching=true
    if(this.watchTimer)clearTimeout(this.watchTimer)
    this.watchTimer=null
  }
  hideWatching(){
    this.showingWatching=false
    if(this.watchTimer){clearTimeout(this.watchTimer);this.watchTimer=null}
  }
  goTo(target){
    if(this.sceneId==='tunnel'&&target==='end'){
      this.endGame('bone')
      return
    }
    if(!SCENES[target]){
      this.engine.tooltip('Não há saída aqui.')
      return
    }
    this.prevScene=this.sceneId
    this.a.door()
    this.engine.transitionTo(target,()=>{
      this.sceneId=target
      const sc=SCENES[target]
      this.a.startDrone(target)
      if(sc.day&&sc.day!==this.day){this.day=sc.day;this.updateDay()}
      if(target==='tunnel'){this.showWatching();this.engine.tooltip('O ar muda. Shiva está aqui.',3000)}
      else if(target==='tower')this.showWatching()
      else if(target==='church')this.flashWatching(2000)
      else this.hideWatching()
    })
  }
  goNorth(){
    const t=getNeighbor(this.sceneId,0,-1)
    if(t)this.goTo(t);else this.engine.tooltip('Não há saída ao norte.')
  }
  goSouth(){
    const t=getNeighbor(this.sceneId,0,1)
    if(t)this.goTo(t);else this.engine.tooltip('Não há saída ao sul.')
  }
  goWest(){
    const t=getNeighbor(this.sceneId,-1,0)
    if(t)this.goTo(t);else this.engine.tooltip('Não há saída a oeste.')
  }
  goEast(){
    const t=getNeighbor(this.sceneId,1,0)
    if(t)this.goTo(t);else this.engine.tooltip('Não há saída ao leste.')
  }
  updateDay(){}
  checkEndings(){
    this.engine.closePuzzle()
    const keys=['cellar_key','kitchen_key','church_key','graveyard_key','mansion_key','tower_key','key6']
      .filter(k=>this.obtainedItems.includes(k)).length
    const notes=['note_cellar','note_kitchen','note_church','note_graveyard','note_mansion','note_tower']
      .filter(n=>this.obtainedItems.includes(n)).length
    const prot=['photo','medallion','bell','feather','collar','ring','shard','lantern']
      .filter(p=>this.obtainedItems.includes(p)).length
    if(keys>=7&&notes>=6&&prot>=5){
      this.engine.showFinal(STORY.endings.walk.title,STORY.endings.walk.text)
    }else if(keys>=7&&prot>=3){
      this.engine.showFinal(STORY.endings.collar.title,STORY.endings.collar.text)
    }else{
      this.engine.showFinal(STORY.endings.bone.title,STORY.endings.bone.text)
    }
  }
  endGame(type){
    this.engine.showFinal(STORY.endings[type].title,STORY.endings[type].text)
  }
  loop(){
    this.engine.render(performance.now())
    requestAnimationFrame(()=>this.loop())
  }
}

document.addEventListener('DOMContentLoaded',()=>new Game())
