class PuzzleSystem{
  constructor(game){
    this.g=game
    this.puzzles={}
    this._initAll()
  }
  _initAll(){
    this._add('gate',{
      title:'PORTÃO DE FERRO',
      hint:'Três fechaduras. Três símbolos. Você encontrou as chaves?',
      type:'key_slot',slots:3,keys:['cellar_key','kitchen_key','church_key'],
      placed:[],onComplete:()=>{this.g.a.unlock();return true}
    })
    this._add('cellar_well',{
      title:'O POÇO',
      hint:'A superfície da água reflete algo. Toque na água.',
      type:'click',maxClicks:1,clicks:0,
      onComplete:(g)=>{
        if(g.flags.cellar_well_done)return false
        g.flags.cellar_well_done=true;g.a.water()
        g.showDialogue(['Você toca a água fria. Seus dedos fecham em torno de algo duro.','Você puxa: uma chave enferrujada.'])
        g.addItem('cellar_key',true)
        return true
      }
    })
    this._add('cellar_vent',{
      title:'VENTILAÇÃO',
      hint:'As barras estão enferrujadas. Talvez algo fino possa alavancá-las.',
      type:'use_item',item:'wax',used:false,
      onUse:(g)=>{
        if(g.flags.cellar_vent_done)return false
        g.flags.cellar_vent_done=true
        g.showDialogue(['A cera amolece entre as barras. Você empurra e a grade cede.','Dentro: uma nota amassada.'])
        g.addNote('cellar')
        return true
      }
    })
    this._add('kitchen_stove',{
      title:'FOGÃO',
      hint:'As cinzas estão frias. Sopre para revelar o que está oculto.',
      type:'click',maxClicks:1,clicks:0,
      onComplete:(g)=>{
        if(g.flags.stove_done)return false
        g.flags.stove_done=true;g.a.wind()
        g.showDialogue(['Você sopra as cinzas. Elas se espalham no ar.','No fundo do fogão: gravado na pedra — o símbolo da nota do porão.','E uma chave está escondida nas cinzas.'])
        g.addItem('kitchen_key',true)
        return true
      }
    })
    this._add('kitchen_radio',{
      title:'RÁDIO',
      hint:'O dial está solto. Encontre a frequência certa.',
      type:'dial',target:88.5,current:60,min:60,max:120,
      onCheck:(g,val)=>{
        if(Math.abs(val-88.5)<0.5){
          g.a.radio(880)
          g.showDialogue(['...estático... "Shiva... a terceira cabeça... vê tudo..." ...estático...','... "a hora do passeio se aproxima"...','O rádio chia. Um medalhão cai do compartimento da pilha.'])
          g.addItem('medallion',true)
          return true
        }
        return false
      }
    })
    this._add('kitchen_sink',{
      title:'PIA',
      hint:'A água pinga em um padrão. Conte as gotas.',
      type:'sequence',sequence:[3,5,2,4,1],pos:0,labels:['1 GOTA','2 GOTAS','3 GOTAS','4 GOTAS','5 GOTAS'],
      onInput:(g,val)=>{
        const p=this.get('kitchen_sink')
        const expected=p.sequence[p.pos]
        if(val===expected){
          p.pos++
          if(p.pos>=p.sequence.length){
            g.a.water();g.showDialogue(['O ritmo está correto. O cano range.','Algo cai na pia. Uma chave suja de gordura.'])
            g.addItem('church_key',true)
            return true
          }
          return false
        }else{
          p.pos=0;g.a.wrong()
          return false
        }
      }
    })
    this._add('church_altar',{
      title:'ALTAR DA CAPELA',
      hint:'Três cavidades. Três oferendas. Ciúme, vigilância, punição.',
      type:'offering',slots:3,accepted:['medallion','bell','feather'],placed:[],
      onComplete:(g)=>{
        g.a.chime();g.showDialogue(['As oferendas se encaixam perfeitamente. O altar treme.','Uma passagem se abre. Você sente o peso de seis olhos sobre você.'])
        g.flags.church_altar_done=true
        return true
      }
    })
    this._add('graveyard_1',{
      title:'TÚMULO 1 — MEMÓRIA',
      hint:'O que veio primeiro?',
      type:'click',maxClicks:1,clicks:0,
      onComplete:(g)=>{
        if(g.flags.grave1_done)return false
        g.flags.grave1_done=true;g.a.grave()
        g.showDialogue(['Você escava a terra fofa. Sob a terra: um osso. Dentro do osso: uma chave.'])
        g.addItem('graveyard_key',true)
        return true
      }
    })
    this._add('graveyard_2',{
      title:'TÚMULO 2 — TEMPO',
      hint:'O tempo está parado aqui.',
      type:'click',maxClicks:1,clicks:0,
      onComplete:(g)=>{
        if(g.flags.grave2_done)return false
        g.flags.grave2_done=true;g.a.grave()
        g.showDialogue(['Você cava. Sob a terra: um relógio de bolso parado. Dentro: uma foto.'])
        g.addItem('photo',true)
        return true
      }
    })
    this._add('graveyard_3',{
      title:'TÚMULO 3 — NOME',
      hint:'Qual o seu nome?',
      type:'text_input',answer:'SHIVA',tries:0,
      onCorrect:(g)=>{
        g.a.grave();g.showDialogue(['Você sussurra o nome. A terra se move.','Algo sobe à superfície: uma fita vermelha manchada.'])
        g.addItem('ribbon',true)
        return true
      },
      onWrong:(g)=>{g.a.wrong();g.showDialogue(['Não é esse o nome. Tente novamente.'])}
    })
    this._add('graveyard_4',{
      title:'TÚMULO 4 — MEDO',
      hint:'Enfrente seu medo.',
      type:'click',maxClicks:1,clicks:0,
      onComplete:(g)=>{
        if(g.flags.grave4_done)return false
        g.flags.grave4_done=true;g.a.grave()
        g.showDialogue(['Você enfia a mão na terra escura. Algo toca seus dedos. Uma chave.'])
        g.addItem('mansion_key',true)
        return true
      }
    })
    this._add('graveyard_5',{
      title:'TÚMULO 5 — DESEJO',
      hint:'O que você mais quer?',
      type:'click',maxClicks:1,clicks:0,
      onComplete:(g)=>{
        if(g.flags.grave5_done)return false
        g.flags.grave5_done=true;g.a.grave()
        g.showDialogue(['Você cava. Não há nada. Você cava mais fundo.','Uma caixa. Dentro: uma flor preta fria como metal.'])
        g.addItem('flower',true)
        return true
      }
    })
    this._add('mansion_mirror',{
      title:'O ESPELHO',
      hint:'Seu reflexo está atrasado. Toque quando ele estiver mais distante.',
      type:'timed_click',solved:false,
      onCheck:(g,time)=>{
        const eTime=time-g.puzzleOpenTime
        const delay=1000+Math.sin(time*0.002)*300+200
        if(eTime>delay+100&&eTime<delay+400){
          g.a.chime();g.showDialogue(['O vidro se distorce. Você atravessa a mão.','Do outro lado, alguém deixou cair uma chave.'])
          g.addItem('tower_key',true)
          return true
        }
        g.a.wrong();return false
      }
    })
    this._add('mansion_cabinet',{
      title:'ARMÁRIO DE GAVETAS',
      hint:'6 celas — 6 chaves — 6 símbolos',
      type:'combo',length:3,digits:[0,0,0],target:[6,6,6],
      onCheck:(g,digits)=>{
        if(digits[0]===6&&digits[1]===6&&digits[2]===6){
          g.a.unlock();g.showDialogue(['As gavetas se abrem. Dentro: uma coleira quebrada e um anel de prata.'])
          g.addItem('collar',true);g.addItem('ring',true)
          return true
        }
        g.a.wrong();return false
      }
    })
    this._add('mansion_clock',{
      title:'RELÓGIO DE PÊNDULO',
      hint:'O pêndulo está solto. Use algo para dar corda.',
      type:'use_item',item:'ribbon',used:false,
      onUse:(g)=>{
        g.a.clock();g.showDialogue(['Você amarra o pêndulo com a fita. Ele começa a balançar.','O relógio bate seis vezes. Uma gaveta secreta se abre.','Dentro: uma nota.'])
        g.addNote('mansion')
        return true
      }
    })
    this._add('library_shelf',{
      title:'ESTANTE DA BIBLIOTECA',
      hint:'Vermelho, azul, roxo, dourado, preto.',
      type:'order',items:[
        {label:'VERMELHO',color:'#8a3a3a'},
        {label:'AZUL',color:'#1a2a3a'},
        {label:'ROXO',color:'#3a2a5a'},
        {label:'DOURADO',color:'#c4a46c'},
        {label:'PRETO',color:'#0a0505'}
      ],slotCount:5,placed:[],solved:false,
      onComplete:(g)=>{
        g.a.bell()
        g.showDialogue(['Os livros se alinham. A estante range.','Um compartimento secreto se revela. Dentro: uma pena preta e uma chave.'])
        g.addItem('feather',true);g.addItem('tower_key',true)
        return true
      }
    })
    this._add('tower_shrine',{
      title:'SANTUÁRIO DE SHIVA',
      hint:'Subterrâneo, fogo, tempo, morte, vaidade, altura.',
      type:'candle_order',sequence:[0,1,2,3,4,5],current:0,candles:[
        {label:'PORÃO',lit:false},{label:'COZINHA',lit:false},
        {label:'CAPELA',lit:false},{label:'CEMITÉRIO',lit:false},
        {label:'SALÃO',lit:false},{label:'TORRE',lit:false}
      ],
      onLight:(g,idx)=>{
        const p=this.get('tower_shrine')
        const order=p.sequence
        if(idx===order[p.current]){
          p.current++;p.candles[idx].lit=true;g.a.candle()
          if(p.current>=p.sequence.length){
            g.a.chime();g.showDialogue(['As seis velas acendem. A chama forma um círculo.','O santuário se abre. A chave dourada está lá.','E uma nota — a última.'])
            g.addItem('key6',true);g.addNote('tower')
            g.flags.shrine_done=true
            return true
          }
        }else{
          p.current=0;p.candles.forEach(c=>c.lit=false);g.a.wrong()
        }
        return false
      }
    })
    this._add('final_altar',{
      title:'ALTAR FINAL',
      hint:'Três oferendas para três cabeças.',
      type:'offering',slots:3,accepted:['collar','ring','flower'],placed:[],
      onComplete:(g)=>{
        if(g.flags.final_done)return false
        const hasKeys=['cellar_key','kitchen_key','church_key','graveyard_key','mansion_key','tower_key','key6']
          .filter(k=>g.obtained.includes(k)).length
        const hasNotes=['note_cellar','note_kitchen','note_church','note_graveyard','note_mansion','note_tower']
          .filter(n=>g.obtained.includes(n)).length
        const hasProt=['photo','medallion','bell','feather','collar','ring','shard','lantern']
          .filter(p=>g.obtained.includes(p)).length
        if(hasKeys>=7&&hasNotes>=6&&hasProt>=5){
          g.a.final()
          g.endGame('walk')
        }else if(hasKeys>=7&&hasProt>=3){
          g.a.final()
          g.endGame('collar')
        }else{
          g.a.wrong()
          g.showDialogue(['Nada acontece. Faltam oferendas. Faltam chaves. Falta memória.','Você não está pronto para o Passeio.'])
          return false
        }
        return true
      }
    })
  }
  _add(id,config){this.puzzles[id]=config}
  get(id){return this.puzzles[id]}
  isSolved(id){
    const p=this.puzzles[id]
    if(!p)return false
    if(p.type==='click')return p.clicks>=p.maxClicks
    if(p.type==='key_slot')return p.placed.length>=p.slots
    if(p.type==='use_item')return p.used
    if(p.type==='sequence')return p.pos>=p.sequence.length
    if(p.type==='offering')return p.placed.length>=p.slots
    if(p.type==='dial')return p.solved||false
    if(p.type==='combo')return p.solved||false
    if(p.type==='order')return p.solved||false
    if(p.type==='candle_order')return p.current>=p.sequence.length
    if(p.type==='text_input')return p.solved||false
    if(p.type==='timed_click')return false
    return false
  }
}
