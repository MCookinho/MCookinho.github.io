const S = { INTRO:0, PLAYING:1, PUZZLE:2, NOTE:3, FINAL:4 }

class Engine {
  constructor(){
    this.canvas=document.getElementById('game-canvas')
    this.ctx=this.canvas.getContext('2d')
    this.state=S.INTRO
    this.scene='corridor'
    this.puzzle=null
    this.tooltipTimer=null
    this.tooltipEl=document.getElementById('tooltip')
    this.roomLabel=document.getElementById('room-label')
    this.watchingEl=document.getElementById('hud-watching')
    this.transitionEl=document.getElementById('transition-overlay')
    this.setupEvents()
  }

  setupEvents(){
    const getPos=e=>{
      const r=this.canvas.getBoundingClientRect()
      return {x:(e.clientX-r.left)/r.width*800,y:(e.clientY-r.top)/r.height*600}
    }
    this.canvas.addEventListener('click',e=>{
      const p=getPos(e)
      if(this.state===S.INTRO)this.handleIntroClick()
      else if(this.state===S.PLAYING)window.__game.handleClick(p.x,p.y)
    })

    document.getElementById('puzzle-overlay').addEventListener('click',e=>{
      if(this.state!==S.PUZZLE||!this.puzzle)return
      const p=getPos(e)
      this.puzzle.click(p.x,p.y,window.__game)
    })
    document.getElementById('note-overlay').addEventListener('click',()=>{
      if(this.state===S.NOTE)this.closeNote()
    })

    this.canvas.addEventListener('dragover',e=>{e.preventDefault()})
    this.canvas.addEventListener('drop',e=>{
      e.preventDefault()
      if(this.state!==S.PLAYING)return
      const idx=parseInt(e.dataTransfer.getData('text/plain'))
      if(isNaN(idx))return
      const r=this.canvas.getBoundingClientRect()
      const x=(e.clientX-r.left)/r.width*800
      const y=(e.clientY-r.top)/r.height*600
      window.__game.handleItemDrop(idx,x,y)
    })

    document.addEventListener('keydown',e=>{
      if(this.state===S.NOTE&&e.key==='Escape'){this.closeNote();return}
      if(this.state===S.PUZZLE&&e.key==='Escape'){this.closePuzzle();return}
      if(this.state===S.FINAL&&(e.key==='Enter'||e.key===' ')){location.reload();return}
      if(this.state===S.INTRO&&(e.key==='Enter'||e.key===' ')){this.handleIntroClick();return}
      if(this.state!==S.PLAYING)return
      const g=window.__game
      if(e.key==='ArrowUp')g.goNorth()
      else if(e.key==='ArrowDown')g.goSouth()
      else if(e.key==='ArrowLeft')g.goWest()
      else if(e.key==='ArrowRight')g.goEast()
      else if(e.key>='1'&&e.key<='9'){const i=parseInt(e.key)-1;g.selectItem(i)}
    })

    this.canvas.addEventListener('contextmenu',e=>{e.preventDefault()})
  }

  handleIntroClick(){
    const g=window.__game
    const intro=document.getElementById('intro-overlay')
    const t=intro.querySelector('.intro-text')
    const idx=g.introStep||0
    if(idx<STORY.intro.length-1){
      g.introStep=idx+1
      t.textContent=STORY.intro[g.introStep]
    }else{
      intro.style.display='none'
      this.state=S.PLAYING
      g.introStep=0
    }
  }

  render(t){
    const ctx=this.ctx
    if(this.state===S.INTRO||this.state===S.PLAYING||this.state===S.FINAL){
      drawScene(ctx,this.scene,t)
      this.drawSceneLabel()
      this.drawEdgeHints(t)
    }
    if(this.state===S.PUZZLE&&this.puzzle&&this.puzzle.render){
      this.puzzle.render(ctx,t)
    }
    if(window.__game&&window.__game.showingWatching&&this.state===S.PLAYING){
      this.watchingEl.classList.add('show')
    }else{
      this.watchingEl.classList.remove('show')
    }
  }

  drawSceneLabel(){
    const sc=window.__game?window.__game.getScene(this.scene):null
    if(sc){this.roomLabel.textContent=sc.name;this.roomLabel.style.display='block'}
  }

  drawEdgeHints(t){
    const ctx=this.ctx
    const g=window.__game
    if(!g)return
    const exits=g.getExits(this.scene)
    const hint=document.getElementById('dir-hint')
    let labels=[]
    if(exits.north)labels.push('N: '+g.getScene(exits.north).name)
    if(exits.south)labels.push('S: '+g.getScene(exits.south).name)
    if(exits.west)labels.push('O: '+g.getScene(exits.west).name)
    if(exits.east)labels.push('L: '+g.getScene(exits.east).name)
    hint.textContent=labels.join(' · ')
    hint.style.display=labels.length?'block':'none'
  }

  findHit(x,y){
    const g=window.__game
    if(!g)return null
    const scene=this.scene
    for(const obj of g.getScene(scene).objects){
      const h=g.getHitbox(scene,obj.id)
      if(h&&x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h)return obj
    }
    return null
  }

  openPuzzle(p){
    this.state=S.PUZZLE
    this.puzzle=p
    if(p.init&&!p.inited){p.init();p.inited=true}
    document.getElementById('puzzle-overlay').style.display='flex'
  }

  closePuzzle(){
    this.state=S.PLAYING
    this.puzzle=null
    document.getElementById('puzzle-overlay').style.display='none'
  }

  showNote(symbol,text){
    this.state=S.NOTE
    const ov=document.getElementById('note-overlay')
    ov.querySelector('.note-symbol').textContent=symbol
    ov.querySelector('.note-text').textContent=text
    ov.style.display='flex'
  }

  closeNote(){
    this.state=S.PLAYING
    document.getElementById('note-overlay').style.display='none'
  }

  tooltip(msg,dur){
    const el=this.tooltipEl
    el.textContent=msg;el.classList.add('show')
    if(this.tooltipTimer)clearTimeout(this.tooltipTimer)
    if(dur)this.tooltipTimer=setTimeout(()=>el.classList.remove('show'),dur)
  }

  clearTooltip(){
    this.tooltipEl.classList.remove('show')
    if(this.tooltipTimer){clearTimeout(this.tooltipTimer);this.tooltipTimer=null}
  }

  transitionTo(target,cb){
    this.transitionEl.classList.add('active')
    setTimeout(()=>{
      this.scene=target
      if(cb)cb()
      setTimeout(()=>this.transitionEl.classList.remove('active'),200)
    },400)
  }

  showIntro(texts){
    const ov=document.getElementById('intro-overlay')
    ov.style.display='flex'
    ov.querySelector('.intro-text').textContent=texts[0]
  }

  showFinal(title,texts){
    this.state=S.FINAL
    const ov=document.getElementById('final-overlay')
    ov.style.display='flex'
    ov.querySelector('.final-title').textContent=title
    ov.querySelector('.final-text').innerHTML=texts.map(t=>'<p>'+t+'</p>').join('')
  }
}
