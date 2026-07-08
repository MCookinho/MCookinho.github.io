class Engine{
  constructor(){
    this.canvas=document.getElementById('game-canvas')
    this.ctx=this.canvas.getContext('2d')
    this.W=800;this.H=600
    this.currentScene=null
    this.transitioning=false
    this.transitionAlpha=0
    this.puzzleOpenTime=0
    this.inputLocked=false
    this.keys={}
    this.mouse={x:0,y:0,down:false}
    this.callbacks={click:[],hover:[],keydown:[]}
    this.initEvents()
  }
  initEvents(){
    this.canvas.addEventListener('click',e=>{
      if(this.inputLocked)return
      const r=this.canvas.getBoundingClientRect()
      const x=(e.clientX-r.left)*this.W/r.width
      const y=(e.clientY-r.top)*this.H/r.height
      this.mouse.x=x;this.mouse.y=y
      this.callbacks.click.forEach(c=>c(x,y))
    })
    this.canvas.addEventListener('mousemove',e=>{
      const r=this.canvas.getBoundingClientRect()
      this.mouse.x=(e.clientX-r.left)*this.W/r.width
      this.mouse.y=(e.clientY-r.top)*this.H/r.height
      this.callbacks.hover.forEach(c=>c(this.mouse.x,this.mouse.y))
    })
    document.addEventListener('keydown',e=>{
      this.keys[e.key]=true
      this.callbacks.keydown.forEach(c=>c(e.key,e))
    })
    document.addEventListener('keyup',e=>{this.keys[e.key]=false})
    document.getElementById('puz-cancel').addEventListener('click',()=>this.closePuzzle())
    document.getElementById('puz-confirm').addEventListener('click',()=>{
      if(this.currentPuzzleCb)this.currentPuzzleCb('confirm')
    })
    document.getElementById('note-overlay').addEventListener('click',e=>{
      if(e.target.closest('.note-close')||e.target===document.getElementById('note-overlay'))
        this.closeNote()
    })
    document.getElementById('dialogue-overlay').addEventListener('click',()=>this.nextDialogue())
    document.getElementById('final-overlay').addEventListener('click',(e)=>{
      if(e.target===document.getElementById('final-overlay').querySelector('.final-sub')){
        location.reload()
      }
    })
    document.getElementById('hint-btn').addEventListener('click',()=>{
      this.showHint()
    })
  }
  on(event,cb){this.callbacks[event].push(cb)}
  setScene(id){
    this.currentScene=id
  }
  transitionTo(id,cb){
    if(this.transitioning)return
    this.transitioning=true
    const ov=document.getElementById('transition-overlay')
    ov.style.display='flex'
    ov.style.opacity='0'
    let start=performance.now()
    const fadeIn=()=>{
      const t=(performance.now()-start)/500
      if(t<1){
        ov.style.opacity=String(Math.min(t*2,1))
        requestAnimationFrame(fadeIn)
      }else{
        ov.style.opacity='1'
        this.setScene(id)
        setTimeout(()=>{
          start=performance.now()
          const fadeOut=()=>{
            const t2=(performance.now()-start)/500
            if(t2<1){
              ov.style.opacity=String(Math.max(1-t2*2,0))
              requestAnimationFrame(fadeOut)
            }else{
              ov.style.opacity='0'
              ov.style.display='none'
              this.transitioning=false
              if(cb)cb()
            }
          };fadeOut()
        },200)
      }
    };fadeIn()
  }
  showDialogue(lines,cb){
    this.inputLocked=true
    const ov=document.getElementById('dialogue-overlay')
    const txt=document.getElementById('dialogue-overlay').querySelector('.text')
    this.dialogueLines=Array.isArray(lines)?lines:[lines]
    this.dialogueIndex=0
    this.dialogueCb=cb||null
    txt.textContent=this.dialogueLines[0]
    ov.style.display='flex'
  }
  nextDialogue(){
    if(!this.dialogueLines)return
    this.dialogueIndex++
    const txt=document.getElementById('dialogue-overlay').querySelector('.text')
    if(this.dialogueIndex<this.dialogueLines.length){
      txt.textContent=this.dialogueLines[this.dialogueIndex]
    }else{
      document.getElementById('dialogue-overlay').style.display='none'
      this.inputLocked=false
      this.dialogueLines=null
      if(this.dialogueCb){this.dialogueCb();this.dialogueCb=null}
    }
  }
  showNote(title,text,symbol){
    const ov=document.getElementById('note-overlay')
    document.getElementById('note-overlay').querySelector('.note-title').textContent=title
    document.getElementById('note-overlay').querySelector('.note-text').textContent=text
    document.getElementById('note-overlay').querySelector('.note-symbol').textContent=symbol||''
    ov.style.display='flex'
    this.inputLocked=true
  }
  closeNote(){
    document.getElementById('note-overlay').style.display='none'
    this.inputLocked=false
  }
  showPuzzle(title,hint,uiHtml,onConfirm){
    const ov=document.getElementById('puzzle-overlay')
    document.getElementById('puzzle-overlay').querySelector('.puzzle-title').textContent=title
    document.getElementById('puzzle-overlay').querySelector('.puzzle-hint').textContent=hint
    document.getElementById('puzzle-overlay').querySelector('.puzzle-ui').innerHTML=uiHtml
    document.getElementById('puzzle-overlay').querySelector('.puzzle-msg').textContent=''
    this.currentPuzzleCb=onConfirm||null
    this.puzzleOpenTime=performance.now()
    ov.style.display='flex'
    this.inputLocked=true
  }
  closePuzzle(){
    document.getElementById('puzzle-overlay').style.display='none'
    document.getElementById('puzzle-overlay').querySelector('.puzzle-ui').innerHTML=''
    this.currentPuzzleCb=null
    this.inputLocked=false
  }
  showHint(){
    const msg=document.getElementById('desc-text')
    msg.textContent=STORY.descriptions.hint_generic||'?'
    msg.style.color='#8a7a5a'
    setTimeout(()=>{msg.textContent=''},3000)
  }
  setDesc(text){
    const el=document.getElementById('desc-text')
    el.textContent=text||''
  }
  clearDesc(){document.getElementById('desc-text').textContent=''}
  render(time){
    const ctx=this.ctx
    if(this.currentScene){
      drawDiorama(ctx,this.currentScene,time)
      this.renderExits(ctx)
      this.renderObjects(ctx,time)
    }else{
      rect(ctx,0,0,this.W,this.H,PAL.bg)
      ctx.fillStyle=PAL.blood
      ctx.font='20px Georgia'
      ctx.textAlign='center'
      ctx.fillText('◈',400,300)
    }
  }
  renderExits(ctx){
    const scene=DIORAMAS[this.currentScene]
    if(!scene)return
    const objs=scene.objects||[]
    objs.forEach(obj=>{
      if(obj.type==='exit'){
        const hit=this._getObjHit(obj)
        ctx.fillStyle='rgba(196,164,108,0.06)'
        ctx.fillRect(hit.x,hit.y,hit.w,hit.h)
      }
    })
  }
  renderObjects(ctx,time){
    const scene=DIORAMAS[this.currentScene]
    if(!scene)return
    const objs=scene.objects||[]
    objs.forEach(obj=>{
      if(obj.type==='exit'||obj.type==='decor')return
      if(this._isObjSolved(obj))return
    })
  }
  _getObjHit(obj){
    if(obj.hitbox)return obj.hitbox
    const defaults={
      door_front:{x:300,y:180,w:200,h:300},
      door_cellar_out:{x:350,y:450,w:100,h:150},
      well:{x:300,y:300,w:200,h:200},
      wall_cellar:{x:100,y:100,w:200,h:300},
      chain_cellar:{x:500,y:100,w:80,h:200},
      vent_cellar:{x:600,y:200,w:60,h:60},
      water_cellar:{x:350,y:350,w:100,h:100},
      stove:{x:60,y:200,w:180,h:200},
      radio:{x:550,y:280,w:120,h:80},
      cabinet_kitchen:{x:500,y:100,w:100,h:150},
      sink:{x:280,y:300,w:100,h:100},
      knife:{x:40,y:350,w:40,h:40},
      door_kitchen:{x:350,y:430,w:100,h:170},
      pantry_door:{x:520,y:430,w:60,h:170},
      shelf:{x:100,y:150,w:120,h:150},
      box:{x:400,y:360,w:80,h:60},
      jar:{x:560,y:300,w:60,h:80},
      back_door:{x:350,y:430,w:100,h:170},
      altar:{x:350,y:280,w:100,h:80},
      statue:{x:340,y:380,w:120,h:100},
      pew:{x:100,y:350,w:150,h:80},
      window_church:{x:600,y:100,w:80,h:120},
      door_church:{x:350,y:430,w:100,h:170},
      grave1:{x:60,y:320,w:100,h:80},
      grave2:{x:180,y:320,w:100,h:80},
      grave3:{x:300,y:320,w:100,h:80},
      grave4:{x:420,y:320,w:100,h:80},
      grave5:{x:540,y:320,w:100,h:80},
      grave6:{x:660,y:320,w:100,h:80},
      tree:{x:250,y:330,w:100,h:130},
      fence:{x:100,y:200,w:80,h:150},
      door_graveyard:{x:350,y:50,w:100,h:150},
      mirror:{x:260,y:70,w:260,h:320},
      portrait:{x:30,y:160,w:80,h:120},
      cabinet_mansion:{x:600,y:350,w:80,h:120},
      clock_mansion:{x:540,y:100,w:80,h:100},
      lamp_mansion:{x:30,y:280,w:40,h:80},
      door_mansion:{x:350,y:430,w:100,h:170},
      library_door:{x:620,y:450,w:60,h:130},
      bookshelf:{x:40,y:100,w:170,h:300},
      desk:{x:250,y:300,w:160,h:120},
      book:{x:330,y:260,w:100,h:60},
      door_library:{x:50,y:430,w:80,h:170},
      shrine:{x:280,y:180,w:240,h:180},
      bed_tower:{x:100,y:250,w:200,h:150},
      window_tower:{x:550,y:80,w:100,h:120},
      door_tower:{x:350,y:400,w:100,h:180},
      tower_candle:{x:600,y:400,w:40,h:50},
      altar_tunnel:{x:340,y:280,w:120,h:120},
      chain_tunnel:{x:100,y:300,w:60,h:200},
      wall_tunnel:{x:200,y:100,w:80,h:300},
      eye_tunnel:{x:350,y:130,w:100,h:120},
      light_tunnel:{x:700,y:120,w:80,h:200},
      door_c2:{x:350,y:150,w:100,h:200},
      step_c2:{x:250,y:350,w:300,h:80},
      window_c2:{x:620,y:100,w:60,h:80},
      door_c3:{x:300,y:130,w:200,h:300},
      bell_c3:{x:580,y:360,w:40,h:30},
      candle_c3:{x:640,y:370,w:30,h:40},
      door_c4:{x:340,y:140,w:120,h:250},
      door_c5:{x:310,y:120,w:180,h:300},
      chandelier:{x:350,y:50,w:100,h:60},
      rug:{x:200,y:400,w:400,h:200},
      door_c6:{x:340,y:80,w:120,h:200},
      mirror_c6:{x:600,y:120,w:50,h:80},
      symbol_c6:{x:390,y:380,w:20,h:40},
      lamp_c1:{x:350,y:20,w:100,h:100},
      wall_c1:{x:100,y:250,w:200,h:150},
      ground_c1:{x:0,y:400,w:800,h:200},
    }
    return defaults[obj.id]||{x:350,y:250,w:100,h:100}
  }
  _isObjSolved(obj){
    const g=window.__game
    if(!g||!g.puzzles)return false
    if(obj.puzzle&&g.puzzles.isSolved(obj.puzzle))return true
    return false
  }
  hitTest(x,y,obj){
    const h=this._getObjHit(obj)
    return x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h
  }
  findHitObject(x,y){
    const scene=DIORAMAS[this.currentScene]
    if(!scene)return null
    const objs=scene.objects||[]
    for(let i=objs.length-1;i>=0;i--){
      if(this.hitTest(x,y,objs[i]))return objs[i]
    }
    return null
  }
  onClickOnce(cb){
    const handler=(x,y)=>{
      this.callbacks.click=this.callbacks.click.filter(h=>h!==handler)
      cb(x,y)
    }
    this.callbacks.click.push(handler)
  }
  lockInput(){this.inputLocked=true}
  unlockInput(){this.inputLocked=false}
}
