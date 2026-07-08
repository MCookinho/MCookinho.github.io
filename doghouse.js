;(function () {
  var scene, camera, renderer
  var raycaster, mouse
  var clock = new THREE.Clock()

  // Player
  var player = { height: 1.6, speed: 3, pos: new THREE.Vector3(5, 0, 5) }
  var euler = { x: 0, y: 0 }
  var vel = new THREE.Vector3()
  var moveDir = { fwd: 0, right: 0 }
  var isLocked = false
  var isRunning = false
  var isCrouching = false

  // Game state
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

  // Rooms map
  var MAP = {
    cols: 4,
    rows: 4,
    data: [
      ['bedroom1','bedroom2','hall','storage'],
      ['kitchen','living','dining','bathroom'],
      ['pantry','bedroom3','garage','entrance'],
      ['void','void','void','void']
    ]
  }

  var ROOM_NAMES = {
    bedroom1: 'QUARTO 1', bedroom2: 'QUARTO 2', bedroom3: 'QUARTO 3',
    hall: 'CORREDOR', storage: 'DEPÓSITO',
    kitchen: 'COZINHA', living: 'SALA', dining: 'SALA DE JANTAR',
    bathroom: 'BANHEIRO', pantry: 'DESPENSA', garage: 'GARAGEM',
    entrance: 'ENTRADA', void: null
  }

  var WALL_HEIGHT = 2.8
  var ROOM_SIZE = 4
  var wallObjects = []
  var doorObjects = []
  var interactables = []
  var hudEls = {}

  function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050508)
    scene.fog = new THREE.Fog(0x050508, 12, 20)

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 30)
    camera.position.copy(player.pos)
    camera.position.y = player.height

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.8
    document.body.prepend(renderer.domElement)

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    buildLighting()
    buildRooms()
    buildFurniture()
    placeItems()

    hudEls.day = document.getElementById('hudDay')
    hudEls.items = document.getElementById('hudItems')
    hudEls.memories = document.getElementById('hudMemories')
    hudEls.hunger = document.getElementById('hudHunger')
    hudEls.interact = document.getElementById('interactPrompt')

    setupControls()
    setupPointerLock()
    updateHUD()

    // Hide loading
    setTimeout(function () {
      var ls = document.getElementById('loadingScreen')
      if (ls) ls.classList.add('hidden')
    }, 500)

    animate()
  }

  function buildLighting() {
    var amb = new THREE.AmbientLight(0x1a1a2e, 0.3)
    scene.add(amb)

    var dir = new THREE.DirectionalLight(0xffeedd, 0.6)
    dir.position.set(5, 10, 5)
    dir.castShadow = true
    dir.shadow.mapSize.width = 1024
    dir.shadow.mapSize.height = 1024
    var d = 10
    dir.shadow.camera.left = -d
    dir.shadow.camera.right = d
    dir.shadow.camera.top = d
    dir.shadow.camera.bottom = -d
    dir.shadow.camera.near = 1
    dir.shadow.camera.far = 20
    scene.add(dir)

    // Warm point lights in rooms (simulate lamps)
    var lightPositions = [
      [5, 2.4, 5], [9, 2.4, 5], [13, 2.4, 5],
      [5, 2.4, 9], [9, 2.4, 9], [13, 2.4, 9],
      [5, 2.4, 13], [9, 2.4, 13], [13, 2.4, 13]
    ]
    lightPositions.forEach(function (p) {
      var pl = new THREE.PointLight(0xff8844, 0.15, 6)
      pl.position.set(p[0], p[1], p[2])
      scene.add(pl)
    })
  }

  function roomAt(col, row) {
    if (row < 0 || row >= MAP.rows || col < 0 || col >= MAP.cols) return null
    return MAP.data[row][col]
  }

  function isWalkable(col, row) {
    var r = roomAt(col, row)
    return r && r !== 'void'
  }

  function buildRooms() {
    var texLoader = new THREE.TextureLoader()
    // Generate procedural textures using Canvas
    function makeWallTex(color1, color2) {
      var c = document.createElement('canvas')
      c.width = 64; c.height = 64
      var ctx = c.getContext('2d')
      ctx.fillStyle = color1
      ctx.fillRect(0, 0, 64, 64)
      ctx.fillStyle = color2
      for (var i = 0; i < 64; i += 8) {
        for (var j = 0; j < 64; j += 8) {
          if ((i / 8 + j / 8) % 2 === 0) ctx.fillRect(i, j, 8, 8)
        }
      }
      var tex = new THREE.CanvasTexture(c)
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(2, 2)
      return tex
    }

    function makeFloorTex(color1, color2) {
      var c = document.createElement('canvas')
      c.width = 64; c.height = 64
      var ctx = c.getContext('2d')
      ctx.fillStyle = color1
      ctx.fillRect(0, 0, 64, 64)
      ctx.fillStyle = color2
      var s = 8
      for (var x = 0; x < 64; x += s) {
        for (var y = 0; y < 64; y += s) {
          if ((x / s + y / s) % 2 === 0) ctx.fillRect(x, y, s, s)
        }
      }
      var tex = new THREE.CanvasTexture(c)
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(2, 2)
      return tex
    }

    function makeDoorTex() {
      var c = document.createElement('canvas')
      c.width = 64; c.height = 64
      var ctx = c.getContext('2d')
      ctx.fillStyle = '#2a1a0a'
      ctx.fillRect(0, 0, 64, 64)
      ctx.fillStyle = '#3a2a1a'
      for (var i = 0; i < 64; i += 16) {
        ctx.fillRect(i, 0, 2, 64)
      }
      ctx.fillStyle = '#4a3a2a'
      ctx.fillRect(28, 28, 8, 8) // doorknob
      return new THREE.CanvasTexture(c)
    }

    var wallTex = makeWallTex('#2a2a3a', '#22223a')
    var floorTex = makeFloorTex('#3a2a1a', '#2a1a0a')
    var ceilTex = makeFloorTex('#1a1a2a', '#111122')
    var doorTex = makeDoorTex()

    var wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.9 })
    var floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.8 })
    var ceilMat = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.9 })
    var doorMat = new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.7 })

    function addWall(x, y, width, height, depth, rotY) {
      var geo = new THREE.BoxGeometry(width, height, depth)
      var mesh = new THREE.Mesh(geo, wallMat)
      mesh.position.set(x, height / 2, y)
      mesh.rotation.y = rotY || 0
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)
      wallObjects.push(mesh)
      return mesh
    }

    function addFloor(x, z) {
      var geo = new THREE.BoxGeometry(ROOM_SIZE - 0.1, 0.1, ROOM_SIZE - 0.1)
      var mesh = new THREE.Mesh(geo, floorMat)
      mesh.position.set(x, 0, z)
      mesh.receiveShadow = true
      scene.add(mesh)
      return mesh
    }

    function addCeiling(x, z) {
      var geo = new THREE.BoxGeometry(ROOM_SIZE - 0.1, 0.05, ROOM_SIZE - 0.1)
      var mesh = new THREE.Mesh(geo, ceilMat)
      mesh.position.set(x, WALL_HEIGHT, z)
      scene.add(mesh)
      return mesh
    }

    // Door opening helper
    function hasDoorBetween(c1, r1, c2, r2) {
      // Returns true if two adjacent rooms exist (both walkable)
      return isWalkable(c1, r1) && isWalkable(c2, r2)
    }

    function computeRoomPos(col, row) {
      var x = col * ROOM_SIZE + ROOM_SIZE / 2
      var z = row * ROOM_SIZE + ROOM_SIZE / 2
      return { x: x, z: z }
    }

    // Build walls for each room
    for (var row = 0; row < MAP.rows; row++) {
      for (var col = 0; col < MAP.cols; col++) {
        var room = roomAt(col, row)
        if (!room || room === 'void') continue

        var pos = computeRoomPos(col, row)
        var x = pos.x
        var z = pos.z

        // Floor and ceiling for each room
        addFloor(x, z)
        addCeiling(x, z)

        var hw = ROOM_SIZE / 2

        // Check neighbors for doors
        var hasN = hasDoorBetween(col, row - 1, col, row)
        var hasS = hasDoorBetween(col, row + 1, col, row)
        var hasW = hasDoorBetween(col - 1, row, col, row)
        var hasE = hasDoorBetween(col + 1, row, col, row)

        // North wall (z - half)
        if (!hasN) {
          addWall(x, z - hw, ROOM_SIZE, WALL_HEIGHT, 0.12, 0)
        } else {
          // Wall with door opening
          var doorW = 0.8
          var doorH = 2.2
          // Left part
          addWall(x - hw / 2 - doorW / 4, z - hw, hw - doorW / 2, WALL_HEIGHT, 0.12, 0)
          // Right part
          addWall(x + hw / 2 + doorW / 4, z - hw, hw - doorW / 2, WALL_HEIGHT, 0.12, 0)
          // Top part above door
          addWall(x, z - hw, doorW, WALL_HEIGHT - doorH, 0.12, 0)
        }

        // South wall (z + half)
        if (!hasS) {
          addWall(x, z + hw, ROOM_SIZE, WALL_HEIGHT, 0.12, 0)
        } else {
          var doorW = 0.8
          var doorH = 2.2
          addWall(x - hw / 2 - doorW / 4, z + hw, hw - doorW / 2, WALL_HEIGHT, 0.12, 0)
          addWall(x + hw / 2 + doorW / 4, z + hw, hw - doorW / 2, WALL_HEIGHT, 0.12, 0)
          addWall(x, z + hw, doorW, WALL_HEIGHT - doorH, 0.12, 0)
        }

        // West wall (x - half)
        if (!hasW) {
          addWall(x - hw, z, 0.12, WALL_HEIGHT, ROOM_SIZE, 0)
        } else {
          var doorW = 0.8
          var doorH = 2.2
          addWall(x - hw, z - hw / 2 - doorW / 4, 0.12, WALL_HEIGHT, hw - doorW / 2, 0)
          addWall(x - hw, z + hw / 2 + doorW / 4, 0.12, WALL_HEIGHT, hw - doorW / 2, 0)
          addWall(x - hw, z, 0.12, WALL_HEIGHT - doorH, doorW, 0)
        }

        // East wall (x + half)
        if (!hasE) {
          addWall(x + hw, z, 0.12, WALL_HEIGHT, ROOM_SIZE, 0)
        } else {
          var doorW = 0.8
          var doorH = 2.2
          addWall(x + hw, z - hw / 2 - doorW / 4, 0.12, WALL_HEIGHT, hw - doorW / 2, 0)
          addWall(x + hw, z + hw / 2 + doorW / 4, 0.12, WALL_HEIGHT, hw - doorW / 2, 0)
          addWall(x + hw, z, 0.12, WALL_HEIGHT - doorH, doorW, 0)
        }
      }
    }

    // Add outer walls (boundary)
    var totalW = MAP.cols * ROOM_SIZE
    var totalD = MAP.rows * ROOM_SIZE
    // North outer
    addWall(totalW / 2, -0.06, totalW, WALL_HEIGHT, 0.12, 0)
    // South outer
    addWall(totalW / 2, totalD + 0.06, totalW, WALL_HEIGHT, 0.12, 0)
    // West outer
    addWall(-0.06, totalD / 2, 0.12, WALL_HEIGHT, totalD, 0)
    // East outer
    addWall(totalW + 0.06, totalD / 2, 0.12, WALL_HEIGHT, totalD, 0)
  }

  function buildFurniture() {
    // Simple furniture placeholders using basic geometry
    // Each type has position (col, row) within a room
    var furnitureData = [
      // Living room
      { type: 'table', col: 2, row: 1, color: 0x4a3a2a, w: 0.8, h: 0.7, d: 0.5 },
      // Kitchen
      { type: 'counter', col: 0, row: 1, color: 0x3a3a4a, w: 0.6, h: 0.9, d: 0.4 },
    ]
    furnitureData.forEach(function (f) {
      var x = f.col * ROOM_SIZE + ROOM_SIZE / 2
      var z = f.row * ROOM_SIZE + ROOM_SIZE / 2
      var geo = new THREE.BoxGeometry(f.w, f.h, f.d)
      var mat = new THREE.MeshStandardMaterial({ color: f.color, roughness: 0.8 })
      var mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, f.h / 2, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)
    })
  }

  function placeItems() {
    // Place interactable items for puzzles
  }

  function setupControls() {
    document.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'w': case 'W': moveDir.fwd = 1; break
        case 's': case 'S': moveDir.fwd = -1; break
        case 'a': case 'A': moveDir.right = -1; break
        case 'd': case 'D': moveDir.right = 1; break
        case 'Shift': isRunning = true; break
        case 'Control': isCrouching = true; break
      }
    })
    document.addEventListener('keyup', function (e) {
      switch (e.key) {
        case 'w': case 'W': if (moveDir.fwd > 0) moveDir.fwd = 0; break
        case 's': case 'S': if (moveDir.fwd < 0) moveDir.fwd = 0; break
        case 'a': case 'A': if (moveDir.right < 0) moveDir.right = 0; break
        case 'd': case 'D': if (moveDir.right > 0) moveDir.right = 0; break
        case 'Shift': isRunning = false; break
        case 'Control': isCrouching = false; break
      }
    })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'e' || e.key === 'E') interact()
    })
    document.addEventListener('mousedown', function () {
      if (isLocked) interact()
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

    // ESC to unlock
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isLocked) {
        document.exitPointerLock()
      }
    })
  }

  function updateMovement(dt) {
    if (gameState.gameOver || gameState.caught) return

    var speed = player.speed
    if (isRunning) speed *= 1.8
    if (isCrouching) speed *= 0.4

    var fwd = new THREE.Vector3(-Math.sin(euler.y), 0, -Math.cos(euler.y))
    var right = new THREE.Vector3(fwd.z, 0, -fwd.x)
    fwd.multiplyScalar(moveDir.fwd)
    right.multiplyScalar(moveDir.right)
    vel.copy(fwd).add(right)
    if (vel.length() > 0) {
      vel.normalize().multiplyScalar(speed * dt)
      var newPos = player.pos.clone().add(vel)
      // Collision detection
      if (!checkCollision(newPos)) {
        player.pos.copy(newPos)
      } else {
        // Try sliding along walls
        var slideX = new THREE.Vector3(vel.x, 0, 0)
        var testX = player.pos.clone().add(slideX)
        if (!checkCollision(testX)) player.pos.x = testX.x
        var slideZ = new THREE.Vector3(0, 0, vel.z)
        var testZ = player.pos.clone().add(slideZ)
        if (!checkCollision(testZ)) player.pos.z = testZ.z
      }
    }

    // Update camera position
    camera.position.copy(player.pos)
    camera.position.y = player.height - (isCrouching ? 0.4 : 0)
    var qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), euler.x)
    var qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), euler.y)
    camera.quaternion.copy(qy.multiply(qx))
  }

  function checkCollision(pos) {
    var margin = 0.25
    var playerR = 0.2
    var testY = 0.5
    for (var i = 0; i < wallObjects.length; i++) {
      var w = wallObjects[i]
      var box = new THREE.Box3().setFromObject(w)
      var pBox = new THREE.Box3(
        new THREE.Vector3(pos.x - playerR, testY - 0.3, pos.z - playerR),
        new THREE.Vector3(pos.x + playerR, testY + 0.3, pos.z + playerR)
      )
      if (box.intersectsBox(pBox)) return true
    }
    return false
  }

  function interact() {
    if (gameState.gameOver) return
    // Raycast from center of screen
    raycaster.setFromCamera({ x: 0, y: 0 }, camera)
    var intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length > 0) {
      var obj = intersects[0].object
      if (obj.userData && obj.userData.interactable) {
        obj.userData.onInteract(obj)
      }
    }
  }

  function updateHUD() {
    hudEls.day.textContent = 'DIA ' + gameState.day
    hudEls.items.textContent = 'ITENS: ' + gameState.items.length
    hudEls.memories.textContent = 'MEMÓRIAS: ' + gameState.memories + '/' + gameState.maxMemories
    var hungerBars = Math.max(1, Math.ceil(gameState.hunger / 20))
    var hStr = ''
    for (var i = 0; i < hungerBars; i++) hStr += '⏳'
    hudEls.hunger.textContent = hStr
  }

  function showDeathScreen() {
    gameState.caught = true
    document.getElementById('deathScreen').classList.add('open')
    document.getElementById('deathText').innerHTML =
      'VOCÊ PERDEU TODOS OS ITENS DO DIA ' + gameState.day + '.<br/>TENTE NOVAMENTE...'
    if (document.pointerLockElement) document.exitPointerLock()
  }

  function nextDay() {
    document.getElementById('deathScreen').classList.remove('open')
    gameState.day++
    gameState.items = []
    gameState.dayItems = []
    gameState.caught = false
    gameState.puzzlesSolved = 0
    // Reset player position
    player.pos.set(5, 0, 5)
    camera.position.copy(player.pos)
    camera.position.y = player.height
    // Place new items for the day
    placeItems()
    updateHUD()
    renderer.domElement.requestPointerLock()
  }

  function animate() {
    requestAnimationFrame(animate)
    var dt = Math.min(clock.getDelta(), 0.05)

    if (!gameState.gameOver && !gameState.caught) {
      updateMovement(dt)
      // Hunger decreases slowly
      gameState.hunger -= dt * 0.3
      if (gameState.hunger <= 0) {
        gameState.gameOver = true
        showDeathScreen()
        document.getElementById('deathText').innerHTML =
          'VOCÊ MORREU DE FOME APÓS ' + gameState.day + ' DIAS.'
        document.getElementById('retryBtn').textContent = 'REINICIAR'
      }
      updateHUD()
    }

    renderer.render(scene, camera)
  }

  // Retry button
  document.getElementById('retryBtn').addEventListener('click', function () {
    if (gameState.gameOver) {
      // Full restart
      gameState.day = 1
      gameState.hunger = 100
      gameState.memories = 0
      gameState.items = []
      gameState.gameOver = false
      gameState.caught = false
      player.pos.set(5, 0, 5)
      document.getElementById('deathScreen').classList.remove('open')
      document.getElementById('retryBtn').textContent = 'TENTAR NOVAMENTE'
      updateHUD()
      renderer.domElement.requestPointerLock()
    } else {
      nextDay()
    }
  })

  // Window resize
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  // Start
  init()
})()
