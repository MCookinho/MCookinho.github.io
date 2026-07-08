(function () {
  'use strict'

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
  let idx = 0
  let tetris = null

  document.addEventListener('keydown', function (e) {
    const key = e.key
    const exp = KONAMI[idx]
    if (key === exp || key.toLowerCase() === exp.toLowerCase()) {
      idx++
      if (idx === KONAMI.length) {
        idx = 0
        e.preventDefault()
        launch()
      }
    } else {
      idx = 0
    }
  })

  function launch() {
    if (tetris) { tetris.show(); return }
    flashEffect()
    setTimeout(() => { tetris = new TetrisGame() }, 600)
  }

  function flashEffect() {
    const el = document.createElement('div')
    el.className = 'konami-flash'
    el.innerHTML = '<span>// KONAMI ACTIVATED</span>'
    document.body.appendChild(el)
    el.addEventListener('animationend', () => el.remove())
  }

  const C = {
    I: '#00ffff',
    O: '#ffff00',
    T: '#ff1493',
    S: '#00ff41',
    Z: '#ff0044',
    J: '#4466ff',
    L: '#ff6600',
    ghost: 'rgba(255,255,255,0.08)',
    grid: 'rgba(255,255,255,0.04)',
    bg: '#0a0a0a',
    border: '#ff1493',
  }

  const SHAPES = {
    I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    O: [[1,1],[1,1]],
    T: [[0,1,0],[1,1,1],[0,0,0]],
    S: [[0,1,1],[1,1,0],[0,0,0]],
    Z: [[1,1,0],[0,1,1],[0,0,0]],
    J: [[1,0,0],[1,1,1],[0,0,0]],
    L: [[0,0,1],[1,1,1],[0,0,0]],
  }

  const PIECES = ['I','O','T','S','Z','J','L']

  const KICKS = {
    '0>1': [[-1,0],[-1,-1],[0,2],[-1,2]],
    '1>0': [[1,0],[1,1],[0,-2],[1,-2]],
    '1>2': [[1,0],[1,1],[0,-2],[1,-2]],
    '2>1': [[-1,0],[-1,-1],[0,2],[-1,2]],
    '2>3': [[1,0],[1,-1],[0,2],[1,2]],
    '3>2': [[-1,0],[-1,1],[0,-2],[-1,-2]],
    '3>0': [[-1,0],[-1,-1],[0,2],[-1,2]],
    '0>3': [[1,0],[1,1],[0,-2],[1,-2]],
  }
  const IKICKS = {
    '0>1': [[-2,0],[1,0],[-2,1],[1,-2]],
    '1>0': [[2,0],[-1,0],[2,-1],[-1,2]],
    '1>2': [[-1,0],[2,0],[-1,-2],[2,1]],
    '2>1': [[1,0],[-2,0],[1,2],[-2,-1]],
    '2>3': [[2,0],[-1,0],[2,-1],[-1,2]],
    '3>2': [[-2,0],[1,0],[-2,1],[1,-2]],
    '3>0': [[1,0],[-2,0],[1,2],[-2,-1]],
    '0>3': [[-1,0],[2,0],[-1,-2],[2,1]],
  }

  function rotateCCW(m) {
    return m[0].map((_, c) => m.map(r => r[r.length-1-c]))
  }

  function getK(piece, from, to) {
    const k = `${from}>${to}`
    return piece === 'I' ? (IKICKS[k]||[]) : (KICKS[k]||[])
  }

  function rand(n) { return Math.floor(Math.random()*n) }
  function lerp(a,b,t) { return a+(b-a)*t }
  function clr(r,g,b,a) { return `rgba(${r|0},${g|0},${b|0},${a})` }

  class Particle {
    constructor(x,y,c) {
      this.x = x; this.y = y; this.c = c
      this.vx = (Math.random()-0.5)*4
      this.vy = -Math.random()*6-2
      this.life = 1; this.decay = 0.015+Math.random()*0.01
    }
    update() { this.x+=this.vx; this.y+=this.vy; this.vy+=0.15; this.life-=this.decay }
    get dead() { return this.life<=0 }
  }

  class TetrisGame {
    constructor() {
      this.cell = 28
      this.rows = 20
      this.cols = 10
      this.bw = this.cols*this.cell
      this.bh = this.rows*this.cell
      this.board = Array(this.rows).fill().map(()=>Array(this.cols).fill(0))
      this.score = 0
      this.lines = 0
      this.level = 1
      this.gameOver = false
      this.paused = false
      this.dropTimer = 0
      this.dropInterval = 1000
      this.lockTimer = 0
      this.lockDelay = 500
      this.lockMoves = 0
      this.maxLockMoves = 15
      this.clearing = null
      this.clearFlash = 0
      this.particles = []
      this.levelUpFlash = 0
      this.lastTime = 0
      this.animFrame = null

      this.dasDelay = 170
      this.dasInterval = 50
      this.keys = {}
      this.dasTimers = {}
      this.dasDir = null

      this.next = null
      this.hold = null
      this.canHold = true
      this.bag = []
      this.spawnPiece()

      this.buildDOM()
      this.render()
      this.loop(0)
      this.bindKeys()
    }

    buildDOM() {
      this.overlay = document.createElement('div')
      this.overlay.className = 'tetris-overlay'
      this.overlay.innerHTML = `
<div class="tetris-frame">
  <div class="tetris-head">
    <span class="tetris-title">TETRIS</span>
    <button class="tetris-close" id="tClose"><span>[ X ]</span></button>
  </div>
  <div class="tetris-body">
    <canvas id="tBoard" width="${this.bw}" height="${this.bh}"></canvas>
    <div class="tpanel">
      <div class="tstat"><span class="tlabel">SCORE</span><span class="tval" id="tScore">0</span></div>
      <div class="tstat"><span class="tlabel">LINES</span><span class="tval" id="tLines">0</span></div>
      <div class="tstat"><span class="tlabel">LEVEL</span><span class="tval" id="tLevel">1</span></div>
      <div class="tnext"><span class="tlabel">NEXT</span><canvas id="tNext" width="112" height="112"></canvas></div>
    </div>
  </div>
  <div class="tcontrols">
    <span>← → MOVER</span><span>↑ ROTAR</span><span>↓ DESCER</span><span>SPACE SOLTAR</span><span>P PAUSA</span>
  </div>
</div>`
      document.body.appendChild(this.overlay)
      requestAnimationFrame(() => this.overlay.classList.add('tetris-open'))

      this.cv = document.getElementById('tBoard')
      this.ctx = this.cv.getContext('2d')
      this.ncv = document.getElementById('tNext')
      this.nctx = this.ncv.getContext('2d')

      document.getElementById('tClose').onclick = () => this.hide()
      this.overlay.onclick = (e) => { if (e.target===this.overlay) this.hide() }
    }

    hide() { this.overlay.classList.remove('tetris-open'); this.paused=true }
    show() { this.overlay.classList.add('tetris-open'); this.paused=false }

    bagNext() {
      if (this.bag.length===0) this.bag = PIECES.slice().sort(()=>Math.random()-0.5)
      return this.bag.pop()
    }

    spawnPiece() {
      const t = this.next || this.bagNext()
      this.next = this.bagNext()
      const shape = SHAPES[t].map(r=>[...r])
      const cols = shape[0].length
      this.piece = { type: t, shape, x: Math.floor((this.cols-cols)/2), y: 0, rot: 0 }
      this.canHold = true
      this.lockTimer = 0
      this.lockMoves = 0
      if (this.collides(this.piece.shape, this.piece.x, this.piece.y)) {
        this.gameOver = true
      }
    }

    collides(shape, px, py) {
      for (let r=0; r<shape.length; r++) {
        for (let c=0; c<shape[r].length; c++) {
          if (!shape[r][c]) continue
          const bx = px+c, by = py+r
          if (bx<0||bx>=this.cols||by>=this.rows) return true
          if (by>=0 && this.board[by][bx]) return true
        }
      }
      return false
    }

    lock() {
      const s = this.piece.shape, px = this.piece.x, py = this.piece.y
      for (let r=0; r<s.length; r++) {
        for (let c=0; c<s[r].length; c++) {
          if (!s[r][c]) continue
          const by = py+r
          if (by<0) { this.gameOver=true; return }
          this.board[by][px+c] = this.piece.type
        }
      }
      this.clearLines()
      this.spawnPiece()
      this.dropTimer = 0
    }

    clearLines() {
      const full = []
      for (let r=0; r<this.rows; r++) {
        if (this.board[r].every(c=>c!==0)) full.push(r)
      }
      if (full.length===0) return
      this.clearing = full
      this.clearFlash = 12

      const pts = [0,100,300,500,800]
      this.score += (pts[full.length]||800)*this.level
      this.lines += full.length
      const newLvl = Math.floor(this.lines/10)+1
      if (newLvl>this.level) {
        this.level = newLvl
        this.levelUpFlash = 20
        this.dropInterval = Math.max(50, 1000 - (this.level-1)*80)
      }

      this.spawnParticles(full)
    }

    spawnParticles(rows) {
      for (const r of rows) {
        for (let c=0; c<this.cols; c++) {
          for (let i=0; i<3; i++) {
            this.particles.push(new Particle(
              c*this.cell+this.cell/2, r*this.cell+this.cell/2,
              this.board[r][c]
            ))
          }
        }
      }
    }

    finishClear() {
      if (!this.clearing) return
      const rows = this.clearing.sort((a,b)=>b-a)
      for (const r of rows) {
        this.board.splice(r,1)
      }
      for (let i = 0; i < rows.length; i++) {
        this.board.unshift(Array(this.cols).fill(0))
      }
      this.clearing = null
      this.clearFlash = 0
    }

    move(dx) {
      if (this.gameOver||this.paused||this.clearing) return false
      if (!this.collides(this.piece.shape, this.piece.x+dx, this.piece.y)) {
        this.piece.x += dx
        this.onMove()
        return true
      }
      return false
    }

    rotate(dir) {
      if (this.gameOver||this.paused||this.clearing) return
      const from = this.piece.rot
      const to = (from+dir+4)%4
      const rotated = rotateCCW(this.piece.shape)
      if (!this.collides(rotated, this.piece.x, this.piece.y)) {
        this.piece.shape = rotated
        this.piece.rot = to
        this.onMove()
        return
      }
      const kicks = getK(this.piece.type, from, to)
      for (const [kx,ky] of kicks) {
        if (!this.collides(rotated, this.piece.x+kx, this.piece.y-ky)) {
          this.piece.shape = rotated
          this.piece.x += kx
          this.piece.y -= ky
          this.piece.rot = to
          this.onMove()
          return
        }
      }
    }

    onMove() {
      this.lockMoves++
      if (this.isOnFloor()) this.lockTimer = 0
    }

    isOnFloor() {
      return this.collides(this.piece.shape, this.piece.x, this.piece.y+1)
    }

    hardDrop() {
      if (this.gameOver||this.paused||this.clearing) return
      let dy = 0
      while (!this.collides(this.piece.shape, this.piece.x, this.piece.y+dy+1)) dy++
      this.piece.y += dy
      this.score += dy*2
      this.lock()
    }

    ghostY() {
      let dy = 0
      while (!this.collides(this.piece.shape, this.piece.x, this.piece.y+dy+1)) dy++
      return this.piece.y+dy
    }

    holdPiece() {
      if (this.gameOver||this.paused||this.clearing||!this.canHold) return
      if (!this.hold) {
        this.hold = this.piece.type
        this.spawnPiece()
      } else {
        const t = this.hold
        this.hold = this.piece.type
        const shape = SHAPES[t].map(r=>[...r])
        const cols = shape[0].length
        this.piece = { type: t, shape, x: Math.floor((this.cols-cols)/2), y: 0, rot: 0 }
      }
      this.canHold = false
    }

    update(dt) {
      if (this.gameOver||this.paused) return

      if (this.levelUpFlash>0) this.levelUpFlash--
      if (this.clearFlash>0) {
        this.clearFlash--
        if (this.clearFlash===0) this.finishClear()
        return
      }
      this.particles = this.particles.filter(p=>{p.update();return !p.dead})

      this.dropTimer += dt
      if (this.dropTimer >= this.dropInterval) {
        this.dropTimer = 0
        if (!this.collides(this.piece.shape, this.piece.x, this.piece.y+1)) {
          this.piece.y++
        } else {
          this.lockTimer += dt
          if (this.lockTimer >= this.lockDelay || this.lockMoves >= this.maxLockMoves) {
            this.lock()
          }
        }
      }
    }

    render() {
      const ctx = this.ctx
      ctx.clearRect(0,0,this.bw,this.bh)

      // bg
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0,0,this.bw,this.bh)

      // grid
      ctx.strokeStyle = C.grid
      ctx.lineWidth = 1
      for (let r=0; r<=this.rows; r++) {
        ctx.beginPath(); ctx.moveTo(0,r*this.cell); ctx.lineTo(this.bw,r*this.cell); ctx.stroke()
      }
      for (let c=0; c<=this.cols; c++) {
        ctx.beginPath(); ctx.moveTo(c*this.cell,0); ctx.lineTo(c*this.cell,this.bh); ctx.stroke()
      }

      // board
      for (let r=0; r<this.rows; r++) {
        for (let c=0; c<this.cols; c++) {
          const v = this.board[r][c]
          if (!v) continue
          const flashing = this.clearing && this.clearing.includes(r)
          if (flashing && this.clearFlash%4<2) continue
          this.drawCell(ctx, c, r, C[v]||C.T)
        }
      }

      // ghost
      if (!this.gameOver && this.piece) {
        const gy = this.ghostY()
        const s = this.piece.shape
        for (let r=0; r<s.length; r++) {
          for (let c=0; c<s[r].length; c++) {
            if (!s[r][c]) continue
            const bx = this.piece.x+c, by = gy+r
            if (by<0) continue
            const col = C[this.piece.type]||C.T
            ctx.fillStyle = C.ghost
            ctx.fillRect(bx*this.cell+1, by*this.cell+1, this.cell-2, this.cell-2)
            ctx.strokeStyle = col
            ctx.lineWidth = 1
            ctx.globalAlpha = 0.3
            ctx.strokeRect(bx*this.cell+1, by*this.cell+1, this.cell-2, this.cell-2)
            ctx.globalAlpha = 1
          }
        }
      }

      // current piece
      if (!this.gameOver && this.piece) {
        const s = this.piece.shape
        for (let r=0; r<s.length; r++) {
          for (let c=0; c<s[r].length; c++) {
            if (!s[r][c]) continue
            const bx = this.piece.x+c, by = this.piece.y+r
            if (by<0) continue
            this.drawCell(ctx, bx, by, C[this.piece.type]||C.T)
          }
        }
      }

      // particles
      for (const p of this.particles) {
        ctx.globalAlpha = p.life
        ctx.fillStyle = C[p.c]||C.T
        ctx.fillRect(p.x-2, p.y-2, 4, 4)
      }
      ctx.globalAlpha = 1

      // game over overlay
      if (this.gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'
        ctx.fillRect(0,0,this.bw,this.bh)
        ctx.fillStyle = '#ff1493'
        ctx.font = '16px "Press Start 2P"'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', this.bw/2, this.bh/2-20)
        ctx.fillStyle = '#fff'
        ctx.font = '8px "Press Start 2P"'
        ctx.fillText('PRESSIONE R PARA REINICIAR', this.bw/2, this.bh/2+20)
      }

      // pause overlay
      if (this.paused && !this.overlay.classList.contains('tetris-open')) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0,0,this.bw,this.bh)
        ctx.fillStyle = '#00ffff'
        ctx.font = '16px "Press Start 2P"'
        ctx.textAlign = 'center'
        ctx.fillText('PAUSA', this.bw/2, this.bh/2)
      }

      if (this.levelUpFlash>0) {
        ctx.fillStyle = `rgba(255,255,255,${this.levelUpFlash/40})`
        ctx.fillRect(0,0,this.bw,this.bh)
      }

      // score panel
      document.getElementById('tScore').textContent = this.score
      document.getElementById('tLines').textContent = this.lines
      document.getElementById('tLevel').textContent = this.level

      // next piece
      this.drawNext()
    }

    drawCell(ctx, x, y, color) {
      const s = this.cell
      ctx.fillStyle = color
      ctx.fillRect(x*s+1, y*s+1, s-2, s-2)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.fillRect(x*s+1, y*s+1, s-2, 3)
      ctx.fillRect(x*s+1, y*s+1, 3, s-2)
    }

    drawNext() {
      const nctx = this.nctx
      nctx.clearRect(0,0,112,112)
      nctx.fillStyle = '#0a0a0a'
      nctx.fillRect(0,0,112,112)

      if (!this.next) return
      const shape = SHAPES[this.next]
      const rows = shape.length, cols = shape[0].length
      const cs = 24
      const ox = (112-cols*cs)/2, oy = (112-rows*cs)/2
      for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
          if (!shape[r][c]) continue
          const col = C[this.next]||C.T
          nctx.fillStyle = col
          nctx.fillRect(ox+c*cs, oy+r*cs, cs-1, cs-1)
          nctx.fillStyle = 'rgba(255,255,255,0.12)'
          nctx.fillRect(ox+c*cs, oy+r*cs, cs-1, 2)
          nctx.fillRect(ox+c*cs, oy+r*cs, 2, cs-1)
        }
      }
    }

    loop(time) {
      const dt = Math.min(time-this.lastTime, 1000)
      this.lastTime = time
      this.update(dt)
      this.render()
      this.animFrame = requestAnimationFrame((t) => this.loop(t))
    }

    restart() {
      this.board = Array(this.rows).fill().map(()=>Array(this.cols).fill(0))
      this.score = 0
      this.lines = 0
      this.level = 1
      this.dropInterval = 1000
      this.gameOver = false
      this.paused = false
      this.clearing = null
      this.clearFlash = 0
      this.particles = []
      this.dropTimer = 0
      this.lockTimer = 0
      this.lockMoves = 0
      this.bag = []
      this.hold = null
      this.canHold = true
      this.spawnPiece()
    }

    bindKeys() {
      document.addEventListener('keydown', (e) => {
        if (!this.overlay.classList.contains('tetris-open') && e.key!=='p'&&e.key!=='P') return

        switch(e.key) {
          case 'ArrowLeft': e.preventDefault(); this.dasDir='left'; this.dasTimers.left={delay:this.dasDelay,interval:0}; this.move(-1); break
          case 'ArrowRight': e.preventDefault(); this.dasDir='right'; this.dasTimers.right={delay:this.dasDelay,interval:0}; this.move(1); break
          case 'ArrowDown': e.preventDefault(); if(!this.gameOver&&!this.paused&&!this.clearing){if(!this.collides(this.piece.shape,this.piece.x,this.piece.y+1)){this.piece.y++;this.score++;this.dropTimer=0}} break
          case 'ArrowUp': e.preventDefault(); this.rotate(1); break
          case ' ': e.preventDefault(); this.hardDrop(); break
          case 'p': case 'P': e.preventDefault(); this.paused=!this.paused; if(this.paused)this.overlay.classList.remove('tetris-open'); else this.overlay.classList.add('tetris-open'); break
          case 'r': case 'R': e.preventDefault(); if(this.gameOver)this.restart(); break
          case 'c': case 'C': e.preventDefault(); this.holdPiece(); break
        }
      })

      document.addEventListener('keyup', (e) => {
        if (e.key==='ArrowLeft') { delete this.dasTimers.left; if(this.dasDir==='left')this.dasDir=null }
        if (e.key==='ArrowRight') { delete this.dasTimers.right; if(this.dasDir==='right')this.dasDir=null }
      })

      // DAS handling in update
      const origUpdate = this.update.bind(this)
      this.update = (dt) => {
        origUpdate(dt)
        if (this.gameOver||this.paused||this.clearing) return
        for (const [dir,timer] of Object.entries(this.dasTimers)) {
          if (!timer) continue
          timer.delay -= dt
          if (timer.delay<=0) {
            timer.interval -= dt
            if (timer.interval<=0) {
              timer.interval = this.dasInterval
              this.move(dir==='left'?-1:1)
            }
          }
        }
      }
    }
  }
})()
