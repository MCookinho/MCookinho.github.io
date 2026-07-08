const S = { INTRO:0, PLAYING:1, PUZZLE:2, NOTE:3, FINAL:4 }

class Engine {
  constructor(){
    this.canvas=document.getElementById('game-canvas')
    this.ctx=this.canvas.getContext('2d')
    this.state=S.INTRO
    this.puzzle=null
    this.tooltipTimer=null
    this.tooltipEl=document.getElementById('tooltip')
    this.dirHint=document.getElementById('dir-hint')
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
    document.addEventListener('keydown',e=>{
      if(this.state===S.NOTE&&e.key==='Escape'){this.closeNote();return}
      if(this.state===S.PUZZLE&&e.key==='Escape'){this.closePuzzle();return}
      if(this.state===S.FINAL&&(e.key==='Enter'||e.key===' ')){location.reload();return}
      if(this.state===S.INTRO&&(e.key==='Enter'||e.key===' ')){this.handleIntroClick();return}
      if(this.state!==S.PLAYING)return
      const g=window.__game
      if(e.key==='ArrowLeft'||e.key==='a')g.goToView(g.view-1)
      else if(e.key==='ArrowRight'||e.key==='d')g.goToView(g.view+1)
      else if(e.key==='ArrowUp'||e.key==='w')g.goToView(4)
      else if(e.key==='ArrowDown'||e.key==='s')g.goToView(g.view===4?0:g.view)
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
    const ctx=this.ctx,g=window.__game
    if(this.state===S.INTRO||this.state===S.PLAYING||this.state===S.FINAL){
      const views=['north','east','south','west','ceiling']
      const vk=views[g.view]||'north'
      const fn=VIEW_DRAW[vk]
      if(fn)fn(ctx,t)

      if(g.candleLit)drawCandleLight(ctx,t,true)

      if(g.shivaActive&&this.state===S.PLAYING){
        $ctx=ctx
        drawShivaAppearance(ctx,g.view,performance.now()*0.001,t)
      }

    }
    if(this.state===S.PUZZLE&&this.puzzle&&this.puzzle.render){
      this.puzzle.render(ctx,t)
    }
  }

  drawDirHint(g){
    const el=this.dirHint
    const views=['NORTE','LESTE','SUL','OESTE','TETO']
    let hint=''
    if(g.view>0)hint+='◀ '
    hint+=views[g.view]
    if(g.view<4)hint+=' ▶'
    if(g.view!==4)hint+='  ↑TETO'
    if(g.view!==0)hint+='  ↓CHÃO'
    el.textContent=hint
    el.style.display='block'
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

  flashView(cb){
    this.transitionEl.classList.add('flash')
    setTimeout(()=>{
      if(cb)cb()
      setTimeout(()=>this.transitionEl.classList.remove('flash'),60)
    },100)
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
