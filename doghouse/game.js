class Game{
  constructor(){
    window.__game=this
    this.engine=new Engine()
    this.a=new AudioSys()
    this.puzzles=new PuzzleSystem(this)
    this.flags={}
    this.inventory=[]
    this.obtained=[]
    this.notes=[]
    this.currentScene='corridor_1'
    this.day=7
    this.lanternFuel=100
    this.selectedItem=null
    this.running=false
    this.puzzleOpenTime=0
    this.engine.currentPuzzleCb=null
    this.shivaVisible=false
    this.shivaTimer=0
    this.fadingDesc=''
    this.init()
  }
  init(){
    document.getElementById('loading-text').style.display='none'
    document.getElementById('hud').style.display='block'
    this.initHUD()
    this.engine.setScene('corridor_1')
    this.engine.on('click',(x,y)=>{
      this.a.resume()
      this.handleClick(x,y)
    })
    this.startLoop()
    this.a.init()
    this.showIntro()
  }
  showIntro(){
    this.engine.showDialogue(STORY.intro,()=>{
      this.engine.showDialogue([
        'Toque nos objetos para interagir. Clique nas portas para navegar.',
        'Use o inventário na parte inferior para selecionar itens.',
        'Colete notas, encontre chaves, e prepare-se para o Passeio.'
      ])
    })
  }
  initHUD(){
    const memBar=document.getElementById('hud-memories')
    memBar.innerHTML=''
    for(let i=0;i<6;i++){
      const div=document.createElement('div');div.className='mem-slot'
      div.id='mem-'+i;div.textContent='○';memBar.appendChild(div)
    }
    this.renderInventory()
  }
  renderInventory(){
    const bar=document.getElementById('inventory-bar')
    bar.innerHTML=''
    const maxSlots=7
    for(let i=0;i<maxSlots;i++){
      const slot=document.createElement('div');slot.className='slot'
      slot.style.position='relative'
      if(i<this.inventory.length){
        const item=this.inventory[i]
        slot.textContent=this._itemIcon(item)
        slot.title=this._itemName(item)
        if(this.selectedItem===i)slot.classList.add('selected')
        slot.addEventListener('click',()=>this.selectItem(i))
      }else{
        slot.textContent='·'
        slot.style.color='#1a0a0a'
      }
      bar.appendChild(slot)
    }
    this.updateMemories()
    this.updateLantern()
    this.updateDay()
  }
  _itemIcon(id){
    const icons={
      cellar_key:'🔑',kitchen_key:'🗝️',church_key:'⚷',graveyard_key:'🦴',
      mansion_key:'🗝️',tower_key:'🔑',key6:'✧',match:'🔥',wax:'🕯️',
      photo:'📷',medallion:'📿',bell:'🔔',feather:'🪶',skull:'💀',
      collar:'📿',ribbon:'🎀',shard:'🪞',flower:'🌺',ring:'💍',
      mirror:'🪞',candle:'🕯️',lantern:'🏮',rope:'🪢',heart:'❤️'
    }
    return icons[item]||'·'
  }
  _itemName(id){
    const names={
      cellar_key:'Chave do Porão',kitchen_key:'Chave da Cozinha',church_key:'Chave da Capela',
      graveyard_key:'Chave do Cemitério',mansion_key:'Chave do Salão',tower_key:'Chave da Torre',
      key6:'Chave Dourada',match:'Fósforo',wax:'Pedaço de Vela',
      photo:'Fotografia Antiga',medallion:'Medalhão',bell:'Sino de Bronze',
      feather:'Pena Preta',skull:'Caveira',collar:'Coleira Quebrada',
      ribbon:'Fita Vermelha',shard:'Caco de Espelho',flower:'Flor Preta',
      ring:'Anel de Prata',mirror:'Espelho de Mão',candle:'Vela Inteira',
      lantern:'Lanterna',rope:'Corda',heart:'Coração de Pedra'
    }
    return names[id]||id
  }
  selectItem(idx){
    if(this.selectedItem===idx){this.selectedItem=null}
    else{this.selectedItem=idx}
    this.renderInventory()
    if(this.selectedItem!==null){
      const item=this.inventory[this.selectedItem]
      this.engine.setDesc(this._itemName(item)+' selecionado')
    }else{
      this.engine.clearDesc()
    }
  }
  hasItem(id){return this.inventory.includes(id)}
  addItem(id,silent){
    if(!this.obtained.includes(id))this.obtained.push(id)
    if(this.inventory.length<7&&!this.hasItem(id)){
      this.inventory.push(id)
      this.a.pickup()
      this.renderInventory()
      if(!silent)this.engine.showDialogue(['Você pegou: '+this._itemName(id)+'.'])
    }else if(this.hasItem(id)){
      if(!silent)this.engine.showDialogue(['Você já tem isso.'])
    }else{
      if(!silent)this.engine.showDialogue(['Seu inventário está cheio.'])
    }
  }
  removeItem(id){
    const idx=this.inventory.indexOf(id)
    if(idx>-1){
      this.inventory.splice(idx,1)
      if(this.selectedItem===idx)this.selectedItem=null
      else if(this.selectedItem>idx)this.selectedItem--
      this.renderInventory()
    }
  }
  addNote(id){
    if(!this.notes.includes(id)){
      this.notes.push(id)
      if(!this.obtained.includes('note_'+id))this.obtained.push('note_'+id)
      this.a.paper()
      const note=STORY.notes[id]
      this.engine.showNote(note.title,note.text,note.symbol)
      this.updateMemories()
    }
  }
  updateMemories(){
    for(let i=0;i<6;i++){
      const el=document.getElementById('mem-'+i)
      if(el){
        const noteIds=['cellar','kitchen','church','graveyard','mansion','tower']
        if(i<this.notes.length){
          el.textContent=STORY.notes[noteIds[i]].symbol
          el.className='mem-slot filled'
        }else{
          el.textContent='○'
          el.className='mem-slot'
        }
      }
    }
  }
  updateLantern(){
    const fill=document.querySelector('#hud-lantern .fill')
    if(fill)fill.style.width=this.lanternFuel+'%'
  }
  updateDay(){
    document.getElementById('hud-day').textContent='DIA '+this.day
  }
  startLoop(){
    this.running=true
    this.lastTime=performance.now()
    this.loop()
  }
  loop(){
    if(!this.running)return
    const now=performance.now()
    const dt=now-this.lastTime
    this.lastTime=now
    this.update(dt,now)
    this.engine.render(now)
    requestAnimationFrame(()=>this.loop())
  }
  update(dt,time){
    if(this.engine.inputLocked||this.engine.transitioning)return
    this.updateShiva(time)
    this.updateLanternFuel(dt)
    this.updateWatching(time)
  }
  updateShiva(time){
    const shivaScenes=['corridor_1','corridor_3','corridor_5','tunnel']
    if(shivaScenes.includes(this.currentScene)){
      this.shivaTimer+=time
      if(this.shivaTimer%6000<200){
        this.shivaVisible=true
      }else{
        this.shivaVisible=false
      }
    }else if(this.currentScene==='tower'){
      this.shivaVisible=true
    }else if(this.currentScene==='cellar'||this.currentScene==='church'||this.currentScene==='graveyard'){
      this.shivaVisible=Math.sin(time*0.0005)>0.9
    }else{
      this.shivaVisible=false
    }
  }
  updateWatching(time){
    const el=document.getElementById('hud-watching')
    if(this.shivaVisible){
      el.classList.add('active')
    }else{
      el.classList.remove('active')
    }
  }
  updateLanternFuel(dt){
    if(this.currentScene!=='tunnel')return
    this.lanternFuel-=dt*0.002
    if(this.lanternFuel<0)this.lanternFuel=0
    this.updateLantern()
  }
  handleClick(x,y){
    if(this.engine.inputLocked||this.engine.transitioning)return
    const obj=this.engine.findHitObject(x,y)
    if(obj)this.interact(obj)
  }
  interact(obj){
    this.engine.clearDesc()
    switch(obj.type){
      case 'exit':
        this.goTo(obj.target)
        break
      case 'item':
        this.addItem(obj.gives)
        if(obj.onPickup)obj.onPickup(this)
        break
      case 'examine':
        if(obj.onExamine)this.handleExamine(obj.onExamine)
        else this.engine.showDialogue([obj.desc||'Nada de especial.'])
        break
      case 'puzzle':
        this.startPuzzle(obj)
        break
      case 'locked':
        if(obj.puzzle&&this.puzzles.isSolved(obj.puzzle)){
          if(obj.target)this.goTo(obj.target)
          else this.engine.showDialogue(['Agora está aberto.'])
        }else{
          if(obj.puzzle)this.startPuzzle(obj)
          else this.engine.showDialogue([obj.desc||'Está trancado.'])
        }
        break
      case 'decor':
      default:
        this.engine.showDialogue([obj.desc||'Nada de especial.'])
        break
    }
  }
  handleExamine(action){
    switch(action){
      case 'cellar_note':this.addNote('cellar');break
      case 'kitchen_note':this.addNote('kitchen');break
      case 'pantry_find':
        this.engine.showDialogue(['Você encontra um pano sujo. Debaixo dele: um fósforo.'])
        this.addItem('match',true)
        break
      case 'church_note':this.addNote('church');break
      case 'graveyard_note':this.addNote('graveyard');break
      case 'mansion_note':this.addNote('mansion');break
      case 'tower_note':this.addNote('tower');break
      case 'final_eye':
        this.engine.showDialogue(['O olho de Shiva. Ele vê através de você.','Seis memórias. Seis celas. Você lembra de tudo agora.'])
        break
      case 'memory_1':
        this.engine.showDialogue(['Uma memória: você era uma criança. Havia três cães. Um deles te mordeu.'])
        this.flags.memory1=true
        break
      default:
        this.engine.showDialogue(['Você observa atentamente.'])
    }
  }
  goTo(target){
    if(!DIORAMAS[target]){
      this.engine.showDialogue(['Não há saída aqui.'])
      return
    }
    const current=DIORAMAS[this.currentScene]
    if(current.id==='tunnel'&&target==='end'){
      this.endGame('bone')
      return
    }
    this.a.door()
    this.engine.transitionTo(target,()=>{
      this.currentScene=target
      const scene=DIORAMAS[target]
      if(scene.day&&scene.day!==this.day){
        this.day=scene.day
        this.updateDay()
        if(this.day===8){
          this.engine.showDialogue(['O segundo dia. O ar mudou. Shiva está mais perto.'])
        }
      }
    })
  }
  startPuzzle(obj){
    if(!obj.puzzle)return
    const puz=this.puzzles.get(obj.puzzle)
    if(!puz)return
    if(this.puzzles.isSolved(obj.puzzle)){
      this.engine.showDialogue(['Você já resolveu isso.'])
      return
    }
    this.puzzleOpenTime=performance.now()
    switch(puz.type){
      case 'click':
        this.handleClickPuzzle(obj,puz)
        break
      case 'key_slot':
        this.handleKeySlotPuzzle(obj,puz)
        break
      case 'use_item':
        this.handleUseItemPuzzle(obj,puz)
        break
      case 'dial':
        this.handleDialPuzzle(obj,puz)
        break
      case 'sequence':
        this.handleSequencePuzzle(obj,puz)
        break
      case 'offering':
        this.handleOfferingPuzzle(obj,puz)
        break
      case 'timed_click':
        this.handleTimedClickPuzzle(obj,puz)
        break
      case 'combo':
        this.handleComboPuzzle(obj,puz)
        break
      case 'order':
        this.handleOrderPuzzle(obj,puz)
        break
      case 'candle_order':
        this.handleCandlePuzzle(obj,puz)
        break
      case 'text_input':
        this.handleTextInputPuzzle(obj,puz)
        break
      default:
        this.engine.showDialogue(['Nada acontece.'])
    }
  }
  handleClickPuzzle(obj,puz){
    if(puz.clicks<puz.maxClicks){
      puz.clicks++
      const ok=puz.onComplete(this)
      if(ok)this.renderInventory()
      else{puz.clicks--}
    }
  }
  handleKeySlotPuzzle(obj,puz){
    if(this.selectedItem===null){
      this.engine.showDialogue(['Selecione uma chave no inventário primeiro.'])
      return
    }
    const item=this.inventory[this.selectedItem]
    if(puz.keys.includes(item)&&!puz.placed.includes(item)){
      puz.placed.push(item)
      this.removeItem(item)
      this.a.key()
      if(puz.placed.length>=puz.slots){
        puz.onComplete(this)
        this.renderInventory()
        this.engine.showDialogue(['Todas as fechaduras se abrem. O portão range.'])
      }else{
        this.engine.showDialogue(['A chave encaixa. Faltam '+(puz.slots-puz.placed.length)+' chaves.'])
      }
    }else{
      this.engine.showDialogue([STORY.descriptions.wrong_key])
    }
    this.renderInventory()
  }
  handleUseItemPuzzle(obj,puz){
    if(this.selectedItem===null){
      this.engine.showDialogue(['Selecione um item primeiro.'])
      return
    }
    const item=this.inventory[this.selectedItem]
    if(item===puz.item){
      puz.used=true
      this.removeItem(item)
      const ok=puz.onUse(this)
      if(ok)this.renderInventory()
    }else{
      this.engine.showDialogue([STORY.descriptions.default_use])
    }
  }
  handleDialPuzzle(obj,puz){
    let val=puz.current
    const html=`
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
        <div style="font-size:40px;color:#c4a46c">${val.toFixed(1)}</div>
        <input type="range" min="${puz.min}" max="${puz.max}" value="${val}" step="0.1"
          style="width:200px" id="dial-slider">
        <div style="font-size:11px;color:#5a3a5a">ENCONTRE A FREQUÊNCIA</div>
      </div>`
    this.engine.showPuzzle(puz.title,puz.hint,html,(action)=>{
      if(action==='confirm'){
        const slider=document.getElementById('dial-slider')
        const v=parseFloat(slider.value)
        const ok=puz.onCheck(this,v)
        if(ok){
          puz.solved=true
          this.renderInventory()
          this.engine.closePuzzle()
        }else{
          document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Estático... frequência errada.'
        }
      }
    })
    const slider=document.getElementById('dial-slider')
    if(slider){
      slider.addEventListener('input',()=>{
        const v=parseFloat(slider.value)
        document.querySelector('#puzzle-overlay .puzzle-ui div div').textContent=v.toFixed(1)
      })
    }
  }
  handleSequencePuzzle(obj,puz){
    const html=`
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center">
        <div class="puz-btn" data-seq="1">1 GOTA</div>
        <div class="puz-btn" data-seq="2">2 GOTAS</div>
        <div class="puz-btn" data-seq="3">3 GOTAS</div>
        <div class="puz-btn" data-seq="4">4 GOTAS</div>
        <div class="puz-btn" data-seq="5">5 GOTAS</div>
      </div>`
    this.engine.showPuzzle(puz.title,puz.hint,html,(action)=>{
      if(action==='confirm'){
        this.engine.closePuzzle()
      }
    })
    const ui=document.getElementById('puzzle-overlay').querySelector('.puzzle-ui')
    ui.querySelectorAll('[data-seq]').forEach(el=>{
      el.addEventListener('click',()=>{
        const val=parseInt(el.dataset.seq)
        const ok=puz.onInput(this,val)
        const msg=document.getElementById('puzzle-overlay').querySelector('.puzzle-msg')
        if(ok){
          msg.textContent='O padrão está correto!'
          this.renderInventory()
          setTimeout(()=>this.engine.closePuzzle(),500)
        }else{msg.textContent='Padrão errado. Recomece.'}
      })
    })
  }
  handleOfferingPuzzle(obj,puz){
    const items=puz.placed.slice()
    const html=`
      <div style="display:flex;gap:12px;margin:10px 0">
        ${puz.accepted.map((a,i)=>`
          <div class="puz-slot-box ${items[i]?'filled':''}" data-idx="${i}" style="${items[i]?'border-color:#c4a46c':''}">
            ${items[i]?this._itemIcon(items[i]):'?'}
          </div>
        `).join('')}
      </div>
      <div style="font-size:11px;color:#5a3a5a">Selecione um item do inventário e clique no slot</div>`
    this.engine.showPuzzle(puz.title,puz.hint,html,(action)=>{
      if(action==='confirm'){
        if(puz.placed.length>=puz.slots){
          const ok=puz.onComplete(this)
          if(ok){this.renderInventory();this.engine.closePuzzle()}
        }else{
          document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Faltam oferendas.'
        }
      }
    })
    setTimeout(()=>{
      document.querySelectorAll('.puz-slot-box').forEach(el=>{
        el.addEventListener('click',()=>{
          if(this.selectedItem===null){
            document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Selecione um item primeiro.'
            return
          }
          const idx=parseInt(el.dataset.idx)
          const item=this.inventory[this.selectedItem]
          if(puz.accepted.includes(item)&&!puz.placed.includes(item)){
            puz.placed[idx]=item
            this.removeItem(item)
            this.selectedItem=null
            this.renderInventory()
            el.textContent=this._itemIcon(item)
            el.style.borderColor='#c4a46c'
            document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Oferenda colocada.'
          }else{
            document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Isso não serve como oferenda.'
          }
        })
      })
    },50)
  }
  handleTimedClickPuzzle(obj,puz){
    this.puzzleOpenTime=performance.now()
    this.engine.showDialogue(['Aguarde o momento certo... e clique no espelho quando seu reflexo estiver mais distante.'],()=>{
      this.engine.lockInput()
      const checkInterval=setInterval(()=>{
        const now=performance.now()
        const eTime=now-this.puzzleOpenTime
        const delay=1000+Math.sin(now*0.002)*300+200
        if(eTime>delay+100&&eTime<delay+400){
          clearInterval(checkInterval)
          this.engine.unlockInput()
          this.engine.showDialogue(['Clique AGORA no espelho!'],()=>{
            this.engine.lockInput()
            this.engine.onClickOnce((x,y)=>{
              if(Math.abs(x-390)<100&&Math.abs(y-200)<100){
                puz.onCheck(this,now)
                this.renderInventory()
              }else{
                this.engine.showDialogue(['Você errou o momento. Tente novamente.'])
              }
              this.engine.unlockInput()
            })
          })
        }else if(eTime>delay+1000){
          clearInterval(checkInterval)
          this.engine.unlockInput()
          this.engine.showDialogue(['O momento passou. Tente novamente.'])
        }
      },100)
    })
  }
  handleComboPuzzle(obj,puz){
    const digits=puz.digits.slice()
    const html=`
      <div style="display:flex;gap:10px;align-items:center">
        ${digits.map((d,i)=>`
          <div class="puz-rotor"><div class="arrow" data-idx="${i}" data-dir="up">▲</div>
          <div class="digit" id="digit-${i}">${d}</div>
          <div class="arrow" data-idx="${i}" data-dir="down">▼</div></div>
        `).join('')}
      </div>
      <div style="font-size:11px;color:#5a3a5a;margin-top:8px">6 celas · 6 chaves · 6 símbolos</div>`
    this.engine.showPuzzle(puz.title,puz.hint,html,(action)=>{
      if(action==='confirm'){
        const dig=Array.from(document.querySelectorAll('.digit')).map(el=>parseInt(el.textContent))
        const ok=puz.onCheck(this,dig)
        if(ok){
          puz.solved=true
          this.renderInventory()
          setTimeout(()=>this.engine.closePuzzle(),500)
        }else{
          document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Combinação errada.'
        }
      }
    })
    setTimeout(()=>{
      document.querySelectorAll('.arrow').forEach(el=>{
        el.addEventListener('click',()=>{
          const idx=parseInt(el.dataset.idx)
          const dir=el.dataset.dir
          const dEl=document.getElementById('digit-'+idx)
          let val=parseInt(dEl.textContent)
          val=dir==='up'?(val+1)%10:(val+9)%10
          dEl.textContent=val
        })
      })
    },50)
  }
  handleOrderPuzzle(obj,puz){
    const placed=puz.placed.slice()
    if(!puz.order)puz.order=[]
    const html=`
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:8px">
        ${puz.items.map((it,i)=>`
          <div class="puz-drawing" data-idx="${i}" style="${placed.includes(i)?'border-color:#c4a46c;opacity:0.5':''}">
            ${placed.includes(i)?'✓':it.label[0]}
          </div>
        `).join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center">
        SLOTS: ${Array(puz.slotCount).fill(0).map((_,i)=>`
          <div class="puz-slot-box" data-slot="${i}">${puz.order[i]!==undefined?puz.items[puz.order[i]].label[0]:'_'}</div>
        `).join('')}
      </div>`
    this.engine.showPuzzle(puz.title,puz.hint,html,(action)=>{
      if(action==='confirm'){
        if(puz.order.length===puz.slotCount){
          const correct=puz.order.every((id,i)=>id===i)
          if(correct&&puz.solved){
            this.engine.closePuzzle()
          }else if(!correct){
            document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Ordem errada.'
          }
        }else{
          document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Preencha todos os slots.'
        }
      }
    })
    let selecting=true
    setTimeout(()=>{
      document.querySelectorAll('.puz-drawing').forEach(el=>{
        el.addEventListener('click',()=>{
          if(!selecting)return
          const idx=parseInt(el.dataset.idx)
          if(puz.order.includes(idx))return
          if(puz.order.length<puz.slotCount){
            puz.order.push(idx)
            const slot=document.querySelector(`.puz-slot-box[data-slot="${puz.order.length-1}"]`)
            if(slot)slot.textContent=puz.items[idx].label[0]
          }
          if(puz.order.length>=puz.slotCount){
            selecting=false
            const correct=JSON.stringify(puz.order)===JSON.stringify([0,1,2,3,4])
            if(correct){
              puz.solved=true
              puz.onComplete(this)
              this.renderInventory()
              document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Correto!'
              setTimeout(()=>this.engine.closePuzzle(),800)
            }else{
              document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Ordem errada. Recomece.'
              setTimeout(()=>{
                puz.order=[]
                selecting=true
                document.querySelectorAll('.puz-slot-box').forEach(s=>s.textContent='_')
              },1000)
            }
          }
        })
      })
    },50)
  }
  handleCandlePuzzle(obj,puz){
    const candles=puz.candles
    const html=`
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">
        ${candles.map((c,i)=>`
          <div class="puz-vela ${c.lit?'on':''}" data-idx="${i}" style="${c.lit?'opacity:1':'opacity:0.6'}">
            <div class="puz-vela-wick"></div>
            <div class="puz-vela-flame"></div>
            <div class="puz-vela-body"></div>
            <div style="font-size:8px;color:#5a3a5a;margin-top:4px">${c.label}</div>
          </div>
        `).join('')}
      </div>
      <div style="font-size:11px;color:#5a3a5a;margin-top:8px">Acenda na ordem: subterrâneo, fogo, tempo, morte, vaidade, altura</div>`
    this.engine.showPuzzle(puz.title,puz.hint,html,(action)=>{
      if(action==='confirm'){
        if(puz.current>=puz.sequence.length){
          this.renderInventory();this.engine.closePuzzle()
        }
      }
    })
    setTimeout(()=>{
      document.querySelectorAll('.puz-vela').forEach(el=>{
        el.addEventListener('click',()=>{
          const idx=parseInt(el.dataset.idx)
          puz.candles[idx].lit=!puz.candles[idx].lit
          el.classList.toggle('on')
          const ok=puz.onLight(this,idx)
          if(ok){
            this.renderInventory()
            setTimeout(()=>this.engine.closePuzzle(),800)
          }else{
            document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent='Ordem errada. Recomece.'
            setTimeout(()=>{
              document.querySelectorAll('.puz-vela').forEach((v,j)=>{
                v.classList.remove('on')
                puz.candles[j].lit=false
              })
            },300)
          }
        })
      })
    },50)
  }
  handleTextInputPuzzle(obj,puz){
    const html=`
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
        <input type="text" id="txt-input" maxlength="10"
          style="background:#1a0a0a;border:1px solid #3a1a1a;color:#c4a46c;padding:8px 16px;
                 text-align:center;font-size:18px;font-family:Georgia,serif;width:200px"
          placeholder="DIGITE O NOME">
        <div class="puz-btn" id="txt-submit">CONFIRMAR</div>
      </div>`
    this.engine.showPuzzle(puz.title,puz.hint,html,(action)=>{
      if(action==='confirm'){
        const input=document.getElementById('txt-input')
        if(input&&input.value.trim().toUpperCase()===puz.answer){
          puz.solved=true
          puz.onCorrect(this)
          this.renderInventory()
          setTimeout(()=>this.engine.closePuzzle(),600)
        }else{
          puz.onWrong(this)
        }
      }
    })
    setTimeout(()=>{
      const sub=document.getElementById('txt-submit')
      if(sub)sub.addEventListener('click',()=>{
        document.getElementById('puz-confirm').click()
      })
      const inp=document.getElementById('txt-input')
      if(inp)inp.addEventListener('keydown',e=>{
        if(e.key==='Enter')document.getElementById('puz-confirm').click()
      })
    },50)
  }
  endGame(type){
    this.running=false
    this.engine.inputLocked=false
    document.getElementById('puzzle-overlay').style.display='none'
    document.getElementById('dialogue-overlay').style.display='none'
    document.getElementById('note-overlay').style.display='none'
    const ov=document.getElementById('final-overlay')
    const end=STORY.endings[type]
    if(!end)return
    document.getElementById('final-overlay').querySelector('.final-title').textContent=end.title
    document.getElementById('final-overlay').querySelector('.final-text').innerHTML=
      end.text.map(t=>'<p style="margin:8px 0">'+t+'</p>').join('')
    const sub=document.getElementById('final-overlay').querySelector('.final-sub')
    sub.textContent='[ CLIQUE PARA REINICIAR ]'
    ov.style.display='flex'
  }
  showDialogue(lines,cb){this.engine.showDialogue(lines,cb)}
}

document.addEventListener('DOMContentLoaded',()=>{new Game()})
