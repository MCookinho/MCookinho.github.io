const S = { INTRO:0, PLAYING:1, PUZZLE:2, NOTE:3, FINAL:4, CLOSEUP:5 }

class Engine {
  constructor(){
    this.canvas=document.getElementById('game-canvas')
    this.ctx=this.canvas.getContext('2d')
    this.state=S.INTRO
    this.puzzle=null
    this.tooltipTimer=null
    this.tooltipEl=document.getElementById('tooltip')
    this.transitionEl=document.getElementById('transition-overlay')
    this.diaryPages=[]
    this.diaryPageIdx=0
    this.diaryFlipping=false
    this.setupEvents()
  }

  setupEvents(){
    const getPos=e=>{
      const r=this.canvas.getBoundingClientRect()
      return {x:(e.clientX-r.left)/r.width*800,y:(e.clientY-r.top)/r.height*600}
    }
    this.canvas.addEventListener('click',e=>{
      const g=window.__game
      if(g&&g.a){g.a.init();g.a.resume()}
      const p=getPos(e)
      if(this.state===S.INTRO)this.handleIntroClick()
      else if(this.state===S.PLAYING)g.handleClick(p.x,p.y)
    })
    document.getElementById('puzzle-overlay').addEventListener('click',e=>{
      if(this.state!==S.PUZZLE||!this.puzzle)return
      const p=getPos(e)
      this.puzzle.click(p.x,p.y,window.__game)
    })
    document.getElementById('book-next').addEventListener('click',e=>{
      e.stopPropagation()
      if(this.state===S.NOTE)this.nextDiaryPage()
    })
    document.getElementById('book-prev').addEventListener('click',e=>{
      e.stopPropagation()
      if(this.state===S.NOTE)this.prevDiaryPage()
    })
    document.getElementById('book-close').addEventListener('click',e=>{
      e.stopPropagation()
      if(this.state===S.NOTE)this.closeNote()
    })
    document.addEventListener('keydown',e=>{
      if(this.state===S.NOTE){
        if(e.key==='Escape'){this.closeNote();return}
        if(e.key==='ArrowRight'||e.key===' '){this.nextDiaryPage();return}
        if(e.key==='ArrowLeft'){this.prevDiaryPage();return}
        return
      }
      if(this.state===S.PUZZLE&&e.key==='Escape'){this.closePuzzle();return}
      if(this.state===S.FINAL&&(e.key==='Enter'||e.key===' ')){location.reload();return}
      if(this.state===S.INTRO&&(e.key==='Enter'||e.key===' ')){this.handleIntroClick();return}
      if(this.state!==S.PLAYING)return
      const g=window.__game
      if(e.key==='ArrowLeft'||e.key==='a')g.goLeft()
      else if(e.key==='ArrowRight'||e.key==='d')g.goRight()
      else if(e.key==='ArrowUp'||e.key==='w')g.goUp()
      else if(e.key==='ArrowDown'||e.key==='s')g.goDown()
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
        drawShivaAppearance(ctx,g.view,g.shivaPhase||0,t)
      }

      this.drawNavArrows(g,ctx,t)

      if(g.anim)drawPickupToast(ctx,t,g.anim)
    }
    if(this.state===S.PUZZLE&&this.puzzle&&this.puzzle.render){
      this.puzzle.render(ctx,t)
    }
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

  showDiary(pages){
    this.state=S.NOTE
    this.diaryPages=pages
    this.diaryPageIdx=0
    this.diaryFlipping=false
    this.renderDiaryPage()
    document.getElementById('note-overlay').style.display='flex'
    const hint=document.getElementById('book-hint')
    hint.textContent=pages.length>1?'◀ VIRAR ▶':''
  }

  renderDiaryPage(){
    const page=document.getElementById('diary-page')
    const front=page.querySelector('.page-front')
    const back=page.querySelector('.page-back')
    const idx=this.diaryPageIdx
    const total=this.diaryPages.length

    const getBody=t=>{
      const nl=t.indexOf('\n')
      return nl>=0?t.slice(nl+1):''
    }
    const getTitle=t=>{
      const m=t.match(/^(.+)/)
      return m?m[1]:''
    }

    front.querySelector('.page-header').textContent=idx<total?getTitle(this.diaryPages[idx]):''
    front.querySelector('.page-text').textContent=idx<total?getBody(this.diaryPages[idx]):''
    front.querySelector('.page-number').textContent=idx<total?`— ${idx+1} —`:''

    const nextIdx=Math.min(idx+1,total-1)
    back.querySelector('.page-header').textContent=nextIdx<total?getTitle(this.diaryPages[nextIdx]):''
    back.querySelector('.page-text').textContent=nextIdx<total?getBody(this.diaryPages[nextIdx]):''
    back.querySelector('.page-number').textContent=nextIdx<total?`— ${nextIdx+1} —`:total>0?`— ${total} —`:'';

    const prevEl=document.getElementById('book-prev')
    const nextEl=document.getElementById('book-next')
    prevEl.style.display=this.diaryPageIdx>0?'block':'none'
    nextEl.style.display=this.diaryPageIdx<total-1?'block':'none'

    page.classList.remove('flipping','flipping-back')
  }

  nextDiaryPage(){
    if(this.diaryFlipping||this.diaryPageIdx>=this.diaryPages.length-1)return
    this.diaryFlipping=true
    const page=document.getElementById('diary-page')
    const g=window.__game
    if(g&&g.a)g.a.paper()
    page.classList.add('flipping')
    const onEnd=()=>{
      page.removeEventListener('transitionend',onEnd)
      this.diaryPageIdx++
      page.style.transition='none'
      this.renderDiaryPage()
      page.offsetHeight
      page.style.transition=''
      this.diaryFlipping=false
    }
    page.addEventListener('transitionend',onEnd)
  }

  prevDiaryPage(){
    if(this.diaryFlipping||this.diaryPageIdx<=0)return
    this.diaryFlipping=true
    const page=document.getElementById('diary-page')
    const g=window.__game
    if(g&&g.a)g.a.paper()
    const front=page.querySelector('.page-front')
    const back=page.querySelector('.page-back')
    const idx=this.diaryPageIdx
    const getBody=t=>{const nl=t.indexOf('\n');return nl>=0?t.slice(nl+1):''}
    const getTitle=t=>{const m=t.match(/^(.+)/);return m?m[1]:''}

    page.style.transition='none'
    page.classList.remove('flipping','flipping-back')
    // Front shows current page, back shows PREVIOUS page (will be revealed after flip)
    front.querySelector('.page-header').textContent=getTitle(this.diaryPages[idx])
    front.querySelector('.page-text').textContent=getBody(this.diaryPages[idx])
    front.querySelector('.page-number').textContent=`— ${idx+1} —`
    const prevIdx=idx-1
    back.querySelector('.page-header').textContent=getTitle(this.diaryPages[prevIdx])
    back.querySelector('.page-text').textContent=getBody(this.diaryPages[prevIdx])
    back.querySelector('.page-number').textContent=`— ${prevIdx+1} —`

    page.offsetHeight
    page.style.transition=''
    page.classList.add('flipping-back')
    const onEnd=()=>{
      page.removeEventListener('transitionend',onEnd)
      this.diaryPageIdx--
      page.style.transition='none'
      page.classList.remove('flipping-back')
      this.renderDiaryPage()
      page.offsetHeight
      page.style.transition=''
      this.diaryFlipping=false
    }
    page.addEventListener('transitionend',onEnd)
  }

  closeNote(){
    this.state=S.PLAYING
    document.getElementById('note-overlay').style.display='none'
    this.diaryPages=[]
    this.diaryPageIdx=0
    this.diaryFlipping=false
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

  drawNavArrows(g,ctx,t){
    const alpha=0.2+Math.sin(t*0.003)*0.08
    ctx.fillStyle=`rgba(110,90,70,${alpha})`
    ctx.font='18px Georgia'
    ctx.textAlign='center'
    if(g.view===4){
      ctx.fillText('▼',400,585)
    }else{
      ctx.fillText('◀',14,310)
      ctx.fillText('▶',786,310)
      ctx.fillText('▲',400,22)
    }
  }

  showFinal(title,texts){
    this.state=S.FINAL
    const ov=document.getElementById('final-overlay')
    ov.style.display='flex'
    ov.querySelector('.final-title').textContent=title
    ov.querySelector('.final-text').innerHTML=texts.map(t=>'<p>'+t+'</p>').join('')
  }
}
