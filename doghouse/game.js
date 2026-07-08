const ROOM_LOCKS = {
  cellar:'cellar_key',
  kitchen:'kitchen_key',
  church:'church_key',
  graveyard:'graveyard_key',
  mansion:'mansion_key',
  library:'library_key',
  tower:'tower_key',
  tunnel:'collar'
}

const SCENES = {
  corridor:{
    id:'corridor', name:'CORREDOR', day:7,
    objects:[
      {id:'gate',name:'PORTÃO',type:'puzzle',puzzle:'gate',desc:'Três fechaduras de símbolos.'},
      {id:'lamp_c',name:'LÂMPADA',desc:'Oscila sem vento.'},
      {id:'wall_c',name:'PAREDE',desc:'"O passeio começa onde a luz termina."'},
      {id:'ground_c',name:'CHÃO',desc:'Pegadas recentes levam ao portão.'},
      {id:'cellar_key',name:'CHAVE DO PORÃO',type:'item',gives:'cellar_key',desc:'Chave enferrujada no chão.'},
      {id:'medallion',name:'MEDALHÃO',type:'item',gives:'medallion',desc:'Medalhão frio no chão.'}
    ]
  },
  cellar:{
    id:'cellar', name:'PORÃO', day:7,
    objects:[
      {id:'chain_cellar',name:'CORRENTE',type:'item',gives:'kitchen_key',desc:'Chave da cozinha pendurada na corrente.'},
      {id:'vent_cellar',name:'VENTILAÇÃO',type:'puzzle',puzzle:'cellar_vent',desc:'Algo brilha atrás das barras.'},
      {id:'wall_cellar',name:'PAREDE',type:'examine',desc:'Parede úmida.',note:'cellar'},
      {id:'water_cellar',name:'POÇO',desc:'O reflexo não é seu. É Shiva.'},
      {id:'bell_cellar',name:'SINO',type:'item',gives:'bell',desc:'Sino pequeno enferrujado.'}
    ]
  },
  kitchen:{
    id:'kitchen', name:'COZINHA', day:7,
    objects:[
      {id:'sink',name:'PIA',type:'puzzle',puzzle:'kitchen_sink',desc:'Água pinga sem parar.'},
      {id:'cabinet_kitchen',name:'ARMÁRIO',type:'examine',desc:'Range.',note:'kitchen'},
      {id:'knife',name:'FACA',type:'item',gives:'wax',desc:'Cera grudada no cabo.'}
    ]
  },
  church:{
    id:'church', name:'CAPELA', day:7,
    objects:[
      {id:'altar',name:'ALTAR',type:'puzzle',puzzle:'church_altar',desc:'Três cavidades aguardam oferendas.'},
      {id:'statue',name:'ESTÁTUA',type:'examine',desc:'Cão de três cabeças.',note:'church'},
      {id:'pew',name:'BANCO',type:'item',gives:'feather',desc:'Pena preta no banco.'},
      {id:'window_church',name:'VITRAL',desc:'Luz forma um símbolo no chão.'}
    ]
  },
  graveyard:{
    id:'graveyard', name:'CEMITÉRIO', day:7,
    objects:[
      {id:'grave_all',name:'TÚMULOS',type:'puzzle',puzzle:'graveyard_tomb',desc:'Seis túmulos em fileira.'},
      {id:'fence',name:'CERCA',desc:'Chave pendurada na cerca. Já não está mais aqui.'},
      {id:'tree',name:'ÁRVORE',desc:'Galhos como dedos.'}
    ]
  },
  mansion:{
    id:'mansion', name:'SALÃO', day:7,
    objects:[
      {id:'cabinet_mansion',name:'ARMÁRIO',type:'puzzle',puzzle:'mansion_cabinet',desc:'Gavetas trancadas com segredo.'},
      {id:'clock_mansion',name:'RELÓGIO',type:'puzzle',puzzle:'mansion_clock',desc:'Pêndulo parado.'},
      {id:'portrait',name:'RETRATO',type:'examine',desc:'Olhos arrancados.',note:'mansion'},
      {id:'lamp_mansion',name:'ABAJUR',desc:'Luz azulada, mas a chave já não está aqui.'}
    ]
  },
  library:{
    id:'library', name:'BIBLIOTECA', day:8,
    objects:[
      {id:'shelf_main',name:'ESTANTE',type:'puzzle',puzzle:'library_shelf',desc:'Livros em ordem enigmática.'},
      {id:'book_table',name:'MESA',desc:'Cérbero: Guardião do Subumano'},
      {id:'lantern_lib',name:'LANTERNA',type:'item',gives:'lantern',desc:'Lanterna acesa no canto.'}
    ]
  },
  tower:{
    id:'tower', name:'TORRE', day:8,
    objects:[
      {id:'shrine',name:'SANTUÁRIO',type:'puzzle',puzzle:'tower_shrine',desc:'Seis velas apagadas.'},
      {id:'bed_tower',name:'CAMA',type:'examine',desc:'Ainda quente.',note:'tower'},
      {id:'window_tower',name:'JANELA',desc:'O céu está cheio de olhos.'},
      {id:'tower_candle',name:'VELAS',desc:'Chamas tremulam. A chave não está mais aqui.'}
    ]
  },
  tunnel:{
    id:'tunnel', name:'O TÚNEL', day:8,
    objects:[
      {id:'altar_tunnel',name:'ALTAR FINAL',type:'puzzle',puzzle:'final_altar',desc:'Três cavidades para a oferenda final.'},
      {id:'eye_tunnel',name:'O OLHO',desc:'Shiva vê tudo.'},
      {id:'light_tunnel',name:'LUZ',desc:'Lá longe — talvez a saída.'},
      {id:'chain_tunnel',name:'CORRENTE',desc:'A corrente que te prendeu — quebrada.'}
    ]
  }
}

const ROOM_GRID = {
  corridor:[0,0], cellar:[1,0],
  kitchen:[0,1], church:[1,1],
  graveyard:[2,0], mansion:[2,1],
  library:[2,2], tower:[3,2],
  tunnel:[3,3]
}
const GRID_ROOMS={};for(const[id,[x,y]]of Object.entries(ROOM_GRID))GRID_ROOMS[x+','+y]=id
function getNeighbor(id,dx,dy){
  const p=ROOM_GRID[id];if(!p)return null
  return GRID_ROOMS[(p[0]+dx)+','+(p[1]+dy)]||null
}

const HITBOXES = {
  gate:{x:200,y:100,w:400,h:400},
  lamp_c:{x:380,y:30,w:40,h:60},
  wall_c:{x:80,y:240,w:180,h:180},
  ground_c:{x:0,y:400,w:800,h:200},
   cellar_key:{x:620,y:380,w:40,h:40},
   medallion:{x:300,y:420,w:30,h:30},
  chain_cellar:{x:500,y:120,w:60,h:180},
  vent_cellar:{x:600,y:200,w:60,h:60},
  wall_cellar:{x:60,y:80,w:180,h:280},
   water_cellar:{x:350,y:350,w:100,h:100},
   bell_cellar:{x:200,y:400,w:30,h:40},
  sink:{x:280,y:300,w:100,h:100},
  cabinet_kitchen:{x:500,y:120,w:80,h:120},
  knife:{x:600,y:300,w:30,h:50},
  altar:{x:340,y:260,w:120,h:100},
  statue:{x:340,y:360,w:120,h:120},
  pew:{x:80,y:350,w:120,h:60},
  window_church:{x:600,y:100,w:80,h:100},
  grave_all:{x:40,y:300,w:720,h:100},
  fence:{x:100,y:200,w:80,h:100},
  tree:{x:250,y:330,w:100,h:130},
  cabinet_mansion:{x:600,y:350,w:80,h:100},
  clock_mansion:{x:560,y:110,w:55,h:75},
  portrait:{x:40,y:180,w:60,h:70},
  lamp_mansion:{x:40,y:280,w:40,h:70},
  shelf_main:{x:40,y:90,w:720,h:310},
  book_table:{x:270,y:250,w:160,h:100},
  lantern_lib:{x:680,y:350,w:35,h:45},
  shrine:{x:260,y:130,w:280,h:260},
  bed_tower:{x:100,y:250,w:180,h:140},
  window_tower:{x:550,y:80,w:100,h:100},
  tower_candle:{x:600,y:400,w:40,h:45},
  altar_tunnel:{x:340,y:270,w:120,h:120},
  eye_tunnel:{x:350,y:150,w:100,h:90},
  light_tunnel:{x:680,y:100,w:80,h:200},
  chain_tunnel:{x:100,y:280,w:80,h:180}
}

const ITEMS_ICONS = {
  cellar_key:'🗝️',kitchen_key:'🗝️',church_key:'🗝️',graveyard_key:'🦴',
  mansion_key:'🗝️',tower_key:'🔑',wax:'🕯️',
  medallion:'📿',bell:'🔔',  feather:'🪶',skull:'💀',photo:'🖼️',
  collar:'⛓️',shard:'🪞',flower:'🌺',ring:'💍',
  lantern:'🏮',candle:'🕯️',match:'🔥',ribbon:'🎀',
  eye:'👁️',bone:'🦴',mirror:'🪞'
}
const ITEMS_NAMES = {
  cellar_key:'Chave do Porão',kitchen_key:'Chave da Cozinha',church_key:'Chave da Capela',
  graveyard_key:'Chave do Cemitério',mansion_key:'Chave do Salão',tower_key:'Chave da Torre',
  wax:'Vela',medallion:'Medalhão',bell:'Sino',feather:'Pena',
  collar:'Coleira',shard:'Caco de Espelho',flower:'Flor',ring:'Anel',
  lantern:'Lanterna',candle:'Vela',match:'Fósforo',ribbon:'Fita',
  skull:'Caveira',eye:'Olho de Vidro',bone:'Osso',mirror:'Espelho',photo:'Fotografia'
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
    this.locks={...ROOM_LOCKS}
    this.flags={}
    this.sceneId='corridor'
    this.day=7
    this.engine.scene='corridor'
    this.engine.state=S.INTRO
    this.a.init()
    this.initHUD()
    this.showingWatching=false
    this.watchTimer=null
    this.loop()
    setTimeout(()=>{this.startIntro();this.a.startDrone('corridor')},100)
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
        if(this.notes.includes(ids[i])){
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
  isLocked(roomId){
    return this.locks[roomId]&&!this.obtainedItems.includes(this.locks[roomId])
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
    if(this.isLocked(target)){
      this.engine.tooltip('Trancado. Precisa de '+ITEMS_NAMES[this.locks[target]]+'.')
      this.a.wrong()
      return
    }
    this.prevScene=this.sceneId
    this.a.door()
    this.engine.transitionTo(target,()=>{
      this.sceneId=target
      const sc=SCENES[target]
      this.a.startDrone(target)
      if(sc.day&&sc.day!==this.day){this.day=sc.day}
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
  checkEndings(){
    this.engine.closePuzzle()
    const prot=['medallion','bell','feather','collar','ring','shard','lantern','mirror']
      .filter(p=>this.obtainedItems.includes(p)).length
    if(this.obtainedItems.includes('collar')&&prot>=4){
      this.engine.showFinal(STORY.endings.walk.title,STORY.endings.walk.text)
    }else if(prot>=3){
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
