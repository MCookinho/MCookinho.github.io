const S = {
  EXPLORE:'explore', PUZZLE:'puzzle', NOTE:'note',
  INTRO:'intro', FINAL:'final', TRANSITION:'transition'
}

class Engine {
  constructor() {
    this.canvas = document.getElementById('game-canvas')
    this.ctx = this.canvas.getContext('2d')
    this.LW=800; this.LH=600
    this.cw=800; this.ch=600
    this.state=S.EXPLORE
    this.scene=null; this.puzzle=null; this.puzzleData=null
    this.time=0; this.tooltipTimer=0; this.tooltipText=''
    this.mouseX=0; this.mouseY=0
    this._resize()
    this._bindEvents()
  }
  _resize(){
    this.cw=window.innerWidth; this.ch=window.innerHeight
    this.canvas.width=this.cw; this.canvas.height=this.ch
  }
  _s(){
    return Math.min(this.cw/this.LW,this.ch/this.LH)
  }
  _ox(){
    return (this.cw-this.LW*this._s())/2
  }
  _oy(){
    return (this.ch-this.LH*this._s())/2
  }
  _scrToCanvas(cx,cy){
    const s=this._s()
    return {x:(cx-this._ox())/s,y:(cy-this._oy())/s}
  }
  _bindEvents() {
    this.canvas.addEventListener('click', e => {
      if(this.state===S.TRANSITION)return
      const r=this.canvas.getBoundingClientRect()
      const p=this._scrToCanvas(e.clientX-r.left,e.clientY-r.top)
      this._handleClick(p.x,p.y,e.clientX-r.left)
    })
    this.canvas.addEventListener('mousemove', e => {
      const r=this.canvas.getBoundingClientRect()
      const p=this._scrToCanvas(e.clientX-r.left,e.clientY-r.top)
      this.mouseX=p.x;this.mouseY=p.y
    })
    document.getElementById('note-overlay').addEventListener('click', e => {
      if (e.target.closest('.note-close')||e.target===document.getElementById('note-overlay'))
        this.closeNote()
    })
    document.getElementById('intro-overlay').addEventListener('click', () => {
      const g=window.__game;if(g&&g.a)g.a.resume()
      this.nextIntro()
    })
    document.getElementById('final-overlay').querySelector('.final-sub').addEventListener('click', () => location.reload())
    document.getElementById('hint-btn').addEventListener('click', () => {
      this.tooltip('Explorar cada canto. Observar os detalhes. As respostas estão no ambiente.', 3000)
    })
    window.addEventListener('resize',()=>this._resize())
    window.addEventListener('keydown', e => this._handleKey(e))
  }
  _handleKey(e){
    const g=window.__game
    if(!g)return
    if(g.a)g.a.resume()
    if(e.key==='Escape'){
      if(this.state===S.NOTE){this.closeNote();e.preventDefault()}
      else if(this.state===S.PUZZLE&&this.puzzle){g.engine.closePuzzle();e.preventDefault()}
      return
    }
    if(this.state===S.INTRO){
      if(e.key==='Enter'||e.key===' '){this.nextIntro();e.preventDefault()}
      return
    }
    if(this.state===S.FINAL){
      if(e.key==='Enter'||e.key===' '){location.reload();e.preventDefault()}
      return
    }
    if(this.state===S.EXPLORE){
      if(e.key==='ArrowRight'||e.key==='d'||e.key==='ArrowUp'||e.key==='w'){g.goForward();e.preventDefault();return}
      if(e.key==='ArrowLeft'||e.key==='a'||e.key==='ArrowDown'||e.key==='s'){g.goBack();e.preventDefault();return}
      const n=parseInt(e.key)
      if(n>=1&&n<=7){g.selectItem(n-1);e.preventDefault();return}
      if(e.key==='Enter'||e.key===' '){this._handleClick(this.LW/2,this.LH/2);e.preventDefault();return}
    }
  }
  _handleClick(x, y, scrX) {
    const g = window.__game
    if (!g) return
    if(g.a)g.a.resume()
    if (this.state===S.EXPLORE) {
      if(this.scene){
        const w=this.cw
        if(scrX!==undefined&&scrX<w*0.15){g.goBack();return}
        if(scrX!==undefined&&scrX>w*0.85){g.goForward();return}
      }
      g.handleClick(x, y)
    } else if (this.state===S.PUZZLE && this.puzzle) {
      if (this.puzzle.click) this.puzzle.click(x, y, g)
    }
  }
  tooltip(text, duration = 2500) {
    const el = document.getElementById('tooltip')
    el.textContent = text; el.classList.add('show')
    this.tooltipTimer = duration
  }
  clearTooltip() {
    document.getElementById('tooltip').classList.remove('show')
    this.tooltipTimer = 0
  }
  showNote(symbol, text) {
    this.state=S.NOTE
    document.getElementById('note-overlay').querySelector('.note-symbol').textContent = symbol || ''
    document.getElementById('note-overlay').querySelector('.note-text').textContent = text || ''
    document.getElementById('note-overlay').style.display='flex'
  }
  closeNote() {
    this.state=S.EXPLORE
    document.getElementById('note-overlay').style.display='none'
  }
  showIntro(lines) {
    this.state=S.INTRO; this.introLines=lines; this.introIndex=0
    document.getElementById('intro-overlay').querySelector('.intro-text').textContent=lines[0]
    document.getElementById('intro-overlay').style.display='flex'
  }
  nextIntro() {
    this.introIndex++
    if(this.introIndex<this.introLines.length){
      document.getElementById('intro-overlay').querySelector('.intro-text').textContent=this.introLines[this.introIndex]
    }else{
      document.getElementById('intro-overlay').style.display='none'
      this.state=S.EXPLORE
    }
  }
  showFinal(title,text){
    this.state=S.FINAL
    document.getElementById('final-overlay').querySelector('.final-title').textContent=title
    document.getElementById('final-overlay').querySelector('.final-text').innerHTML=
      text.map(t=>'<p style="margin:6px 0">'+t+'</p>').join('')
    document.getElementById('final-overlay').style.display='flex'
  }
  transitionTo(sceneId,cb){
    if(this.state===S.TRANSITION)return
    this.state=S.TRANSITION
    const ov=document.getElementById('transition-overlay')
    ov.classList.add('active')
    setTimeout(()=>{
      this.scene=sceneId; ov.classList.remove('active')
      setTimeout(()=>{this.state=S.EXPLORE;if(cb)cb()},450)
    },450)
  }
  openPuzzle(puzzle){
    this.state=S.PUZZLE; this.puzzle=puzzle
    if(puzzle.onOpen)puzzle.onOpen(this,window.__game)
  }
  closePuzzle(){
    this.state=S.EXPLORE; this.puzzle=null; this.puzzleData=null
  }
  render(now){
    this.time=now; const ctx=this.ctx
    ctx.clearRect(0,0,this.cw,this.ch)
    if(!this.scene)return
    ctx.save()
    const s=this._s()
    ctx.translate(this._ox(),this._oy())
    ctx.scale(s,s)
    ctx.beginPath(); ctx.rect(0,0,this.LW,this.LH); ctx.clip()
    if(drawScene)drawScene(ctx,this.scene,now)
    else{ctx.fillStyle='#0a0505';ctx.fillRect(0,0,this.LW,this.LH)}
    const isWatching=this.scene==='tower'||this.scene==='tunnel'||
      (['corridor_1','corridor_3','corridor_5','cellar','church','graveyard'].includes(this.scene)&&Math.sin(now*0.0008)>0.85)
    document.getElementById('hud-watching').classList.toggle('show',isWatching)
    if(this.state===S.PUZZLE&&this.puzzle){
      ctx.fillStyle='rgba(5,2,2,0.7)'
      ctx.fillRect(0,0,this.LW,this.LH)
      if(this.puzzle.render)this.puzzle.render(ctx,now)
    }
    ctx.restore()
    if(this.tooltipTimer>0){this.tooltipTimer-=16;if(this.tooltipTimer<=0)this.clearTooltip()}
  }
  findHit(x,y){
    const scene=SCENES[this.scene]
    if(!scene)return null
    for(let i=scene.objects.length-1;i>=0;i--){
      const obj=scene.objects[i],h=HITBOXES[obj.id]
      if(h&&x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h)return obj
    }
    return null
  }
}
