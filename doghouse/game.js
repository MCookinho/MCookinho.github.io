// ── Doghouse (Terror de Shiva) — Escape Room ──
// Jogo de terror point-and-click acessado pelo easter egg "passear"
// da Shiva. O jogador precisa explorar salas, coletar itens,
// combinar objetos e resolver puzzles para escapar.
// Views: north, east, south, west, ceiling (com/sem lanterna).
// Itens combináveis: pedra+espelho, fósforo+vela, corda+gancho, etc.
// Controles: clique nas laterais/topo para navegar, clique em
// objetos para interagir, drag & drop no inventário para combinar.

// ── Item Definitions ──
const ITEMS_ICON = {
  pedra:'🪨', caco_vidro:'💎', fosforo:'🔥', vela:'🕯️',
  vela_acesa:'🕯️✨', corda:'🪢', gancho:'🪝', corda_gancho:'🪝🪢',
  ferro:'🔩', chave_1:'🗝️¹', chave_2:'🗝️²', chave_3:'🗝️³',
  chave_12:'🗝️¹²', chave_completa:'🔑✓',
  guia:'🦮', coleira:'⛓️', bola:'⚾', osso:'🦴'
}

const ITEMS_NAME = {
  pedra:'Pedra', caco_vidro:'Caco de Vidro', fosforo:'Fósforo', vela:'Vela',
  vela_acesa:'Vela Acesa', corda:'Corda', gancho:'Gancho', corda_gancho:'Corda com Gancho',
  ferro:'Barra de Ferro', chave_1:'Fragmento de Chave I', chave_2:'Fragmento de Chave II',
  chave_3:'Fragmento de Chave III', chave_12:'Dois Fragmentos',
  chave_completa:'Chave Completa',
  guia:'Guia', coleira:'Coleira', bola:'Bola', osso:'Osso'
}

// ── Room Views ──
// Cada parede (north/east/south/west) e o teto (ceiling) possuem
// uma lista de objetos clicáveis. O teto tem uma variante
// "ceiling_lantern" que aparece quando a vela está acesa.
const VIEWS = {
  north: [
    {id:'porta',name:'PORTA',desc:'Madeira grossa, ferro, três fechaduras.',type:'door'},
    {id:'grade',name:'GRADE',desc:'Barras de ferro presas na parede.',type:'grate'},
    {id:'janela',name:'JANELA',desc:'Gradeada. Lá fora, escuridão.',type:'examine'},
    {id:'cruz',name:'CRUZ',desc:'Enferrujada. As marcas dos pregos.',type:'examine'},
    {id:'ferramentas',name:'CAIXA DE FERRAMENTAS',desc:'Caixa de metal enferrujada.',type:'item',gives:'ferro'}
  ],
  east: [
    {id:'marcas',name:'ARRANHÕES',desc:'Três marcas estranhas na madeira: ⚬, ◉, —.',type:'examine'},
    {id:'prateleira',name:'PRATELEIRA',desc:'Empoeirada.',type:'shelf'},
    {id:'espelho',name:'ESPELHO',desc:'Trincado. O reflexo é seu mas não parece.',type:'mirror'},
    {id:'teia',name:'TEIA DE ARANHA',desc:'A aranha observa.',type:'examine'},
    {id:'tijolo',name:'BURACO',desc:'Um buraco escuro na parede.',type:'brick'}
  ],
  south: [
    {id:'inscricao',name:'INSCRIÇÃO',desc:'"ESQUEÇA" — a palavra lateja.',type:'examine'},
    {id:'ralo',name:'RALO',desc:'No chão. Água escura.',type:'drain'},
    {id:'assoalho',name:'ASSOALHO',desc:'Tábua solta no chão.',type:'floorboard'},
    {id:'bola_assoalho',name:'BOLA',desc:'Bola velha embaixo do assoalho.',type:'floorboard_ball'},
    {id:'goteira',name:'GOTEIRA',desc:'Ping... ping...',type:'examine'},
    {id:'pedra_obj',name:'PEDRA',desc:'No chão. Pesada.',type:'item',gives:'pedra'}
  ],
  west: [
    {id:'gaveta',name:'GAVETA',desc:'Trancada. Três pinos de metal.',type:'drawer'},
    {id:'diario',name:'DIÁRIO',desc:'Páginas amareladas.',type:'diary'},
    {id:'bancada',name:'BANCADA',desc:'Marca de unhas na madeira.',type:'examine'},
    {id:'corda_obj',name:'CORDA',desc:'Pendurada na parede.',type:'item',gives:'corda'}
  ],
  ceiling: [
    {id:'corrente',name:'CORRENTE',desc:'Pendurada. Um gancho na ponta.',type:'chain'},
    {id:'alcapao',name:'ALÇAPÃO',desc:'No teto. Trancado por fora.',type:'hatch'},
    {id:'olhos',name:'OLHOS...',desc:'Brilham na escuridão.',type:'examine'}
  ],
  ceiling_lantern: [
    {id:'corrente',name:'CORRENTE',desc:'Pendurada. Um gancho na ponta.',type:'chain'},
    {id:'alcapao',name:'ALÇAPÃO',desc:'No teto. Trancado por fora.',type:'hatch'},
    {id:'olho_shiva',name:'OLHO DE SHIVA',desc:'Um olho brilhante. Algo deve ser oferecido.',type:'offering'},
    {id:'boca_shiva',name:'BOCA DE SHIVA',desc:'A boca escancarada. Precisa de uma oferenda.',type:'offering'},
    {id:'pata_shiva',name:'PATA DE SHIVA',desc:'A pata dianteira. Um espaço vazio.',type:'offering'},
  ]
}

/* Fixed hitboxes for normal interactables */
// ── Hitboxes (clique em cada objeto) ──
// Coordenadas {x, y, w, h} fixas para cada objeto clicável.
// Usadas pelo handleClick para detectar em qual objeto o jogador clicou.
const HITBOXES = {
  north: {
    porta:{x:270,y:8,w:260,h:440},
    grade:{x:50,y:190,w:110,h:160},
    janela:{x:580,y:130,w:100,h:90},
    cruz:{x:630,y:250,w:24,h:60},
    ferramentas:{x:555,y:395,w:115,h:75}
  },
  east: {
    marcas:{x:80,y:373,w:200,h:20},
    prateleira:{x:30,y:70,w:320,h:300},
    espelho:{x:430,y:80,w:220,h:280},
    teia:{x:40,y:75,w:30,h:20},
    tijolo:{x:555,y:375,w:40,h:40}
  },
  south: {
    inscricao:{x:140,y:250,w:320,h:100},
    ralo:{x:330,y:470,w:140,h:50},
    assoalho:{x:240,y:465,w:120,h:35},
    bola_assoalho:{x:260,y:472,w:80,h:28},
    goteira:{x:380,y:60,w:40,h:60},
    pedra_obj:{x:90,y:465,w:55,h:33}
  },
  west: {
    bancada:{x:70,y:275,w:580,h:100},
    gaveta:{x:220,y:295,w:180,h:65},
    diario:{x:402,y:238,w:72,h:37},
    corda_obj:{x:610,y:60,w:25,h:220}
  },
  ceiling: {
    corrente:{x:380,y:40,w:40,h:220},
    alcapao:{x:300,y:300,w:200,h:80},
    olhos:{x:200,y:140,w:120,h:70}
  },
  ceiling_lantern: {
    corrente:{x:380,y:40,w:40,h:220},
    alcapao:{x:300,y:300,w:200,h:80},
    olho_shiva:{x:210,y:135,w:35,h:25},
    boca_shiva:{x:178,y:172,w:35,h:20},
    pata_shiva:{x:282,y:227,w:38,h:35}
  }
}

// ── Game Class ──
// Classe principal que orquestra todo o jogo: inventário, navegação
// entre salas, interações com objetos, puzzles, sistema de oferendas
// a Shiva, aparições aleatórias e game loop.
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
    this.lastWallView=0
    this.introStep=0
    this.shivaOffered={eye:false,mouth:false,paw:false}
    this.ceilingPuzzleSolved=false
    this.floorboardRaised=false
    this.flags={}
    this.anim=null
    this.a.init()
    this.setupUI()
    this.loop()
    setTimeout(()=>{this.engine.showIntro(STORY.intro);this.a.startDrone()},100)
    setTimeout(()=>this.startShivaTimer(),3000)
  }

  // ── Inventário (drag & drop / clique) ──
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
      if(!silent)this.engine.tooltip(ITEMS_NAME[id]+' — pego.',3000)
      // pickup toast animation
      this.anim={type:'pickup',item:id,icon:ITEMS_ICON[id]||'·',name:ITEMS_NAME[id]||id,startTime:performance.now(),duration:1000,xOff:0}
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

  removeItemById(id){
    const idx=this.inventory.indexOf(id)
    if(idx>=0)this.removeItem(idx)
  }

  hasItem(id){return this.inventory.includes(id)}
  hasObtained(id){return this.obtainedItems.includes(id)}

  // ── Combinação de Itens ──
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

  // ── Clique / Navegação ──
  handleClick(x,y){
    if(this.view===4){
      if(y>570)return this.goDown()
    }else{
      if(y<30)return this.goUp()
      if(x<50)return this.goLeft()
      if(x>750)return this.goRight()
    }

    let vk=['north','east','south','west','ceiling'][this.view]
    let objs=VIEWS[vk]
    let hbs=HITBOXES[vk]

    if(vk==='ceiling'&&this.candleLit){
      objs=VIEWS.ceiling_lantern
      hbs=HITBOXES.ceiling_lantern
    }

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

  // ── Interações por Tipo ──
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
      case 'floorboard_ball': return this.interactFloorboardBall()
      case 'drawer':
        if(PUZZLES.drawer.solved){
          if(!this.hasObtained('fosforo')){
            this.addItem('fosforo',false)
          }else{
            this.engine.tooltip('A gaveta está vazia.')
          }
          return
        }
        return this.startPuzzle('drawer')
      case 'diary': return this.readDiary()
      case 'chain': return this.interactChain(item)
      case 'hatch': return this.interactHatch(item)
      case 'offering': return this.interactOffering(obj,item)
      case 'item': return this.pickupItem(obj)
      default: this.engine.tooltip(obj.desc||'...')
    }
  }

  // Pegar item genérico do ambiente (ferro, pedra, corda, etc.)
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

  // Porta principal — verifica qual item foi usado e dispara o final correspondente
  /* ─── DOOR (endings) ─── */
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

    if(item==='guia'&&this.ceilingPuzzleSolved&&this.diaryRead){
      this.a.final()
      this.a.bell()
      this.engine.showFinal(STORY.endings.walk.title,STORY.endings.walk.text)
      this.engine.state=S.FINAL
      return
    }

    this.engine.tooltip(ITEMS_NAME[item]+' não funciona na porta.')
  }

  // Grade — barra de ferro que precisa ser forçada para obter a guia
  /* ─── GRATE → GUIÁ ─── */
  interactGrate(item){
    if(this.hasObtained('guia')){
      this.engine.tooltip('A grade está quebrada.')
      return
    }
    if(item==='ferro'){
      this.a.chain()
      this.engine.tooltip('A grade range! Uma guia velha cai.',3000)
      this.addItem('guia',false)
      this.selectedItem=null;this.renderInventory()
      return
    }
    if(!item)this.engine.tooltip('Barras de ferro. Preciso de algo para forçar.')
    else this.engine.tooltip(ITEMS_NAME[item]+' não quebra a grade.')
  }

  // Prateleira — coleta a vela
  /* ─── SHELF ─── */
  interactShelf(item){
    if(this.hasObtained('vela')){
      this.engine.tooltip('A prateleira está vazia.')
      return
    }
    this.addItem('vela',false)
  }

  // Espelho — quebrar com pedra para obter caco de vidro
  /* ─── MIRROR ─── */
  interactMirror(item){
    if(this.hasObtained('caco_vidro')){
      this.engine.tooltip('O espelho já está quebrado.')
      return
    }
    if(item==='pedra'){
      this.a.glassBreak()
      this.engine.tooltip('O espelho estilhaça! Um caco no chão.',2000)
      this.addItem('caco_vidro',false)
      this.selectedItem=null;this.renderInventory()
      return
    }
    this.engine.tooltip('O espelho está trincado. Dá pra quebrar com algo.')
  }

  // Buraco no tijolo — precisa de luz para encontrar fragmento de chave
  /* ─── BRICK (needs candle) ─── */
  interactBrick(item){
    if(this.hasObtained('chave_1')){
      this.engine.tooltip('O buraco está vazio.')
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

  // Ralo — abrir com barra de ferro para obter fragmento de chave
  /* ─── DRAIN (needs lantern + iron bar) ─── */
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
    if(!item)this.engine.tooltip('O ralo está tampado. Preciso de algo para abrir.')
    else this.engine.tooltip(ITEMS_NAME[item]+' não abre o ralo.')
  }

  // Assoalho — levantar tábua para encontrar bola (dois passos)
  /* ─── FLOORBOARD (two-step: lift, then grab ball) ─── */
  interactFloorboard(item){
    if(this.floorboardRaised){
      if(this.hasObtained('bola')){
        this.engine.tooltip('O assoalho está levantado. Vazio.')
      }else{
        this.interactFloorboardBall()
      }
      return
    }
    if(!this.candleLit){
      this.engine.tooltip('Não vejo direito no escuro.')
      return
    }
    this.a.dig()
    this.floorboardRaised=true
    this.engine.tooltip('A tábua range! Uma bola velha embaixo.',3000)
  }

  // Pegar bola de baixo do assoalho levantado
  /* ─── GRAB BALL from under floorboard ─── */
  interactFloorboardBall(){
    if(!this.floorboardRaised)return
    if(this.hasObtained('bola')){
      this.engine.tooltip('Já pegou a bola.')
      return
    }
    this.addItem('bola',false)
  }

  // Corrente — forçar com barra de ferro para obter gancho
  /* ─── CHAIN ─── */
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

  // Alçapão — alcançar com corda+gancho para obter osso
  /* ─── HATCH ─── */
  interactHatch(item){
    if(this.hasObtained('osso')){
      this.engine.tooltip('O alçapão está aberto. Vazio.')
      return
    }
    if(item==='corda_gancho'){
      this.a.unlock()
      this.engine.tooltip('O gancho prende no alçapão! Um osso cai.',3000)
      this.addItem('osso',false)
      this.removeItemById('corda_gancho')
      this.selectedItem=null;this.renderInventory()
      return
    }
    this.engine.tooltip('Alçapão no teto. Muito alto. Preciso de algo para alcançar.')
  }

  // Oferendas a Shiva — oferecer caco_vidro, bola e osso nos três espaços
  /* ─── CEILING OFFERING PUZZLE ─── */
  interactOffering(obj,item){
    if(this.ceilingPuzzleSolved){
      this.engine.tooltip('As oferendas foram aceitas.')
      return
    }

    let slotKey,itemNeeded
    if(obj.id==='olho_shiva'){slotKey='eye';itemNeeded='caco_vidro'}
    else if(obj.id==='boca_shiva'){slotKey='mouth';itemNeeded='bola'}
    else if(obj.id==='pata_shiva'){slotKey='paw';itemNeeded='osso'}
    else return

    if(this.shivaOffered[slotKey]){
      this.engine.tooltip('Este espaço já foi preenchido.')
      return
    }

    if(!item||item!==itemNeeded){
      this.engine.tooltip('Precisa de '+ITEMS_NAME[itemNeeded]+' aqui.')
      return
    }

    this.a.dig()
    this.engine.tooltip(ITEMS_NAME[item]+' oferecido a Shiva.',2000)
    this.shivaOffered[slotKey]=true
    this.removeItemById(item)
    this.selectedItem=null
    this.renderInventory()

    if(this.shivaOffered.eye&&this.shivaOffered.mouth&&this.shivaOffered.paw){
      this.ceilingPuzzleSolved=true
      this.a.unlock()
      setTimeout(()=>{
        this.engine.tooltip('Shiva aceitou as oferendas! Fragmento de chave e coleira caem do teto.',4000)
        this.addItem('chave_2',false)
        this.addItem('coleira',false)
      },500)
    }
  }

  // Diário — lê e marca flag para o final "passear"
  /* ─── DIARY ─── */
  readDiary(){
    this.diaryRead=true
    this.a.paper()
    this.engine.showDiary(STORY.diary)
  }

  // Puzzle mini-game — abre interface de puzzle (ex: gaveta com pinos)
  /* ─── PUZZLE ─── */
  startPuzzle(id){
    const p=PUZZLES[id]
    if(!p)return
    if(p.solved){this.engine.tooltip('Já resolveu.');return}
    if(!p.inited){if(p.init)p.init();p.inited=true}
    this.engine.openPuzzle(p)
  }

  /* ─── VIEW NAVIGATION ─── */
  goLeft(){
    if(this.view===4)return
    let idx=this.view-1
    if(idx<0)idx=3
    this.engine.flashView(()=>{this.view=idx;this.a.step()})
  }
  goRight(){
    if(this.view===4)return
    let idx=this.view+1
    if(idx>3)idx=0
    this.engine.flashView(()=>{this.view=idx;this.a.step()})
  }
  goUp(){
    if(this.view===4)return
    this.lastWallView=this.view
    this.engine.flashView(()=>{this.view=4;this.a.step()})
  }
  goDown(){
    if(this.view!==4)return
    this.engine.flashView(()=>{this.view=this.lastWallView;this.a.step()})
  }

  // ── Shiva Timer (aparições aleatórias) ──
  // Agenda aparições de Shiva em intervalos de 90-180s.
  // Quando ativo, a tela escurece e Shiva aparece brevemente.
  // Para quando o puzzle do teto é resolvido.
  /* ─── SHIVA TIMER (rare appearances) ─── */
  startShivaTimer(){
    const next=90000+Math.random()*90000
    this.shivaTimer=setTimeout(()=>{
      if(this.engine.state===S.PLAYING&&!this.ceilingPuzzleSolved){
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

  // ── Game Loop ──
  // requestAnimationFrame — limpa animações expiradas e renderiza a cada frame
  /* ─── GAME LOOP ─── */
  loop(){
    const now=performance.now()
    // Auto-cleanup expired animation
    if(this.anim&&now-this.anim.startTime>=this.anim.duration)this.anim=null
    this.engine.render(now)
    requestAnimationFrame(()=>this.loop())
  }
}

document.addEventListener('DOMContentLoaded',()=>new Game())
