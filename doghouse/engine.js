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
    this.scrX=0; this.scrY=0; this._hintHidden=false
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
      const sx=e.clientX-r.left,sy=e.clientY-r.top
      const p=this._scrToCanvas(sx,sy)
      this._handleClick(p.x,p.y,sx,sy)
    })
    this.canvas.addEventListener('mousemove', e => {
      const r=this.canvas.getBoundingClientRect()
      this.scrX=e.clientX-r.left;this.scrY=e.clientY-r.top
      const p=this._scrToCanvas(this.scrX,this.scrY)
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
      if(e.key==='ArrowUp'||e.key==='w'){g.goNorth();e.preventDefault();return}
      if(e.key==='ArrowDown'||e.key==='s'){g.goSouth();e.preventDefault();return}
      if(e.key==='ArrowLeft'||e.key==='a'){g.goWest();e.preventDefault();return}
      if(e.key==='ArrowRight'||e.key==='d'){g.goEast();e.preventDefault();return}
      const n=parseInt(e.key)
      if(n>=1&&n<=7){g.selectItem(n-1);e.preventDefault();return}
      if(e.key==='Enter'||e.key===' '){this._handleClick(this.LW/2,this.LH/2);e.preventDefault();return}
    }
  }
  _handleClick(x, y, scrX, scrY) {
    const g = window.__game
    if (!g) return
    if(g.a)g.a.resume()
    if (this.state===S.EXPLORE) {
      this._hintHidden=true
      setTimeout(()=>{if(this._hintHidden!==undefined)this._hintHidden=false},600)
      if(this.scene&&scrX!==undefined){
        const edge=80
        if(scrY<edge){g.goNorth();return}
        if(scrY>this.ch-edge){g.goSouth();return}
        if(scrX<edge){g.goWest();return}
        if(scrX>this.cw-edge){g.goEast();return}
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
    if(this.state===S.PUZZLE&&this.puzzle){
      ctx.fillStyle='rgba(5,2,2,0.7)'
      ctx.fillRect(0,0,this.LW,this.LH)
      if(this.puzzle.render)this.puzzle.render(ctx,now)
    }
    ctx.restore()
    if(this.state===S.EXPLORE)this._drawMinimap(ctx)
    this._drawRoomLabel()
    this._drawEdgeHints()
    document.getElementById('hud-watching').classList.toggle('show', window.__game && window.__game.showingWatching)
    if(this.tooltipTimer>0){this.tooltipTimer-=16;if(this.tooltipTimer<=0)this.clearTooltip()}
  }
  _drawMinimap(ctx){
    if(!window.__game)return
    const g=window.__game,id=g.sceneId
    const p=ROOM_GRID[id];if(!p)return
    const ms=18,gap=4,ox=20,oy=20,rad=5
    const minX=Math.min(...Object.values(ROOM_GRID).map(v=>v[0]))
    const minY=Math.min(...Object.values(ROOM_GRID).map(v=>v[1]))
    const maxX=Math.max(...Object.values(ROOM_GRID).map(v=>v[0]))
    const maxY=Math.max(...Object.values(ROOM_GRID).map(v=>v[1]))
    const cols=maxX-minX+1,rows=maxY-minY+1
    const mw=cols*(ms+gap)-gap,mh=rows*(ms+gap)-gap
    const bx=ox,by=oy
    ctx.save()
    ctx.fillStyle='rgba(10,5,5,0.85)'
    ctx.fillRect(bx-6,by-6,mw+12,mh+12)
    ctx.strokeStyle='#2a1010';ctx.lineWidth=1
    ctx.strokeRect(bx-6,by-6,mw+12,mh+12)
    for(const[rid,[rx,ry]]of Object.entries(ROOM_GRID)){
      const cx=bx+(rx-minX)*(ms+gap)+ms/2
      const cy=by+(ry-minY)*(ms+gap)+ms/2
      const isCurrent=rid===id
      const isConnected=getNeighbor(id,0,-1)===rid||getNeighbor(id,0,1)===rid||
                       getNeighbor(id,-1,0)===rid||getNeighbor(id,1,0)===rid
      ctx.fillStyle=isCurrent?'#c4a46c':isConnected?'#5a3a3a':'#2a1010'
      ctx.fillRect(cx-ms/2+2,cy-ms/2+2,ms-4,ms-4)
      if(isCurrent){
        ctx.strokeStyle='#e8d4a8';ctx.lineWidth=1.5
        ctx.strokeRect(cx-ms/2+1,cy-ms/2+1,ms-2,ms-2)
      }
    }
    ctx.fillStyle='#3a1a1a'
    ctx.font='7px Georgia'
    ctx.textAlign='left'
    ctx.fillText('⊙ MAPA',bx+2,by+mh+12)
    ctx.restore()
  }
  _drawRoomLabel(){
    if(!window.__game||this.state!==S.EXPLORE)return
    const scene=SCENES[window.__game.sceneId]
    if(!scene)return
    const el=document.getElementById('room-label')
    if(!el)return
    el.textContent=scene.name
    el.style.display='block'
  }
  _drawEdgeHints(){
    if(!window.__game||this.state!==S.EXPLORE)return
    const ctx=this.ctx,g=window.__game,id=g.sceneId
    const edge=80,aSize=16
    const dirs=[
      {d:'n',dx:0,dy:-1,x:this.cw/2,y:edge/2,label:'N'},
      {d:'s',dx:0,dy:1,x:this.cw/2,y:this.ch-edge/2,label:'S'},
      {d:'w',dx:-1,dy:0,x:edge/2,y:this.ch/2,label:'O'},
      {d:'e',dx:1,dy:0,x:this.cw-edge/2,y:this.ch/2,label:'L'}
    ]
    const mouseNear=80
    const nearEdge=dirs.find(d=>{
      if(d.d==='n')return this.scrY<mouseNear
      if(d.d==='s')return this.scrY>this.ch-mouseNear
      if(d.d==='w')return this.scrX<mouseNear
      if(d.d==='e')return this.scrX>this.cw-mouseNear
    })
    ctx.save()
    for(const d of dirs){
      const hasExit=getNeighbor(id,d.dx,d.dy)
      if(!hasExit)continue
      const isHover=nearEdge&&nearEdge.d===d.d&&!this._hintHidden
      const alpha=isHover?0.9:0.25
      ctx.fillStyle=`rgba(196,164,108,${alpha})`
      ctx.font=`${isHover?14:10}px Georgia`
      ctx.textAlign='center';ctx.textBaseline='middle'
      ctx.fillText(d.label,d.x,d.y)
      if(isHover){
        ctx.font='11px Georgia'
        ctx.fillStyle='rgba(196,164,108,0.5)'
        const name=SCENES[hasExit]?.name||''
        ctx.fillText(name,d.x,d.y+(d.d==='n'?18:-18))
      }
    }
    ctx.restore()
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
