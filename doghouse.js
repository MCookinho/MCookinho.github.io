;(function () {
  var scene, camera, renderer, raycaster
  var isPointerLocked = false, lastTime = 0, dirLight = null, memoryFlags = 0, keys = {}

  var audioCtx = null
  var flickerLights = []
  var footstepTimer = 0

  function getAudioCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      } catch (e) { return null }
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {})
    }
    return audioCtx
  }

  function ensureAudio() {
    var ac = getAudioCtx()
    if (ac && ac.state === 'suspended') ac.resume().catch(function () {})
  }
  document.addEventListener('click', ensureAudio, { once: true })
  document.addEventListener('keydown', ensureAudio, { once: true })

  function playNoise(duration, volume, freq) {
    try {
      var ac = getAudioCtx(), now = ac.currentTime
      var bufSize = Math.floor(ac.sampleRate * duration)
      var buf = ac.createBuffer(1, bufSize, ac.sampleRate)
      var data = buf.getChannelData(0)
      for (var i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2)
      var source = ac.createBufferSource()
      source.buffer = buf
      var gain = ac.createGain()
      gain.gain.setValueAtTime(volume, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
      var filter = ac.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(freq || 800, now)
      source.connect(filter)
      filter.connect(gain)
      gain.connect(ac.destination)
      source.start(now)
    } catch (e) {}
  }

  function playTone(freqStart, freqEnd, duration, volume, type) {
    try {
      var ac = getAudioCtx(), now = ac.currentTime
      var osc = ac.createOscillator()
      osc.type = type || 'sine'
      osc.frequency.setValueAtTime(freqStart, now)
      if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration)
      var gain = ac.createGain()
      gain.gain.setValueAtTime(volume, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.start(now)
      osc.stop(now + duration + 0.01)
    } catch (e) {}
  }

  var ambientSource = null
  var windSource = null
  var dripTimer = 0

  function startAmbient() {
    try {
      var ac = getAudioCtx()
      if (ac.state === 'suspended') ac.resume()
      // Deep house rumble (low frequency drone)
      var bufSize = Math.floor(ac.sampleRate * 8)
      var buf = ac.createBuffer(1, bufSize, ac.sampleRate)
      var data = buf.getChannelData(0)
      for (var i = 0; i < bufSize; i++) {
        var t = i / ac.sampleRate
        var env = Math.sin(Math.PI * i / bufSize)
        data[i] = (Math.random() * 2 - 1) * env * 0.012
        data[i] += Math.sin(t * 30) * 0.002 * env
        data[i] += Math.sin(t * 17.3) * 0.001 * env
      }
      ambientSource = ac.createBufferSource()
      ambientSource.buffer = buf
      ambientSource.loop = true
      var gain = ac.createGain()
      gain.gain.setValueAtTime(0.06, ac.currentTime)
      var filter = ac.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(120, ac.currentTime)
      ambientSource.connect(filter)
      filter.connect(gain)
      gain.connect(ac.destination)
      ambientSource.start()

      // Wind (band-passed noise, slow modulation)
      var wBufSize = Math.floor(ac.sampleRate * 6)
      var wBuf = ac.createBuffer(1, wBufSize, ac.sampleRate)
      var wData = wBuf.getChannelData(0)
      for (var wi = 0; wi < wBufSize; wi++) {
        wData[wi] = (Math.random() * 2 - 1) * 0.02 * Math.sin(Math.PI * wi / wBufSize)
      }
      windSource = ac.createBufferSource()
      windSource.buffer = wBuf
      windSource.loop = true
      var wGain = ac.createGain()
      wGain.gain.setValueAtTime(0.025, ac.currentTime)
      var wFilter = ac.createBiquadFilter()
      wFilter.type = 'bandpass'
      wFilter.frequency.setValueAtTime(800, ac.currentTime)
      wFilter.Q.setValueAtTime(0.5, ac.currentTime)
      windSource.connect(wFilter)
      wFilter.connect(wGain)
      wGain.connect(ac.destination)
      windSource.start()
    } catch (e) {}
  }

  function playDrip(cx, cz) {
    try {
      var dt = 0
      function dripLoop() {
        if (gameState.gameOver) return
        dt += 0.016
        if (dt > 2 + Math.random() * 5) {
          dt = 0
          playNoise(0.03, 0.015, 1200 + Math.random() * 600)
          setTimeout(function () { playNoise(0.02, 0.01, 800) }, 50)
        }
        requestAnimationFrame(dripLoop)
      }
      dripLoop()
    } catch (e) {}
  }

  function playFootstep() {
    var col = Math.floor(player.pos.x / CELL_SIZE), row = Math.floor(player.pos.z / CELL_SIZE)
    var fl = isOnSecondFloor ? 1 : 0
    var room = getRoomAtCell(col, row, fl)
    if (room && (room.type === 'garage' || room.type === 'entrance')) {
      playNoise(0.07, 0.12, 300 + Math.random() * 200)
      playNoise(0.04, 0.10, 100)
    } else if (room && room.type === 'bathroom') {
      playNoise(0.05, 0.08, 800 + Math.random() * 400)
      playNoise(0.02, 0.06, 300)
    } else if (room && (room.type === 'bedroom' || room.type === 'study')) {
      playNoise(0.04, 0.06, 400 + Math.random() * 200)
      playNoise(0.02, 0.04, 150)
    } else if (room && room.type === 'hall') {
      playNoise(0.05, 0.12, 600 + Math.random() * 200)
      playNoise(0.03, 0.08, 300)
    } else {
      playNoise(0.06, 0.10, 500 + Math.random() * 300)
      playNoise(0.03, 0.06, 200)
    }
  }

  function playJumpSnd() {
    try {
      var ac = getAudioCtx(), now = ac.currentTime
      var buf = ac.createBuffer(1, ac.sampleRate * 0.12, ac.sampleRate)
      var data = buf.getChannelData(0)
      for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5)
      var src = ac.createBufferSource()
      src.buffer = buf
      var bp = ac.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.setValueAtTime(300, now)
      bp.frequency.exponentialRampToValueAtTime(600, now + 0.12)
      bp.Q.setValueAtTime(1.5, now)
      var g = ac.createGain()
      g.gain.setValueAtTime(0.05, now)
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      src.connect(bp)
      bp.connect(g)
      g.connect(ac.destination)
      src.start(now)
      var buf2 = ac.createBuffer(1, ac.sampleRate * 0.04, ac.sampleRate)
      var d2 = buf2.getChannelData(0)
      for (var j = 0; j < d2.length; j++) d2[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / d2.length, 3)
      var src2 = ac.createBufferSource()
      src2.buffer = buf2
      var lp = ac.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.setValueAtTime(200, now)
      var g2 = ac.createGain()
      g2.gain.setValueAtTime(0.06, now)
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
      src2.connect(lp)
      lp.connect(g2)
      g2.connect(ac.destination)
      src2.start(now)
    } catch (e) {}
  }

  function playLandSnd() {
    playNoise(0.1, 0.08, 300)
    playNoise(0.04, 0.04, 100)
  }

  function playFlashlightSnd() {
    try {
      var ac = getAudioCtx(), now = ac.currentTime
      var buf = ac.createBuffer(1, ac.sampleRate * 0.06, ac.sampleRate)
      var data = buf.getChannelData(0)
      for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2)
      var source = ac.createBufferSource()
      source.buffer = buf
      var hp = ac.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.setValueAtTime(1500, now)
      hp.Q.setValueAtTime(2, now)
      var gain = ac.createGain()
      gain.gain.setValueAtTime(flashlightOn ? 0.04 : 0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      source.connect(hp)
      hp.connect(gain)
      gain.connect(ac.destination)
      source.start(now)
      setTimeout(function () {
        var buf2 = ac.createBuffer(1, ac.sampleRate * 0.02, ac.sampleRate)
        var d2 = buf2.getChannelData(0)
        for (var j = 0; j < d2.length; j++) d2[j] = (Math.random() * 2 - 1) * 0.5 * Math.pow(1 - j / d2.length, 4)
        var src2 = ac.createBufferSource()
        src2.buffer = buf2
        var hp2 = ac.createBiquadFilter()
        hp2.type = 'highpass'
        hp2.frequency.setValueAtTime(3000, now)
        var g2 = ac.createGain()
        g2.gain.setValueAtTime(0.05, now + 0.07)
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
        src2.connect(hp2)
        hp2.connect(g2)
        g2.connect(ac.destination)
        src2.start(now + 0.07)
      }, 60)
    } catch (e) {}
  }

  function playItemPickup() {
    playTone(400, 800, 0.1, 0.05)
    playTone(600, 1200, 0.08, 0.03, 'square')
  }

  function playPuzzleSolve() {
    playTone(300, 600, 0.15, 0.06)
    setTimeout(function () { playTone(400, 800, 0.15, 0.05) }, 150)
    setTimeout(function () { playTone(500, 1000, 0.2, 0.04) }, 300)
  }

  function playCaughtSnd() {
    playNoise(0.3, 0.15, 80)
    playTone(200, 60, 0.6, 0.15, 'sawtooth')
  }

  var growlTimer = 0
  function playGrowl(dist) {
    if (growlTimer > 0) return
    growlTimer = 3 + Math.random() * 4
    var vol = Math.max(0.05, 0.15 * (1 - dist / 6))
    playNoise(0.15 + Math.random() * 0.1, vol, 80 + Math.random() * 40)
    playTone(90 + Math.random() * 30, 60 + Math.random() * 20, 0.3 + Math.random() * 0.2, vol * 0.8, 'sawtooth')
  }

  var GRAVITY = -9.8, JUMP_SPEED = 5.0
  var GRID_COLS = 5, GRID_ROWS = 4, CELL_SIZE = 4, WALL_HEIGHT = 2.8
  var DAY_DURATION = 480, DAWN_SLEEP = 120

  var player = { height: 1.6, speed: 3, pos: new THREE.Vector3(6, 0, 10), velY: 0, isGrounded: true, yaw: 0, pitch: 0 }
  var flashlightOn = false, flashlightFound = false, flashlightPickupAnim = 0

  var gameState = {
    day: 1, maxDays: 5, timeOfDay: 0, dayLength: DAY_DURATION,
    hunger: 100, memories: 0, maxMemories: 6,
    captures: 0, maxCaptures: 5, caught: false, gameOver: false,
    secondFloorUnlocked: false, transitioning: false, transitionDay: 1
  }
  var playerItems = []
  var memoryFlags = 0

  var itemIcons = {
    key: '\uD83D\uDD11', photo: '\uD83D\uDCF7', letter: '\uD83D\uDCDC', medallion: '\uD83C\uDFC5',
    bone: '\uD83E\uDDB4', candle: '\uD83D\uDD6F', musicbox: '\uD83C\uDFB5', mirror: '\uD83E\uDE9E',
    clock: '\u23F0', flower: '\uD83C\uDF38', ring: '\uD83D\uDC8D', book: '\uD83D\uDCD5',
    coin: '\uD83E\uDE99', feather: '\uD83E\uDEB6', jar: '\uD83C\uDFFA',
    miranteKey: '\uD83D\uDDDD', alecrim: '\uD83C\uDF3F', hortela: '\uD83C\uDF31',
    salGrosso: '\uD83E\uDDCA', poProtetor: '\u2728', papelEnzo: '\uD83D\uDCC4',
    tocaKey: '\uD83D\uDD11', diario: '\uD83D\uDCD3', ervasSecas: '\uD83C\uDF3E',
    passo: '\uD83D\uDC3E'
  }

  var ROOMS = [
    // Ground floor
    { id:'living',    col:0, row:0, w:2, h:2, type:'living' },
    { id:'hall',      col:2, row:0, w:1, h:3, type:'hall' },
    { id:'kitchen',   col:3, row:0, w:2, h:2, type:'kitchen' },
    { id:'bedroom_g', col:0, row:2, w:1, h:1, type:'bedroom' },
    { id:'entrance',  col:1, row:2, w:1, h:1, type:'entrance' },
    { id:'dining',    col:3, row:2, w:2, h:1, type:'dining' },
    { id:'garage',    col:0, row:3, w:2, h:1, type:'garage' },
    { id:'bathroom',  col:2, row:3, w:1, h:1, type:'bathroom' },
    { id:'pantry',    col:3, row:3, w:2, h:1, type:'pantry' },
    // Upper floor (yOffset:3.0)
    { id:'bedroom1',  col:0, row:0, w:2, h:2, type:'bedroom', yOffset:3.0 },
    { id:'hall_up',   col:2, row:0, w:1, h:2, type:'hall', yOffset:3.0 },
    { id:'study',     col:3, row:0, w:2, h:1, type:'study', yOffset:3.0 },
    { id:'bedroom2',  col:3, row:1, w:2, h:1, type:'bedroom', yOffset:3.0 }
  ]

  var DOOR_CONNECTIONS = [
    // Ground floor
    ['living', 'hall'],
    ['living', 'bedroom_g'],
    ['living', 'entrance'],
    ['hall', 'kitchen'],
    ['hall', 'dining'],
    ['hall', 'entrance'],
    ['hall', 'bathroom'],
    ['kitchen', 'dining'],
    ['dining', 'pantry'],
    ['bedroom_g', 'entrance'],
    ['entrance', 'garage'],
    ['bathroom', 'garage'],
    ['bathroom', 'pantry'],
    // Upper floor
    ['bedroom1', 'hall_up'],
    ['hall_up', 'study'],
    ['hall_up', 'bedroom2'],
    ['study', 'bedroom2']
  ]

  var ROOM_NAMES = {
    living: 'SALA', hall: 'CORREDOR', kitchen: 'COZINHA',
    bedroom_g: 'QUARTO', entrance: 'ENTRADA', dining: 'SALA DE JANTAR',
    garage: 'GARAGEM', bathroom: 'BANHEIRO', pantry: 'DESPENSA',
    bedroom1: 'QUARTO 1', hall_up: 'CORREDOR', study: 'ESCRIT\u00D3RIO', bedroom2: 'QUARTO 2'
  }

  var VICTIM_NOTES = {
    joao: {
      id:'joao', victim:'Jo\u00E3o Marcelo', room:'bedroom_g',
      title:'// CARTA \u2014 JO\u00C3O MARCELO', icon:'\u2709\uFE0F',
      text:'Peu, se voc\u00EA ler isso... ela n\u00E3o \u00E9 um cachorro normal.\nEu juro que vi ela mudar de forma na minha frente.\nOlhos vermelhos, dentes que n\u00E3o cabiam na boca.\nEla sabe quando a gente mente.\n\nN\u00E3o tente fugir \u2014 encontre a porta dourada.\nEla est\u00E1 no andar de cima.\n\n\u2014 Jo\u00E3o',
      memoryId:0, pos:{x:2.5, z:10}
    },
    sandalia: {
      id:'sandalia', victim:'Sand\u00E1lia', room:'living',
      title:'// MARCAS \u2014 SAND\u00C1LIA', icon:'\uD83D\uDC3E',
      text:null, memoryId:1, pos:{x:4, z:4}
    },
    ulisses: {
      id:'ulisses', victim:'Seu Ulisses', room:'garage',
      title:'// BILHETE \u2014 SEU ULISSES', icon:'\uD83D\uDCDD',
      text:'VOC\u00C8 TAMB\u00C9M?\nAchou que ia ser s\u00F3 um passeio?\n\nA casa muda. Preste aten\u00E7\u00E3o nos dias.\nDia 1 ela fica no corredor.\nDia 2 ela j\u00E1 vai pra cozinha.\n\nE no dia 5? Ela n\u00E3o dorme.\n\nE outra coisa: N\u00C3O CONFIE NO QUE VOC\u00C8 V\u00CA.\nAs paredes mentem.\n\n\u2014 Seu Ulisses (sim, O VIZINHO CHATO)',
      memoryId:2, pos:{x:4.5, z:13}
    },
    enzo: {
      id:'enzo', victim:'Enzo', room:'study',
      title:'// DESENHOS \u2014 ENZO', icon:'\uD83C\uDFA8',
      text:'[Desenho infantil: uma figura canina gigante com 3 cabe\u00E7as, olhos vermelhos, cercada de fogo. No canto: uma porta dourada.]\n\nA tia do fogo disse pra n\u00E3o abrir a porta grande.\nEla mora l\u00E1 dentro.\n\n\u2600\uFE0F\uD83C\uDF19\u2B50\uD83D\uDD25\n\n[Letra de crian\u00E7a] O sol vem antes da lua,\na estrela brilha depois do fogo,\no fogo queima antes do sol dormir.',
      memoryId:3, pos:{x:16, z:2.5}
    },
    elaine: {
      id:'elaine', victim:'Elaine', room:'kitchen',
      title:'// CADERNO \u2014 ELAINE', icon:'\uD83D\uDCD6',
      text:'Receita da V\u00F3 \u2014 Caldo Protetor\n\nIngredientes que afastam o MAL:\n- Alecrim seco (confunde o faro)\n- Hortel\u00E3 fresca (acalma os esp\u00EDritos)\n- Sal grosso (barreira)\n\nModo de preparo:\nMisture tudo e espalhe na entrada.\nEla hesita. D\u00E1 tempo de fugir.\n\nDeixei escondido pela casa.\nDeus tenha piedade de quem vier depois.\n\n\u2014 Elaine',
      memoryId:4, pos:{x:15, z:3.5}
    },
    giulia: {
      id:'giulia', victim:'Giulia L.', room:'bathroom',
      title:'// ANOTA\u00C7\u00D5ES \u2014 GIULIA L.', icon:'\uD83D\uDD0D',
      text:'Consegui decifrar parte do padr\u00E3o.\n\n\u25B3 = 1\n\u25CB = 2\n\u25A1 = 3\n\u2726 = 4\n\nA sequ\u00EAncia no espelho: \u25A1 \u25B3 \u2726 \u25CB\n\nO cofre atr\u00E1s do quadro... tem a chave.\nA chave da toca.\n\nL\u00E1 dentro tem a verdade.\n\nSe voc\u00EA est\u00E1 lendo isso, ainda d\u00E1 tempo.\nN\u00C3O FA\u00C7A O QUE ELA PEDE.\n\n\u2014 Giulia',
      memoryId:5, pos:{x:10, z:13.5}
    }
  }

  var puzzleState = {
    drawerSolved: false, herbsCollected: 0, herbsUsed: false,
    drawingSeq: [], drawingSolved: false, safeSolved: false,
    brickFound: false, brickPassageOpen: false, diaryRead: false,
    scratchCount: 0, scratchSolved: false
  }

  var wallObjects = []
  var wallBoxes = []
  function rebuildWallBoxes() {
    wallBoxes = []
    for (var bi = 0; bi < wallObjects.length; bi++) {
      wallBoxes.push(new THREE.Box3().setFromObject(wallObjects[bi]))
    }
  }
  var interactables = []
  var scratchMarks = []
  var noteMeshes = []
  var drawingMeshes = []
  var hudEls = {}
  var currentInteractTarget = null
  var brickWallMesh = null
  var goldenDoorMesh = null
  var stairTeleportUp = null
  var stairTeleportDown = null
  var isOnSecondFloor = false
  var shivaAlertActive = false

  var flashlight = null
  var flashlightBulb = null

  var shiva = null, shivaBodyMat = null

  var shivaState = {
    mesh: null, pos: new THREE.Vector3(10, 0, 8), targetRoom: null,
    waypoints: [], currentWP: 0, speed: 1.5, state: 'patrol',
    alertDistance: 6, chaseDistance: 2, patrolTimer: 0,
    sleepTimer: 0, isSleeping: true, proximityTimer: 0,
    lastPlayerDist: 999, anger: 0, sleepPos: new THREE.Vector3(10, 0, 8),
    sleeping: false, wanderDir: 0, lastKnownPos: null, sleepDuration: 0
  }

  function makeCanvas(w, h, drawFn) {
    var c = document.createElement('canvas')
    c.width = w || 128; c.height = h || 128
    drawFn(c.getContext('2d'), c.width, c.height)
    return c
  }

  function createWallpaperTex(baseColor, patternColor, patternFn) {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = baseColor; ctx.fillRect(0, 0, w, h)
      if (patternFn) patternFn(ctx, w, h, patternColor)
      for (var i = 0; i < 200; i++) {
        ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.06) + ')'
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
      }
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1.5, 1.5)
    return tex
  }

  function createVerticalStripes(ctx, w, h, color) {
    ctx.fillStyle = color
    for (var x = 0; x < w; x += 16) ctx.fillRect(x, 0, 4, h)
  }

  function createHorizontalBoards(ctx, w, h, color) {
    ctx.fillStyle = color
    for (var y = 0; y < h; y += 12) {
      ctx.fillRect(0, y, w, 2); ctx.fillRect(0, y + 8, w, 1)
    }
  }

  function createDiamondPattern(ctx, w, h, color) {
    ctx.fillStyle = color; var s = 16
    for (var x = 0; x < w + s; x += s) {
      for (var y = 0; y < h + s; y += s) {
        if (((x / s) % 2) !== ((y / s) % 2)) ctx.fillRect(x, y, s, s)
      }
    }
  }

  function createBrickPattern(ctx, w, h, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 1
    var bh = 16, bw = 32
    for (var row = 0; row < h / bh + 1; row++) {
      var offX = (row % 2) * (bw / 2)
      for (var col = -1; col < w / bw + 2; col++) {
        ctx.strokeRect(col * bw + offX, row * bh, bw, bh)
        ctx.fillStyle = 'rgba(255,255,255,0.02)'
        ctx.fillRect(col * bw + offX + 2, row * bh + 2, bw - 4, bh - 4)
      }
    }
  }

  function createFloorPlanks(color1, color2) {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = color1; ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = color2; ctx.lineWidth = 1
      for (var y = 0; y < h; y += 12) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
        if (y % 24 < 2) {
          var jx = Math.random() * w * 0.6 + w * 0.2
          ctx.beginPath(); ctx.moveTo(jx, y); ctx.lineTo(jx, y + 12); ctx.stroke()
        }
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.04)'; ctx.lineWidth = 0.5
      for (var i = 0; i < 30; i++) {
        var gx = Math.random() * w, gy = Math.random() * h
        ctx.beginPath(); ctx.moveTo(gx, gy)
        ctx.quadraticCurveTo(gx + (Math.random() - 0.5) * 10, gy + (Math.random() - 0.5) * 5, gx + (Math.random() - 0.5) * 15, gy + (Math.random() - 0.5) * 10)
        ctx.stroke()
      }
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 2)
    return tex
  }

  function createTileFloor(color1, color2) {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = color1; ctx.fillRect(0, 0, w, h); var s = 16
      ctx.strokeStyle = color2; ctx.lineWidth = 1
      for (var x = 0; x < w; x += s) {
        for (var y = 0; y < h; y += s) {
          ctx.strokeRect(x, y, s, s)
          if (((x / s) + (y / s)) % 2 === 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2)
          }
        }
      }
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 2)
    return tex
  }

  function createCeilTex() {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = '#0a0a12'; ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(255,255,255,0.02)'
      for (var i = 0; i < 300; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 2)
    return tex
  }

  function createTrimTex() {
    var c = makeCanvas(32, 32, function (ctx, w, h) {
      ctx.fillStyle = '#1a1410'; ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#2a1e18'; ctx.fillRect(0, 0, w, 3)
      ctx.fillStyle = '#0e0a08'; ctx.fillRect(0, h - 4, w, 4)
      ctx.strokeStyle = '#3a2820'; ctx.lineWidth = 0.5; ctx.strokeRect(1, 1, w - 2, h - 2)
    })
    return new THREE.CanvasTexture(c)
  }

  function createWornWoodTex() {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = '#1a1010'; ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#2a1a1a'; ctx.lineWidth = 1
      for (var y = 0; y < h; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
      ctx.fillStyle = 'rgba(30,20,20,0.3)'
      for (var i = 0; i < 40; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 8, 1)
      ctx.strokeStyle = 'rgba(10,5,5,0.5)'; ctx.lineWidth = 0.5
      for (var j = 0; j < 15; j++) {
        var sx = Math.random() * w, sy = Math.random() * h
        ctx.beginPath(); ctx.moveTo(sx, sy)
        ctx.lineTo(sx + (Math.random() - 0.5) * 6, sy + (Math.random() - 0.5) * 6); ctx.stroke()
      }
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 2)
    return tex
  }

  function createLightWoodTex() {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = '#2a2018'; ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#3a2a20'; ctx.lineWidth = 1
      for (var y = 0; y < h; y += 10) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
      ctx.strokeStyle = 'rgba(50,40,30,0.15)'; ctx.lineWidth = 0.5
      for (var i = 0; i < 25; i++) {
        var gx = Math.random() * w, gy = Math.random() * h
        ctx.beginPath(); ctx.moveTo(gx, gy)
        ctx.quadraticCurveTo(gx + (Math.random() - 0.5) * 12, gy + (Math.random() - 0.5) * 6, gx + (Math.random() - 0.5) * 18, gy + (Math.random() - 0.5) * 12)
        ctx.stroke()
      }
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 2)
    return tex
  }

  function createDustyFloorTex() {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = '#1a1510'; ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(30,25,20,0.4)'
      for (var i = 0; i < 100; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 10, 1 + Math.random() * 3)
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 2)
    return tex
  }

  function createConcreteTileTex() {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, w, h)
      var s = 24; ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 1
      for (var x = 0; x < w; x += s) { for (var y = 0; y < h; y += s) { ctx.strokeRect(x, y, s, s) } }
      ctx.fillStyle = 'rgba(255,255,255,0.02)'
      for (var i = 0; i < 150; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 2)
    return tex
  }

  var roomTextures = {}

  function getRoomTex(roomType) {
    if (roomTextures[roomType]) return roomTextures[roomType]
    var t = {}
    switch (roomType) {
      case 'bedroom':
        t.wall = createWallpaperTex('#1a1518', '#2a1a20', createVerticalStripes)
        t.floor = createFloorPlanks('#2a1e18', '#1a1008'); break
      case 'bathroom':
        t.wall = createWallpaperTex('#12151a', '#1a2030', createDiamondPattern)
        t.floor = createTileFloor('#1a2028', '#0a1018'); break
      case 'hall':
        t.wall = createWallpaperTex('#1a1815', '#2a2218', createVerticalStripes)
        t.floor = createFloorPlanks('#2a2218', '#1a1408'); break
      case 'kitchen':
        t.wall = createWallpaperTex('#1a1812', '#2a2818', createDiamondPattern)
        t.floor = createTileFloor('#2a2420', '#1a1410'); break
      case 'living':
        t.wall = createWallpaperTex('#181218', '#2a1828', createHorizontalBoards)
        t.floor = createFloorPlanks('#2a1e18', '#1a1008'); break
      case 'dining':
        t.wall = createWallpaperTex('#1a1512', '#2a2018', createBrickPattern)
        t.floor = createFloorPlanks('#2a2218', '#1a1408'); break
      case 'pantry':
        t.wall = createWallpaperTex('#121210', '#1a1a10', createHorizontalBoards)
        t.floor = createTileFloor('#1a1a14', '#0e0e08'); break
      case 'study':
        t.wall = createWallpaperTex('#121016', '#1a1024', createHorizontalBoards)
        t.floor = createFloorPlanks('#1a1410', '#0e0808'); break
      case 'garage':
        t.wall = createWallpaperTex('#101012', '#18181a', createBrickPattern)
        t.floor = createConcreteTileTex(); break
      case 'entrance':
        t.wall = createWallpaperTex('#1a1815', '#2a2218', createBrickPattern)
        t.floor = createConcreteTileTex(); break
      case 'attic':
        t.wall = createWornWoodTex(); t.floor = createDustyFloorTex(); break
      case 'loft':
        t.wall = createLightWoodTex(); t.floor = createFloorPlanks('#2a2018', '#1a1408'); break
      default:
        t.wall = createWallpaperTex('#1a1a1a', '#2a2a2a', createVerticalStripes)
        t.floor = createFloorPlanks('#2a1e18', '#1a1008')
    }
    t.ceil = createCeilTex(); t.trim = createTrimTex()
    roomTextures[roomType] = t
    return t
  }

  function makeMat(color, rough, metalness) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: rough || 0.8, metalness: metalness || 0 })
  }

  function addBox(x, y, z, w, h, d, mat, rotY, addToWalls) {
    var geo = new THREE.BoxGeometry(w, h, d)
    var mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, y, z)
    if (rotY) mesh.rotation.y = rotY
    mesh.castShadow = true; mesh.receiveShadow = true
    scene.add(mesh)
    if (addToWalls !== false) wallObjects.push(mesh)
    return mesh
  }

  function getRoomById(id) {
    for (var i = 0; i < ROOMS.length; i++) { if (ROOMS[i].id === id) return ROOMS[i] }
    return null
  }

  function getRoomAtCell(col, row, floor) {
    for (var i = 0; i < ROOMS.length; i++) {
      var r = ROOMS[i]
      var isUpper = r.yOffset > 0
      if (floor !== undefined && ((floor === 0 && isUpper) || (floor > 0 && !isUpper))) continue
      if (col >= r.col && col < r.col + r.w && row >= r.row && row < r.row + r.h) return r
    }
    return null
  }

  function isDoorConnection(r1, r2) {
    for (var i = 0; i < DOOR_CONNECTIONS.length; i++) {
      var dc = DOOR_CONNECTIONS[i]
      if ((dc[0] === r1 && dc[1] === r2) || (dc[0] === r2 && dc[1] === r1)) return true
    }
    return false
  }

  var cellRoom = { 0: [], 1: [] }

  function buildCellRoomGrid() {
    for (var f = 0; f <= 1; f++) {
      cellRoom[f] = []
      for (var row = 0; row < GRID_ROWS; row++) {
        cellRoom[f][row] = []
        for (var col = 0; col < GRID_COLS; col++) {
          var r = getRoomAtCell(col, row, f)
          cellRoom[f][row][col] = r ? r.id : null
        }
      }
    }
  }

  function showPrologue(callback) {
    var overlay = document.getElementById('prologueOverlay')
    var textEl = document.getElementById('prologueText')
    if (!overlay) { if (callback) callback(); return }
    var lines = [
      'A casa range ao seu redor.',
      'Suas maos estao sujas de terra e sangue seco.',
      'Voce nao sabe de quem e o sangue.',
      '',
      'O corredor se estende para os dois lados, mas voce sabe',
      'que nao ha saida. Nao ha janelas. So paredes.',
      'Paredes que respiram.',
      '',
      'Lembre-se: voce nao e o primeiro a entrar aqui.',
      'Mas talvez seja o ultimo a sair.',
      '',
      '[ Use WASD para andar, E para interagir, F para lanterna ]'
    ]
    var lineIdx = 0, charIdx = 0, skipped = false
    textEl.innerHTML = ''
    function skipPrologue() {
      if (skipped) return
      skipped = true
      overlay.classList.add('hidden')
      if (callback) callback()
    }
    function typeLine() {
      if (skipped) return
      if (lineIdx >= lines.length) { setTimeout(function() { if (!skipped) skipPrologue() }, 1500); return }
      var line = lines[lineIdx]
      if (charIdx < line.length) {
        charIdx++
        textEl.innerHTML = line.substring(0, charIdx) + '<span class="cursor">|</span>'
        setTimeout(typeLine, 30 + Math.random() * 20)
      } else {
        textEl.innerHTML = line
        lineIdx++; charIdx = 0
        setTimeout(typeLine, line === '' ? 400 : 1200)
      }
    }
    var keyHandler = function(e) { if (e.key === 'Enter') { skipPrologue(); document.removeEventListener('keydown', keyHandler) } }
    document.addEventListener('keydown', keyHandler)
    overlay.addEventListener('click', skipPrologue)
    typeLine()
  }

  var dayTransitions = {
    2: { num:'DIA 2', text:'O som de passos no andar de cima.\nMas nao ha ninguem la.\nShiva esta mais inquieta hoje.\nEla sente que voce esta tentando sair.\n\nOs outros tambem tentaram.' },
    3: { num:'DIA 3', text:'A casa esta mudando. As portas nao levam\nmais para os mesmos lugares.\nVoce comeca a ouvir sussurros\nvindo de dentro das paredes.\n\nSao eles. Os que vieram antes.' },
    4: { num:'DIA 4', text:'O corredor se esticou durante a noite.\nAs janelas que antes nao existiam\nagora mostram um ceu\nque nunca amanhece.\n\nVoce nao sabe mais o que e real.' },
    5: { num:'DIA 5', text:'Ela nao esta mais dormindo.\nEla esta esperando.\nO cheiro de cachorro molhado\nimpregna cada comodo.\n\nHoje e o fim. De um jeito ou de outro.' }
  }

  function showDayTransition(day, callback) {
    var overlay = document.getElementById('dayTransition')
    var numEl = overlay.querySelector('.dayNum')
    var textEl = overlay.querySelector('.dayText')
    var td = dayTransitions[day]
    if (!td || !overlay) { if (callback) callback(); return }
    numEl.textContent = td.num
    textEl.innerHTML = td.text.replace(/\n/g, '<br>')
    overlay.classList.add('open')
    setTimeout(function () {
      overlay.classList.remove('open')
      if (callback) callback()
    }, 3500)
  }

  var shivaDialogueOpen = false

  function showShivaDialogue() {
    if (shivaDialogueOpen || !shivaState.sleeping) return
    shivaDialogueOpen = true
    var overlay = document.getElementById('shivaDialogue')
    var responseEl = overlay.querySelector('.response')
    var optionsEl = overlay.querySelector('.options')
    var introText = 'Ela dorme. Na penumbra, voce ve o corpo dela. Em pe, encostada na parede, como uma pessoa. Mas nao e. O peito dela sobe e desce devagar. O que voce faz?'
    document.querySelector('#shivaBox .question').textContent = '// SHIVA — ' + gameState.day + '/' + gameState.maxDays
    var choices = [
      { label: '[ ACARICIAR ]', response: 'O pelo e aspero, quente. Sob seus dedos, voce sente o corpo dela tremer. Um som baixo, quase um gemido, sai da garganta dela. Os dedos dela (sao dedos?) se contraem. Ela esta sonhando.', next: false },
      { label: '[ FALAR COM ELA ]', response: 'O silencio e absoluto. A casa inteira parece prender a respiracao. Entao, sem abrir os olhos, a boca dela se move. Nao sai som. Mas voce ouve alguma coisa dentro da sua cabeca: "ainda nao."', next: false },
      { label: '[ SUSSURRAR "CERBERUS" ]', response: 'O corpo dela enrijece. Os olhos se abrem instantaneamente — dois vasos de fogo vermelho na escuridao. Ela olha atraves de voce. A casa range. As paredes suam. Entao ela sorri. E volta a dormir.', next: false }
    ]
    if (gameState.day < 5 && !puzzleState.diaryRead) {
      choices.pop()
    }
    var choiceIdx = 0
    function render() {
      if (choiceIdx < choices.length) {
        responseEl.textContent = choices[choiceIdx].response
        var btn = document.createElement('div')
        btn.className = 'opt'
        btn.textContent = '[ CONTINUAR ]'
        btn.onclick = function() {
          choiceIdx++
          optionsEl.innerHTML = ''
          render()
        }
        optionsEl.appendChild(btn)
      } else {
        overlay.classList.remove('open')
        shivaDialogueOpen = false
      }
    }
    responseEl.textContent = introText
    optionsEl.innerHTML = ''
    for (var ci = 0; ci < choices.length; ci++) {
      ;(function(idx) {
        var btn = document.createElement('div')
        btn.className = 'opt'
        btn.textContent = choices[idx].label
        btn.onclick = function() {
          choiceIdx = idx + 1
          optionsEl.innerHTML = ''
          render()
        }
        optionsEl.appendChild(btn)
      })(ci)
    }
    overlay.classList.add('open')
  }

  function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x010102)
    scene.fog = new THREE.FogExp2(0x010102, 0.035)

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30)
    camera.position.copy(player.pos)
    camera.position.y = player.height

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    document.body.prepend(renderer.domElement)

    raycaster = new THREE.Raycaster()
    raycaster.far = 3

    buildCellRoomGrid()
    buildLighting()
    buildFlashlight()
    buildRooms()
    buildFurniture()
    buildNotes()
    buildPuzzles()
    buildShiva()
    buildStairTeleports()
    buildGoldenDoor()

    hudEls.day = document.getElementById('hudDay')
    hudEls.daySub = document.getElementById('hudDaySub')
    hudEls.memories = document.getElementById('hudMemories')
    hudEls.memSlots = document.querySelectorAll('.mem-slot')
    hudEls.hungerFill = document.getElementById('hudHungerFill')
    hudEls.hungerPct = document.getElementById('hudHungerPct')
    hudEls.itemSlots = document.querySelectorAll('.item-slot')
    hudEls.interact = document.getElementById('interactPrompt')
    hudEls.flashlightInd = document.getElementById('flashlightIndicator')

    setupControls()
    setupPointerLock()
    updateHUD()
    placeFlashlightItem()
    rebuildWallBoxes()

    var loadBar = document.getElementById('loadBar')
    var loadStart = Date.now()
    var loadDuration = 1200
    ;(function tickLoad() {
      var elapsed = Date.now() - loadStart
      var pct = Math.min(1, elapsed / loadDuration)
      pct = 1 - Math.pow(1 - pct, 3)
      if (loadBar) loadBar.style.width = Math.floor(pct * 100) + '%'
      if (pct < 1) { requestAnimationFrame(tickLoad) }
      else {
        var ls = document.getElementById('loadingScreen')
        if (ls) ls.classList.add('hidden')
        showPrologue(function() { startAmbient(); playDrip(); animate() })
      }
    })()
  }

  function buildLighting() {
    var amb = new THREE.AmbientLight(0x191928, 0.3)
    scene.add(amb)
    dirLight = new THREE.DirectionalLight(0xffaa44, 0.0)
    dirLight.position.set(0, 10, 0)
    scene.add(dirLight)
    var moon = new THREE.DirectionalLight(0x4444aa, 0.15)
    moon.position.set(-5, 8, 3)
    scene.add(moon)
    for (var i = 0; i < ROOMS.length; i++) {
      var r = ROOMS[i]
      if (r.yOffset) continue
      var cx = (r.col + r.w / 2) * CELL_SIZE, cz = (r.row + r.h / 2) * CELL_SIZE
      var pl = new THREE.PointLight(0x442211, 0.06, 5)
      pl.position.set(cx, WALL_HEIGHT - 0.4, cz)
      pl.userData = { baseIntensity: 0.06 + Math.random() * 0.02, phase: Math.random() * 100 }
      scene.add(pl)
      flickerLights.push(pl)
    }
    // Upper floor dim lights
    for (var ui = 0; ui < ROOMS.length; ui++) {
      var ru = ROOMS[ui]
      if (!ru.yOffset) continue
      var ucx = (ru.col + ru.w / 2) * CELL_SIZE, ucz2 = (ru.row + ru.h / 2) * CELL_SIZE
      var upl = new THREE.PointLight(0x331122, 0.04, 4)
      upl.position.set(ucx, 4.0, ucz2)
      scene.add(upl)
    }
  }

  function buildFlashlight() {
    flashlight = new THREE.SpotLight(0xffeedd, 2.5)
    flashlight.angle = 0.32; flashlight.penumbra = 0.6; flashlight.decay = 1.2
    flashlight.distance = 14; flashlight.castShadow = true
    flashlight.shadow.mapSize.width = 512; flashlight.shadow.mapSize.height = 512
    flashlight.shadow.camera.near = 0.1; flashlight.shadow.camera.far = 14
    flashlight.intensity = 0
    scene.add(flashlight)
    var target = new THREE.Object3D()
    target.position.set(0, 0, -5); scene.add(target)
    flashlight.target = target
    var bulbGeo = new THREE.SphereGeometry(0.04, 8, 8)
    flashlightBulb = new THREE.Mesh(bulbGeo, new THREE.MeshBasicMaterial({ color: 0x111111 }))
    flashlightBulb.position.set(0, 0, 0); scene.add(flashlightBulb)
  }

  function toggleFlashlight() {
    if (!flashlightFound) return
    flashlightOn = !flashlightOn
    flashlight.intensity = flashlightOn ? 2.5 : 0
    if (flashlightBulb) flashlightBulb.material.color.setHex(flashlightOn ? 0xffeedd : 0x111111)
    playFlashlightSnd()
    updateHUD()
  }

  function pickupFlashlight() {
    if (flashlightFound) return
    flashlightFound = true; flashlightPickupAnim = 0.001; flashlightOn = true
    flashlight.intensity = 0
    if (flashlightBulb) flashlightBulb.material.color.setHex(0x111111)
    playPuzzleSolve()
    updateHUD()
  }

  function updateFlashlight(dt) {
    var camPos = camera.position
    var fwd = new THREE.Vector3(0, 0, -1)
    fwd.applyQuaternion(camera.quaternion)
    var flashOffset = new THREE.Vector3(0.2, -0.15, -0.3)
    flashOffset.applyQuaternion(camera.quaternion)
    flashlight.position.copy(camPos).add(flashOffset)
    flashlightBulb.position.copy(flashlight.position)
    flashlight.target.position.copy(camPos.clone().add(fwd.clone().multiplyScalar(5)))
    if (flashlightPickupAnim > 0 && flashlightPickupAnim < 1) {
      flashlightPickupAnim += dt * 1.5
      if (flashlightPickupAnim >= 1) {
        flashlightPickupAnim = 1; flashlight.intensity = 2.5
        if (flashlightBulb) flashlightBulb.material.color.setHex(0xffeedd)
      } else {
        var flicker = Math.sin(flashlightPickupAnim * 40) * 0.5 + 0.5
        flashlight.intensity = 2.5 * flicker * easeOut(flashlightPickupAnim)
        if (flashlightBulb) {
          var bright = Math.floor(0xee * easeOut(flashlightPickupAnim))
          flashlightBulb.material.color.setHex((bright << 16) | (bright << 8) | bright)
        }
      }
    }
    if (shivaAlertActive && flashlightOn && flashlight.intensity > 0) {
      var vib = Math.sin(Date.now() * 0.02) * 0.15 + 0.75
      var targetI = shiva.state === 'chase' ? 0.3 : 0.6
      flashlight.intensity = flashlight.intensity * (1 - dt * 2) + targetI * vib * dt * 2
    }
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3) }

  function buildRooms() {
    var trimTex = createTrimTex()
    var trimMat = new THREE.MeshStandardMaterial({ map: trimTex, roughness: 0.9 })

    function edgeKey(c1, r1, c2, r2) {
      if (c1 > c2 || (c1 === c2 && r1 > r2)) return c2 + '-' + r2 + '_' + c1 + '-' + r1
      return c1 + '-' + r1 + '_' + c2 + '-' + r2
    }

    function buildSolidWall(wx, wz, ww, wd, yOff, wh) {
      wh = wh || WALL_HEIGHT; yOff = yOff || 0
      var mat = new THREE.MeshStandardMaterial({ color: 0x1a1818, roughness: 0.85 })
      addBox(wx, yOff + wh / 2, wz, ww, wh, wd, mat, 0)
      addBox(wx, yOff + 0.05, wz, ww + 0.04, 0.1, wd + 0.04, trimMat, 0)
      addBox(wx, yOff + wh - 0.03, wz, ww + 0.04, 0.06, wd + 0.04, trimMat, 0)
    }

    function buildDoorWall(wx, wz, ww, wd, yOff, wh) {
      wh = wh || WALL_HEIGHT; yOff = yOff || 0
      var doorW = 1.2, doorH = 2.2
      var mat = new THREE.MeshStandardMaterial({ color: 0x1a1818, roughness: 0.85 })
      var frameMat = new THREE.MeshStandardMaterial({ color: 0x2a1e18, roughness: 0.7 })
      if (ww > wd) {
        var sideW = (ww - doorW) / 2
        if (sideW > 0) {
          addBox(wx - doorW / 2 - sideW / 2, yOff + wh / 2, wz, sideW, wh, wd, mat, 0)
          addBox(wx + doorW / 2 + sideW / 2, yOff + wh / 2, wz, sideW, wh, wd, mat, 0)
          addBox(wx - doorW / 2 - sideW / 2, yOff + 0.05, wz, sideW, 0.1, wd + 0.04, trimMat, 0)
          addBox(wx + doorW / 2 + sideW / 2, yOff + 0.05, wz, sideW, 0.1, wd + 0.04, trimMat, 0)
          addBox(wx - doorW / 2 - sideW / 2, yOff + wh - 0.03, wz, sideW, 0.06, wd + 0.04, trimMat, 0)
          addBox(wx + doorW / 2 + sideW / 2, yOff + wh - 0.03, wz, sideW, 0.06, wd + 0.04, trimMat, 0)
        }
        addBox(wx, yOff + wh - (wh - doorH) / 2, wz, doorW, wh - doorH, wd, mat, 0)
        addBox(wx - doorW / 2 - 0.02, yOff + doorH / 2, wz, 0.06, doorH, wd + 0.1, frameMat, 0)
        addBox(wx + doorW / 2 + 0.02, yOff + doorH / 2, wz, 0.06, doorH, wd + 0.1, frameMat, 0)
        addBox(wx, yOff + doorH + 0.04, wz, doorW + 0.04, 0.06, wd + 0.1, frameMat, 0)
      } else {
        var sideD = (wd - doorW) / 2
        if (sideD > 0) {
          addBox(wx, yOff + wh / 2, wz - doorW / 2 - sideD / 2, ww, wh, sideD, mat, 0)
          addBox(wx, yOff + wh / 2, wz + doorW / 2 + sideD / 2, ww, wh, sideD, mat, 0)
          addBox(wx, yOff + 0.05, wz - doorW / 2 - sideD / 2, ww + 0.04, 0.1, sideD, trimMat, 0)
          addBox(wx, yOff + 0.05, wz + doorW / 2 + sideD / 2, ww + 0.04, 0.1, sideD, trimMat, 0)
          addBox(wx, yOff + wh - 0.03, wz - doorW / 2 - sideD / 2, ww + 0.04, 0.06, sideD, trimMat, 0)
          addBox(wx, yOff + wh - 0.03, wz + doorW / 2 + sideD / 2, ww + 0.04, 0.06, sideD, trimMat, 0)
        }
        addBox(wx, yOff + wh - (wh - doorH) / 2, wz, ww, wh - doorH, doorW, mat, 0)
        addBox(wx, yOff + doorH / 2, wz - doorW / 2 - 0.02, ww + 0.1, doorH, 0.06, frameMat, 0)
        addBox(wx, yOff + doorH / 2, wz + doorW / 2 + 0.02, ww + 0.1, doorH, 0.06, frameMat, 0)
        addBox(wx, yOff + doorH + 0.04, wz, ww + 0.1, 0.06, doorW + 0.04, frameMat, 0)
      }
    }

    function processFloor(floor, yOffset, wallHeight) {
      var edgeBuilt = {}
      var builtDoors = {}
      function processEdge(col, row, ncol, nrow) {
        var r = cellRoom[floor][row][col]
        if (!r) return
        var key = edgeKey(col, row, ncol, nrow)
        if (edgeBuilt[key]) return
        edgeBuilt[key] = true
        var nr = null
        if (ncol >= 0 && ncol < GRID_COLS && nrow >= 0 && nrow < GRID_ROWS) nr = cellRoom[floor][nrow][ncol]
        if (nr === r) return
        var isDoor2 = nr && isDoorConnection(r, nr)
        if (isDoor2) {
          var dk = [r, nr].sort().join('-')
          if (builtDoors[dk]) isDoor2 = false
          else builtDoors[dk] = true
        }
        var wx, wz, ww, wd
        if (ncol !== col) {
          wx = Math.max(col, ncol) * CELL_SIZE; wz = (Math.min(row, nrow) + 0.5) * CELL_SIZE
          ww = 0.12; wd = CELL_SIZE
        } else {
          wx = (Math.min(col, ncol) + 0.5) * CELL_SIZE; wz = Math.max(row, nrow) * CELL_SIZE
          ww = CELL_SIZE; wd = 0.12
        }
        if (isDoor2) buildDoorWall(wx, wz, ww, wd, yOffset, wallHeight)
        else buildSolidWall(wx, wz, ww, wd, yOffset, wallHeight)
      }

      for (var row = 0; row < GRID_ROWS; row++) {
        for (var col = 0; col < GRID_COLS; col++) {
          if (!cellRoom[floor][row][col]) continue
          processEdge(col, row, col, row - 1)
          processEdge(col, row, col, row + 1)
          processEdge(col, row, col - 1, row)
          processEdge(col, row, col + 1, row)
        }
      }
    }

    // Ground floor: floors + ceilings
    for (var ri = 0; ri < ROOMS.length; ri++) {
      var room = ROOMS[ri]
      if (room.yOffset) continue
      var cx = (room.col + room.w / 2) * CELL_SIZE, cz = (room.row + room.h / 2) * CELL_SIZE
      var rw = room.w * CELL_SIZE, rh = room.h * CELL_SIZE
      var tex = getRoomTex(room.type)
      var fMat = new THREE.MeshStandardMaterial({ map: tex.floor, roughness: 0.8 })
      var cMat = new THREE.MeshStandardMaterial({ map: tex.ceil, roughness: 0.9 })
      addBox(cx, 0.05, cz, rw - 0.1, 0.1, rh - 0.1, fMat, 0, false)
      addBox(cx, WALL_HEIGHT - 0.02, cz, rw - 0.1, 0.05, rh - 0.1, cMat, 0, false)
    }
    processFloor(0, 0, WALL_HEIGHT)

    // Upper floor: floors + ceilings + walls
    var upperRooms = ROOMS.filter(function (r) { return r.yOffset > 0 })
    for (var ui = 0; ui < upperRooms.length; ui++) {
      var ur = upperRooms[ui]
      var ucx = (ur.col + ur.w / 2) * CELL_SIZE, ucz = (ur.row + ur.h / 2) * CELL_SIZE
      var urw = ur.w * CELL_SIZE, urh = ur.h * CELL_SIZE
      var ute = getRoomTex(ur.type)
      var ufMat = new THREE.MeshStandardMaterial({ map: ute.floor, roughness: 0.8 })
      var ucMat = new THREE.MeshStandardMaterial({ map: ute.ceil, roughness: 0.9 })
      addBox(ucx, 3.0 + 0.05, ucz, urw - 0.1, 0.1, urh - 0.1, ufMat, 0, false)
      addBox(ucx, 3.0 + 2.2 - 0.02, ucz, urw - 0.1, 0.05, urh - 0.1, ucMat, 0, false)
    }
    processFloor(1, 3.0, 2.2)

    // Garage sub-floor
    var garageR = getRoomById('garage')
    if (garageR) {
      var gx = (garageR.col + garageR.w / 2) * CELL_SIZE, gz = (garageR.row + garageR.h / 2) * CELL_SIZE
      var gMat = new THREE.MeshStandardMaterial({ map: getRoomTex('garage').floor, roughness: 0.9 })
      addBox(gx, -0.25, gz, CELL_SIZE * 2 - 0.1, 0.1, CELL_SIZE - 0.1, gMat, 0, false)
    }

    // Entrance step
    var entranceRM = getRoomById('entrance')
    if (entranceRM) {
      var ex = (entranceRM.col + entranceRM.w / 2) * CELL_SIZE
      var ez = (entranceRM.row + entranceRM.h / 2) * CELL_SIZE
      var sMat = makeMat(0x3a2a1a, 0.8)
      addBox(ex - 0.5, 0.075, ez + 0.5, 0.6, 0.15, 0.3, sMat, 0)
    }
  }

  function buildFurniture() {
    function placeBox(cx, cz, w, h, d, mat, yOff) {
      yOff = yOff || 0
      var geo = new THREE.BoxGeometry(w, h, d)
      var mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(cx, yOff + h / 2, cz)
      mesh.castShadow = true; mesh.receiveShadow = true
      scene.add(mesh)
      return mesh
    }
    var dMat = makeMat(0x2a1e14, 0.7)
    var ctMat = makeMat(0x3a2818, 0.5)
    var fMat = makeMat(0x1a1010, 0.9)
    var chairMat = makeMat(0x1a1410, 0.85)
    var clothMat = makeMat(0x1a1214, 0.85)
    var darkWoodMat = makeMat(0x1a0e08, 0.85)

    // LIVING ROOM (center 4, 4, 8x8)
    var livingR = getRoomById('living')
    if (livingR) {
      var lx = 4, lz = 4
      // Sofa (south side, facing north toward TV)
      placeBox(lx, 6.5, 1.6, 0.35, 0.65, fMat) // seat
      placeBox(lx, 7.0, 1.6, 0.5, 0.08, fMat)  // backrest
      placeBox(lx - 0.85, 6.5, 0.12, 0.3, 0.65, fMat) // left armrest
      placeBox(lx + 0.85, 6.5, 0.12, 0.3, 0.65, fMat) // right armrest
      // TV against north wall
      placeBox(lx, 0.5, 0.02, 0.35, 0.55, makeMat(0x0a0a0a, 0.3, 0.5))
      // TV stand
      placeBox(lx, 0.2, 0.55, 0.4, 0.35, darkWoodMat)
      // Coffee table
      placeBox(lx, 3.5, 0.7, 0.25, 0.45, dMat)
      // Rug under coffee table
      placeBox(lx, lz, 1.6, 0.02, 1.4, makeMat(0x2a1a20, 0.9))
      // Bookshelf against west wall
      placeBox(0.5, 3, 0.3, 1.3, 0.7, darkWoodMat)
      // Floor lamp (southwest corner)
      var lampLiv = new THREE.PointLight(0xff8844, 0.15, 3)
      lampLiv.position.set(1.5, 0.9, 7)
      scene.add(lampLiv)
      placeBox(1.5, 7, 0.08, 0.8, 0.08, makeMat(0x1a1818, 0.7), 0)
    }

    // HALL (narrow, center 10, 6, 4x12)
    var hallR = getRoomById('hall')
    if (hallR) {
      // Small table at north end (near kitchen door)
      placeBox(10, 1.2, 0.3, 0.6, 0.3, dMat)
      var lampHall = new THREE.PointLight(0xff8844, 0.12, 2.5)
      lampHall.position.set(10, 0.9, 1.2)
      scene.add(lampHall)
      // Coat rack (mid-hall)
      placeBox(10, 6, 0.1, 0.9, 0.1, makeMat(0x1a1410, 0.8))
      placeBox(10, 6.5, 0.2, 0.04, 0.2, makeMat(0x2a1e14, 0.7))
      // Picture frames on east wall
      placeBox(11.9, 3, 0.02, 0.35, 0.25, makeMat(0x2a1a12, 0.7, 0.2))
      placeBox(11.9, 9, 0.02, 0.35, 0.25, makeMat(0x2a1a12, 0.7, 0.2))
    }

    // KITCHEN (center 16, 4, 8x8)
    var kitchenR = getRoomById('kitchen')
    if (kitchenR) {
      var cMat2 = makeMat(0x2a2a38, 0.6)
      // Counter: north wall (z=0.5)
      placeBox(14.5, 0.8, 0.5, 0.85, 1.0, cMat2)
      placeBox(17.5, 0.8, 0.5, 0.85, 1.0, cMat2)
      placeBox(14.5, 0.8, 0.5, 0.06, 1.0, ctMat) // countertop
      placeBox(17.5, 0.8, 0.5, 0.06, 1.0, ctMat)
      // Counter: east wall (z=7.5)
      placeBox(19.2, 4, 0.5, 0.85, 1.0, cMat2)
      placeBox(19.2, 4, 0.5, 0.06, 1.0, ctMat)
      // Stove (center of north counters)
      placeBox(16, 1.2, 0.45, 0.8, 0.45, makeMat(0x1a1a22, 0.4, 0.5))
      // Refrigerator
      placeBox(14.5, 4.5, 0.4, 1.2, 0.4, makeMat(0x1a1a1a, 0.7))
      // Sink
      placeBox(17.5, 4.5, 0.4, 0.15, 0.4, makeMat(0x2a2a2a, 0.6, 0.4))
      // Kitchen island
      placeBox(16, 3.0, 0.7, 0.75, 0.6, makeMat(0x2a2a38, 0.6))
      placeBox(16, 3.0, 0.7, 0.06, 0.6, ctMat)
    }

    // GROUND FLOOR BEDROOM (center 2, 10, 4x4)
    var bg = getRoomById('bedroom_g')
    if (bg) {
      // Bed against south wall
      placeBox(2, 11.2, 0.9, 0.35, 1.1, makeMat(0x2a1e20, 0.85))
      placeBox(2, 11.2, 0.9, 0.12, 0.9, makeMat(0x1a1218, 0.9)) // mattress
      // Nightstand
      placeBox(2.8, 11.0, 0.25, 0.1, 0.25, makeMat(0x1a1810, 0.7))
      // Wardrobe against west wall
      placeBox(0.5, 10, 0.3, 1.4, 0.65, darkWoodMat)
      // Rug
      placeBox(2, 10, 0.7, 0.02, 0.7, makeMat(0x2a1a20, 0.9))
      // Bedside lamp
      var lampBg = new THREE.PointLight(0xff8844, 0.08, 1.5)
      lampBg.position.set(1.2, 0.6, 11)
      scene.add(lampBg)
    }

    // ENTRANCE (center 6, 10, 4x4)
    var entR = getRoomById('entrance')
    if (entR) {
      // Shoe rack
      placeBox(5.5, 9.2, 0.4, 0.35, 0.3, darkWoodMat)
      // Small table with mirror
      placeBox(6.5, 10.5, 0.3, 0.6, 0.3, dMat)
      placeBox(6.5, 11.0, 0.02, 0.5, 0.3, makeMat(0x3a3a4a, 0.3, 0.5)) // mirror
      // Doormat
      placeBox(6, 11.5, 0.6, 0.04, 0.4, makeMat(0x1a0a0a, 0.9))
    }

    // DINING (center 16, 10, 8x4, wide room)
    var diningR = getRoomById('dining')
    if (diningR) {
      // Dining table in center
      placeBox(16, 10, 1.0, 0.75, 0.65, dMat)
      placeBox(16, 10, 1.0, 0.05, 0.65, makeMat(0x3a2a1a, 0.5)) // tabletop
      // 4 chairs around table
      placeBox(16, 8.8, 0.3, 0.45, 0.3, chairMat)
      placeBox(16, 11.2, 0.3, 0.45, 0.3, chairMat)
      placeBox(14.8, 10, 0.3, 0.45, 0.3, chairMat)
      placeBox(17.2, 10, 0.3, 0.45, 0.3, chairMat)
      // Sideboard against south wall
      placeBox(15, 11.8, 0.85, 0.65, 0.4, makeMat(0x2a1e14, 0.8))
    }

    // GARAGE (center 4, 14, 8x4)
    var garR = getRoomById('garage')
    if (garR) {
      // Workbench against south wall
      placeBox(3, 14.5, 0.2, 0.5, 0.6, makeMat(0x2a2818, 0.9))
      placeBox(3, 14.8, 1.0, 0.08, 0.65, makeMat(0x3a2a18, 0.8))
      // Shelf against west wall
      placeBox(0.5, 14, 0.3, 1.4, 0.8, makeMat(0x1a1410, 0.9))
      // Toolbox
      placeBox(5, 14.5, 0.3, 0.2, 0.25, makeMat(0x2a2a2a, 0.5, 0.5))
      // Cloth pile
      placeBox(5, 13.2, 0.8, 0.15, 0.4, clothMat)
    }

    // BATHROOM (center 10, 14, 4x4)
    var bathR = getRoomById('bathroom')
    if (bathR) {
      // Bathtub along north wall
      placeBox(9.5, 13.2, 0.65, 0.3, 1.0, makeMat(0x1a1a28, 0.4, 0.3))
      placeBox(9.5, 13.2, 0.45, 0.12, 0.7, makeMat(0x0a0a18, 0.3, 0.5)) // water
      // Toilet
      placeBox(10.5, 14.8, 0.35, 0.45, 0.35, makeMat(0x1a1a22, 0.5))
      // Sink
      placeBox(10.5, 13.2, 0.25, 0.4, 0.25, makeMat(0x1a1a1e, 0.6))
      // Mirror above sink
      placeBox(10.5, 12.9, 0.3, 0.4, 0.02, makeMat(0x3a3a4a, 0.3, 0.5))
    }

    // PANTRY (center 16, 14, 8x4)
    var panR = getRoomById('pantry')
    if (panR) {
      // Tall shelves along walls
      placeBox(14.5, 14, 0.3, 1.3, 0.9, makeMat(0x1a1410, 0.9))
      placeBox(17.5, 14, 0.3, 1.3, 0.9, makeMat(0x1a1410, 0.9))
      // Crate on floor
      placeBox(16, 14.3, 0.4, 0.2, 0.3, makeMat(0x2a2a1a, 0.8))
    }

    // UPPER FLOOR FURNITURE (yOffset = 3.0)

    // BEDROOM1 (upper, center 4, 4, 8x8)
    var b1u = getRoomById('bedroom1')
    if (b1u) {
      // Bed
      placeBox(4, 3.0, 0.9, 0.35, 1.1, makeMat(0x2a1e20, 0.85), 3.0)
      placeBox(4, 3.0, 0.9, 0.12, 0.9, makeMat(0x1a1218, 0.9), 3.0)
      // Desk against east wall
      placeBox(3, 5.5, 0.65, 0.75, 0.35, makeMat(0x1a1412, 0.8), 3.0)
      placeBox(3, 5.5, 0.65, 0.05, 0.35, makeMat(0x2a1e14, 0.5), 3.0)
      // Chair at desk
      placeBox(3, 6.2, 0.25, 0.4, 0.25, chairMat, 3.0)
      // Wardrobe against south wall
      placeBox(5.5, 5.5, 0.3, 1.4, 0.65, darkWoodMat, 3.0)
      // Nightstand
      placeBox(2.5, 4.5, 0.25, 0.1, 0.25, makeMat(0x1a1810, 0.7), 3.0)
      var lampB1 = new THREE.PointLight(0xff8844, 0.1, 2)
      lampB1.position.set(2.5, 3.7, 4.5)
      scene.add(lampB1)
    }

    // HALL_UP (upper, center 10, 4, 4x8)
    var hup = getRoomById('hall_up')
    if (hup) {
      placeBox(10, 2.5, 0.3, 0.6, 0.3, dMat, 3.0)
      var lampH = new THREE.PointLight(0xff8844, 0.1, 2)
      lampH.position.set(10, 4.0, 2.5)
      scene.add(lampH)
      placeBox(10, 5.5, 0.02, 0.3, 0.25, makeMat(0x2a1a12, 0.7, 0.2), 3.0)
    }

    // STUDY (upper, center 16, 2, 8x4)
    var stuR = getRoomById('study')
    if (stuR) {
      // Desk
      placeBox(16, 1.5, 0.75, 0.75, 0.4, makeMat(0x1a1412, 0.8), 3.0)
      placeBox(16, 1.5, 0.75, 0.05, 0.4, makeMat(0x2a1e14, 0.5), 3.0)
      // Bookshelf
      var sh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 1.0), makeMat(0x1a1210, 0.9))
      sh.position.set(14.5, 3.6, 2.5)
      sh.castShadow = true; sh.receiveShadow = true; scene.add(sh)
      for (var si2 = 0; si2 < 4; si2++) {
        var sd = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.9), makeMat(0x2a1e14, 0.7))
        sd.position.set(14.5, 3.2 + si2 * 0.3, 2.5)
        sd.castShadow = true; scene.add(sd)
      }
      // Chair
      placeBox(16.5, 1.5, 0.3, 0.45, 0.3, chairMat, 3.0)
      // Desk lamp
      var lampSt = new THREE.PointLight(0xff8844, 0.12, 2)
      lampSt.position.set(16, 3.7, 1.5)
      scene.add(lampSt)
      // Pen holder
      placeBox(15.5, 1.8, 0.01, 0.3, 0.01, makeMat(0x8a6a3a, 0.6, 0.4), 3.0)
    }

    // BEDROOM2 (upper, center 16, 6, 8x4)
    var b2u = getRoomById('bedroom2')
    if (b2u) {
      // Bed against south wall
      placeBox(16, 7.0, 0.9, 0.35, 1.1, makeMat(0x2a2018, 0.85), 3.0)
      placeBox(16, 7.0, 0.9, 0.12, 0.9, makeMat(0x1a1410, 0.9), 3.0)
      // Nightstand
      placeBox(17, 7.5, 0.25, 0.1, 0.25, makeMat(0x1a1810, 0.7), 3.0)
      // Wardrobe against north wall
      placeBox(17.5, 5, 0.3, 1.4, 0.65, darkWoodMat, 3.0)
      // Rug
      placeBox(16, 6, 0.7, 0.02, 0.7, makeMat(0x2a2a3a, 0.8), 3.0)
    }

    // STAIRCASE (hall -> upper floor)
    var stairMat = makeMat(0x2a1e14, 0.8)
    for (var step = 0; step < 8; step++) {
      var t = step / 7
      var sy = 3.0 * t, sh = 0.12 + 3.0 * t * 0.5
      var sx2 = 10 + t * 0.8, sz2 = 9.2 + t * 0.8
      addBox(sx2, sy + sh / 2, sz2, 0.9, sh, 0.5, stairMat, 0)
    }
    // Stair railing
    var railMat = makeMat(0x1a1410, 0.8)
    for (var rp = 0; rp < 5; rp++) {
      var rt = rp / 4
      addBox(10 + rt * 0.8, 0.6 + rt * 2.4, 8.7 + rt * 0.8, 0.04, 0.5 + rt * 2.0, 0.04, railMat, 0)
    }
    addBox(10.4, 1.2, 8.5, 1.0, 0.04, 0.04, makeMat(0x2a1e14, 0.7), 0)

    // Attic window (on upper floor north wall)
    var winMat2 = new THREE.MeshStandardMaterial({ color: 0x224488, emissive: 0x4488cc, emissiveIntensity: 0.3 })
    addBox(10, 4.2, 0.06, 0.06, 1.2, 0.8, winMat2, 0, false)
  }

  function buildNotes() {
    var noteNames = Object.keys(VICTIM_NOTES)
    for (var ni = 0; ni < noteNames.length; ni++) {
      var nd = VICTIM_NOTES[noteNames[ni]]
      if (nd.id === 'sandalia') { buildScratchMarks(nd); continue }
      var geo = new THREE.BoxGeometry(0.1, 0.1, 0.1)
      var mat = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, emissive: 0x5a3a1a, emissiveIntensity: 0.3, roughness: 0.5, metalness: 0.4 })
      var mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(nd.pos.x, 0.2, nd.pos.z)
      mesh.castShadow = true
      mesh.userData = {
        interactable: true, icon: nd.icon, name: nd.title, type: 'note', noteId: nd.id,
        onInteract: function (obj) {
          if (gameState.gameOver || gameState.caught) return
          showNote(obj.userData.noteId)
        }
      }
      scene.add(mesh)
      noteMeshes.push(mesh)
      interactables.push(mesh)
    }
  }

  function buildScratchMarks(noteData) {
    var positions = [{x:3,z:2},{x:5,z:3},{x:3,z:5},{x:5,z:5},{x:4,z:4}]
    var scratchMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x888888, emissiveIntensity: 0.1 })
    for (var si = 0; si < positions.length; si++) {
      var group = new THREE.Object3D()
      var pp = positions[si]
      for (var ci = 0; ci < 3; ci++) {
        var line = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.04 + Math.random() * 0.06), scratchMat)
        line.position.set((Math.random() - 0.5) * 0.1, 0.01, (Math.random() - 0.5) * 0.1)
        line.rotation.y = (Math.random() - 0.5) * 0.8
        group.add(line)
      }
      group.position.set(pp.x, 0, pp.z)
      group.userData = {
        interactable: true, icon: '\uD83D\uDC3E', name: 'MARCAS DE GARRAS', type: 'scratch', scratchIdx: si,
        onInteract: function (obj) {
          if (gameState.gameOver || gameState.caught) return
          onScratchInteract(obj)
        }
      }
      scene.add(group)
      scratchMarks.push(group)
      interactables.push(group)
    }
  }

  function onScratchInteract(obj) {
    var idx = obj.userData.scratchIdx
    if (idx === puzzleState.scratchCount && !puzzleState.scratchSolved) {
      puzzleState.scratchCount++
      playItemPickup()
      if (puzzleState.scratchCount >= 5) {
        puzzleState.scratchSolved = true
        playerItems.push('ervasSecas')
        showNote('sandalia')
        updateHUD()
      } else {
        var directions = ['NORTE', 'LESTE', 'SUL', 'OESTE', 'SUL']
        document.getElementById('puzzleTitle').textContent = '// MARCAS'
        document.getElementById('puzzleDisplay').textContent = directions[idx] || '?'
        document.getElementById('puzzleOverlay').classList.add('open')
        playPuzzleSolve()
        setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 1000)
      }
    }
  }

  function showNote(noteId) {
    var nd = VICTIM_NOTES[noteId]
    if (!nd) return
    if (nd.text) {
      document.getElementById('noteVictim').textContent = nd.victim
      document.getElementById('noteTitle').textContent = nd.title
      document.getElementById('noteText').innerHTML = nd.text.replace(/\n/g, '<br>')
      document.getElementById('noteOverlay').classList.add('open')
    }
    var bit = 1 << nd.memoryId
    if (!(memoryFlags & bit)) {
      memoryFlags |= bit
      gameState.memories++
      playPuzzleSolve()
      var mf = document.getElementById('memoryFlash')
      mf.classList.add('active')
      setTimeout(function () { mf.classList.remove('active') }, 300)
      updateHUD()
    }
  }

  function closeNote() {
    document.getElementById('noteOverlay').classList.remove('open')
  }

  function buildPuzzles() {
    // STUDY (upper floor) - drawers puzzle
    var studyR = getRoomById('study')
    if (studyR) {
      var sx = 16, sz = 2
      var drawerMat = makeMat(0x2a1e18, 0.8)
      for (var di = 0; di < 3; di++) {
        var dm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.25), drawerMat)
        dm.position.set(sx + (di - 1) * 0.3, 3.06, sz + 0.4)
        dm.castShadow = true; scene.add(dm)
        if (di === 1) {
          dm.userData = {
            interactable: true, icon: '\uD83D\uDD11', name: 'GAVETA (meio)', type: 'puzzle', puzzleId: 'drawer',
            onInteract: function () { onDrawerInteract() }
          }
          interactables.push(dm)
        }
      }
    }

    // HERBS - now at logical positions
    // Alecrim (living room, on shelf)
    var alecrimMat = new THREE.MeshStandardMaterial({ color: 0x3a5a2a, emissive: 0x1a3a0a, emissiveIntensity: 0.15 })
    var alecrim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), alecrimMat)
    alecrim.position.set(3.5, 0.5, 3.5)
    alecrim.userData = {
      interactable: true, icon: '\uD83C\uDF3F', name: 'ALECRIM SECO', type: 'herb', herb: 'alecrim',
      onInteract: function (obj) { collectHerb(obj, 'alecrim') }
    }
    scene.add(alecrim); interactables.push(alecrim)

    // Hortela (kitchen, near sink)
    var hortelaMat = new THREE.MeshStandardMaterial({ color: 0x2a5a2a, emissive: 0x1a3a0a, emissiveIntensity: 0.15 })
    var hortela = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), hortelaMat)
    hortela.position.set(17, 0.7, 4.5)
    hortela.userData = {
      interactable: true, icon: '\uD83C\uDF31', name: 'HORTELA FRESCA', type: 'herb', herb: 'hortela',
      onInteract: function (obj) { collectHerb(obj, 'hortela') }
    }
    scene.add(hortela); interactables.push(hortela)

    // Sal Grosso (pantry, on shelf)
    var salMat = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, emissive: 0x4a4a4a, emissiveIntensity: 0.1 })
    var sal = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), salMat)
    sal.position.set(15, 0.7, 14)
    sal.userData = {
      interactable: true, icon: '\uD83E\uDDCA', name: 'SAL GROSSO', type: 'herb', herb: 'salGrosso',
      onInteract: function (obj) { collectHerb(obj, 'salGrosso') }
    }
    scene.add(sal); interactables.push(sal)

    // DRAWINGS (study, upper floor - wall placements)
    var drawData = [
      {pos:{x:15.5,z:2},sym:'\u2600\uFE0F',col:'#ff6600',name:'DESENHO: SOL'},
      {pos:{x:16,z:2},sym:'\uD83C\uDF19',col:'#8888ff',name:'DESENHO: LUA'},
      {pos:{x:16.5,z:2},sym:'\u2B50',col:'#ffff44',name:'DESENHO: ESTRELA'},
      {pos:{x:17,z:2},sym:'\uD83D\uDD25',col:'#ff3300',name:'DESENHO: FOGO'}
    ]
    for (var dwi = 0; dwi < drawData.length; dwi++) {
      var dd = drawData[dwi]
      ;(function(sym, col, name, px, pz) {
        var c2 = document.createElement('canvas')
        c2.width = 64; c2.height = 64
        var ctx2 = c2.getContext('2d')
        ctx2.fillStyle = '#1a1010'; ctx2.fillRect(0, 0, 64, 64)
        ctx2.fillStyle = col; ctx2.font = '40px serif'; ctx2.textAlign = 'center'; ctx2.textBaseline = 'middle'
        ctx2.fillText(sym, 32, 32)
        var dTex = new THREE.CanvasTexture(c2)
        var dm = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: dTex, side: THREE.DoubleSide }))
        dm.position.set(px, 4.5, pz)
        dm.userData = {
          interactable: true, icon: '\uD83C\uDFA8', name: name, type: 'drawing', symbol: sym,
          onInteract: function (obj2) { onDrawingInteract(obj2) }
        }
        scene.add(dm)
        drawingMeshes.push(dm)
        interactables.push(dm)
      })(dd.sym, dd.col, dd.name, dd.pos.x, dd.pos.z)
    }

    // PAINTING (living room, on wall)
    var livingR = getRoomById('living')
    if (livingR) {
      var paintMat = new THREE.MeshStandardMaterial({ color: 0x2a1a1a })
      var paint = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.02), paintMat)
      paint.position.set(4, 1.4, 7.9)
      paint.userData = {
        interactable: true, icon: '\uD83D\uDDBC\uFE0F', name: 'QUADRO NA PAREDE', type: 'painting',
        onInteract: function () {
          if (!puzzleState.diaryRead) {
            document.getElementById('puzzleMsg').textContent = 'O QUADRO ESTA PRESO...'
            document.getElementById('puzzleOverlay').classList.add('open')
            setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 1200)
            return
          }
          showSafePuzzle()
        }
      }
      scene.add(paint); interactables.push(paint)
    }

    // BRICK WALL (hallway, south end near stairs)
    var brickMat2 = new THREE.MeshStandardMaterial({ color: 0x2a2818, roughness: 0.9 })
    brickWallMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.12), brickMat2)
    brickWallMesh.position.set(10, 0.6, 7.94)
    brickWallMesh.castShadow = true
    brickWallMesh.receiveShadow = true
    scene.add(brickWallMesh)
    wallObjects.push(brickWallMesh)

    var brickMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), brickMat2)
    brickMesh.position.set(10.3, 1.0, 8.2)
    brickMesh.userData = {
      interactable: true, icon: '\uD83E\uDDF1', name: 'TIJOLO SOLTO', type: 'brick',
      onInteract: function () {
        if (puzzleState.brickFound) {
          document.getElementById('puzzleMsg').textContent = 'A PASSAGEM JA ESTA ABERTA.'
          document.getElementById('puzzleOverlay').classList.add('open')
          setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 1000)
          return
        }
        puzzleState.brickFound = true
        if (brickWallMesh) {
          scene.remove(brickWallMesh)
          for (var wi = wallObjects.length - 1; wi >= 0; wi--) {
            if (wallObjects[wi] === brickWallMesh) { wallObjects.splice(wi, 1); break }
          }
          brickWallMesh = null
          rebuildWallBoxes()
        }
        puzzleState.brickPassageOpen = true
        playPuzzleSolve()
        document.getElementById('puzzleMsg').textContent = 'UMA PASSAGEM SECRETA SE ABRIU!'
        document.getElementById('puzzleOverlay').classList.add('open')
        setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 1500)
      }
    }
    scene.add(brickMesh); interactables.push(brickMesh)

    var diaryMat2 = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, emissive: 0x1a0a00, emissiveIntensity: 0.2 })
    var diaryMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.08), diaryMat2)
    diaryMesh.position.set(10.5, 0.03, 7.5)
    diaryMesh.userData = {
      interactable: true, icon: '\uD83D\uDCD3', name: 'DIARIO DE ULISSES', type: 'diary',
      onInteract: function () {
        if (puzzleState.diaryRead) return
        puzzleState.diaryRead = true
        document.getElementById('noteVictim').textContent = VICTIM_NOTES.ulisses.victim
        document.getElementById('noteTitle').textContent = '// DIARIO \u2014 SEU ULISSES'
        document.getElementById('noteText').innerHTML = (
          'Ela dorme ao amanhecer.<br>' +
          '2 minutos. Nao mais.<br><br>' +
          'Encontrei isso na garagem, escondido atras da bancada.<br>' +
          'O quarto selado... a passagem no corredor...<br>' +
          'Tudo faz sentido agora.<br><br>' +
          'A porta dourada so abre com a chave certa.<br>' +
          'E a chave... esta com quem entendeu os simbolos.'
        )
        document.getElementById('noteOverlay').classList.add('open')
        playPuzzleSolve()
        playerItems.push('diario')
        updateHUD()
      }
    }
    scene.add(diaryMesh); interactables.push(diaryMesh)
  }

  function collectHerb(obj, herbType) {
    if (puzzleState.herbsCollected >= 3) return
    for (var hi = 0; hi < playerItems.length; hi++) { if (playerItems[hi] === herbType) return }
    playerItems.push(herbType)
    puzzleState.herbsCollected++
    scene.remove(obj)
    for (var ii = interactables.length - 1; ii >= 0; ii--) {
      if (interactables[ii] === obj) { interactables.splice(ii, 1); break }
    }
    playItemPickup()
    updateHUD()
    if (puzzleState.herbsCollected >= 3 && !puzzleState.herbsUsed) {
      document.getElementById('puzzleMsg').textContent = 'TODOS OS INGREDIENTES COLETADOS! USE NA COZINHA.'
      document.getElementById('puzzleOverlay').classList.add('open')
      setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 2000)
    }
  }

  function onDrawingInteract(obj) {
    if (puzzleState.drawingSolved) return
    var sym = obj.userData.symbol
    var order = ['\u2600\uFE0F', '\uD83C\uDF19', '\u2B50', '\uD83D\uDD25']
    var idx = puzzleState.drawingSeq.length
    if (sym === order[idx]) {
      puzzleState.drawingSeq.push(sym)
      playItemPickup()
      if (puzzleState.drawingSeq.length >= 4) {
        puzzleState.drawingSolved = true
        playerItems.push('papelEnzo')
        playPuzzleSolve()
        document.getElementById('puzzleMsg').textContent = 'SEQUENCIA CORRETA! VOCE GANHOU: PAPEL DO ENZO'
        document.getElementById('puzzleOverlay').classList.add('open')
        setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 2000)
        updateHUD()
      }
    } else {
      puzzleState.drawingSeq = []
      playCaughtSnd()
      document.getElementById('puzzleMsg').textContent = 'SEQUENCIA ERRADA! TENTE NOVAMENTE.'
      document.getElementById('puzzleOverlay').classList.add('open')
      setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 1500)
    }
  }

  function onDrawerInteract() {
    if (puzzleState.drawerSolved) return
    if (gameState.memories < 1) {
      document.getElementById('puzzleMsg').textContent = 'A GAVETA ESTA TRANCADA. PRECISA DE UMA PISTA...'
      document.getElementById('puzzleOverlay').classList.add('open')
      setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 2000)
      return
    }
    showLockPuzzle()
  }

  function showLockPuzzle() {
    var attempt = []
    var overlay = document.getElementById('puzzleOverlay')
    var title = document.getElementById('puzzleTitle')
    var display = document.getElementById('puzzleDisplay')
    var keys = document.getElementById('puzzleKeys')
    var msg = document.getElementById('puzzleMsg')
    title.textContent = '// CADEADO \u2014 3 DIGITOS'
    display.textContent = '_ _ _'
    msg.textContent = 'DIGITE O CODIGO (7-3-1)'
    keys.innerHTML = ''
    for (var k = 0; k <= 9; k++) {
      (function(n) {
        var btn = document.createElement('div')
        btn.className = 'pkey'
        btn.textContent = n
        btn.onclick = function() {
          if (attempt.length >= 3) return
          attempt.push(n)
          var txt = ''
          for (var ai = 0; ai < 3; ai++) txt += (attempt[ai] !== undefined ? attempt[ai] : '_') + ' '
          display.textContent = txt.trim()
          if (attempt.length >= 3) {
            if (attempt[0] === 7 && attempt[1] === 3 && attempt[2] === 1) {
              msg.textContent = 'CORRETO! CHAVE DO MIRANTE OBTIDA!'
              puzzleState.drawerSolved = true
              gameState.secondFloorUnlocked = true
              playerItems.push('miranteKey')
              playPuzzleSolve()
              updateHUD()
              setTimeout(function () { overlay.classList.remove('open') }, 1500)
            } else {
              msg.textContent = 'CODIGO ERRADO. TENTE NOVAMENTE.'
              attempt = []
              setTimeout(function () { display.textContent = '_ _ _' }, 500)
              playCaughtSnd()
            }
          }
        }
        keys.appendChild(btn)
      })(k)
    }
    overlay.classList.add('open')
  }

  function showSafePuzzle() {
    var dials = [1, 1, 1, 1]
    var code = [3, 1, 4, 2]
    var overlay = document.getElementById('puzzleOverlay')
    var title = document.getElementById('puzzleTitle')
    var display = document.getElementById('puzzleDisplay')
    var keys = document.getElementById('puzzleKeys')
    var msg = document.getElementById('puzzleMsg')
    title.textContent = '// COFRE \u2014 4 DIALS'
    msg.textContent = 'AJUSTE OS DIALS (1-4)'
    keys.innerHTML = ''
    display.textContent = dials.join(' ')
    for (var di2 = 0; di2 < 4; di2++) {
      (function(idx, dArr) {
        var wrap = document.createElement('div')
        wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px'
        var upBtn = document.createElement('div')
        upBtn.className = 'pkey'; upBtn.textContent = '\u25B2'
        var valBtn = document.createElement('div')
        valBtn.className = 'pkey'; valBtn.textContent = dArr[idx]; valBtn.style.fontSize = '16px'
        var downBtn = document.createElement('div')
        downBtn.className = 'pkey'; downBtn.textContent = '\u25BC'
        function updateVal() { valBtn.textContent = dArr[idx] }
        function checkSafe2() {
          if (puzzleState.safeSolved) return
          for (var ci2 = 0; ci2 < 4; ci2++) { if (dArr[ci2] !== code[ci2]) return }
          puzzleState.safeSolved = true
          playerItems.push('tocaKey')
          msg.textContent = 'COFRE ABERTO! CHAVE DA TOCA OBTIDA!'
          playPuzzleSolve()
          updateHUD()
          setTimeout(function () { overlay.classList.remove('open') }, 1500)
        }
        upBtn.onclick = function() {
          dArr[idx] = dArr[idx] >= 4 ? 1 : dArr[idx] + 1
          display.textContent = dArr.join(' '); updateVal(); checkSafe2()
        }
        downBtn.onclick = function() {
          dArr[idx] = dArr[idx] <= 1 ? 4 : dArr[idx] - 1
          display.textContent = dArr.join(' '); updateVal(); checkSafe2()
        }
        wrap.appendChild(upBtn); wrap.appendChild(valBtn); wrap.appendChild(downBtn)
        keys.appendChild(wrap)
      })(di2, dials)
    }
    overlay.classList.add('open')
  }

  function closePuzzle() {
    document.getElementById('puzzleOverlay').classList.remove('open')
  }

  function buildGoldenDoor() {
    var gdMat = new THREE.MeshStandardMaterial({ color: 0x8a7a3a, emissive: 0x6a5a2a, emissiveIntensity: 0.4, metalness: 0.6, roughness: 0.3 })
    var hupR = getRoomById('hall_up')
    if (hupR) {
      var ax = (hupR.col + hupR.w / 2) * CELL_SIZE
      goldenDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.0, 0.06), gdMat)
      goldenDoorMesh.position.set(ax, 4.0, 0.06)
      goldenDoorMesh.userData = {
        interactable: true, icon: '\uD83D\uDEAA', name: 'PORTA DOURADA', type: 'goldenDoor',
        onInteract: function () {
          if (gameState.memories >= gameState.maxMemories && puzzleState.safeSolved) {
            showEnding('good')
          } else {
            var falta = gameState.maxMemories - gameState.memories
            document.getElementById('puzzleMsg').textContent = 'A PORTA NAO ABRE. FALTAM ' + falta + ' MEMORIAS...'
            document.getElementById('puzzleOverlay').classList.add('open')
            setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 2000)
          }
        }
      }
      scene.add(goldenDoorMesh)
      interactables.push(goldenDoorMesh)
    }
  }

  function buildStairTeleports() {
    stairTeleportUp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), new THREE.MeshBasicMaterial({ color: 0x444422, transparent: true, opacity: 0.3 }))
    stairTeleportUp.position.set(10.3, 0.1, 9.5)
    stairTeleportUp.userData = {
      interactable: true, icon: '\u2B06\uFE0F', name: 'SUBIR ESCADA', type: 'stairsUp',
      onInteract: function () {
        if (!gameState.secondFloorUnlocked) {
          document.getElementById('puzzleMsg').textContent = 'O ANDAR DE CIMA ESTA TRANCADO.'
          document.getElementById('puzzleOverlay').classList.add('open')
          setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 1500)
          return
        }
        isOnSecondFloor = true
        player.pos.set(10.3, 3.0, 9.5); player.velY = 0; player.isGrounded = true
        camera.position.set(10.3, player.height + 3.0, 9.5)
      }
    }
    scene.add(stairTeleportUp); interactables.push(stairTeleportUp)

    stairTeleportDown = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), new THREE.MeshBasicMaterial({ color: 0x224444, transparent: true, opacity: 0.3 }))
    stairTeleportDown.position.set(10.3, 3.1, 9.5)
    stairTeleportDown.userData = {
      interactable: true, icon: '\u2B07\uFE0F', name: 'DESCER ESCADA', type: 'stairsDown',
      onInteract: function () {
        isOnSecondFloor = false
        player.pos.set(10.3, 0, 9.5); player.velY = 0; player.isGrounded = true
        camera.position.set(10.3, player.height, 9.5)
      }
    }
    scene.add(stairTeleportDown); interactables.push(stairTeleportDown)
  }

  function setupControls() {
    keys = { w: false, a: false, s: false, d: false, space: false, shift: false, e: false, esc: false, tab: false }
    document.addEventListener('keydown', function (e) {
      var k = e.key.toLowerCase()
      if (k === 'w' || k === 'a' || k === 's' || k === 'd') { keys[k] = true; e.preventDefault() }
      if (k === ' ') { keys.space = true; e.preventDefault() }
      if (k === 'shift') { keys.shift = true; e.preventDefault() }
      if (k === 'e') { keys.e = true; e.preventDefault() }
      if (k === 'escape') { keys.esc = true }
      if (k === 'tab') { keys.tab = true; e.preventDefault() }
      if (k === 'f') { if (!gameState.gameOver && !gameState.caught) toggleFlashlight(); e.preventDefault() }
    })
    document.addEventListener('keyup', function (e) {
      var k = e.key.toLowerCase()
      if (k === 'w' || k === 'a' || k === 's' || k === 'd') { keys[k] = false; e.preventDefault() }
      if (k === ' ') { keys.space = false; e.preventDefault() }
      if (k === 'shift') { keys.shift = false; e.preventDefault() }
      if (k === 'e') { keys.e = false; e.preventDefault() }
      if (k === 'escape') { keys.esc = false }
      if (k === 'tab') { keys.tab = false; e.preventDefault() }
    })
  }

  function setupPointerLock() {
    document.addEventListener('mousemove', function (e) {
      if (!isPointerLocked) return
      var sens = 0.002
      player.yaw -= e.movementX * sens
      player.pitch -= e.movementY * sens
      player.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, player.pitch))
    })
    document.addEventListener('pointerlockchange', function () {
      isPointerLocked = document.pointerLockElement === renderer.domElement
      var ch = document.getElementById('crosshair')
      if (ch) ch.style.display = isPointerLocked ? 'none' : 'block'
    })
    renderer.domElement.addEventListener('click', function () {
      if (!isPointerLocked) { renderer.domElement.requestPointerLock() }
      else if (!gameState.gameOver && !gameState.caught) { tryInteract() }
    })
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }

  function buildShiva() {
    var group = new THREE.Object3D()
    // Materials: golden retriever fur with sickly, mangy undertones
    shivaBodyMat = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, emissive: 0x3a2a0a, emissiveIntensity: 0.15, roughness: 0.7 })
    var darkFurMat = new THREE.MeshStandardMaterial({ color: 0x4a2a0a, roughness: 0.85 })
    var paleFurMat = new THREE.MeshStandardMaterial({ color: 0xba9a6a, roughness: 0.7 })
    var dirtyMat = new THREE.MeshStandardMaterial({ color: 0x6a4a2a, roughness: 0.9 })
    var eyeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1.0 })
    var pupilMat = new THREE.MeshStandardMaterial({ color: 0x000000 })
    var teethMat = new THREE.MeshStandardMaterial({ color: 0xddd4c0, roughness: 0.3 })
    var tongueMat = new THREE.MeshStandardMaterial({ color: 0x6a1a1a, roughness: 0.6 })
    var noseMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 })

    // Helper for adding body parts
    function addPart(geo, mat, x, y, z, castShadow) {
      var m = new THREE.Mesh(geo, mat)
      m.position.set(x, y, z)
      if (castShadow !== false) m.castShadow = true
      group.add(m)
      return m
    }

    // BIPEDAL ANTHROPOMORPHIC GOLDEN RETRIEVER — HUNCHED, GANGLY, MENACING
    // Overall height ~1.9 units. Werewolf-like posture: torso leans forward,
    // digitigrade legs, arms hanging low, head thrust forward.

    // --- LEGS (digitigrade — like dog hind legs) ---
    // Each leg: thigh (angled forward), shin (angled back), paw
    for (var li = -1; li <= 1; li += 2) {
      // Thigh (thick, angled forward)
      var thigh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.16), shivaBodyMat)
      thigh.position.set(li * 0.18, 0.3, 0.06)
      thigh.rotation.x = -0.3
      group.add(thigh)
      // Knee joint
      var knee = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), dirtyMat)
      knee.position.set(li * 0.18, 0.12, 0.12)
      group.add(knee)
      // Shin (longer, angled back)
      var shin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.4, 0.12), darkFurMat)
      shin.position.set(li * 0.18, -0.08, 0.0)
      shin.rotation.x = 0.25
      group.add(shin)
      // Paw (dog-like, broad)
      var paw = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.22), dirtyMat)
      paw.position.set(li * 0.18, -0.28, 0.04)
      group.add(paw)
    }

    // --- TORSO (hunched, larger upper body) ---
    // Lower torso / belly
    addPart(new THREE.BoxGeometry(0.5, 0.4, 0.4), shivaBodyMat, 0, 0.45, 0.04)
    // Upper torso (broader, hunched forward)
    var upperTorso = addPart(new THREE.BoxGeometry(0.7, 0.5, 0.42), shivaBodyMat, 0, 0.8, -0.02)
    upperTorso.rotation.x = 0.15

    // Chest/belly fur (pale)
    addPart(new THREE.BoxGeometry(0.4, 0.4, 0.2), paleFurMat, 0, 0.7, -0.12)

    // --- SHOULDERS (broad, hunched) ---
    for (var shi = -1; shi <= 1; shi += 2) {
      var shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.13, 6, 6), shivaBodyMat)
      shoulder.position.set(shi * 0.38, 1.0, 0.02)
      group.add(shoulder)
      // Trapezius hump (makes it look hunched/animalistic)
      var hump = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.15), darkFurMat)
      hump.position.set(shi * 0.25, 1.15, -0.04)
      hump.rotation.x = -0.3
      group.add(hump)
    }

    // --- ARMS (long, gangly, slightly bent) ---
    for (var ai = -1; ai <= 1; ai += 2) {
      // Upper arm
      var uArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), shivaBodyMat)
      uArm.position.set(ai * 0.42, 0.65, 0.04)
      uArm.rotation.z = ai * 0.2
      uArm.rotation.x = 0.2
      group.add(uArm)
      // Elbow
      var elbow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 5), dirtyMat)
      elbow.position.set(ai * 0.45, 0.38, 0.08)
      group.add(elbow)
      // Forearm (hanging forward)
      var fArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.08), darkFurMat)
      fArm.position.set(ai * 0.44, 0.12, 0.02)
      fArm.rotation.x = -0.15
      fArm.rotation.z = ai * 0.1
      group.add(fArm)
      // Hand/paw (large, clawed)
      addPart(new THREE.BoxGeometry(0.1, 0.1, 0.1), dirtyMat, ai * 0.44, -0.1, 0.04)
      // Claws (3 per hand)
      for (var ci = -1; ci <= 1; ci++) {
        var claw = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.05, 0.008), teethMat)
        claw.position.set(ai * 0.44 + ci * 0.03, -0.15, 0.04)
        claw.rotation.x = 0.3
        group.add(claw)
      }
    }

    // --- NECK (thick, animalistic) ---
    addPart(new THREE.BoxGeometry(0.22, 0.15, 0.18), darkFurMat, 0, 1.1, -0.06)

    // --- HEAD (large golden retriever head, slightly oversized for horror) ---
    // Skull (broad)
    addPart(new THREE.BoxGeometry(0.35, 0.28, 0.32), shivaBodyMat, 0, 1.38, -0.08)
    // Forehead ridge
    addPart(new THREE.BoxGeometry(0.2, 0.06, 0.1), darkFurMat, 0, 1.5, -0.16)

    // Muzzle (long, golden retriever snout)
    var muzzle = addPart(new THREE.BoxGeometry(0.16, 0.1, 0.2), paleFurMat, 0, 1.28, -0.32)
    muzzle.rotation.x = -0.1

    // Upper jaw bridge
    addPart(new THREE.BoxGeometry(0.1, 0.04, 0.12), shivaBodyMat, 0, 1.34, -0.32)

    // Nose (black, at tip of snout)
    addPart(new THREE.BoxGeometry(0.05, 0.03, 0.03), noseMat, 0, 1.3, -0.44)

    // Open mouth / jaw
    var lowerJaw = addPart(new THREE.BoxGeometry(0.12, 0.04, 0.12), darkFurMat, 0, 1.18, -0.34)
    lowerJaw.rotation.x = 0.3

    // Teeth (upper — more prominent, bared)
    for (var ti = -2; ti <= 2; ti++) {
      var tSize = 0.02 + Math.abs(ti) * 0.005
      var tooth = new THREE.Mesh(new THREE.BoxGeometry(tSize, 0.03, 0.01), teethMat)
      tooth.position.set(ti * 0.03, 1.22, -0.38 + Math.abs(ti) * 0.005)
      tooth.rotation.x = -0.2
      group.add(tooth)
    }
    // Teeth (lower — smaller)
    for (var tj = -1; tj <= 1; tj++) {
      var tooth2 = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.02, 0.01), teethMat)
      tooth2.position.set(tj * 0.03, 1.16, -0.38)
      tooth2.rotation.x = 0.3
      group.add(tooth2)
    }
    // Canine fangs
    for (var fk = -1; fk <= 1; fk += 2) {
      var fang = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.045, 0.01), teethMat)
      fang.position.set(fk * 0.05, 1.2, -0.4)
      fang.rotation.x = -0.15
      group.add(fang)
    }

    // Tongue (hanging out of mouth, long)
    var tongue = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.01), tongueMat)
    tongue.position.set(0, 1.12, -0.4)
    tongue.rotation.x = 0.4
    group.add(tongue)

    // Eyes (glowing red — large, unsettling)
    for (var ei = -1; ei <= 1; ei += 2) {
      // Eye socket (dark hollow)
      addPart(new THREE.BoxGeometry(0.07, 0.06, 0.02), new THREE.MeshStandardMaterial({ color: 0x0a0000 }), ei * 0.1, 1.44, -0.2)
      // Glowing eyeball
      var eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), eyeMat)
      eye.position.set(ei * 0.1, 1.44, -0.19)
      group.add(eye)
      // Pupil (dilated, black)
      var pupil = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), pupilMat)
      pupil.position.set(ei * 0.1, 1.44, -0.205)
      group.add(pupil)
      // Red glow aura (larger transparent sphere)
      var glow = new THREE.Mesh(new THREE.SphereGeometry(0.075, 6, 6), new THREE.MeshStandardMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.3, transparent: true, opacity: 0.2
      }))
      glow.position.set(ei * 0.1, 1.44, -0.18)
      group.add(glow)
    }

    // Eyebrows (angry, furrowed)
    for (var ebi = -1; ebi <= 1; ebi += 2) {
      var brow = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.02), darkFurMat)
      brow.position.set(ebi * 0.09, 1.5, -0.16)
      brow.rotation.z = ebi * 0.3
      group.add(brow)
    }

    // EARS (golden retriever floppy ears — large, tattered-looking)
    for (var epi = -1; epi <= 1; epi += 2) {
      // Upper ear (attached to head)
      var earTop = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.06), shivaBodyMat)
      earTop.position.set(epi * 0.2, 1.4, -0.04)
      earTop.rotation.z = epi * 0.2
      group.add(earTop)
      // Floppy portion (hangs down)
      var earFlop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.04), darkFurMat)
      earFlop.position.set(epi * 0.22, 1.26, -0.04)
      earFlop.rotation.z = epi * 0.4
      earFlop.rotation.x = 0.2
      group.add(earFlop)
    }

    // --- TAIL (tucked between legs, scraggly) ---
    var tail = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.2, 0.03), shivaBodyMat)
    tail.position.set(0, 0.15, 0.25)
    tail.rotation.x = 0.5
    group.add(tail)

    // Overall scale
    group.scale.set(1.0, 1.0, 1.0)
    group.position.set(10, 0, 8)
    scene.add(group)
    shiva = group
    shivaState.sleepPos = new THREE.Vector3(10, 0, 8)
  }

  function placeFlashlightItem() {
    var flMat = new THREE.MeshStandardMaterial({ color: 0x8a7a3a, emissive: 0x6a5a2a, emissiveIntensity: 0.3, metalness: 0.5, roughness: 0.4 })
    var flMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.15), flMat)
    flMesh.position.set(8, 0.04, 10)
    flMesh.rotation.z = 0.3
    flMesh.userData = {
      interactable: true, icon: '\uD83D\uDCA1', name: 'LANTERNA',
      onInteract: function () { pickupFlashlight(); scene.remove(flMesh) }
    }
    scene.add(flMesh)
    interactables.push(flMesh)
  }

  function updatePlayer(dt) {
    if (gameState.gameOver || gameState.caught || gameState.transitioning) return
    var spd = keys.shift ? player.speed * 1.5 : player.speed
    var forward = new THREE.Vector3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw))
    var right = new THREE.Vector3(-forward.z, 0, forward.x)
    var move = new THREE.Vector3(0, 0, 0)
    if (keys.w) move.add(forward)
    if (keys.s) move.sub(forward)
    if (keys.a) move.sub(right)
    if (keys.d) move.add(right)
    var isMoving = keys.w || keys.s || keys.a || keys.d
    if (isMoving) {
      move.normalize().multiplyScalar(spd * dt)
      var nx = player.pos.x + move.x
      if (!checkCollision(nx, player.pos.z)) player.pos.x = nx
      var nz = player.pos.z + move.z
      if (!checkCollision(player.pos.x, nz)) player.pos.z = nz
    }
    if (isMoving && player.isGrounded) {
      footstepTimer += dt
      var stepInterval = keys.shift ? 0.25 : 0.45
      if (footstepTimer >= stepInterval) { footstepTimer = 0; playFootstep() }
    } else { footstepTimer = 0 }
    player.velY += GRAVITY * dt
    player.pos.y += player.velY * dt
    var floorY = isOnSecondFloor ? 3.0 : 0
    if (player.pos.y <= floorY) {
      player.pos.y = floorY; player.velY = 0; player.isGrounded = true
    } else { player.isGrounded = false }
    if (keys.space && player.isGrounded) { player.velY = JUMP_SPEED; player.isGrounded = false }
    camera.position.set(player.pos.x, player.pos.y + player.height, player.pos.z)
    var euler = new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ')
    camera.quaternion.setFromEuler(euler)
  }

  function checkCollision(nx, nz, halfSize) {
    halfSize = halfSize !== undefined ? halfSize : 0.2
    var testBox = new THREE.Box3(
      new THREE.Vector3(nx - halfSize, -1, nz - halfSize),
      new THREE.Vector3(nx + halfSize, 5, nz + halfSize)
    )
    for (var ci = 0; ci < wallBoxes.length; ci++) {
      if (wallBoxes[ci].intersectsBox(testBox)) return true
    }
    return false
  }

  function tryInteract() {
    if (shiva && shivaState.sleeping && !shivaDialogueOpen && !gameState.gameOver && !gameState.caught) {
      var dx = shiva.position.x - player.pos.x, dz = shiva.position.z - player.pos.z
      if (dx * dx + dz * dz < 9) { showShivaDialogue(); return }
    }
    var ray = new THREE.Raycaster()
    ray.setFromCamera(new THREE.Vector2(0, 0), camera)
    var hits = ray.intersectObjects(interactables)
    if (hits.length > 0) {
      var hit = hits[0].object
      if (hit.userData && hit.userData.interactable && hit.userData.onInteract) {
        hit.userData.onInteract(hit)
      }
    }
  }

  function updateHUD() {
    var dayEl = document.getElementById('hudDay')
    if (dayEl) dayEl.textContent = 'DIA ' + gameState.day
    var daysLeft = 5 - gameState.day
    if (hudEls.daySub) hudEls.daySub.textContent = '// ' + (daysLeft > 0 ? daysLeft + ' DIAS RESTAM' : 'ULTIMO DIA')
    var hudMem = document.getElementById('hudMemories')
    if (hudMem) hudMem.textContent = gameState.memories + '/' + gameState.maxMemories
    var fill = document.getElementById('hudHungerFill')
    var pct = document.getElementById('hudHungerPct')
    if (fill) fill.style.width = gameState.hunger + '%'
    if (pct) pct.textContent = Math.floor(gameState.hunger) + '%'
    var fi = document.getElementById('flashlightIndicator')
    if (fi) fi.classList.toggle('on', flashlightOn && flashlightFound)
    var memSlots = document.querySelectorAll('.mem-slot')
    for (var mi = 0; mi < memSlots.length; mi++) {
      memSlots[mi].className = 'mem-slot' + (mi < gameState.memories ? ' filled' : '')
    }
    var slots = document.querySelectorAll('.item-slot')
    for (var si = 0; si < slots.length; si++) {
      var slot = slots[si]
      if (si < playerItems.length) {
        var icons = { 'ervasSecas': '\uD83C\uDF3F\u200D\u2620\uFE0F', 'alecrim': '\uD83C\uDF3F', 'hortela': '\uD83C\uDF31', 'salGrosso': '\uD83E\uDDCA', 'miranteKey': '\uD83D\uDD11', 'tocaKey': '\uD83D\uDDDD\uFE0F', 'diario': '\uD83D\uDCD3', 'papelEnzo': '\uD83D\uDCC4', 'pocao': '\uD83E\uDDEA' }
        slot.innerHTML = (icons[playerItems[si]] || '\u2753')
        slot.className = 'item-slot filled'
      } else {
        slot.innerHTML = ''; slot.className = 'item-slot'
      }
    }
  }

  function updateShiva(dt) {
    if (!shiva) return
    if (gameState.gameOver || gameState.caught || gameState.transitioning) return
    var initialSleep = gameState.day < 5 && gameState.timeOfDay < 60
    if (initialSleep) {
      shivaState.sleeping = true
    } else if (shivaState.sleepDuration > 0) {
      shivaState.sleeping = true
      shivaState.sleepDuration = Math.max(0, shivaState.sleepDuration - dt)
    } else {
      shivaState.sleeping = false
    }
    shivaState.anger = Math.min(1, shivaState.anger + dt * 0.0005 * gameState.day)
    var tgt = player.pos.clone()
    if (shivaState.sleeping) {
      shiva.position.copy(shivaState.sleepPos)
      shiva.rotation.y = 0
      return
    }
    var dx = tgt.x - shiva.position.x, dz = tgt.z - shiva.position.z
    var dist = Math.sqrt(dx * dx + dz * dz)
    var speed = 1.2 + gameState.day * 0.2
    if (dist < 2.5) {
      gameState.caught = true; shivaState.anger = 0.3
      showCaughtScreen()
      return
    }
    var noise = Math.sin(Date.now() * 0.001 + shiva.position.x) * 0.3
    var wanderChance = 0.98
    var moveX, moveZ
    if (dist > 8 && Math.random() > wanderChance) {
      shivaState.wanderDir = (shivaState.wanderDir || 0) + (Math.random() - 0.5) * 0.5
      moveX = Math.sin(shivaState.wanderDir) * speed * dt * 0.5
      moveZ = Math.cos(shivaState.wanderDir) * speed * dt * 0.5
    } else {
      var angle = Math.atan2(dx, dz)
      moveX = Math.sin(angle + noise) * speed * dt
      moveZ = Math.cos(angle + noise) * speed * dt
    }
    var sx = shiva.position.x + moveX, sz = shiva.position.z + moveZ
    if (!checkCollision(sx, sz, 0.25)) { shiva.position.x = sx; shiva.position.z = sz }
    shiva.position.y = isOnSecondFloor ? 3.0 : 0
    shiva.rotation.y = Math.atan2(dx, dz)
    // Subtle body sway while moving
    var sway = Math.sin(Date.now() * 0.005 + shiva.position.x) * 0.04
    shiva.position.x += Math.cos(shiva.rotation.y) * sway * dt * 2
    shiva.position.z += Math.sin(shiva.rotation.y) * sway * dt * 2
    // Bob up and down slightly
    shiva.position.y = (isOnSecondFloor ? 3.0 : 0) + Math.abs(Math.sin(Date.now() * 0.004)) * 0.02
    shivaState.lastKnownPos = tgt.clone()
    var alert = document.getElementById('shivaAlert')
    if (alert) { alert.classList.toggle('active', dist < 5 && !shivaState.sleeping) }
    var dmg = document.getElementById('damageOverlay')
    if (dmg) dmg.style.opacity = dist < 5 ? Math.max(0.2, 1 - dist / 5) : 0
    growlTimer = Math.max(0, growlTimer - dt)
    if (dist < 5 && !shivaState.sleeping) playGrowl(dist)
    var shivaWorldPos = shiva.position.clone()
    shivaBodyMat.emissive.setHSL(0, 1, Math.min(0.3, 0.1 + Math.sin(Date.now() * 0.003) * 0.05 + (dist < 5 ? 0.15 : 0)))
  }

  function showCaughtScreen() {
    gameState.captures++
    if (gameState.captures >= 5) { showEnding('bad'); return }
    var ds = document.getElementById('deathScreen')
    if (ds) ds.style.display = 'flex'
    var lostItems = []
    for (var li = playerItems.length - 1; li >= 0; li--) {
      var item = playerItems[li]
      if (item !== 'miranteKey' && item !== 'tocaKey' && item !== 'diario') {
        lostItems.push(item); playerItems.splice(li, 1)
      }
    }
    gameState.hunger = Math.max(50, gameState.hunger)
    updateHUD()
    resetPlayerPosition()
    setTimeout(function () {
      if (ds) ds.style.display = 'none'
      gameState.caught = false
    }, 2000)
  }

  function drawEndingCanvas(type) {
    var canvas = document.getElementById('endingCanvas')
    if (!canvas) return
    var ctx = canvas.getContext('2d')
    var w = canvas.width = 320, h = canvas.height = 180
    var t = 0
    function frame() {
      t += 0.02
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h)
      if (type === 'good') {
        var r = Math.min(w, h) * t * 0.3
        var grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, r)
        grad.addColorStop(0, 'rgba(255,220,100,' + Math.min(1, t) + ')')
        grad.addColorStop(0.5, 'rgba(200,160,50,' + Math.min(0.6, t*0.6) + ')')
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)
        if (t > 0.5) {
          ctx.fillStyle = 'rgba(255,200,80,' + Math.min(0.3, (t-0.5)*0.6) + ')'
          for (var i = 0; i < 20; i++) {
            var rx = Math.random() * w, ry = Math.random() * h
            ctx.fillRect(rx, ry, 2 + Math.random() * 4, 1)
          }
        }
      } else if (type === 'bad') {
        ctx.fillStyle = 'rgba(100,0,0,' + Math.min(0.3, t*0.3) + ')'
        ctx.fillRect(0, 0, w, h)
        if (t > 0.2) {
          var pairs = Math.min(Math.floor((t-0.2) / 0.3) + 1, 5)
          for (var ei = 0; ei < pairs; ei++) {
            var ex = w/2 + Math.sin(ei * 2.1) * 40, ey = h/2 + Math.cos(ei * 1.7) * 20
            ctx.fillStyle = 'rgba(255,0,0,' + (0.5 + Math.sin(t * 3 + ei) * 0.3) + ')'
            ctx.beginPath(); ctx.arc(ex - 6, ey, 4, 0, Math.PI * 2); ctx.fill()
            ctx.beginPath(); ctx.arc(ex + 6, ey, 4, 0, Math.PI * 2); ctx.fill()
          }
        }
      } else {
        ctx.fillStyle = 'rgba(60,40,60,' + Math.min(0.15, t*0.1) + ')'
        ctx.fillRect(0, 0, w, h)
        if (t > 0.3) {
          ctx.fillStyle = 'rgba(80,60,50,' + Math.min(0.4, (t-0.3)*0.5) + ')'
          ctx.font = '14px serif'; ctx.textAlign = 'center'
          ctx.fillText('VOCE', w/2, h/2)
        }
      }
      if (t < 5) requestAnimationFrame(frame)
    }
    frame()
  }

  function showEnding(type) {
    gameState.gameOver = true
    drawEndingCanvas(type)
    var es = document.getElementById('endingScreen')
    if (es) { es.className = type; es.style.display = 'flex' }
    var title = document.getElementById('endingTitle')
    var text = document.getElementById('endingText')
    if (type === 'good') {
      if (title) title.textContent = 'O SOL VOLTOU'
      if (text) text.textContent = 'A porta dourada se abre com um gemido de metal enferrujado. A luz que entra nao e do sol \u2014 e uma luz que vem de dentro de voce. As memorias que voce resgatou formam um caminho. Seis almas, seis verdades. Voce nao escapou da casa. Voce a curou. E ao sair, pela primeira vez, a casa de cachorro esta em silencio. Um silencio que nao e de morte. E de paz.'
    } else if (type === 'bad') {
      if (title) title.textContent = 'O SOL SE APAGOU'
      if (text) text.textContent = 'A casa te consumiu. Sua carne, suas memorias, seu nome. Tudo vira parte das paredes. Voce e agora mais um nome no diario de Ulisses, mais um desenho rabiscado por Enzo, mais uma mancha no chao que Elaine nunca conseguiu limpar. Shiva passeia pelos corredores. Ela rosna para o nada. Porque voce agora e o nada.'
    } else {
      if (title) title.textContent = 'O SOL NUNCA NASCEU'
      if (text) text.textContent = 'Os dias passaram como agua entre os dedos. Voce nao escapou, mas tambem nao foi devorado. Voce simplesmente... ficou. Uma sombra a mais entre tantas. As vezes voce ve outros chegarem. Tenta gritar, avisar. Mas sua voz nao existe mais. A casa de cachorro tem mais um morador. Bem-vindo ao esquecimento.'
    }
    setTimeout(function () {
      if (confirm('Reiniciar?')) location.reload()
    }, 5000)
  }

  function resetPlayerPosition() {
    player.pos.set(6, 0, 10); player.velY = 0; player.isGrounded = true
    isOnSecondFloor = false
    camera.position.set(6, player.height, 10)
  }

  function updateDayNight(dt) {
    if (gameState.gameOver) return
    if (gameState.transitioning) return
    gameState.timeOfDay += dt
    if (gameState.timeOfDay >= gameState.dayLength) {
      gameState.timeOfDay = 0; gameState.day++
      if (gameState.day > 5) { showEnding('neutral'); return }
      gameState.transitioning = true
      gameState.transitionDay = gameState.day
      showDayTransition(gameState.day, function () {
        gameState.transitioning = false
        updateHUD()
      })
      return
    }
    gameState.hunger = Math.max(0, gameState.hunger - dt * 0.2)
    if (gameState.hunger <= 0) player.speed = 1.5
    var t = gameState.timeOfDay / gameState.dayLength
    var amb = 0.05 + t * 0.25
    if (amb > 0.3) amb = 0.3
    if (scene.fog) scene.fog.color.setHSL(0.05, 0.3, amb)
    var sunH = Math.sin(t * Math.PI) * 0.5
    if (dirLight) {
      dirLight.position.set(0, sunH * 20, 0)
      dirLight.intensity = 0.3 + t * 0.5
    }
    if (shiva && shivaBodyMat && !shivaState.sleeping) {
      shivaBodyMat.color.setHSL(0, 0, 0.2 + t * 0.3)
    }
  }

  function updateInteractionPrompt() {
    var prompt = document.getElementById('interactPrompt')
    if (!prompt) return
    if (gameState.gameOver || gameState.caught || gameState.transitioning) { prompt.style.display = 'none'; return }
    var ray = new THREE.Raycaster()
    ray.setFromCamera(new THREE.Vector2(0, 0), camera)
    var hits = ray.intersectObjects(interactables)
    if (hits.length > 0) {
      var obj = hits[0].object
      if (obj.userData && obj.userData.interactable) {
        prompt.style.display = 'block'
        prompt.innerHTML = (obj.userData.icon || '') + ' ' + (obj.userData.name || '')
        return
      }
    }
    prompt.style.display = 'none'
  }

  function isOnStove() {
    return player.pos.x > 14 && player.pos.x < 18 && player.pos.z > 0 && player.pos.z < 4
  }

  function useHerbsOnStove() {
    if (puzzleState.herbsUsed) return
    var hasAlecrim = false, hasHortela = false, hasSal = false
    for (var hi = 0; hi < playerItems.length; hi++) {
      if (playerItems[hi] === 'alecrim') hasAlecrim = true
      if (playerItems[hi] === 'hortela') hasHortela = true
      if (playerItems[hi] === 'salGrosso') hasSal = true
    }
    if (hasAlecrim && hasHortela && hasSal) {
      puzzleState.herbsUsed = true
      playerItems = playerItems.filter(function (it) {
        return it !== 'alecrim' && it !== 'hortela' && it !== 'salGrosso'
      })
      playerItems.push('pocao')
      document.getElementById('puzzleMsg').textContent = 'A POCAO FOI PREPARADA! SHIVA DORMIRA POR MAIS TEMPO.'
      document.getElementById('puzzleOverlay').classList.add('open')
      setTimeout(function () { document.getElementById('puzzleOverlay').classList.remove('open') }, 2000)
      playPuzzleSolve()
      shivaState.sleepDuration = (shivaState.sleepDuration || 0) + 60
      updateHUD()
    }
  }

  function animate() {
    requestAnimationFrame(animate)
    var now = Date.now()
    if (lastTime === 0) { lastTime = now; return }
    var dt = Math.min((now - lastTime) / 1000, 0.05)
    lastTime = now
    updateDayNight(dt)
    updateFlashlight(dt)
    updatePlayer(dt)
    updateShiva(dt)
    updateHUD()
    if (!gameState.gameOver && keys.e) { keys.e = false; tryInteract() }
    if (!gameState.gameOver && keys.tab) {
      keys.tab = false
      if (puzzleState.herbsCollected >= 3 && !puzzleState.herbsUsed && isOnStove()) { useHerbsOnStove() }
    }
    for (var fi = 0; fi < flickerLights.length; fi++) {
      var fl2 = flickerLights[fi]
      var t2 = now * 0.001 + fl2.userData.phase
      var flicker = Math.sin(t2 * 2.7) * Math.sin(t2 * 3.1) * Math.sin(t2 * 5.3)
      flicker = Math.pow(Math.abs(flicker), 1.5) * (flicker > 0 ? 1 : -0.3)
      fl2.intensity = fl2.userData.baseIntensity * (0.7 + 0.3 * Math.max(-0.2, flicker))
    }
    renderer.render(scene, camera)
    updateInteractionPrompt()
  }

  document.getElementById('noteClose').onclick = function () { document.getElementById('noteOverlay').classList.remove('open') }
  document.getElementById('puzzleClose').onclick = function () { document.getElementById('puzzleOverlay').classList.remove('open') }
  document.getElementById('retryBtn').onclick = function () {
    gameState.caught = false
    document.getElementById('deathScreen').style.display = 'none'
    resetPlayerPosition()
  }
  document.getElementById('endingBtn').onclick = function () { location.reload() }

  window.onload = init
})();
