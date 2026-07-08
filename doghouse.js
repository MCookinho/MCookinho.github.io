;(function () {
  var scene, camera, renderer
  var raycaster, mouse
  var clock = new THREE.Clock()

  // ===== SOUND SYSTEM =====
  var audioCtx = null
  var footstepTimer = 0
  var wasMoving = false
  var wasGrounded = true

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    return audioCtx
  }

  function playNoise(duration, volume, freq, type) {
    try {
      var ac = getAudioCtx()
      var now = ac.currentTime
      var bufSize = Math.floor(ac.sampleRate * duration)
      var buf = ac.createBuffer(1, bufSize, ac.sampleRate)
      var data = buf.getChannelData(0)
      for (var i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2)
      }
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
      var ac = getAudioCtx()
      var now = ac.currentTime
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
    playTone(180, 380, 0.15, 0.04)
    playNoise(0.08, 0.03, 400)
  }

  function playLandSnd() {
    playNoise(0.1, 0.08, 300)
    playNoise(0.04, 0.04, 100)
  }

  function playFlashlightSnd() {
    playNoise(0.02, 0.04, 2000)
    playTone(2000, 1500, 0.04, 0.02, 'square')
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

  // ===== PLAYER =====
  var player = {
    height: 1.6,
    speed: 3,
    pos: new THREE.Vector3(6, 0, 14),
    velY: 0,
    isGrounded: true
  }
  var euler = { x: 0, y: 0 }
  var vel = new THREE.Vector3()
  var moveDir = { fwd: 0, right: 0 }
  var isLocked = false
  var isRunning = false
  var isCrouching = false
  var isJumping = false
  var flashlightOn = true

  var GRAVITY = -9.8
  var JUMP_SPEED = 5.0

  // ===== GAME STATE =====
  var gameState = {
    day: 1,
    maxDays: 5,
    items: [],
    memories: 0,
    maxMemories: 5,
    hunger: 100,
    caught: false,
    gameOver: false,
    won: false,
    dayItems: [],
    puzzlesSolved: 0
  }

  var itemIcons = {
    key: '🔑',
    photo: '📷',
    letter: '📜',
    medallion: '🏅',
    bone: '🦴',
    candle: '🕯️',
    musicbox: '🎵',
    mirror: '🪞',
    clock: '⏰',
    flower: '🌸',
    ring: '💍',
    book: '📕',
    coin: '🪙',
    feather: '🪶',
    jar: '🏺'
  }

  // ===== MAP =====
  var MAP = {
    cols: 4,
    rows: 4,
    data: [
      ['bedroom1', 'bathroom1', 'hall',     'kitchen'],
      ['bedroom2', 'living',    'dining',   'pantry'],
      ['study',    'hall2',     'bedroom3', 'bathroom2'],
      ['garage',   'entrance',  'void',     'void']
    ]
  }

  var ROOM_NAMES = {
    bedroom1: 'QUARTO 1', bedroom2: 'QUARTO 2', bedroom3: 'QUARTO 3',
    bathroom1: 'BANHEIRO', bathroom2: 'BANHEIRO 2',
    hall: 'CORREDOR', hall2: 'CORREDOR 2',
    kitchen: 'COZINHA', living: 'SALA', dining: 'SALA DE JANTAR',
    pantry: 'DESPENSA', study: 'ESCRITÓRIO',
    garage: 'GARAGEM', entrance: 'ENTRADA',
    void: null
  }

  var WALL_HEIGHT = 2.8
  var ROOM_SIZE = 4
  var wallObjects = []
  var doorObjects = []
  var interactables = []
  var hudEls = {}

  var flashlight = null
  var flashlightBulb = null

  // ===== TEXTURE GENERATION =====
  function makeCanvas(w, h, drawFn) {
    var c = document.createElement('canvas')
    c.width = w || 128
    c.height = h || 128
    var ctx = c.getContext('2d')
    drawFn(ctx, c.width, c.height)
    return c
  }

  function createWallpaperTex(baseColor, patternColor, patternFn) {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = baseColor
      ctx.fillRect(0, 0, w, h)
      if (patternFn) patternFn(ctx, w, h, patternColor)
      // subtle noise
      for (var i = 0; i < 200; i++) {
        var x = Math.random() * w
        var y = Math.random() * h
        var a = Math.random() * 0.06
        ctx.fillStyle = 'rgba(255,255,255,' + a + ')'
        ctx.fillRect(x, y, 1, 1)
      }
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1.5, 1.5)
    return tex
  }

  function createVerticalStripes(ctx, w, h, color) {
    ctx.fillStyle = color
    for (var x = 0; x < w; x += 16) {
      ctx.fillRect(x, 0, 4, h)
    }
  }

  function createHorizontalBoards(ctx, w, h, color) {
    ctx.fillStyle = color
    for (var y = 0; y < h; y += 12) {
      ctx.fillRect(0, y, w, 2)
      ctx.fillRect(0, y + 8, w, 1)
    }
  }

  function createDiamondPattern(ctx, w, h, color) {
    ctx.fillStyle = color
    var s = 16
    for (var x = 0; x < w + s; x += s) {
      for (var y = 0; y < h + s; y += s) {
        var dx = (x / s) % 2
        var dy = (y / s) % 2
        if (dx !== dy) {
          ctx.fillRect(x, y, s, s)
        }
      }
    }
  }

  function createBrickPattern(ctx, w, h, color) {
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    var bh = 16
    var bw = 32
    for (var row = 0; row < h / bh + 1; row++) {
      var offX = (row % 2) * (bw / 2)
      for (var col = -1; col < w / bw + 2; col++) {
        var bx = col * bw + offX
        var by = row * bh
        ctx.strokeRect(bx, by, bw, bh)
        // inner brick texture
        ctx.fillStyle = 'rgba(255,255,255,0.02)'
        ctx.fillRect(bx + 2, by + 2, bw - 4, bh - 4)
      }
    }
  }

  function createFloorPlanks(color1, color2) {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = color1
      ctx.fillRect(0, 0, w, h)
      // plank lines
      ctx.strokeStyle = color2
      ctx.lineWidth = 1
      for (var y = 0; y < h; y += 12) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
        // random plank end joints
        if (y % 24 < 2) {
          var jx = Math.random() * w * 0.6 + w * 0.2
          ctx.beginPath()
          ctx.moveTo(jx, y)
          ctx.lineTo(jx, y + 12)
          ctx.stroke()
        }
      }
      // wood grain
      ctx.strokeStyle = 'rgba(0,0,0,0.04)'
      ctx.lineWidth = 0.5
      for (var i = 0; i < 30; i++) {
        var gx = Math.random() * w
        var gy = Math.random() * h
        ctx.beginPath()
        ctx.moveTo(gx, gy)
        ctx.quadraticCurveTo(gx + (Math.random() - 0.5) * 10, gy + (Math.random() - 0.5) * 5, gx + (Math.random() - 0.5) * 15, gy + (Math.random() - 0.5) * 10)
        ctx.stroke()
      }
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(2, 2)
    return tex
  }

  function createTileFloor(color1, color2) {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = color1
      ctx.fillRect(0, 0, w, h)
      var s = 16
      ctx.strokeStyle = color2
      ctx.lineWidth = 1
      for (var x = 0; x < w; x += s) {
        for (var y = 0; y < h; y += s) {
          ctx.strokeRect(x, y, s, s)
          if (((x / s) + (y / s)) % 2 === 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.05)'
            ctx.fillRect(x + 1, y + 1, s - 2, s - 2)
          }
        }
      }
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(2, 2)
    return tex
  }

  function createCeilTex() {
    var c = makeCanvas(128, 128, function (ctx, w, h) {
      ctx.fillStyle = '#0a0a12'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(255,255,255,0.02)'
      for (var i = 0; i < 300; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
      }
    })
    var tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(2, 2)
    return tex
  }

  function createTrimTex() {
    var c = makeCanvas(32, 32, function (ctx, w, h) {
      ctx.fillStyle = '#1a1410'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#2a1e18'
      ctx.fillRect(0, 0, w, 3)
      ctx.fillStyle = '#0e0a08'
      ctx.fillRect(0, h - 4, w, 4)
      ctx.strokeStyle = '#3a2820'
      ctx.lineWidth = 0.5
      ctx.strokeRect(1, 1, w - 2, h - 2)
    })
    return new THREE.CanvasTexture(c)
  }

  var roomTextures = {}

  function getRoomTex(roomType) {
    if (roomTextures[roomType]) return roomTextures[roomType]
    var t = {}
    switch (roomType) {
      case 'bedroom1':
      case 'bedroom2':
      case 'bedroom3':
        t.wall = createWallpaperTex('#1a1518', '#2a1a20', createVerticalStripes)
        t.floor = createFloorPlanks('#2a1e18', '#1a1008')
        break
      case 'bathroom1':
      case 'bathroom2':
        t.wall = createWallpaperTex('#12151a', '#1a2030', createDiamondPattern)
        t.floor = createTileFloor('#1a2028', '#0a1018')
        break
      case 'hall':
      case 'hall2':
        t.wall = createWallpaperTex('#1a1815', '#2a2218', createVerticalStripes)
        t.floor = createFloorPlanks('#2a2218', '#1a1408')
        break
      case 'kitchen':
        t.wall = createWallpaperTex('#1a1812', '#2a2818', createDiamondPattern)
        t.floor = createTileFloor('#2a2420', '#1a1410')
        break
      case 'living':
        t.wall = createWallpaperTex('#181218', '#2a1828', createHorizontalBoards)
        t.floor = createFloorPlanks('#2a1e18', '#1a1008')
        break
      case 'dining':
        t.wall = createWallpaperTex('#1a1512', '#2a2018', createBrickPattern)
        t.floor = createFloorPlanks('#2a2218', '#1a1408')
        break
      case 'pantry':
        t.wall = createWallpaperTex('#121210', '#1a1a10', createHorizontalBoards)
        t.floor = createTileFloor('#1a1a14', '#0e0e08')
        break
      case 'study':
        t.wall = createWallpaperTex('#121016', '#1a1024', createHorizontalBoards)
        t.floor = createFloorPlanks('#1a1410', '#0e0808')
        break
      case 'garage':
        t.wall = createWallpaperTex('#101012', '#18181a', createBrickPattern)
        t.floor = createTileFloor('#141414', '#0a0a0a')
        break
      case 'entrance':
        t.wall = createWallpaperTex('#1a1815', '#2a2218', createBrickPattern)
        t.floor = createTileFloor('#2a241e', '#1a140e')
        break
      default:
        t.wall = createWallpaperTex('#1a1a1a', '#2a2a2a', createVerticalStripes)
        t.floor = createFloorPlanks('#2a1e18', '#1a1008')
    }
    t.ceil = createCeilTex()
    t.trim = createTrimTex()
    roomTextures[roomType] = t
    return t
  }

  // ===== INIT =====
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
    renderer.toneMappingExposure = 0.6
    document.body.prepend(renderer.domElement)

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    buildLighting()
    buildFlashlight()
    buildRooms()
    buildFurniture()
    placeItems()

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

    setTimeout(function () {
      var ls = document.getElementById('loadingScreen')
      if (ls) ls.classList.add('hidden')
    }, 600)

    animate()
  }

  // ===== LIGHTING =====
  function buildLighting() {
    var amb = new THREE.AmbientLight(0x0a0a14, 0.2)
    scene.add(amb)

    var moon = new THREE.DirectionalLight(0x222244, 0.15)
    moon.position.set(-5, 8, 3)
    moon.castShadow = true
    moon.shadow.mapSize.width = 512
    moon.shadow.mapSize.height = 512
    var d = 8
    moon.shadow.camera.left = -d
    moon.shadow.camera.right = d
    moon.shadow.camera.top = d
    moon.shadow.camera.bottom = -d
    moon.shadow.camera.near = 1
    moon.shadow.camera.far = 20
    scene.add(moon)
  }

  // ===== FLASHLIGHT =====
  function buildFlashlight() {
    flashlight = new THREE.SpotLight(0xffeedd, 2.5)
    flashlight.angle = 0.35
    flashlight.penumbra = 0.5
    flashlight.decay = 1.5
    flashlight.distance = 12
    flashlight.castShadow = true
    flashlight.shadow.mapSize.width = 512
    flashlight.shadow.mapSize.height = 512
    flashlight.shadow.camera.near = 0.1
    flashlight.shadow.camera.far = 12
    scene.add(flashlight)

    var target = new THREE.Object3D()
    target.position.set(0, 0, -5)
    flashlight.add(target)
    flashlight.target = target

    // Bulb mesh
    var bulbGeo = new THREE.SphereGeometry(0.04, 8, 8)
    var bulbMat = new THREE.MeshBasicMaterial({ color: 0xffeedd })
    flashlightBulb = new THREE.Mesh(bulbGeo, bulbMat)
    flashlightBulb.position.set(0.2, -0.15, -0.3)
    flashlight.add(flashlightBulb)

    // Glow aura
    var glowGeo = new THREE.SphereGeometry(0.08, 8, 8)
    var glowMat = new THREE.MeshBasicMaterial({
      color: 0xffeedd,
      transparent: true,
      opacity: 0.2
    })
    var glow = new THREE.Mesh(glowGeo, glowMat)
    glow.position.copy(flashlightBulb.position)
    flashlight.add(glow)

    // Attach flashlight to camera
    camera.add(flashlight)
    camera.add(flashlight.target)
  }

  function toggleFlashlight() {
    flashlightOn = !flashlightOn
    flashlight.intensity = flashlightOn ? 2.5 : 0
    if (flashlightBulb) flashlightBulb.material.color.setHex(flashlightOn ? 0xffeedd : 0x111111)
    playFlashlightSnd()
    updateHUD()
  }

  // ===== ROOMS =====
  function roomAt(col, row) {
    if (row < 0 || row >= MAP.rows || col < 0 || col >= MAP.cols) return null
    return MAP.data[row][col]
  }

  function isWalkable(col, row) {
    var r = roomAt(col, row)
    return r && r !== 'void'
  }

  function computeRoomPos(col, row) {
    return {
      x: col * ROOM_SIZE + ROOM_SIZE / 2,
      z: row * ROOM_SIZE + ROOM_SIZE / 2
    }
  }

  function hasDoorBetween(c1, r1, c2, r2) {
    return isWalkable(c1, r1) && isWalkable(c2, r2)
  }

  function buildRooms() {
    var trimTex = createTrimTex()
    var trimMat = new THREE.MeshStandardMaterial({ map: trimTex, roughness: 0.9 })

    function addBox(x, y, z, w, h, d, mat, rotY) {
      var geo = new THREE.BoxGeometry(w, h, d)
      var mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      if (rotY) mesh.rotation.y = rotY
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)
      wallObjects.push(mesh)
      return mesh
    }

    function addWall(x, y, z, w, h, d, mat, rotY) {
      return addBox(x, y, z, w, h, d, mat, rotY)
    }

    function addFloor(x, z, mat) {
      return addBox(x, 0.05, z, ROOM_SIZE - 0.15, 0.1, ROOM_SIZE - 0.15, mat)
    }

    function addCeiling(x, z, mat) {
      return addBox(x, WALL_HEIGHT - 0.02, z, ROOM_SIZE - 0.15, 0.05, ROOM_SIZE - 0.15, mat)
    }

    function addBaseboard(x, y, z, w, d, rotY) {
      return addBox(x, y, z, w, 0.1, d, trimMat, rotY)
    }

    function addCrown(x, y, z, w, d, rotY) {
      return addBox(x, y, z, w, 0.06, d, trimMat, rotY)
    }

    var wallTex = createWallpaperTex('#1a1818', '#2a2222', createVerticalStripes)

    for (var row = 0; row < MAP.rows; row++) {
      for (var col = 0; col < MAP.cols; col++) {
        var room = roomAt(col, row)
        if (!room || room === 'void') continue

        var pos = computeRoomPos(col, row)
        var x = pos.x
        var z = pos.z
        var hw = ROOM_SIZE / 2

        var tex = getRoomTex(room)
        var wMat = new THREE.MeshStandardMaterial({ map: tex.wall, roughness: 0.85 })
        var fMat = new THREE.MeshStandardMaterial({ map: tex.floor, roughness: 0.8 })
        var cMat = new THREE.MeshStandardMaterial({ map: tex.ceil, roughness: 0.9 })

        addFloor(x, z, fMat)
        addCeiling(x, z, cMat)

        // Check neighbors
        var hasN = hasDoorBetween(col, row - 1, col, row)
        var hasS = hasDoorBetween(col, row + 1, col, row)
        var hasW = hasDoorBetween(col - 1, row, col, row)
        var hasE = hasDoorBetween(col + 1, row, col, row)

        var doorW = 0.9
        var doorH = 2.2

        function makeWallSegment(x1, z1, w1, h1, d1, rot, isDoor) {
          var wx = x1, wz = z1
          if (isDoor) {
            // Wall with door opening: 3 pieces
            var sideW = (w1 - doorW) / 2
            // Left piece
            addWall(wx - doorW / 2 - sideW / 2, h1 / 2, wz, sideW, h1, d1, wMat, rot)
            // Right piece
            addWall(wx + doorW / 2 + sideW / 2, h1 / 2, wz, sideW, h1, d1, wMat, rot)
            // Top piece above door
            addWall(wx, h1 - (h1 - doorH) / 2, wz, doorW, h1 - doorH, d1, wMat, rot)
          } else {
            addWall(wx, h1 / 2, wz, w1, h1, d1, wMat, rot)
          }

          // Baseboard
          var bbH = 0.1
          if (isDoor) {
            var sideW2 = (w1 - doorW) / 2
            if (sideW2 > 0) {
              addBaseboard(wx - doorW / 2 - sideW2 / 2, bbH / 2, wz, sideW2, d1 + 0.08, rot)
              addBaseboard(wx + doorW / 2 + sideW2 / 2, bbH / 2, wz, sideW2, d1 + 0.08, rot)
            }
          } else {
            addBaseboard(wx, bbH / 2, wz, w1, d1 + 0.08, rot)
          }

          // Crown molding
          var crH = WALL_HEIGHT - 0.03
          if (isDoor) {
            var sideW3 = (w1 - doorW) / 2
            if (sideW3 > 0) {
              addCrown(wx - doorW / 2 - sideW3 / 2, crH, wz, sideW3, d1 + 0.06, rot)
              addCrown(wx + doorW / 2 + sideW3 / 2, crH, wz, sideW3, d1 + 0.06, rot)
            }
          } else {
            addCrown(wx, crH, wz, w1, d1 + 0.06, rot)
          }

          // Door frame if door
          if (isDoor) {
            var frameMat = new THREE.MeshStandardMaterial({ color: 0x2a1e18, roughness: 0.7 })
            // Left post
            addBox(wx - doorW / 2 - 0.02, doorH / 2, wz, 0.06, doorH, d1 + 0.1, frameMat, rot)
            // Right post
            addBox(wx + doorW / 2 + 0.02, doorH / 2, wz, 0.06, doorH, d1 + 0.1, frameMat, rot)
            // Top header
            addBox(wx, doorH + 0.04, wz, doorW + 0.04, 0.06, d1 + 0.1, frameMat, rot)
          }
        }

        // North wall
        if (!hasN) {
          makeWallSegment(x, z - hw, ROOM_SIZE, WALL_HEIGHT, 0.12, 0, false)
        } else {
          makeWallSegment(x, z - hw, ROOM_SIZE, WALL_HEIGHT, 0.12, 0, true)
        }

        // South wall
        if (!hasS) {
          makeWallSegment(x, z + hw, ROOM_SIZE, WALL_HEIGHT, 0.12, 0, false)
        } else {
          makeWallSegment(x, z + hw, ROOM_SIZE, WALL_HEIGHT, 0.12, 0, true)
        }

        // West wall
        if (!hasW) {
          makeWallSegment(x - hw, z, 0.12, WALL_HEIGHT, ROOM_SIZE, 0, false)
        } else {
          makeWallSegment(x - hw, z, 0.12, WALL_HEIGHT, ROOM_SIZE, 0, true)
        }

        // East wall
        if (!hasE) {
          makeWallSegment(x + hw, z, 0.12, WALL_HEIGHT, ROOM_SIZE, 0, false)
        } else {
          makeWallSegment(x + hw, z, 0.12, WALL_HEIGHT, ROOM_SIZE, 0, true)
        }
      }
    }

    // Outer boundary walls
    var totalW = MAP.cols * ROOM_SIZE
    var totalD = MAP.rows * ROOM_SIZE
    var outerMat = new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 1 })
    var outerH = WALL_HEIGHT + 0.5
    addBox(totalW / 2, outerH / 2, -0.1, totalW, outerH, 0.2, outerMat)
    addBox(totalW / 2, outerH / 2, totalD + 0.1, totalW, outerH, 0.2, outerMat)
    addBox(-0.1, outerH / 2, totalD / 2, 0.2, outerH, totalD, outerMat)
    addBox(totalW + 0.1, outerH / 2, totalD / 2, 0.2, outerH, totalD, outerMat)

    // Outer ceiling (beyond boundaries - hide the void)
    addBox(totalW / 2, WALL_HEIGHT - 0.02, totalD / 2, totalW + 0.5, 0.05, totalD + 0.5, outerMat)
  }

  // ===== FURNITURE =====
  function buildFurniture() {
    function makeMat(color, rough, metalness) {
      return new THREE.MeshStandardMaterial({
        color: color,
        roughness: rough || 0.8,
        metalness: metalness || 0
      })
    }

    function placeBox(cx, cz, w, h, d, mat, colOff, rowOff) {
      var x = cx * ROOM_SIZE + ROOM_SIZE / 2 + (colOff || 0)
      var z = cz * ROOM_SIZE + ROOM_SIZE / 2 + (rowOff || 0)
      var geo = new THREE.BoxGeometry(w, h, d)
      var mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, h / 2, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)
      return mesh
    }

    // Living room - fireplace
    var lx = 2 * ROOM_SIZE + ROOM_SIZE / 2
    var lz = 1 * ROOM_SIZE + ROOM_SIZE / 2
    var fMat = makeMat(0x1a1010, 0.9)
    // Fireplace base
    var fp = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.3), fMat)
    fp.position.set(lx - 0.8, 0.3, lz - 0.5)
    fp.castShadow = true
    fp.receiveShadow = true
    scene.add(fp)
    // Fireplace column L
    var fc = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.0, 0.3), fMat)
    fc.position.set(lx - 1.12, 0.8, lz - 0.5)
    fc.castShadow = true
    scene.add(fc)
    // Fireplace column R
    var fc2 = fc.clone()
    fc2.position.set(lx - 0.48, 0.8, lz - 0.5)
    scene.add(fc2)
    // Mantel
    var mt = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.35), makeMat(0x2a1a10, 0.7))
    mt.position.set(lx - 0.8, 1.3, lz - 0.5)
    mt.castShadow = true
    scene.add(mt)
    // Fire glow
    var fl = new THREE.PointLight(0xff4400, 0.3, 3)
    fl.position.set(lx - 0.8, 0.3, lz - 0.5)
    scene.add(fl)

    // Living room - couch
    var couchMat = makeMat(0x2a1820, 0.85)
    placeBox(2, 1, 1.2, 0.5, 0.7, couchMat, 0.2, 1.2)
    placeBox(2, 1, 1.2, 0.3, 0.7, makeMat(0x1a1018, 0.9), 0.2, 1.2)
    // couch arms
    placeBox(2, 1, 0.12, 0.6, 0.7, couchMat, -0.4, 1.2)
    placeBox(2, 1, 0.12, 0.6, 0.7, couchMat, 0.8, 1.2)

    // Coffee table
    placeBox(2, 1, 0.6, 0.3, 0.4, makeMat(0x3a2a1a, 0.7), 0.2, 0.8)

    // Kitchen - counters
    var counterMat = makeMat(0x2a2a38, 0.6)
    // L-shaped counter
    placeBox(3, 0, 0.5, 0.9, 1.2, counterMat, 0.6, -0.2)
    placeBox(3, 0, 1.0, 0.9, 0.5, counterMat, 0.6, 1.1)
    // Counter top (wood)
    var ctMat = makeMat(0x3a2818, 0.5)
    placeBox(3, 0, 0.5, 0.06, 1.2, ctMat, 0.6, -0.2)
    placeBox(3, 0, 1.0, 0.06, 0.5, ctMat, 0.6, 1.1)

    // Dining room - table
    var tableMat = makeMat(0x2a1e14, 0.7)
    placeBox(2, 2, 0.9, 0.75, 0.6, tableMat, 0, 0)
    placeBox(2, 2, 0.9, 0.05, 0.6, makeMat(0x3a2a1a, 0.5), 0, 0)

    // Chairs
    var chairMat = makeMat(0x1a1410, 0.85)
    placeBox(2, 2, 0.3, 0.45, 0.3, chairMat, 0.7, 0.7)
    placeBox(2, 2, 0.3, 0.45, 0.3, chairMat, -0.7, 0.7)
    placeBox(2, 2, 0.3, 0.45, 0.3, chairMat, 0.7, -0.7)
    placeBox(2, 2, 0.3, 0.45, 0.3, chairMat, -0.7, -0.7)

    // Study - desk and bookshelf
    var deskMat = makeMat(0x1a1412, 0.8)
    placeBox(0, 2, 0.7, 0.75, 0.4, deskMat, 0, 0.3)
    // Bookshelf
    var shelfMat = makeMat(0x1a1210, 0.9)
    var sh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 1.0), shelfMat)
    sh.position.set(0 * ROOM_SIZE + 0.2, 0.6, 2 * ROOM_SIZE + ROOM_SIZE / 2 - 0.8)
    sh.castShadow = true
    sh.receiveShadow = true
    scene.add(sh)
    // Shelf dividers
    for (var si = 0; si < 4; si++) {
      var sd = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.9), makeMat(0x2a1e14, 0.7))
      sd.position.set(0 * ROOM_SIZE + 0.2, 0.2 + si * 0.3, 2 * ROOM_SIZE + ROOM_SIZE / 2 - 0.8)
      sd.castShadow = true
      scene.add(sd)
    }

    // Bathroom 1 - bathtub
    var bathMat = makeMat(0x1a1a28, 0.4, 0.3)
    placeBox(1, 0, 0.7, 0.3, 1.2, bathMat, 0, 0.2)
    // Bathtub interior
    placeBox(1, 0, 0.5, 0.15, 0.9, makeMat(0x0a0a18, 0.3, 0.5), 0, 0.2)

    // Garage - workbench
    var wbMat = makeMat(0x2a2818, 0.9)
    placeBox(0, 3, 1.2, 0.5, 0.6, wbMat, 0, 0)

    // Entrance - coat rack
    var rackMat = makeMat(0x1a1a1a, 0.6, 0.3)
    placeBox(1, 3, 0.06, 1.0, 0.06, rackMat, 0.4, 0)
    placeBox(1, 3, 0.06, 0.8, 0.06, rackMat, -0.4, 0)
    placeBox(1, 3, 0.06, 0.8, 0.06, rackMat, 0, 0.4)
    placeBox(1, 3, 0.06, 0.8, 0.06, rackMat, 0, -0.4)
    // Top hook
    placeBox(1, 3, 0.5, 0.06, 0.5, rackMat, 0, 0)

    // Staircase model in hall (visual only, no upper floor)
    var stairMat = makeMat(0x2a1e14, 0.85)
    for (var step = 0; step < 6; step++) {
      var sh2 = 0.12 + step * 0.08
      placeBox(2, 0, 0.3, sh2, 0.5, stairMat, 0.1 + step * 0.1, -0.5 + step * 0.15)
    }
    // Railing posts
    for (var rp = 0; rp < 4; rp++) {
      placeBox(2, 0, 0.04, 0.5 + rp * 0.1, 0.04, makeMat(0x1a1410, 0.8), 0.3 + rp * 0.15, -0.4)
    }
    // Railing rail
    placeBox(2, 0, 0.6, 0.04, 0.04, makeMat(0x2a1e14, 0.7), 0.4, -0.4)

    // Hall 2 - small table with lamp
    placeBox(1, 2, 0.3, 0.6, 0.3, tableMat, 0, 0.3)
    // Lamp glow
    var lampLight = new THREE.PointLight(0xff8844, 0.15, 2.5)
    lampLight.position.set(1 * ROOM_SIZE + 0.3, 0.9, 2 * ROOM_SIZE + ROOM_SIZE / 2 + 0.3)
    scene.add(lampLight)

    // Kitchen - stove (simple)
    placeBox(3, 0, 0.4, 0.8, 0.4, makeMat(0x1a1a22, 0.4, 0.5), 0.6, -0.7)

    // Pillars in living/dining open area
    var pillarMat = new THREE.MeshStandardMaterial({ color: 0x1a1818, roughness: 0.9 })
    function addPillar(px, pz) {
      var p = new THREE.Mesh(new THREE.BoxGeometry(0.12, WALL_HEIGHT, 0.12), pillarMat)
      p.position.set(px, WALL_HEIGHT / 2, pz)
      p.castShadow = true
      scene.add(p)
      wallObjects.push(p)
    }
    addPillar(1 * ROOM_SIZE + ROOM_SIZE, 1 * ROOM_SIZE + ROOM_SIZE)
    addPillar(2 * ROOM_SIZE, 1 * ROOM_SIZE + ROOM_SIZE)
    addPillar(1 * ROOM_SIZE + ROOM_SIZE, 2 * ROOM_SIZE)
    addPillar(2 * ROOM_SIZE, 2 * ROOM_SIZE)
  }

  // ===== ITEMS =====
  function placeItems() {
    // Remove old items
    interactables.forEach(function (item) {
      if (item.parent) scene.remove(item)
    })
    interactables = []

    // Place items randomly in rooms
    var itemPositions = [
      { room: 'bedroom1', offX: 0.2, offZ: 0.2, icon: '📜', name: 'CARTA', type: 'letter' },
      { room: 'kitchen', offX: -0.3, offZ: 0.4, icon: '🦴', name: 'OSSO', type: 'bone' },
      { room: 'study', offX: 0.3, offZ: -0.3, icon: '📕', name: 'LIVRO', type: 'book' },
      { room: 'bathroom1', offX: -0.2, offZ: -0.2, icon: '🪞', name: 'ESPELHO', type: 'mirror' },
      { room: 'garage', offX: 0, offZ: 0.3, icon: '🔑', name: 'CHAVE', type: 'key' },
      { room: 'dining', offX: 0.4, offZ: -0.4, icon: '🕯️', name: 'VELA', type: 'candle' },
      { room: 'living', offX: -0.5, offZ: 0.5, icon: '🎵', name: 'CAIXA DE MÚSICA', type: 'musicbox' },
    ]

    // Only place items for current day
    var itemsToPlace = Math.min(3 + gameState.day, itemPositions.length)
    var used = {}
    var placed = 0
    while (placed < itemsToPlace) {
      var idx = Math.floor(Math.random() * itemPositions.length)
      if (used[idx]) continue
      used[idx] = true
      var ip = itemPositions[idx]
      var roomFound = false
      for (var r = 0; r < MAP.rows && !roomFound; r++) {
        for (var c = 0; c < MAP.cols && !roomFound; c++) {
          if (roomAt(c, r) === ip.room) {
            var pos = computeRoomPos(c, r)
            var item = createItemMesh(pos.x + ip.offX, pos.z + ip.offZ, ip.icon, ip.name, ip.type)
            interactables.push(item)
            placed++
            roomFound = true
          }
        }
      }
    }
  }

  function createItemMesh(x, z, icon, name, type) {
    var color = 0x8a5a3a
    var geo = new THREE.BoxGeometry(0.15, 0.15, 0.15)
    var mat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: 0x3a1a0a,
      emissiveIntensity: 0.2,
      roughness: 0.6,
      metalness: 0.3
    })
    var mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, 0.2, z)
    mesh.castShadow = true
    mesh.userData = {
      interactable: true,
      icon: icon,
      name: name,
      type: type,
      onInteract: function (obj) {
        if (gameState.gameOver || gameState.caught) return
        pickupItem(obj)
      }
    }
    scene.add(mesh)
    return mesh
  }

  function pickupItem(mesh) {
    if (gameState.items.length >= 6) return
    gameState.items.push(mesh.userData.type)
    scene.remove(mesh)
    playItemPickup()
    updateHUD()
  }

  // ===== CONTROLS =====
  function setupControls() {
    document.addEventListener('keydown', function (e) {
      if (gameState.gameOver || gameState.caught) return
      switch (e.key) {
        case 'w': case 'W': moveDir.fwd = 1; e.preventDefault(); break
        case 's': case 'S': moveDir.fwd = -1; e.preventDefault(); break
        case 'a': case 'A': moveDir.right = 1; e.preventDefault(); break
        case 'd': case 'D': moveDir.right = -1; e.preventDefault(); break
        case 'Shift': isRunning = true; e.preventDefault(); break
        case 'Control': isCrouching = true; e.preventDefault(); break
        case ' ': 
          e.preventDefault()
          if (player.isGrounded && !isJumping) {
            player.velY = JUMP_SPEED
            player.isGrounded = false
            isJumping = true
            playJumpSnd()
          }
          break
        case 'f': case 'F': toggleFlashlight(); e.preventDefault(); break
      }
    })
    document.addEventListener('keyup', function (e) {
      switch (e.key) {
        case 'w': case 'W': if (moveDir.fwd > 0) moveDir.fwd = 0; break
        case 's': case 'S': if (moveDir.fwd < 0) moveDir.fwd = 0; break
        case 'a': case 'A': if (moveDir.right > 0) moveDir.right = 0; break
        case 'd': case 'D': if (moveDir.right < 0) moveDir.right = 0; break
        case 'Shift': isRunning = false; break
        case 'Control': isCrouching = false; break
        case ' ': isJumping = false; break
      }
    })
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'e' || e.key === 'E') && !gameState.gameOver && !gameState.caught) interact()
    })
    document.addEventListener('mousedown', function () {
      if (isLocked && !gameState.gameOver && !gameState.caught) interact()
    })
  }

  function setupPointerLock() {
    renderer.domElement.addEventListener('click', function () {
      if (!isLocked) {
        renderer.domElement.requestPointerLock()
      }
    })
    document.addEventListener('pointerlockchange', function () {
      isLocked = document.pointerLockElement === renderer.domElement
    })
    document.addEventListener('mousemove', function (e) {
      if (!isLocked) return
      euler.y -= e.movementX * 0.002
      euler.x -= e.movementY * 0.002
      euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, euler.x))
    })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isLocked) {
        document.exitPointerLock()
      }
    })
  }

  // ===== PHYSICS =====
  function updateMovement(dt) {
    if (gameState.gameOver || gameState.caught) return

    var speed = player.speed
    if (isRunning) speed *= 1.8
    if (isCrouching) speed *= 0.4

    // Horizontal movement
    var fwd = new THREE.Vector3(-Math.sin(euler.y), 0, -Math.cos(euler.y))
    var right = new THREE.Vector3(fwd.z, 0, -fwd.x)
    fwd.multiplyScalar(moveDir.fwd)
    right.multiplyScalar(moveDir.right)
    vel.copy(fwd).add(right)
    if (vel.length() > 0) {
      vel.normalize().multiplyScalar(speed * dt)
      var newPos = player.pos.clone().add(vel)
      if (!checkCollision(newPos)) {
        player.pos.copy(newPos)
      } else {
        var slideX = new THREE.Vector3(vel.x, 0, 0)
        var testX = player.pos.clone().add(slideX)
        if (!checkCollision(testX)) player.pos.x = testX.x
        var slideZ = new THREE.Vector3(0, 0, vel.z)
        var testZ = player.pos.clone().add(slideZ)
        if (!checkCollision(testZ)) player.pos.z = testZ.z
      }

      // Footstep sounds
      if (player.isGrounded) {
        footstepTimer += dt
        var stepInterval = isRunning ? 0.3 : 0.5
        if (footstepTimer >= stepInterval) {
          footstepTimer = 0
          playFootstep()
        }
      }
      wasMoving = true
    } else {
      footstepTimer = 0
      wasMoving = false
    }

    // Gravity
    if (!player.isGrounded) {
      player.velY += GRAVITY * dt
      player.pos.y += player.velY * dt
      if (player.pos.y <= 0) {
        player.pos.y = 0
        player.velY = 0
        player.isGrounded = true
        if (!wasGrounded) {
          playLandSnd()
        }
      }
    }

    // Track grounded state for landing sound
    if (player.isGrounded && !wasGrounded) {
      // landing sound already played above
    }
    wasGrounded = player.isGrounded

    // Update camera
    camera.position.copy(player.pos)
    camera.position.y = player.height - (isCrouching ? 0.4 : 0)
    var qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), euler.x)
    var qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), euler.y)
    camera.quaternion.copy(qy.multiply(qx))
  }

  function checkCollision(pos) {
    var playerR = 0.2
    var testY = 0.5
    for (var i = 0; i < wallObjects.length; i++) {
      var w = wallObjects[i]
      var box = new THREE.Box3().setFromObject(w)
      var minY = box.min.y
      var maxY = box.max.y
      // Only collide if player is in same height range
      if (pos.y + player.height * 0.5 < minY || pos.y + 0.2 > maxY) continue
      var pBox = new THREE.Box3(
        new THREE.Vector3(pos.x - playerR, pos.y - 0.3, pos.z - playerR),
        new THREE.Vector3(pos.x + playerR, pos.y + 0.3, pos.z + playerR)
      )
      if (box.intersectsBox(pBox)) return true
    }
    return false
  }

  // ===== INTERACTION =====
  function interact() {
    raycaster.setFromCamera({ x: 0, y: 0 }, camera)
    var intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length > 0) {
      var obj = intersects[0].object
      if (obj.userData && obj.userData.interactable) {
        obj.userData.onInteract(obj)
      }
    }
  }

  // ===== HUD =====
  function updateHUD() {
    // Day
    hudEls.day.textContent = 'DIA ' + gameState.day
    hudEls.day.dataset.text = 'DIA ' + gameState.day
    hudEls.daySub.textContent = '// ' + (gameState.maxDays - gameState.day + 1) + ' DIAS RESTAM'

    // Memories
    var memHtml = ''
    for (var mi = 0; mi < gameState.maxMemories; mi++) {
      memHtml += '<span class="mem-slot' + (mi < gameState.memories ? ' filled' : '') + '" data-i="' + mi + '"></span>'
    }
    hudEls.memories.innerHTML = memHtml

    // Hunger
    var hungerPct = Math.max(0, gameState.hunger)
    hudEls.hungerFill.style.width = hungerPct + '%'
    hudEls.hungerPct.textContent = Math.floor(hungerPct) + '%'

    // Items
    var allSlots = hudEls.itemSlots
    for (var si = 0; si < allSlots.length; si++) {
      var slot = allSlots[si]
      var existingIcon = slot.querySelector('.item-icon')
      if (existingIcon) slot.removeChild(existingIcon)
      if (si < gameState.items.length) {
        slot.classList.add('filled')
        var iconSpan = document.createElement('span')
        iconSpan.className = 'item-icon'
        var type = gameState.items[si]
        iconSpan.textContent = itemIcons[type] || '?'
        slot.appendChild(iconSpan)
      } else {
        slot.classList.remove('filled')
      }
    }

    // Flashlight indicator
    if (hudEls.flashlightInd) {
      hudEls.flashlightInd.textContent = flashlightOn ? '🔦 LANTERNA: LIGADA' : '🔦 LANTERNA: DESLIGADA'
      hudEls.flashlightInd.className = flashlightOn ? 'on' : ''
    }
  }

  // ===== DEATH / WIN =====
  function showDeathScreen() {
    gameState.caught = true
    playCaughtSnd()
    document.getElementById('deathScreen').classList.add('open')
    document.getElementById('deathText').innerHTML =
      'VOCÊ PERDEU TODOS OS ITENS DO DIA ' + gameState.day + '.<br>TENTE NOVAMENTE...'
    if (document.pointerLockElement) document.exitPointerLock()
  }

  function nextDay() {
    document.getElementById('deathScreen').classList.remove('open')
    gameState.day++
    gameState.items = []
    gameState.dayItems = []
    gameState.caught = false
    gameState.puzzlesSolved = 0
    player.pos.set(13, 0, 13)
    player.velY = 0
    player.isGrounded = true
    camera.position.copy(player.pos)
    camera.position.y = player.height
    placeItems()
    updateHUD()
    renderer.domElement.requestPointerLock()
  }

  // ===== ANIMATION LOOP =====
  function animate() {
    requestAnimationFrame(animate)
    var dt = Math.min(clock.getDelta(), 0.05)

    if (!gameState.gameOver && !gameState.caught) {
      updateMovement(dt)

      gameState.hunger -= dt * 0.2
      if (gameState.hunger <= 0) {
        gameState.gameOver = true
        showDeathScreen()
        document.getElementById('deathText').innerHTML =
          'VOCÊ MORREU DE FOME APÓS ' + gameState.day + ' DIAS.'
        document.getElementById('retryBtn').textContent = 'REINICIAR'
      }

      updateHUD()
    }

    // Rotate items gently
    for (var i = 0; i < interactables.length; i++) {
      interactables[i].rotation.y += dt * 0.5
    }

    renderer.render(scene, camera)
  }

  // ===== EVENT BINDINGS =====
  document.getElementById('retryBtn').addEventListener('click', function () {
    if (gameState.gameOver) {
      gameState.day = 1
      gameState.hunger = 100
      gameState.memories = 0
      gameState.items = []
      gameState.gameOver = false
      gameState.caught = false
    player.pos.set(6, 0, 14)
      player.velY = 0
      player.isGrounded = true
      document.getElementById('deathScreen').classList.remove('open')
      document.getElementById('retryBtn').textContent = 'TENTAR NOVAMENTE'
      updateHUD()
      renderer.domElement.requestPointerLock()
    } else {
      nextDay()
    }
  })

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  // ===== START =====
  init()
})()
