;(function () {
  var scene, camera, renderer, raycaster, clock
  var isPointerLocked = false, lastTime = 0, dirLight = null, memoryFlags = 0, keys = {}
  clock = new THREE.Clock()

  var audioCtx = null
  var footstepTimer = 0
  var wasMoving = false
  var wasGrounded = true

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    return audioCtx
  }

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

  function playFootstep() {
    playNoise(0.06, 0.05, 500 + Math.random() * 300)
    playNoise(0.03, 0.03, 200)
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
    playNoise(0.5, 0.2, 200)
    playTone(200, 80, 0.4, 0.1, 'sawtooth')
  }

  var GRAVITY = -9.8, JUMP_SPEED = 5.0
  var GRID_COLS = 5, GRID_ROWS = 4, CELL_SIZE = 4, WALL_HEIGHT = 2.8
  var DAY_DURATION = 300, DAWN_SLEEP = 120

  var player = { height: 1.6, speed: 3, pos: new THREE.Vector3(8, 0, 14), velY: 0, isGrounded: true, yaw: 0, pitch: 0 }
  var euler = { x: 0, y: 0 }
  var vel = new THREE.Vector3()
  var moveDir = { fwd: 0, right: 0 }
  var isLocked = false, isRunning = false, isCrouching = false, isJumping = false
  var flashlightOn = false, flashlightFound = false, flashlightPickupAnim = 0

  var gameState = {
    day: 1, maxDays: 5, dayTimer: 0, timeOfDay: 0, dayLength: DAY_DURATION,
    hunger: 100, memories: 0, maxMemories: 6,
    captures: 0, maxCaptures: 5, caught: false, gameOver: false, won: false,
    secondFloorUnlocked: false
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
    { id:'bedroom1',  col:0, row:0, w:1, h:1, type:'bedroom' },
    { id:'bathroom1', col:1, row:0, w:1, h:1, type:'bathroom' },
    { id:'hall',      col:2, row:0, w:3, h:2, type:'hall' },
    { id:'bedroom2',  col:0, row:1, w:1, h:1, type:'bedroom' },
    { id:'study',     col:1, row:1, w:1, h:1, type:'study' },
    { id:'living',    col:0, row:2, w:2, h:1, type:'living' },
    { id:'dining',    col:2, row:2, w:1, h:1, type:'dining' },
    { id:'kitchen',   col:3, row:2, w:2, h:1, type:'kitchen' },
    { id:'garage',    col:0, row:3, w:1, h:1, type:'garage' },
    { id:'entrance',  col:1, row:3, w:2, h:1, type:'entrance' },
    { id:'pantry',    col:3, row:3, w:1, h:1, type:'pantry' },
    { id:'bathroom2', col:4, row:3, w:1, h:1, type:'bathroom' },
    { id:'attic',     col:2, row:0, w:2, h:2, type:'attic', yOffset:3.0 },
    { id:'loft',      col:4, row:0, w:1, h:2, type:'loft', yOffset:3.0 }
  ]

  var DOOR_CONNECTIONS = [
    ['bedroom1','hall'], ['bedroom2','study'], ['bedroom2','living'],
    ['bathroom1','hall'], ['study','hall'], ['study','living'],
    ['hall','kitchen'], ['hall','dining'], ['living','dining'],
    ['living','entrance'], ['dining','kitchen'], ['dining','pantry'],
    ['garage','entrance'], ['entrance','pantry'], ['pantry','bathroom2']
  ]

  var ROOM_NAMES = {
    bedroom1: 'QUARTO 1', bedroom2: 'QUARTO 2', bathroom1: 'BANHEIRO', bathroom2: 'BANHEIRO 2',
    hall: 'CORREDOR', kitchen: 'COZINHA', living: 'SALA', dining: 'SALA DE JANTAR',
    pantry: 'DESPENSA', study: 'ESCRIT\u00D3RIO', garage: 'GARAGEM', entrance: 'ENTRADA',
    attic: 'SOT\u00C3O', loft: 'SOBRADO'
  }

  var VICTIM_NOTES = {
    joao: {
      id:'joao', victim:'Jo\u00E3o Marcelo', room:'bedroom1',
      title:'// CARTA \u2014 JO\u00C3O MARCELO', icon:'\u2709\uFE0F',
      text:'Peu, se voc\u00EA ler isso... ela n\u00E3o \u00E9 um cachorro normal.\nEu juro que vi ela mudar de forma na minha frente.\nOlhos vermelhos, dentes que n\u00E3o cabiam na boca.\nEla sabe quando a gente mente.\n\nN\u00E3o tente fugir \u2014 encontre a porta dourada.\nEla est\u00E1 no andar de cima, atr\u00E1s do arm\u00E1rio.\n\n\u2014 Jo\u00E3o',
      memoryId:0, pos:{x:2, z:2}
    },
    sandalia: {
      id:'sandalia', victim:'Sand\u00E1lia', room:'hall',
      title:'// MARCAS \u2014 SAND\u00C1LIA', icon:'\uD83D\uDC3E',
      text:null, memoryId:1, pos:{x:10, z:4}
    },
    ulisses: {
      id:'ulisses', victim:'Seu Ulisses', room:'garage',
      title:'// BILHETE \u2014 SEU ULISSES', icon:'\uD83D\uDCDD',
      text:'VOC\u00CA TAMB\u00C9M?\nAchou que ia ser s\u00F3 um passeio?\n\nA casa muda. Preste aten\u00E7\u00E3o nos dias.\nDia 1 ela fica no corredor.\nDia 2 ela j\u00E1 vai pra cozinha.\n\nE no dia 5? Ela n\u00E3o dorme.\n\nE outra coisa: N\u00C3O CONFIE NO QUE VOC\u00CA V\u00CA.\nAs paredes mentem.\n\n\u2014 Seu Ulisses (sim, O VIZINHO CHATO)',
      memoryId:2, pos:{x:2, z:14}
    },
    enzo: {
      id:'enzo', victim:'Enzo', room:'study',
      title:'// DESENHOS \u2014 ENZO', icon:'\uD83C\uDFA8',
      text:'[Desenho infantil: uma figura canina gigante com 3 cabe\u00E7as, olhos vermelhos, cercada de fogo. No canto: uma porta dourada.]\n\nA tia do fogo disse pra n\u00E3o abrir a porta grande.\nEla mora l\u00E1 dentro.\n\n\u2600\uFE0F\uD83C\uDF19\u2B50\uD83D\uDD25\n\n[Letra de crian\u00E7a] O sol vem antes da lua,\na estrela brilha depois do fogo,\no fogo queima antes do sol dormir.',
      memoryId:3, pos:{x:6, z:6}
    },
    elaine: {
      id:'elaine', victim:'Elaine', room:'kitchen',
      title:'// CADERNO \u2014 ELAINE', icon:'\uD83D\uDCD6',
      text:'Receita da V\u00F3 \u2014 Caldo Protetor\n\nIngredientes que afastam o MAL:\n- Alecrim seco (confunde o faro)\n- Hortel\u00E3 fresca (acalma os esp\u00EDritos)\n- Sal grosso (barreira)\n\nModo de preparo:\nMisture tudo e espalhe na entrada.\nEla hesita. D\u00E1 tempo de fugir.\n\nDeixei escondido pela casa.\nDeus tenha piedade de quem vier depois.\n\n\u2014 Elaine',
      memoryId:4, pos:{x:14, z:10}
    },
    giulia: {
      id:'giulia', victim:'Giulia L.', room:'bathroom2',
      title:'// ANOTA\u00C7\u00D5ES \u2014 GIULIA L.', icon:'\uD83D\uDD0D',
      text:'Consegui decifrar parte do padr\u00E3o.\n\n\u25B3 = 1\n\u25CB = 2\n\u25FB = 3\n\u2726 = 4\n\nA sequ\u00EAncia no espelho: \u25FB \u25B3 \u2726 \u25CB\n\nO cofre atr\u00E1s do quadro... tem a chave.\nA chave da toca.\n\nL\u00E1 dentro tem a verdade.\n\nSe voc\u00EA est\u00E1 lendo isso, ainda d\u00E1 tempo.\nN\u00C3O FA\u00C7A O QUE ELA PEDE.\n\n\u2014 Giulia',
      memoryId:5, pos:{x:18, z:14}
    }
  }

  var puzzleState = {
    drawerSolved: false, herbsCollected: 0, herbsUsed: false,
    drawingSeq: [], drawingSolved: false, safeSolved: false,
    brickFound: false, brickPassageOpen: false, diaryRead: false,
    scratchCount: 0, scratchSolved: false
  }

  var wallObjects = []
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
  var proShieldTimer = 0
  var shivaAlertActive = false

  var flashlight = null
  var flashlightBulb = null

  var shiva = null

  var shivaState = {
    mesh: null, pos: new THREE.Vector3(10, 0, 4), targetRoom: null,
    waypoints: [], currentWP: 0, speed: 1.5, state: 'patrol',
    alertDistance: 6, chaseDistance: 2, patrolTimer: 0,
    sleepTimer: 0, isSleeping: true, proximityTimer: 0,
    lastPlayerDist: 999, anger: 0, sleepPos: new THREE.Vector3(12, 0, 14),
    sleeping: false, wanderDir: 0, lastKnownPos: null, sleepDuration: 0
  }

  var cellRoom = []

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

  function getRoomAtCell(col, row) {
    for (var i = 0; i < ROOMS.length; i++) {
      var r = ROOMS[i]
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

  function buildCellRoomGrid() {
    for (var row = 0; row < GRID_ROWS; row++) {
      cellRoom[row] = []
      for (var col = 0; col < GRID_COLS; col++) {
        var r = getRoomAtCell(col, row)
        cellRoom[row][col] = r ? r.id : null
      }
    }
  }

  function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020204)
    scene.fog = new THREE.Fog(0x020204, 14, 22)

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

    setTimeout(function () {
      var ls = document.getElementById('loadingScreen')
      if (ls) ls.classList.add('hidden')
    }, 600)

    animate()
  }

  function buildLighting() {
    var amb = new THREE.AmbientLight(0x222244, 0.5)
    scene.add(amb)
    dirLight = new THREE.DirectionalLight(0xffaa44, 0.0)
    dirLight.position.set(0, 10, 0)
    scene.add(dirLight)
    var moon = new THREE.DirectionalLight(0x4444aa, 0.4)
    moon.position.set(-5, 8, 3)
    moon.castShadow = true
    moon.shadow.mapSize.width = 512; moon.shadow.mapSize.height = 512
    var d2 = 8
    moon.shadow.camera.left = -d2; moon.shadow.camera.right = d2
    moon.shadow.camera.top = d2; moon.shadow.camera.bottom = -d2
    moon.shadow.camera.near = 1; moon.shadow.camera.far = 20
    scene.add(moon)
    for (var i = 0; i < ROOMS.length; i++) {
      var r = ROOMS[i]
      if (r.yOffset) continue
      var cx = (r.col + r.w / 2) * CELL_SIZE, cz = (r.row + r.h / 2) * CELL_SIZE
      var pl = new THREE.PointLight(0xff8844, 0.08, 5)
      pl.position.set(cx, WALL_HEIGHT - 0.4, cz)
      scene.add(pl)
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
    var edgeBuilt = {}

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
      var doorW = 0.9, doorH = 2.2
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

    function processEdge(col, row, ncol, nrow) {
      var r = cellRoom[row][col]
      if (!r) return
      var key = edgeKey(col, row, ncol, nrow)
      if (edgeBuilt[key]) return
      edgeBuilt[key] = true
      var nr = null
      if (ncol >= 0 && ncol < GRID_COLS && nrow >= 0 && nrow < GRID_ROWS) nr = cellRoom[nrow][ncol]
      if (nr === r) return
      var isDoor2 = nr && isDoorConnection(r, nr)
      var wx, wz, ww, wd
      if (ncol !== col) {
        wx = Math.max(col, ncol) * CELL_SIZE; wz = (Math.min(row, nrow) + 0.5) * CELL_SIZE
        ww = 0.12; wd = CELL_SIZE
      } else {
        wx = (Math.min(col, ncol) + 0.5) * CELL_SIZE; wz = Math.max(row, nrow) * CELL_SIZE
        ww = CELL_SIZE; wd = 0.12
      }
      if (isDoor2) buildDoorWall(wx, wz, ww, wd)
      else buildSolidWall(wx, wz, ww, wd)
    }

    for (var ri = 0; ri < ROOMS.length; ri++) {
      var room = ROOMS[ri]
      if (room.yOffset || room.type === 'attic' || room.type === 'loft') continue
      var cx = (room.col + room.w / 2) * CELL_SIZE, cz = (room.row + room.h / 2) * CELL_SIZE
      var rw = room.w * CELL_SIZE, rh = room.h * CELL_SIZE
      var tex = getRoomTex(room.type)
      var fMat = new THREE.MeshStandardMaterial({ map: tex.floor, roughness: 0.8 })
      var cMat = new THREE.MeshStandardMaterial({ map: tex.ceil, roughness: 0.9 })
      addBox(cx, 0.05, cz, rw - 0.1, 0.1, rh - 0.1, fMat, 0)
      addBox(cx, WALL_HEIGHT - 0.02, cz, rw - 0.1, 0.05, rh - 0.1, cMat, 0)
    }

    for (var row = 0; row < GRID_ROWS; row++) {
      for (var col = 0; col < GRID_COLS; col++) {
        if (!cellRoom[row][col]) continue
        processEdge(col, row, col, row - 1)
        processEdge(col, row, col, row + 1)
        processEdge(col, row, col - 1, row)
        processEdge(col, row, col + 1, row)
      }
    }

    var garage = getRoomById('garage')
    if (garage) {
      var gx = (garage.col + 0.5) * CELL_SIZE, gz = (garage.row + 0.5) * CELL_SIZE
      var gMat = new THREE.MeshStandardMaterial({ map: getRoomTex('garage').floor, roughness: 0.9 })
      addBox(gx, -0.25, gz, CELL_SIZE - 0.1, 0.1, CELL_SIZE - 0.1, gMat, 0)
    }

    var entranceR = getRoomById('entrance')
    if (entranceR) {
      var ex = (entranceR.col + entranceR.w / 2) * CELL_SIZE
      var ez = (entranceR.row + entranceR.h / 2) * CELL_SIZE
      var sMat = makeMat(0x3a2a1a, 0.8)
      addBox(ex - 0.5, 0.075, ez + 0.5, 0.6, 0.15, 0.3, sMat, 0)
    }
  }

  function buildFurniture() {
    function placeBox(cx, cz, w, h, d, mat) {
      var geo = new THREE.BoxGeometry(w, h, d)
      var mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(cx, h / 2, cz)
      mesh.castShadow = true; mesh.receiveShadow = true
      scene.add(mesh)
      return mesh
    }
    var wMat = makeMat(0x2a1e18, 0.8), dMat = makeMat(0x2a1e14, 0.7)
    var cMat = makeMat(0x2a1820, 0.85), ctMat = makeMat(0x3a2818, 0.5)
    var fMat = makeMat(0x1a1010, 0.9), pillMat = makeMat(0x1a1818, 0.9)
    var chairMat = makeMat(0x1a1410, 0.85)

    var b1 = getRoomById('bedroom1')
    if (b1) {
      var b1x = (b1.col + 0.5) * CELL_SIZE, b1z = (b1.row + 0.5) * CELL_SIZE
      placeBox(b1x, b1z - 0.3, 0.8, 0.4, 1.0, makeMat(0x2a1e20, 0.85))
      placeBox(b1x, b1z - 0.3, 0.8, 0.15, 0.8, makeMat(0x1a1218, 0.9))
      placeBox(b1x - 0.6, b1z + 0.5, 0.25, 0.1, 0.25, makeMat(0x1a1810, 0.7))
      placeBox(b1x + 0.7, b1z - 0.2, 0.4, 1.2, 0.3, makeMat(0x1a1410, 0.85))
    }

    var b2 = getRoomById('bedroom2')
    if (b2) {
      var b2x = (b2.col + 0.5) * CELL_SIZE, b2z = (b2.row + 0.5) * CELL_SIZE
      placeBox(b2x, b2z - 0.3, 0.8, 0.4, 1.0, makeMat(0x2a2018, 0.85))
      placeBox(b2x, b2z - 0.3, 0.8, 0.15, 0.8, makeMat(0x1a1410, 0.9))
      placeBox(b2x + 0.5, b2z + 0.2, 0.6, 0.75, 0.35, makeMat(0x1a1412, 0.8))
      placeBox(b2x + 0.5, b2z + 0.2, 0.6, 0.05, 0.35, makeMat(0x2a1e14, 0.5))
      placeBox(b2x + 0.5, b2z - 0.3, 0.2, 0.4, 0.2, chairMat)
    }

    var ba1 = getRoomById('bathroom1')
    if (ba1) {
      var ba1x = (ba1.col + 0.5) * CELL_SIZE, ba1z = (ba1.row + 0.5) * CELL_SIZE
      placeBox(ba1x, ba1z + 0.2, 0.6, 0.3, 1.0, makeMat(0x1a1a28, 0.4, 0.3))
      placeBox(ba1x, ba1z + 0.2, 0.4, 0.12, 0.7, makeMat(0x0a0a18, 0.3, 0.5))
      placeBox(ba1x - 0.5, ba1z - 0.5, 0.3, 0.5, 0.3, makeMat(0x1a1a22, 0.5))
      placeBox(ba1x + 0.5, ba1z - 0.5, 0.25, 0.4, 0.25, makeMat(0x1a1a1e, 0.6))
    }

    var ba2 = getRoomById('bathroom2')
    if (ba2) {
      var ba2x = (ba2.col + 0.5) * CELL_SIZE, ba2z = (ba2.row + 0.5) * CELL_SIZE
      placeBox(ba2x - 0.3, ba2z - 0.3, 0.3, 0.5, 0.3, makeMat(0x1a1a22, 0.5))
      placeBox(ba2x + 0.3, ba2z - 0.3, 0.25, 0.4, 0.25, makeMat(0x1a1a1e, 0.6))
    }

    var hall = getRoomById('hall')
    if (hall) {
      var hx = (hall.col + hall.w / 2) * CELL_SIZE, hz = (hall.row + hall.h / 2) * CELL_SIZE
      placeBox(8, 1.5, 0.3, 0.6, 0.3, dMat)
      var lampLight = new THREE.PointLight(0xff8844, 0.15, 2.5)
      lampLight.position.set(8, 0.9, 1.5)
      scene.add(lampLight)
      for (var pi = 0; pi < 3; pi++) {
        var pp = new THREE.Mesh(new THREE.BoxGeometry(0.12, WALL_HEIGHT, 0.12), pillMat)
        pp.position.set(8 + (pi - 1) * 2, WALL_HEIGHT / 2, 3.5)
        pp.castShadow = true; scene.add(pp); wallObjects.push(pp)
      }
    }

    var living = getRoomById('living')
    if (living) {
      var lx = (living.col + living.w / 2) * CELL_SIZE, lz = (living.row + living.h / 2) * CELL_SIZE
      placeBox(lx - 0.8, lz - 0.5, 0.8, 0.6, 0.3, fMat)
      placeBox(lx - 1.12, 0.8, lz - 0.5, 0.12, 1.0, 0.3, fMat)
      placeBox(lx - 0.48, 0.8, lz - 0.5, 0.12, 1.0, 0.3, fMat)
      placeBox(lx - 0.8, 1.3, lz - 0.5, 0.9, 0.06, 0.35, makeMat(0x2a1a10, 0.7))
      var fl = new THREE.PointLight(0xff4400, 0.3, 3)
      fl.position.set(lx - 0.8, 0.3, lz - 0.5)
      scene.add(fl)
      placeBox(lx + 0.3, lz + 1.1, 1.0, 0.5, 0.7, cMat)
      placeBox(lx + 0.3, lz + 1.1, 1.0, 0.3, 0.7, makeMat(0x1a1018, 0.9))
      placeBox(lx - 0.2, lz + 1.1, 0.12, 0.6, 0.7, cMat)
      placeBox(lx + 0.8, lz + 1.1, 0.12, 0.6, 0.7, cMat)
      placeBox(lx + 0.3, lz + 0.8, 0.5, 0.3, 0.35, makeMat(0x3a2a1a, 0.7))
      placeBox(lx - 1.0, lz + 0.8, 0.03, 0.4, 0.5, makeMat(0x0a0a0a, 0.3, 0.3))
    }

    var dining = getRoomById('dining')
    if (dining) {
      var dx = (dining.col + 0.5) * CELL_SIZE, dz = (dining.row + 0.5) * CELL_SIZE
      placeBox(dx, dz, 0.9, 0.75, 0.6, dMat)
      placeBox(dx, dz, 0.9, 0.05, 0.6, makeMat(0x3a2a1a, 0.5))
      placeBox(dx + 0.7, dz + 0.7, 0.3, 0.45, 0.3, chairMat)
      placeBox(dx - 0.7, dz + 0.7, 0.3, 0.45, 0.3, chairMat)
      placeBox(dx + 0.7, dz - 0.7, 0.3, 0.45, 0.3, chairMat)
      placeBox(dx - 0.7, dz - 0.7, 0.3, 0.45, 0.3, chairMat)
    }

    var kitchen = getRoomById('kitchen')
    if (kitchen) {
      var kx = (kitchen.col + kitchen.w / 2) * CELL_SIZE, kz = (kitchen.row + kitchen.h / 2) * CELL_SIZE
      var cMat2 = makeMat(0x2a2a38, 0.6)
      placeBox(kx - 0.8, kz - 0.5, 0.5, 0.9, 1.2, cMat2)
      placeBox(kx - 0.3, kz + 0.8, 1.0, 0.9, 0.5, cMat2)
      placeBox(kx - 0.8, kz - 0.5, 0.5, 0.06, 1.2, ctMat)
      placeBox(kx - 0.3, kz + 0.8, 1.0, 0.06, 0.5, ctMat)
      placeBox(kx + 1.0, kz - 1.0, 0.4, 0.8, 0.4, makeMat(0x1a1a22, 0.4, 0.5))
      placeBox(kx + 1.3, kz + 0.5, 0.4, 1.2, 0.4, makeMat(0x1a1a1a, 0.7))
    }

    var study = getRoomById('study')
    if (study) {
      var sx = (study.col + 0.5) * CELL_SIZE, sz = (study.row + 0.5) * CELL_SIZE
      placeBox(sx + 0.2, sz + 0.3, 0.7, 0.75, 0.4, makeMat(0x1a1412, 0.8))
      var shelfMat = makeMat(0x1a1210, 0.9)
      var sh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 1.0), shelfMat)
      sh.position.set(sx - 0.5, 0.6, sz - 0.5)
      sh.castShadow = true; sh.receiveShadow = true; scene.add(sh)
      for (var si = 0; si < 4; si++) {
        var sd = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.9), makeMat(0x2a1e14, 0.7))
        sd.position.set(sx - 0.5, 0.2 + si * 0.3, sz - 0.5)
        sd.castShadow = true; scene.add(sd)
      }
      var lampL = new THREE.PointLight(0xff8844, 0.12, 2)
      lampL.position.set(sx + 0.5, 0.7, sz + 0.2)
      scene.add(lampL)
      placeBox(sx + 0.5, sz + 0.2, 0.15, 0.3, 0.15, makeMat(0x2a2a1a, 0.6))
    }

    var garageR = getRoomById('garage')
    if (garageR) {
      var gx = (garageR.col + 0.5) * CELL_SIZE, gz = (garageR.row + 0.5) * CELL_SIZE
      placeBox(gx, gz, 1.0, 0.5, 0.6, makeMat(0x2a2818, 0.9))
      placeBox(gx + 0.8, gz - 0.5, 0.3, 0.3, 0.3, makeMat(0x3a2a1a, 0.8))
      placeBox(gx - 0.6, gz + 0.4, 0.3, 0.4, 0.3, makeMat(0x2a1a1a, 0.85))
    }

    var entranceR2 = getRoomById('entrance')
    if (entranceR2) {
      var ex2 = (entranceR2.col + entranceR2.w / 2) * CELL_SIZE
      var ez2 = (entranceR2.row + entranceR2.h / 2) * CELL_SIZE
      var rackMat = makeMat(0x1a1a1a, 0.6, 0.3)
      placeBox(ex2 - 0.6, ez2, 0.06, 1.0, 0.06, rackMat)
      placeBox(ex2 - 0.6, ez2 - 0.5, 0.5, 0.06, 0.5, rackMat)
      placeBox(ex2 + 0.3, ez2, 0.3, 0.6, 0.3, dMat)
    }

    var pantry = getRoomById('pantry')
    if (pantry) {
      var px = (pantry.col + 0.5) * CELL_SIZE, pz = (pantry.row + 0.5) * CELL_SIZE
      placeBox(px - 0.4, pz, 0.3, 1.3, 0.8, makeMat(0x1a1410, 0.9))
      placeBox(px + 0.4, pz, 0.3, 1.3, 0.8, makeMat(0x1a1410, 0.9))
    }

    var attR = getRoomById('attic')
    if (attR) {
      // Staircase
      var stairMat = makeMat(0x2a1e14, 0.8)
      for (var step = 0; step < 8; step++) {
        var t = step / 7
        var sy = 3.0 * t, sh = 0.12 + 3.0 * t * 0.5
        var sx2 = 10 + t * 0.8, sz2 = 2.5 + t * 0.8
        addBox(sx2, sy + sh / 2, sz2, 0.9, sh, 0.5, stairMat, 0)
      }
      var railMat = makeMat(0x1a1410, 0.8)
      for (var rp = 0; rp < 5; rp++) {
        var rt = rp / 4
        addBox(10 + rt * 0.8, 0.6 + rt * 2.4, 2 + rt * 0.8, 0.04, 0.5 + rt * 2.0, 0.04, railMat, 0)
      }
      addBox(10.4, 1.2, 1.9, 1.0, 0.04, 0.04, makeMat(0x2a1e14, 0.7), 0)

      // Second floor rooms: attic + loft
      var floorRooms = ['attic', 'loft']
      var wallH2 = 2.2, yOff2 = 3.0
      for (var fi = 0; fi < floorRooms.length; fi++) {
        var fRoom = null
        for (var ri2 = 0; ri2 < ROOMS.length; ri2++) {
          if (ROOMS[ri2].type === floorRooms[fi]) { fRoom = ROOMS[ri2]; break }
        }
        if (!fRoom) continue
        var fcx = (fRoom.col + fRoom.w / 2) * CELL_SIZE, fcz = (fRoom.row + fRoom.h / 2) * CELL_SIZE
        var frw = fRoom.w * CELL_SIZE, frh = fRoom.h * CELL_SIZE
        var ftex = getRoomTex(fRoom.type)
        var ffMat = new THREE.MeshStandardMaterial({ map: ftex.floor, roughness: 0.8 })
        var fcMat = new THREE.MeshStandardMaterial({ map: ftex.ceil, roughness: 0.9 })
        addBox(fcx, yOff2 + 0.05, fcz, frw - 0.1, 0.1, frh - 0.1, ffMat, 0)
        addBox(fcx, yOff2 + wallH2 - 0.02, fcz, frw - 0.1, 0.05, frh - 0.1, fcMat, 0)
        for (var rr = fRoom.row; rr < fRoom.row + fRoom.h; rr++) {
          for (var cc = fRoom.col; cc < fRoom.col + fRoom.w; cc++) {
            var edges = [[cc,rr,cc,rr-1],[cc,rr,cc,rr+1],[cc,rr,cc-1,rr],[cc,rr,cc+1,rr]]
            for (var ei = 0; ei < edges.length; ei++) {
              var e = edges[ei], nc = e[2], nr = e[3]
              var tRoom = cellRoom[rr] ? cellRoom[rr][cc] : null
              var nbRoom = (nc >= 0 && nc < GRID_COLS && nr >= 0 && nr < GRID_ROWS && cellRoom[nr]) ? cellRoom[nr][nc] : null
              if (nbRoom === tRoom) continue
              var isDr = nbRoom && isDoorConnection(tRoom, nbRoom)
              var wwx, wwz, www, wwd
              if (nc !== cc) { wwx = Math.max(cc, nc) * CELL_SIZE; wwz = (Math.min(rr, nr) + 0.5) * CELL_SIZE; www = 0.12; wwd = CELL_SIZE }
              else { wwx = (Math.min(cc, nc) + 0.5) * CELL_SIZE; wwz = Math.max(rr, nr) * CELL_SIZE; www = CELL_SIZE; wwd = 0.12 }
              var wMat2 = new THREE.MeshStandardMaterial({ color: 0x1a1818, roughness: 0.85 })
              if (isDr) {
                var dw2 = 0.9, dh2 = 2.0
                if (www > wwd) {
                  var sw = (www - dw2) / 2
                  if (sw > 0) {
                    addBox(wwx - dw2 / 2 - sw / 2, yOff2 + wallH2 / 2, wwz, sw, wallH2, wwd, wMat2, 0)
                    addBox(wwx + dw2 / 2 + sw / 2, yOff2 + wallH2 / 2, wwz, sw, wallH2, wwd, wMat2, 0)
                  }
                  addBox(wwx, yOff2 + wallH2 - (wallH2 - dh2) / 2, wwz, dw2, wallH2 - dh2, wwd, wMat2, 0)
                } else {
                  var sd2 = (wwd - dw2) / 2
                  if (sd2 > 0) {
                    addBox(wwx, yOff2 + wallH2 / 2, wwz - dw2 / 2 - sd2 / 2, www, wallH2, sd2, wMat2, 0)
                    addBox(wwx, yOff2 + wallH2 / 2, wwz + dw2 / 2 + sd2 / 2, www, wallH2, sd2, wMat2, 0)
                  }
                  addBox(wwx, yOff2 + wallH2 - (wallH2 - dh2) / 2, wwz, www, wallH2 - dh2, dw2, wMat2, 0)
                }
              } else addBox(wwx, yOff2 + wallH2 / 2, wwz, www, wallH2, wwd, wMat2, 0)
            }
          }
        }
      }
      // Wall between attic and loft
      for (var rw2 = 0; rw2 < 2; rw2++) {
        var wwz2 = (rw2 + 0.5) * CELL_SIZE
        if (cellRoom[rw2] && cellRoom[rw2][4] === 'loft') {
          addBox(4 * CELL_SIZE, yOff2 + wallH2 / 2, wwz2, 0.12, wallH2, CELL_SIZE, new THREE.MeshStandardMaterial({ color: 0x1a1818, roughness: 0.85 }), 0)
        }
      }
    }

    var loftR = getRoomById('loft')
    if (loftR) {
      var lx2 = (loftR.col + 0.5) * CELL_SIZE, lz2 = (loftR.row + 0.5) * CELL_SIZE
      var winMat = new THREE.MeshStandardMaterial({ color: 0x224488, emissive: 0x4488cc, emissiveIntensity: 0.3 })
      addBox(lx2 + 0.5, 4.2, lz2, 0.06, 1.2, 0.8, winMat, 0, false)
    }
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
    var positions = [{x:10,z:1.5},{x:11,z:4},{x:13,z:3},{x:12,z:1},{x:14,z:2}]
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
    var studyR = getRoomById('study')
    if (studyR) {
      var sx = (studyR.col + 0.5) * CELL_SIZE, sz = (studyR.row + 0.5) * CELL_SIZE
      var drawerMat = makeMat(0x2a1e18, 0.8)
      for (var di = 0; di < 3; di++) {
        var dm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.25), drawerMat)
        dm.position.set(sx + (di - 1) * 0.3, 0.06, sz + 0.6)
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

    var alecrimMat = new THREE.MeshStandardMaterial({ color: 0x3a5a2a, emissive: 0x1a3a0a, emissiveIntensity: 0.15 })
    var alecrim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), alecrimMat)
    alecrim.position.set(11, 0.04, 2)
    alecrim.userData = {
      interactable: true, icon: '\uD83C\uDF3F', name: 'ALECRIM SECO', type: 'herb', herb: 'alecrim',
      onInteract: function (obj) { collectHerb(obj, 'alecrim') }
    }
    scene.add(alecrim); interactables.push(alecrim)

    var hortelaMat = new THREE.MeshStandardMaterial({ color: 0x2a5a2a, emissive: 0x1a3a0a, emissiveIntensity: 0.15 })
    var hortela = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), hortelaMat)
    hortela.position.set(15, 0.04, 9)
    hortela.userData = {
      interactable: true, icon: '\uD83C\uDF31', name: 'HORTELA FRESCA', type: 'herb', herb: 'hortela',
      onInteract: function (obj) { collectHerb(obj, 'hortela') }
    }
    scene.add(hortela); interactables.push(hortela)

    var salMat = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, emissive: 0x4a4a4a, emissiveIntensity: 0.1 })
    var sal = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), salMat)
    sal.position.set(13, 0.7, 12.5)
    sal.userData = {
      interactable: true, icon: '\uD83E\uDDCA', name: 'SAL GROSSO', type: 'herb', herb: 'salGrosso',
      onInteract: function (obj) { collectHerb(obj, 'salGrosso') }
    }
    scene.add(sal); interactables.push(sal)

    var drawData = [
      {pos:{x:2,z:4},sym:'\u2600\uFE0F',col:'#ff6600',name:'DESENHO: SOL'},
      {pos:{x:3,z:10},sym:'\uD83C\uDF19',col:'#8888ff',name:'DESENHO: LUA'},
      {pos:{x:5,z:6},sym:'\u2B50',col:'#ffff44',name:'DESENHO: ESTRELA'},
      {pos:{x:9,z:2},sym:'\uD83D\uDD25',col:'#ff3300',name:'DESENHO: FOGO'}
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
        dm.position.set(px, 1.5, pz)
        dm.userData = {
          interactable: true, icon: '\uD83C\uDFA8', name: name, type: 'drawing', symbol: sym,
          onInteract: function (obj2) { onDrawingInteract(obj2) }
        }
        scene.add(dm)
        drawingMeshes.push(dm)
        interactables.push(dm)
      })(dd.sym, dd.col, dd.name, dd.pos.x, dd.pos.z)
    }

    var diningR = getRoomById('dining')
    if (diningR) {
      var dpx = (diningR.col + 0.5) * CELL_SIZE, dpz = (diningR.row + 0.5) * CELL_SIZE
      var paintMat = new THREE.MeshStandardMaterial({ color: 0x2a1a1a })
      var paint = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.02), paintMat)
      paint.position.set(dpx, 1.4, dpz - 1.9)
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

    var brickMat2 = new THREE.MeshStandardMaterial({ color: 0x2a2818, roughness: 0.9 })
    var brickMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), brickMat2)
    brickMesh.position.set(10, 1.0, 0.3)
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
    diaryMesh.position.set(10.5, 0.03, 0.3)
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
    var attic = getRoomById('attic')
    if (attic) {
      var ax = (attic.col + attic.w / 2) * CELL_SIZE, az = (attic.row + attic.h / 2) * CELL_SIZE
      goldenDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.0, 0.06), gdMat)
      goldenDoorMesh.position.set(ax, 4.0, az + 1.5)
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
    stairTeleportUp.position.set(10.3, 0.1, 2.5)
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
        player.pos.set(10.3, 3.0, 2.5); player.velY = 0; player.isGrounded = true
        camera.position.set(10.3, player.height + 3.0, 2.5)
      }
    }
    scene.add(stairTeleportUp); interactables.push(stairTeleportUp)

    stairTeleportDown = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), new THREE.MeshBasicMaterial({ color: 0x224444, transparent: true, opacity: 0.3 }))
    stairTeleportDown.position.set(10.3, 3.1, 2.5)
    stairTeleportDown.userData = {
      interactable: true, icon: '\u2B07\uFE0F', name: 'DESCER ESCADA', type: 'stairsDown',
      onInteract: function () {
        isOnSecondFloor = false
        player.pos.set(10.3, 0, 2.5); player.velY = 0; player.isGrounded = true
        camera.position.set(10.3, player.height, 2.5)
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
    var bodyMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x440000, emissiveIntensity: 0.3, roughness: 0.8 })
    var eyeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1.0 })
    // Body
    var body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.7), bodyMat)
    body.position.y = 0.3
    body.castShadow = true
    group.add(body)
    // Head
    var head = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.25), bodyMat)
    head.position.set(0, 0.45, -0.35)
    head.castShadow = true
    group.add(head)
    // Eyes (two red spheres)
    for (var ei = -1; ei <= 1; ei += 2) {
      var eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat)
      eye.position.set(ei * 0.08, 0.48, -0.42)
      group.add(eye)
    }
    // 2 front legs
    for (var li = -1; li <= 1; li += 2) {
      var leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), bodyMat)
      leg.position.set(li * 0.15, 0.1, -0.25)
      group.add(leg)
    }
    // 2 back legs
    for (var li = -1; li <= 1; li += 2) {
      var leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), bodyMat)
      leg.position.set(li * 0.15, 0.1, 0.25)
      group.add(leg)
    }
    // Tail
    var tail = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.15, 0.03), bodyMat)
    tail.position.set(0, 0.45, 0.35)
    group.add(tail)
    group.position.set(5, 0, 5)
    scene.add(group)
    shiva = group
    shivaState.sleepPos = new THREE.Vector3(12, 0, 14)
  }

  function placeFlashlightItem() {
    flashlightOn = true
    if (hudEls.flashlightInd) hudEls.flashlightInd.classList.add('on')
    if (flashlight) flashlight.intensity = 2.5
  }

  function updatePlayer(dt) {
    if (gameState.gameOver || gameState.caught) return
    var spd = keys.shift ? player.speed * 1.6 : player.speed
    var forward = new THREE.Vector3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw))
    var right = new THREE.Vector3(forward.z, 0, -forward.x)
    var move = new THREE.Vector3(0, 0, 0)
    if (keys.w) move.add(forward)
    if (keys.s) move.sub(forward)
    if (keys.a) move.sub(right)
    if (keys.d) move.add(right)
    if (move.length() > 0) {
      move.normalize().multiplyScalar(spd * dt)
      var nx = player.pos.x + move.x, nz = player.pos.z + move.z
      if (!checkCollision(nx, nz)) { player.pos.x = nx; player.pos.z = nz }
    }
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

  function checkCollision(nx, nz) {
    for (var ci = 0; ci < wallObjects.length; ci++) {
      var bb = new THREE.Box3().setFromObject(wallObjects[ci])
      var halfSize = 0.2
      var testBox = new THREE.Box3(
        new THREE.Vector3(nx - halfSize, -1, nz - halfSize),
        new THREE.Vector3(nx + halfSize, 5, nz + halfSize)
      )
      if (bb.intersectsBox(testBox)) return true
    }
    return false
  }

  function tryInteract() {
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
    var hudMem = document.getElementById('hudMemories')
    if (hudMem) hudMem.textContent = gameState.memories + '/' + gameState.maxMemories
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
    if (gameState.gameOver || gameState.caught) return
    if (gameState.day < 5 && gameState.timeOfDay < 30) { shivaState.sleeping = true; return }
    else { shivaState.sleeping = false }
    shivaState.anger = Math.min(1, shivaState.anger + dt * 0.0005 * gameState.day)
    var tgt = player.pos.clone()
    if (shivaState.sleeping) {
      shiva.position.copy(shivaState.sleepPos)
      shiva.rotation.y = 0
      return
    }
    var dx = tgt.x - shiva.position.x, dz = tgt.z - shiva.position.z
    var dist = Math.sqrt(dx * dx + dz * dz)
    var speed = 1.5 + gameState.day * 0.3
    if (dist < 3) {
      gameState.caught = true; shivaState.anger = 0.3
      showCaughtScreen()
      return
    }
    var noise = Math.sin(Date.now() * 0.001 + shiva.position.x) * 0.3
    var wanderChance = 0.98
    if (dist > 8 && Math.random() > wanderChance) {
      shivaState.wanderDir = (shivaState.wanderDir || 0) + (Math.random() - 0.5) * 0.5
      shiva.position.x += Math.sin(shivaState.wanderDir) * speed * dt * 0.5
      shiva.position.z += Math.cos(shivaState.wanderDir) * speed * dt * 0.5
    } else {
      var angle = Math.atan2(dx, dz)
      shiva.position.x += Math.sin(angle + noise) * speed * dt
      shiva.position.z += Math.cos(angle + noise) * speed * dt
    }
    shiva.position.y = isOnSecondFloor ? 3.0 : 0
    shiva.rotation.y = Math.atan2(dx, dz)
    shivaState.lastKnownPos = tgt.clone()
    var alert = document.getElementById('shivaAlert')
    if (alert) { alert.classList.toggle('active', dist < 6 && !shivaState.sleeping) }
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
    updateHUD()
    resetPlayerPosition()
    setTimeout(function () {
      if (ds) ds.style.display = 'none'
      gameState.caught = false
    }, 2000)
  }

  function showEnding(type) {
    gameState.gameOver = true
    var es = document.getElementById('endingScreen')
    if (es) es.style.display = 'flex'
    var title = document.getElementById('endingTitle')
    var text = document.getElementById('endingText')
    if (type === 'good') {
      es.className = 'endingGood'; if (title) title.textContent = 'O SOL VOLTOU'
      if (text) text.textContent = 'Voce abriu a porta dourada. A luz invade o sotao, e pela primeira vez em decadas, a casa inteira range como se estivesse respirando. O cheiro de mofo evapora. As paredes param de suar. Shiva uiva ao longe, mas nao e mais um grito de fome. E um adeus.'
    } else if (type === 'bad') {
      es.className = 'endingBad'; if (title) title.textContent = 'O SOL SE APAGOU'
      if (text) text.textContent = 'Cinco vezes. Cinco almas. A casa se alimentou de voce. Sua historia vira mais uma mancha na parede, mais um nome no diario de seu Ulisses. A porta dourada enferruja. Shiva jamais dormira de novo.'
    } else {
      es.className = 'endingNeutral'; if (title) title.textContent = 'O SOL NUNCA NASCEU'
      if (text) text.textContent = 'Os dias passaram. As memorias se foram. A casa nao te prende mais — simplesmente te ignorou. Voce e agora parte do mobiliario, um fantasma entre fantasmas. Talvez alguem ache suas anotacoes um dia.'
    }
    setTimeout(function () {
      if (confirm('Reiniciar?')) location.reload()
    }, 5000)
  }

  function resetPlayerPosition() {
    player.pos.set(8, 0, 14); player.velY = 0; player.isGrounded = true
    isOnSecondFloor = false
    camera.position.set(8, player.height, 14)
  }

  function updateDayNight(dt) {
    if (gameState.gameOver) return
    gameState.timeOfDay += dt
    if (gameState.timeOfDay >= gameState.dayLength) {
      gameState.timeOfDay = 0; gameState.day++
      updateHUD()
      if (gameState.day > 5) { showEnding('neutral'); return }
    }
    var t = gameState.timeOfDay / gameState.dayLength
    var amb = 0.05 + t * 0.25
    if (amb > 0.3) amb = 0.3
    if (scene.fog) scene.fog.color.setHSL(0.05, 0.3, amb)
    var sunH = Math.sin(t * Math.PI) * 0.5
    if (dirLight) {
      dirLight.position.set(0, sunH * 20, 0)
      dirLight.intensity = 0.3 + t * 0.5
    }
    if (shiva && !shivaState.sleeping) {
      shiva.material.color.setHSL(0, 0, 0.2 + t * 0.3)
    }
  }

  function updateInteractionPrompt() {
    var prompt = document.getElementById('interactPrompt')
    if (!prompt) return
    if (gameState.gameOver || gameState.caught) { prompt.style.display = 'none'; return }
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
    return player.pos.x > 6 && player.pos.x < 10 && player.pos.z > 4 && player.pos.z < 8
  }

  function useHerbsOnStove() {
    if (puzzleState.herbsUsed) return
    puzzleState.herbsUsed = true
    var hasAlecrim = false, hasHortela = false, hasSal = false
    for (var hi = 0; hi < playerItems.length; hi++) {
      if (playerItems[hi] === 'alecrim') hasAlecrim = true
      if (playerItems[hi] === 'hortela') hasHortela = true
      if (playerItems[hi] === 'salGrosso') hasSal = true
    }
    if (hasAlecrim && hasHortela && hasSal) {
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
