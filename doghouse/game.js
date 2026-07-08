const ITEMS_ICON = {
  cellar_key:'🗝️',kitchen_key:'🗝️',church_key:'🗝️',crypt_key:'🗝️',graveyard_key:'🦴',
  mansion_key:'🗝️',library_key:'🗝️',tower_key:'🔑',
  match:'🔥',wax:'🕯️',lit_candle:'🕯️🔥',
  medallion:'📿',bell:'🔔',feather:'🪶',
  shovel:'🪚',handle:'🔗',complete_shovel:'🪚✓',
  broken_key_A:'🔑½',broken_key_B:'🔑½',complete_key:'🔑✓',
  shard:'🪞💔',ribbon:'🎀',estilete:'🔪',
  oil:'🫒',cloth:'🧣',oiled_cloth:'🧣💧',
  herb:'🌿',pilao:'🥣',powder:'✨',
  flower:'🌺',ring:'💍',collar:'⛓️',
  skull:'💀',photo:'🖼️',lantern:'🏮'
}

const ITEMS_NAME = {
  cellar_key:'Chave do Porão',kitchen_key:'Chave da Cozinha',church_key:'Chave da Capela',
  crypt_key:'Chave da Cripta',graveyard_key:'Chave do Cemitério',
  mansion_key:'Chave do Salão',library_key:'Chave da Biblioteca',tower_key:'Chave da Torre',
  match:'Fósforo',wax:'Cera',lit_candle:'Vela Acesa',
  medallion:'Medalhão',bell:'Sino',feather:'Pena',
  shovel:'Pá',handle:'Cabo',complete_shovel:'Pá Montada',
  broken_key_A:'Metade de Chave A',broken_key_B:'Metade de Chave B',complete_key:'Chave Completa',
  shard:'Caco de Vidro',ribbon:'Fita',estilete:'Estilete',
  oil:'Óleo',cloth:'Pano',oiled_cloth:'Pano Oleoso',
  herb:'Ervas',pilao:'Pilão',powder:'Pó Ritual',
  flower:'Flor',ring:'Anel',collar:'Coleira',
  skull:'Caveira',photo:'Fotografia',lantern:'Lanterna'
}

const ROOM_EXITS = {
  corridor:{east:'cellar',south:'kitchen'},
  cellar:{west:'corridor',east:'crypt'},
  kitchen:{north:'corridor',east:'church'},
  church:{west:'kitchen',south:'crypt'},
  crypt:{west:'cellar',north:'church',east:'graveyard'},
  graveyard:{west:'crypt',south:'mansion'},
  mansion:{north:'graveyard',east:'library'},
  library:{west:'mansion',east:'tower'},
  tower:{west:'library',south:'tunnel'},
  tunnel:{north:'tower'}
}

const ROOM_LOCKS = {
  cellar:'cellar_key', kitchen:'kitchen_key', church:'church_key',
  crypt:'crypt_key', graveyard:'graveyard_key', mansion:'mansion_key',
  library:'library_key', tower:'tower_key', tunnel:'collar'
}

const SCENES = {
  corridor:{
    id:'corridor',name:'CORREDOR',day:7,
    objects:[
      {id:'portao',name:'PORTÃO',type:'puzzle',puzzle:'gate',desc:'Três fechaduras.'},
      {id:'lamp_c',name:'LÂMPADA',desc:'Oscila sem vento.'},
      {id:'wall_c',name:'PAREDE',desc:'"O passeio começa onde a luz termina."'},
      {id:'ground_c',name:'CHÃO',desc:'Pegadas recentes levam ao portão.'},
      {id:'cellar_key',name:'CHAVE DO PORÃO',type:'item',gives:'cellar_key',desc:'Chave enferrujada no chão.'},
      {id:'loose_floor',name:'PISO SOLTO',desc:'Uma tábua solta.',type:'examine',reveals:'broken_key_B'},
      {id:'broken_key_B',name:'M.PARTIDA B',type:'item',gives:'broken_key_B',desc:'Metade de chave.'}
    ]
  },
  cellar:{
    id:'cellar',name:'PORÃO',day:7,
    objects:[
      {id:'barrels',name:'BARRIS',type:'puzzle',puzzle:'barrels',desc:'Três barris com símbolos.'},
      {id:'match',name:'FÓSFORO',type:'item',gives:'match',desc:'Caixa de fósforos.'},
      {id:'medallion',name:'MEDALHÃO',type:'item',gives:'medallion',desc:'Medalhão frio.'},
      {id:'herb',name:'ERVAS',type:'item',gives:'herb',desc:'Ervas secas.'},
      {id:'wall_cellar',name:'PAREDE',type:'examine',desc:'Parede úmida.',note:'cellar'},
      {id:'water_cellar',name:'POÇO',desc:'O reflexo não é seu.'}
    ]
  },
  kitchen:{
    id:'kitchen',name:'COZINHA',day:7,
    objects:[
      {id:'sink',name:'PIA',type:'puzzle',puzzle:'sink',desc:'Água pinga sem parar.'},
      {id:'wax',name:'CERA',type:'item',gives:'wax',desc:'Cera grudada na faca.'},
      {id:'pilao',name:'PILÃO',type:'item',gives:'pilao',desc:'Pilão de pedra.'},
      {id:'cabinet_kitchen',name:'ARMÁRIO',type:'examine',desc:'Range.',note:'kitchen'},
      {id:'stove',name:'FOGÃO',desc:'Cinzas frias.'}
    ]
  },
  church:{
    id:'church',name:'CAPELA',day:7,
    objects:[
      {id:'altar_church',name:'ALTAR',type:'puzzle',puzzle:'altar',desc:'Três cavidades aguardam oferendas.'},
      {id:'bell_church',name:'SINO',type:'item',gives:'bell',desc:'Sino pequeno no banco.'},
      {id:'feather_church',name:'PENA',type:'item',gives:'feather',desc:'Pena preta.'},
      {id:'shard_church',name:'CACO',type:'item',gives:'shard',desc:'Caco de vidro do vitral.'},
      {id:'statue',name:'ESTÁTUA',type:'examine',desc:'Cão de três cabeças.',note:'church'},
      {id:'pew',name:'BANCO',desc:' '},
      {id:'window_church',name:'VITRAL',desc:'Luz forma um símbolo.'}
    ]
  },
  crypt:{
    id:'crypt',name:'CRIPTA',day:8,
    objects:[
      {id:'candles',name:'VELAS',type:'puzzle',puzzle:'crypt_candles',desc:'Seis velas apagadas.'},
      {id:'broken_key_A',name:'M.PARTIDA A',type:'item',gives:'broken_key_A',desc:'Metade de chave no sarcófago.'},
      {id:'sarcophagus',name:'SARCOFÁGO',desc:'Pedra esculpida.'},
      {id:'inscriptions',name:'INSCRIÇÕES',desc:'Símbolos antigos na parede.'}
    ]
  },
  graveyard:{
    id:'graveyard',name:'CEMITÉRIO',day:7,
    objects:[
      {id:'tombs',name:'TÚMULOS',type:'puzzle',puzzle:'tombs',desc:'Seis túmulos.'},
      {id:'shovel',name:'PÁ',type:'item',gives:'shovel',desc:'Pá encostada na árvore.'},
      {id:'handle',name:'CABO',type:'item',gives:'handle',desc:'Cabo de madeira.'},
      {id:'tree',name:'ÁRVORE',desc:'Galhos como dedos.'}
    ]
  },
  mansion:{
    id:'mansion',name:'SALÃO',day:7,
    objects:[
      {id:'cabinet_mansion',name:'ARMÁRIO',type:'puzzle',puzzle:'cabinet',desc:'Gavetas trancadas.'},
      {id:'clock_mansion',name:'RELÓGIO',type:'puzzle',puzzle:'clock',desc:'Pêndulo parado.'},
      {id:'portrait',name:'RETRATO',type:'examine',desc:'Olhos arrancados.',note:'mansion'},
      {id:'lamp_mansion',name:'ABAJUR',desc:' '},
    ]
  },
  library:{
    id:'library',name:'BIBLIOTECA',day:8,
    objects:[
      {id:'shelf_main',name:'ESTANTE',type:'puzzle',puzzle:'shelf',desc:'Livros em ordem.'},
      {id:'oil',name:'ÓLEO',type:'item',gives:'oil',desc:'Frasco de óleo.'},
      {id:'cloth',name:'PANO',type:'item',gives:'cloth',desc:'Pano velho.'},
      {id:'book_table',name:'MESA',desc:'Cérbero: Guardião do Subumano'},
      {id:'lantern_lib',name:'LANTERNA',type:'item',gives:'lantern',desc:'Lanterna acesa no canto.'}
    ]
  },
  tower:{
    id:'tower',name:'TORRE',day:8,
    objects:[
      {id:'shrine',name:'SANTUÁRIO',type:'puzzle',puzzle:'shrine',desc:'Seis velas.'},
      {id:'bed_tower',name:'CAMA',type:'examine',desc:'Ainda quente.',note:'tower'},
      {id:'window_tower',name:'JANELA',desc:'O céu está cheio de olhos.'}
    ]
  },
  tunnel:{
    id:'tunnel',name:'O TÚNEL',day:8,
    objects:[
      {id:'altar_tunnel',name:'ALTAR FINAL',type:'puzzle',puzzle:'final_altar',desc:'Três cavidades.'},
      {id:'eye_tunnel',name:'O OLHO',desc:'Shiva vê tudo.'},
      {id:'light_tunnel',name:'LUZ',desc:'Lá longe.'},
      {id:'chain_tunnel',name:'CORRENTE',desc:'Quebrada.'}
    ]
  }
}

const HITBOXES = {
  portao:{x:200,y:100,w:400,h:350},
  lamp_c:{x:380,y:30,w:40,h:60},
  wall_c:{x:80,y:240,w:180,h:180},
  ground_c:{x:0,y:400,w:800,h:200},
  cellar_key:{x:620,y:380,w:50,h:40},
  loose_floor:{x:50,y:450,w:100,h:40},
  broken_key_B:{x:60,y:455,w:30,h:30},
  barrels:{x:200,y:100,w:400,h:350},
  match:{x:100,y:300,w:40,h:30},
  medallion:{x:700,y:350,w:40,h:40},
  herb:{x:680,y:250,w:30,h:30},
  wall_cellar:{x:60,y:80,w:180,h:280},
  water_cellar:{x:350,y:350,w:100,h:100},
  sink:{x:300,y:250,w:120,h:120},
  wax:{x:600,y:280,w:40,h:60},
  pilao:{x:650,y:200,w:40,h:40},
  cabinet_kitchen:{x:500,y:120,w:80,h:120},
  stove:{x:100,y:200,w:150,h:200},
  altar_church:{x:340,y:260,w:120,h:100},
  bell_church:{x:80,y:350,w:40,h:40},
  feather_church:{x:120,y:370,w:30,h:20},
  shard_church:{x:620,y:180,w:30,h:30},
  statue:{x:340,y:360,w:120,h:120},
  pew:{x:80,y:320,w:120,h:80},
  window_church:{x:600,y:100,w:80,h:100},
  candles:{x:100,y:100,w:600,h:400},
  broken_key_A:{x:300,y:400,w:30,h:30},
  sarcophagus:{x:200,y:280,w:400,h:100},
  inscriptions:{x:100,y:150,w:150,h:200},
  tombs:{x:40,y:260,w:720,h:100},
  shovel:{x:180,y:230,w:30,h:80},
  handle:{x:250,y:350,w:60,h:20},
  tree:{x:250,y:200,w:100,h:150},
  cabinet_mansion:{x:600,y:350,w:80,h:100},
  clock_mansion:{x:560,y:110,w:55,h:75},
  portrait:{x:40,y:180,w:60,h:70},
  lamp_mansion:{x:40,y:280,w:40,h:70},
  shelf_main:{x:40,y:90,w:720,h:310},
  oil:{x:200,y:400,w:30,h:40},
  cloth:{x:240,y:400,w:40,h:30},
  book_table:{x:270,y:250,w:160,h:100},
  lantern_lib:{x:680,y:350,w:35,h:45},
  shrine:{x:200,y:100,w:400,h:300},
  bed_tower:{x:100,y:250,w:180,h:140},
  window_tower:{x:550,y:80,w:100,h:100},
  altar_tunnel:{x:340,y:270,w:120,h:120},
  eye_tunnel:{x:350,y:150,w:100,h:90},
  light_tunnel:{x:680,y:100,w:80,h:200},
  chain_tunnel:{x:100,y:280,w:80,h:180}
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
    this.showingWatching=false
    this.watchTimer=null
    this.introStep=0
    this.a.init()
    this.setupInventoryUI()
    this.loop()
    setTimeout(()=>{this.engine.showIntro(STORY.intro);this.a.startDrone('corridor')},100)
  }

  getScene(id){return SCENES[id]}
  getExits(id){return ROOM_EXITS[id]||{}}
  getHitbox(sceneId,objId){return HITBOXES[objId]}

  setupInventoryUI(){
    const bar=document.getElementById('inventory-bar')
    bar.addEventListener('dragover',e=>{e.preventDefault()})
    bar.addEventListener('drop',e=>{
      e.preventDefault()
      const src=parseInt(e.dataTransfer.getData('text/plain'))
      if(isNaN(src))return
      const target=e.target.closest('.slot')
      if(!target)return
      const tIdx=parseInt(target.dataset.idx)
      if(src===tIdx)return
      this.tryCombine(src,tIdx)
    })
    this.renderInventory()
  }

  renderInventory(){
    const bar=document.getElementById('inventory-bar')
    bar.innerHTML=''
    for(let i=0;i<this.inventory.length;i++){
      const s=document.createElement('div');s.className='slot'
      s.dataset.idx=i
      const it=this.inventory[i]
      s.textContent=ITEMS_ICON[it]||'·'
      s.title=ITEMS_NAME[it]||it
      if(this.selectedItem===i)s.classList.add('selected')
      s.draggable=true
      s.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',i)})
      s.addEventListener('click',()=>this.selectItem(i))
      bar.appendChild(s)
    }
  }

  selectItem(i){
    this.selectedItem=this.selectedItem===i?null:i
    this.renderInventory()
    if(this.selectedItem!==null){
      const it=this.inventory[this.selectedItem]
      this.engine.tooltip(ITEMS_NAME[it]+' selecionado')
    }
  }

  addItem(id,silent){
    if(!this.obtainedItems.includes(id))this.obtainedItems.push(id)
    if(!this.inventory.includes(id)){
      this.inventory.push(id)
      this.a.pickup()
      this.renderInventory()
      if(!silent)this.engine.tooltip(ITEMS_NAME[id]+' — pego.')
    }else if(!silent)this.engine.tooltip('Já tem isso.')
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

  hasItem(id){return this.inventory.includes(id)}
  obtained(id){if(!this.obtainedItems.includes(id))this.obtainedItems.push(id)}

  tryCombine(srcIdx,targetIdx){
    const a=this.inventory[srcIdx],b=this.inventory[targetIdx]
    const result=tryCombine(a,b)
    if(result){
      this.removeItem(a);this.removeItem(b)
      this.addItem(result,false)
      this.a.combine()
      this.engine.tooltip(ITEMS_NAME[a]+' + '+ITEMS_NAME[b]+' = '+ITEMS_NAME[result],3000)
    }else{
      this.engine.tooltip('Não combina.')
    }
    this.selectedItem=null
    this.renderInventory()
  }

  handleClick(x,y){
    const obj=this.engine.findHit(x,y)
    if(!obj){this.engine.tooltip('...');return}
    this.engine.clearTooltip()
    this._interact(obj)
  }

  handleItemDrop(idx,x,y){
    const obj=this.engine.findHit(x,y)
    if(!obj){this.engine.tooltip('...');return}
    const item=this.inventory[idx]
    if(!item)return
    this.selectedItem=idx
    this._interact(obj)
    if(this.engine.state!==S.PUZZLE){
      this.selectedItem=null
      this.renderInventory()
    }
  }

  _interact(obj){
    if(obj.type==='puzzle'){
      this.startPuzzle(obj)
    }else if(obj.type==='item'){
      if(obj.gives){
        if(obj.reveals){
          this.removeObject(this.sceneId,obj.id)
          this.addObject(this.sceneId,{id:obj.reveals,name:ITEMS_NAME[obj.reveals]||obj.reveals,type:'item',gives:obj.reveals,desc:''})
          this.engine.tooltip(obj.desc||'Algo está escondido.')
        }else{
          this.obtained(obj.gives)
          this.addItem(obj.gives,true)
          this.engine.tooltip(obj.desc||'Pego.')
        }
      }
    }else if(obj.type==='examine'){
      if(obj.reveals){
        this.removeObject(this.sceneId,obj.id)
        this.addObject(this.sceneId,{id:obj.reveals,name:ITEMS_NAME[obj.reveals]||obj.reveals,type:'item',gives:obj.reveals,desc:''})
        this.engine.tooltip(obj.desc||'Algo revelado!')
      }else if(obj.note)this.addNote(obj.note)
      else this.engine.tooltip(obj.desc||'...')
    }else{
      if(this.selectedItem!==null){
        const item=this.inventory[this.selectedItem]
        this.engine.tooltip(ITEMS_NAME[item]+' não funciona aqui.')
      }else{
        this.engine.tooltip(obj.desc||'...')
      }
    }
  }

  addObject(sceneId,obj){
    const sc=SCENES[sceneId]
    if(sc&&!sc.objects.find(o=>o.id===obj.id))sc.objects.push(obj)
  }

  removeObject(sceneId,objId){
    const sc=SCENES[sceneId]
    if(sc){const i=sc.objects.findIndex(o=>o.id===objId);if(i>-1)sc.objects.splice(i,1)}
  }

  startPuzzle(obj){
    if(!obj.puzzle)return
    const p=PUZZLES[obj.puzzle]
    if(!p)return
    if(p.solved){this.engine.tooltip('Já resolveu isso.');return}
    if(!p.inited){if(p.init)p.init();p.inited=true}
    if(p.onOpen)p.onOpen(this.engine,this)
    this.engine.openPuzzle(p)
  }

  addNote(id){
    if(!this.notes.includes(id)){
      this.notes.push(id)
      this.obtainedItems.push('note_'+id)
      this.a.paper()
      const n=STORY.notes[id]
      if(n)this.engine.showNote(n.symbol,n.text)
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

  isLocked(roomId){
    return this.locks[roomId]&&!this.obtainedItems.includes(this.locks[roomId])
  }

  goNorth(){
    const e=ROOM_EXITS[this.sceneId]
    if(e&&e.north)this.goTo(e.north);else this.engine.tooltip('Não há saída ao norte.')
  }
  goSouth(){
    const e=ROOM_EXITS[this.sceneId]
    if(e&&e.south)this.goTo(e.south);else this.engine.tooltip('Não há saída ao sul.')
  }
  goWest(){
    const e=ROOM_EXITS[this.sceneId]
    if(e&&e.west)this.goTo(e.west);else this.engine.tooltip('Não há saída a oeste.')
  }
  goEast(){
    const e=ROOM_EXITS[this.sceneId]
    if(e&&e.east)this.goTo(e.east);else this.engine.tooltip('Não há saída ao leste.')
  }

  goTo(target){
    if(!SCENES[target]){this.engine.tooltip('Não há saída.');return}
    if(this.isLocked(target)){
      this.engine.tooltip('Trancado. Precisa de '+ITEMS_NAME[this.locks[target]]+'.')
      this.a.wrong()
      return
    }
    this.a.door()
    this.engine.transitionTo(target,()=>{
      this.sceneId=target
      const sc=SCENES[target]
      this.a.startDrone(target)
      if(sc.day&&sc.day!==this.day)this.day=sc.day
      if(target==='tunnel'){this.showWatching();this.engine.tooltip('Shiva está aqui.',3000)}
      else if(target==='tower')this.showWatching()
      else if(target==='church')this.flashWatching(2000)
      else this.hideWatching()
    })
  }

  flashWatching(dur){
    this.showingWatching=true
    if(this.watchTimer)clearTimeout(this.watchTimer)
    this.watchTimer=setTimeout(()=>{this.showingWatching=false},dur||3000)
  }
  showWatching(){this.showingWatching=true;if(this.watchTimer)clearTimeout(this.watchTimer);this.watchTimer=null}
  hideWatching(){this.showingWatching=false;if(this.watchTimer){clearTimeout(this.watchTimer);this.watchTimer=null}}

  checkEndings(){
    this.engine.closePuzzle()
    const extras=['medallion','bell','feather','shard','lantern']
    const extraCount=extras.filter(p=>this.obtainedItems.includes(p)).length
    if(extraCount>=4){
      this.engine.showFinal(STORY.endings.walk.title,STORY.endings.walk.text)
    }else if(extraCount>=2){
      this.engine.showFinal(STORY.endings.collar.title,STORY.endings.collar.text)
    }else{
      this.engine.showFinal(STORY.endings.bone.title,STORY.endings.bone.text)
    }
  }

  loop(){
    this.engine.render(performance.now())
    requestAnimationFrame(()=>this.loop())
  }
}

document.addEventListener('DOMContentLoaded',()=>new Game())
