const ITEMS_ICON = {
  pedra:'🪨', caco_vidro:'💎', fosforo:'🔥', vela:'🕯️',
  vela_acesa:'🕯️✨', corda:'🪢', gancho:'🪝', corda_gancho:'🪝🪢',
  ferro:'🔩', chave_1:'🗝️¹', chave_2:'🗝️²', chave_3:'🗝️³',
  chave_12:'🗝️¹²', chave_completa:'🔑✓',
  coleira:'⛓️', bola:'⚾', osso:'🦴'
}

const ITEMS_NAME = {
  pedra:'Pedra', caco_vidro:'Caco de Vidro', fosforo:'Fósforo', vela:'Vela',
  vela_acesa:'Vela Acesa', corda:'Corda', gancho:'Gancho', corda_gancho:'Corda com Gancho',
  ferro:'Barra de Ferro', chave_1:'Fragmento de Chave I', chave_2:'Fragmento de Chave II',
  chave_3:'Fragmento de Chave III', chave_12:'Dois Fragmentos',
  chave_completa:'Chave Completa',
  coleira:'Coleira', bola:'Bola', osso:'Osso'
}

const VIEWS = {
  north: [
    {id:'porta',name:'PORTA',desc:'Madeira grossa, ferro, três fechaduras.',type:'door'},
    {id:'grade',name:'GRADE',desc:'Barras de ferro presas na parede. Algo atrás.',type:'grate'},
    {id:'janela',name:'JANELA',desc:'Gradeada. Lá fora, escuridão.',type:'examine'},
    {id:'cruz',name:'CRUZ',desc:'Enferrujada. As marcas dos pregos.',type:'examine'}
  ],
  east: [
    {id:'prateleira',name:'PRATELEIRA',desc:'Empoeirada. Uma vela.',type:'shelf'},
    {id:'espelho',name:'ESPELHO',desc:'Trincado. O reflexo é seu mas não parece.',type:'mirror'},
    {id:'teia',name:'TEIA DE ARANHA',desc:'A aranha observa.',type:'examine'},
    {id:'tijolo',name:'TIJOLO SOLTO',desc:'Parece que dá pra mexer.',type:'brick'}
  ],
  south: [
    {id:'inscricao',name:'INSCRIÇÃO',desc:'"ESQUEÇA" — a palavra lateja.',type:'examine'},
    {id:'ralo',name:'RALO',desc:'No chão. Água escura. Algo brilha.',type:'drain'},
    {id:'assoalho',name:'ASSOALHO',desc:'Tábua solta no chão.',type:'floorboard'},
    {id:'goteira',name:'GOTEIRA',desc:'Ping... ping...',type:'examine'},
    {id:'pedra_obj',name:'PEDRA',desc:'No chão. Pesada.',type:'item',gives:'pedra'}
  ],
  west: [
    {id:'bancada',name:'BANCADA',desc:'Marca de unhas na madeira.',type:'examine'},
    {id:'gaveta',name:'GAVETA',desc:'Trancada. Três pinos de metal.',type:'drawer'},
    {id:'diario',name:'DIÁRIO',desc:'Páginas amareladas. Algo escrito.',type:'diary'},
    {id:'corda_obj',name:'CORDA',desc:'Pendurada na parede.',type:'item',gives:'corda'},
    {id:'ferramentas',name:'FERRAMENTAS',desc:'Pilha de ferros velhos.',type:'item',gives:'ferro'}
  ],
  ceiling: [
    {id:'corrente',name:'CORRENTE',desc:'Pendurada. Um gancho na ponta.',type:'chain'},
    {id:'alcapao',name:'ALÇAPÃO',desc:'No teto. Trancado por fora.',type:'hatch'},
    {id:'olhos',name:'OLHOS...',desc:'Brilham na escuridão.',type:'examine'}
  ]
}

const HITBOXES = {
  north: {
    porta:{x:270,y:80,w:260,h:420},
    grade:{x:60,y:200,w:100,h:150},
    janela:{x:350,y:120,w:100,h:80},
    cruz:{x:600,y:100,w:50,h:80}
  },
  east: {
    prateleira:{x:50,y:80,w:300,h:280},
    espelho:{x:450,y:100,w:200,h:250},
    teia:{x:420,y:60,w:40,h:40},
    tijolo:{x:560,y:380,w:40,h:40}
  },
  south: {
    inscricao:{x:150,y:200,w:300,h:150},
    ralo:{x:340,y:480,w:120,h:40},
    assoalho:{x:250,y:470,w:100,h:30},
    goteira:{x:380,y:80,w:40,h:60},
    pedra_obj:{x:100,y:470,w:50,h:30}
  },
  west: {
    bancada:{x:120,y:280,w:500,h:60},
    gaveta:{x:240,y:260,w:160,h:50},
    diario:{x:360,y:260,w:80,h:50},
    corda_obj:{x:600,y:80,w:40,h:200},
    ferramentas:{x:580,y:360,w:100,h:90}
  },
  ceiling: {
    corrente:{x:380,y:40,w:40,h:220},
    alcapao:{x:320,y:300,w:160,h:80},
    olhos:{x:200,y:130,w:120,h:80}
  }
}

class Game {
  constructor(){
    window.__game=this
    this.engine=new Engine()
    this.a=new AudioSys()
    this.inventory=[]
    this.obtainedItems=[]
    this.selectedItem=null
    this.view=0
    this.candleLit=false
    this.shivaActive=false
    this.shivaPhase=0
    this.shivaTimer=null
    this.diaryRead=false
    this.bellRung=false
    this.introStep=0
    this.flags={}
    this.a.init()
    this.setupUI()
    this.loop()
    setTimeout(()=>{this.engine.showIntro(STORY.intro);this.a.startDrone()},100)
    setTimeout(()=>this.startShivaTimer(),3000)
  }

  setupUI(){
    const bar=document.getElementById('inventory-bar')
    bar.addEventListener('dragover',e=>e.preventDefault())
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
      s.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',i))
      s.addEventListener('click',()=>this.selectItem(i))
      bar.appendChild(s)
    }
  }

  selectItem(i){
    this.selectedItem=this.selectedItem===i?null:i
    this.renderInventory()
    if(this.selectedItem!==null){
      this.engine.tooltip(ITEMS_NAME[this.inventory[this.selectedItem]]+' selecionado')
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
    return true
  }

  removeItem(idx){
    if(idx===null||idx<0||idx>=this.inventory.length)return
    const id=this.inventory[idx]
    this.inventory.splice(idx,1)
    if(this.selectedItem===idx)this.selectedItem=null
    else if(this.selectedItem!==null&&this.selectedItem>idx)this.selectedItem--
    this.renderInventory()
  }

  hasItem(id){return this.inventory.includes(id)}
  hasObtained(id){return this.obtainedItems.includes(id)}

  tryCombine(srcIdx,targetIdx){
    const a=this.inventory[srcIdx],b=this.inventory[targetIdx]
    const result=tryCombine(a,b)
    if(result){
      this.removeItem(srcIdx)
      this.removeItem(targetIdx>srcIdx?targetIdx-1:targetIdx)
      this.addItem(result,false)
      this.a.combine()
      if(result==='vela_acesa'){
        this.candleLit=true
        this.engine.tooltip('A vela acende. A sala se revela.',3000)
      }else if(result==='chave_completa'){
        this.engine.tooltip('A chave está completa!',3000)
      }else{
        this.engine.tooltip(ITEMS_NAME[a]+' + '+ITEMS_NAME[b]+' = '+ITEMS_NAME[result],3000)
      }
    }else{
      this.engine.tooltip('Não combina.')
    }
    this.selectedItem=null
    this.renderInventory()
  }

  handleClick(x,y){
    if(this.view===4){
      if(y>570)return this.goToView(0)
    }else{
      if(y<30)return this.goToView(4)
      if(x<50)return this.goToView(this.view-1)
      if(x>750)return this.goToView(this.view+1)
    }

    const vk=['north','east','south','west','ceiling'][this.view]
    const objs=VIEWS[vk]
    const hbs=HITBOXES[vk]

    for(const obj of objs){
      const h=hbs[obj.id]
      if(!h)continue
      if(x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h){
        this.engine.clearTooltip()
        this.interact(obj)
        return
      }
    }
    this.engine.tooltip('...')
  }

  interact(obj){
    const item=this.selectedItem!==null?this.inventory[this.selectedItem]:null

    switch(obj.type){
      case 'door': return this.interactDoor(item)
      case 'grate': return this.interactGrate(item)
      case 'shelf': return this.interactShelf(item)
      case 'mirror': return this.interactMirror(item)
      case 'brick': return this.interactBrick(item)
      case 'drain': return this.interactDrain(item)
      case 'floorboard': return this.interactFloorboard(item)
      case 'drawer': return this.startPuzzle('drawer')
      case 'diary': return this.readDiary()
      case 'chain': return this.interactChain(item)
      case 'hatch': return this.interactHatch(item)
      case 'item': return this.pickupItem(obj)
      default: this.engine.tooltip(obj.desc||'...')
    }
  }

  pickupItem(obj){
    if(obj.gives&&!this.hasItem(obj.gives)){
      this.addItem(obj.gives,false)
      obj.gives=null
      obj.desc=obj.desc+' (vazio)'
    }else if(obj.gives){
      this.engine.tooltip('Já pegou isso.')
    }else{
      this.engine.tooltip(obj.desc||'...')
    }
  }

  /* ─── DOOR (ending trigger) ─── */
  interactDoor(item){
    if(!item){
      this.engine.tooltip('Porta de madeira. Três fechaduras. Precisa de algo...')
      this.a.wrong()
      return
    }

    if(item==='chave_completa'){
      this.a.final()
      this.engine.showFinal(STORY.endings.abandon.title,STORY.endings.abandon.text)
      this.engine.state=S.FINAL
      return
    }

    if(item==='coleira'&&this.candleLit){
      this.a.final()
      this.engine.showFinal(STORY.endings.submission.title,STORY.endings.submission.text)
      this.engine.state=S.FINAL
      return
    }

    if(item==='bola'&&this.hasItem('osso')&&this.diaryRead){
      this.a.final()
      this.a.bell()
      this.engine.showFinal(STORY.endings.walk.title,STORY.endings.walk.text)
      this.engine.state=S.FINAL
      return
    }

    this.engine.tooltip(ITEMS_NAME[item]+' não funciona na porta.')
  }

  /* ─── GRATE (north) ─── */
  interactGrate(item){
    if(this.hasObtained('coleira')){
      this.engine.tooltip('Já abriu a grade.')
      return
    }
    if(item==='ferro'){
      this.a.chain()
      this.engine.tooltip('A grade range! Uma coleira cai.',3000)
      this.addItem('coleira',false)
      this.selectedItem=null;this.renderInventory()
      return
    }
    if(!item)this.engine.tooltip('Barras de ferro. Preciso de algo para forçar.')
    else this.engine.tooltip(ITEMS_NAME[item]+' não quebra a grade.')
  }

  /* ─── SHELF (east) ─── */
  interactShelf(item){
    if(this.hasObtained('vela')){
      this.engine.tooltip('A prateleira está vazia.')
      return
    }
    if(item==='pedra'){
      this.engine.tooltip('Quebrar a prateleira? Não faz sentido.')
      return
    }
    this.addItem('vela',false)
  }

  /* ─── MIRROR (east) ─── */
  interactMirror(item){
    if(this.hasObtained('caco_vidro')){
      this.engine.tooltip('O espelho já está quebrado.')
      return
    }
    if(item==='pedra'){
      this.a.chain()
      this.engine.tooltip('O espelho estilhaça! Um caco no chão.',2000)
      this.addItem('caco_vidro',false)
      this.selectedItem=null
      this.renderInventory()
      return
    }
    this.engine.tooltip('O espelho está trincado. Dá pra quebrar com algo.')
  }

  /* ─── BRICK (east, needs candle) ─── */
  interactBrick(item){
    if(this.hasObtained('chave_1')){
      this.engine.tooltip('O tijolo já foi removido.')
      return
    }
    if(!this.candleLit){
      this.engine.tooltip('Está escuro demais para ver direito.')
      return
    }
    this.a.dig()
    this.engine.tooltip('O tijolo se solta! Um fragmento de chave cai.',3000)
    this.addItem('chave_1',false)
  }

  /* ─── DRAIN (south) ─── */
  interactDrain(item){
    if(this.hasObtained('chave_3')){
      this.engine.tooltip('O ralo está vazio.')
      return
    }
    if(!this.candleLit){
      this.engine.tooltip('Água escura. Não dá pra ver o fundo.')
      return
    }
    if(item==='ferro'){
      this.a.water()
      this.engine.tooltip('A tampa do ralo cede! Outro fragmento de chave.',3000)
      this.addItem('chave_3',false)
      this.selectedItem=null;this.renderInventory()
      return
    }
    this.engine.tooltip('O ralo está tampado. Preciso de algo para abrir.')
  }

  /* ─── FLOORBOARD (south, needs candle) ─── */
  interactFloorboard(item){
    if(this.hasObtained('bola')){
      this.engine.tooltip('O assoalho já foi levantado.')
      return
    }
    if(!this.candleLit){
      this.engine.tooltip('Não vejo direito no escuro.')
      return
    }
    this.a.dig()
    this.engine.tooltip('A tábua range! Uma bola velha embaixo.',3000)
    this.addItem('bola',false)
  }

  /* ─── CHAIN (ceiling) ─── */
  interactChain(item){
    if(this.hasObtained('gancho')){
      this.engine.tooltip('A corrente está partida. O gancho no chão.')
      return
    }
    if(item==='ferro'){
      this.a.chain()
      this.engine.tooltip('A corrente range! O gancho se solta.',3000)
      this.addItem('gancho',false)
      this.selectedItem=null;this.renderInventory()
      return
    }
    this.engine.tooltip('Corrente com um gancho. Preciso forçar com algo.')
  }

  /* ─── HATCH (ceiling) ─── */
  interactHatch(item){
    if(this.hasObtained('chave_2')){
      this.engine.tooltip('O alçapão está aberto. Vazio.')
      return
    }
    if(item==='corda_gancho'){
      this.a.unlock()
      this.engine.tooltip('O gancho prende no alçapão! Fragmento de chave e um osso.',3000)
      this.addItem('chave_2',false)
      this.addItem('osso',false)
      this.removeItem(this.selectedItem)
      this.selectedItem=null;this.renderInventory()
      return
    }
    this.engine.tooltip('Alçapão no teto. Muito alto. Preciso de algo para alcançar.')
  }

  /* ─── DIARY ─── */
  readDiary(){
    this.diaryRead=true
    this.a.paper()
    this.engine.showNote('📖',STORY.diary.join('\n\n'))
  }

  /* ─── PUZZLE ─── */
  startPuzzle(id){
    const p=PUZZLES[id]
    if(!p)return
    if(p.solved){this.engine.tooltip('Já resolveu.');return}
    if(!p.inited){if(p.init)p.init();p.inited=true}
    this.engine.openPuzzle(p)
  }

  /* ─── VIEW NAVIGATION ─── */
  goToView(idx){
    if(idx<0)idx=4
    else if(idx>4)idx=0
    if(idx===this.view)return
    this.engine.flashView(()=>{
      this.view=idx
      this.a.step()
    })
  }

  /* ─── SHIVA TIMER ─── */
  startShivaTimer(){
    const next=90000+Math.random()*90000
    this.shivaTimer=setTimeout(()=>{
      if(this.engine.state===S.PLAYING){
        this.shivaActive=true
        this.shivaPhase=this.view
        this.a.shiva()
        setTimeout(()=>{
          this.shivaActive=false
          this.startShivaTimer()
        },2500+Math.random()*2000)
      }else{
        this.startShivaTimer()
      }
    },next)
  }

  /* ─── GAME LOOP ─── */
  loop(){
    this.engine.render(performance.now())
    requestAnimationFrame(()=>this.loop())
  }
}

document.addEventListener('DOMContentLoaded',()=>new Game())
