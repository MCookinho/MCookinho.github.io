// ── Horror Module (easter egg de terror) ──
// Efeitos audiovisuais usados no easter egg "passear" da Shiva.
// Exposto como window.Horror para shiva.js controlar a sequência.
// Inclui: ruído estático (Web Audio API), fade escuro, sons de
// rangido de porta e latido, e animação canvas de "rasgo" com
// olhos, patas, glitch, VHS noise e screen shake.
(function () {
  var ctx = null
  var staticNode = null
  var staticGain = null
  var dimEl = null
  var canvasEl = null
  var canvasCtx = null
  var eggActive = false
  var chatLocked = false
  var afterCallback = null

  // ── Áudio ──
  // Gerencia AudioContext, ruído estático (bandpass filter),
  // tons sintetizados, rangido de porta (noise modulado) e
  // latido canino (sawtooth com wave shaper distortion).
  function getAudioCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }

  function createNoiseBuffer(ac) {
    var len = ac.sampleRate * 2
    var buf = ac.createBuffer(1, len, ac.sampleRate)
    var data = buf.getChannelData(0)
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buf
  }

  function startStatic(vol) {
    var ac = getAudioCtx()
    if (staticNode) stopStatic()
    var buf = createNoiseBuffer(ac)
    staticNode = ac.createBufferSource()
    staticNode.buffer = buf
    staticNode.loop = true
    staticGain = ac.createGain()
    staticGain.gain.value = vol || 0.15
    var filter = ac.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2000
    filter.Q.value = 0.5
    staticNode.connect(filter)
    filter.connect(staticGain)
    staticGain.connect(ac.destination)
    staticNode.start()
  }

  function setStaticVolume(vol) {
    if (staticGain) staticGain.gain.value = vol
  }

  function stopStatic() {
    try { if (staticNode) { staticNode.stop(); staticNode.disconnect() } } catch (e) {}
    try { if (staticGain) staticGain.disconnect() } catch (e) {}
    staticNode = null
    staticGain = null
  }

  function stopMusic() {
    try {
      window.playerAudio && window.playerAudio.pause()
      window.playerAudio && (window.playerAudio.currentTime = 0)
    } catch (e) {}
    var custom = new CustomEvent('horrorStopMusic')
    window.dispatchEvent(custom)
  }

  function setDim(alpha) {
    if (!dimEl) {
      dimEl = document.createElement('div')
      dimEl.id = 'horrorDim'
      dimEl.style.cssText = 'position:fixed;inset:0;z-index:9998;background:#000;pointer-events:none;transition:opacity 2s ease;opacity:0'
      document.body.appendChild(dimEl)
    }
    dimEl.style.opacity = Math.min(1, Math.max(0, alpha))
  }

  function fadeDim(from, to, duration, cb) {
    var start = performance.now()
    setDim(from)
    function tick() {
      var t = (performance.now() - start) / duration
      if (t >= 1) { setDim(to); if (cb) cb(); return }
      setDim(from + (to - from) * easeInOut(t))
      requestAnimationFrame(tick)
    }
    tick()
  }

  function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

  function createCanvasOverlay() {
    if (canvasEl) return
    canvasEl = document.createElement('canvas')
    canvasEl.id = 'horrorCanvas'
    canvasEl.style.cssText = 'position:fixed;inset:0;z-index:9999;display:none;cursor:default'
    document.body.appendChild(canvasEl)
    canvasCtx = canvasEl.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
  }

  function resizeCanvas() {
    if (!canvasEl) return
    canvasEl.width = window.innerWidth
    canvasEl.height = window.innerHeight
  }

  function playTone(ac, freq, duration, type, vol) {
    var osc = ac.createOscillator()
    var gain = ac.createGain()
    osc.type = type || 'sawtooth'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(vol || 0.3, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + duration)
  }

  function playCreakDoor() {
    var ac = getAudioCtx()
    var bufSize = ac.sampleRate * 0.6
    var buf = ac.createBuffer(1, bufSize, ac.sampleRate)
    var data = buf.getChannelData(0)
    for (var i = 0; i < bufSize; i++) {
      var t = i / ac.sampleRate
      data[i] = (Math.random() * 2 - 1) * (0.3 + 0.7 * Math.sin(t * 40)) * Math.max(0, 1 - t * 1.8)
    }
    var src = ac.createBufferSource()
    src.buffer = buf
    var gain = ac.createGain()
    gain.gain.setValueAtTime(0.4, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5)
    var filter = ac.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 800
    filter.Q.value = 2
    src.connect(filter)
    filter.connect(gain)
    gain.connect(ac.destination)
    src.start()
    setTimeout(function () { src.disconnect(); gain.disconnect(); filter.disconnect() }, 600)
  }

  function playDogBark() {
    var ac = getAudioCtx()
    var now = ac.currentTime
    for (var b = 0; b < 3; b++) {
      var tOff = b * 0.15
      var osc = ac.createOscillator()
      var gain = ac.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(300 + Math.random() * 100, now + tOff)
      osc.frequency.exponentialRampToValueAtTime(100 + Math.random() * 50, now + tOff + 0.2)
      gain.gain.setValueAtTime(0.5, now + tOff)
      gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.25)
      var distortion = ac.createWaveShaper()
      function makeDist() {
        var k = 4
        var n = 128
        var curve = new Float32Array(n)
        for (var i = 0; i < n; i++) {
          var x = (i * 2) / n - 1
          curve[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x))
        }
        return curve
      }
      distortion.curve = makeDist()
      osc.connect(distortion)
      distortion.connect(gain)
      gain.connect(ac.destination)
      osc.start(now + tOff)
      osc.stop(now + tOff + 0.25)
    }
  }

  // ── Canvas Tear Animation ──
  // Cria um canvas fullscreen e renderiza uma animação composta de:
  //   - Rachaduras orgânicas (cracks + branchCracks)
  //   - Glitch horizontal (VHS tracking effect)
  //   - Rasgo central com bordas irregulares e glow
  //   - Olhos vermelhos brilhantes no escuro
  //   - Patas digitais saindo do rasgo
  //   - Vignette escurecendo as bordas
  //   - VHS noise scanlines
  //   - Screen shake em fases específicas
  //   - Partículas (faíscas) na borda do rasgo
  // Ao final, chama callback() após fade para preto.
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  function easeOutElastic(t) {
    var c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }

  function animateTear(callback) {
    createCanvasOverlay()
    canvasEl.style.display = 'block'
    var w = canvasEl.width
    var h = canvasEl.height
    var startTime = performance.now()
    var duration = 3200
    var tearWidth = 0
    var shakeIntensity = 0
    var glitchFrames = 0
    var maxGlitchFrames = 12

    // Pre-generate crack system - organic branching cracks from center
    var cracks = []
    var branchCracks = []
    var maxCracks = 60
    for (var i = 0; i < maxCracks; i++) {
      var angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.5
      var len = 20 + Math.random() * 100
      var startX = w / 2 + (Math.random() - 0.5) * 60
      var startY = h / 2 + (Math.random() - 0.5) * h * 0.6
      cracks.push({
        sx: startX, sy: startY,
        dx: startX + Math.cos(angle) * len,
        dy: startY + Math.sin(angle) * len,
        len: len,
        delay: Math.random() * 0.5,
        speed: 0.4 + Math.random() * 0.6,
        width: 0.5 + Math.random() * 3
      })
      // Branch cracks off main cracks
      if (i % 2 === 0 && i > 5) {
        var bAngle = angle + (Math.random() - 0.5) * Math.PI * 0.7
        var bLen = 10 + Math.random() * 40
        var midX = (startX + cracks[cracks.length - 1].dx) / 2
        var midY = (startY + cracks[cracks.length - 1].dy) / 2
        branchCracks.push({
          sx: midX + (Math.random() - 0.5) * 20,
          sy: midY + (Math.random() - 0.5) * 20,
          dx: midX + Math.cos(bAngle) * bLen,
          dy: midY + Math.sin(bAngle) * bLen,
          delay: 0.3 + Math.random() * 0.4,
          speed: 0.5 + Math.random() * 0.5,
          width: 0.3 + Math.random() * 1
        })
      }
    }

    // Glitch effect lines
    var glitchLines = []
    for (var g = 0; g < 8; g++) {
      glitchLines.push({
        y: Math.random() * h,
        h: 2 + Math.random() * 8,
        xOff: (Math.random() - 0.5) * 20,
        alpha: 0.3 + Math.random() * 0.7,
        duration: 50 + Math.random() * 150,
        timer: 0
      })
    }

    function drawBackground(progress) {
      var c = canvasCtx
      // Dark ambient background
      var baseColor = 10 + Math.floor(progress * 5)
      c.fillStyle = 'rgb(' + baseColor + ',' + baseColor + ',' + (baseColor + 5) + ')'
      c.fillRect(0, 0, w, h)
    }

    function drawBaseContent(progress) {
      var c = canvasCtx
      // Content being torn - the last thing you see
      var grad = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6)
      grad.addColorStop(0, 'rgba(5,0,10,0)')
      grad.addColorStop(0.7, 'rgba(5,0,10,0.2)')
      grad.addColorStop(1, 'rgba(0,0,0,0.4)')
      c.fillStyle = grad
      c.fillRect(0, 0, w, h)
    }

    function drawGlitch(progress) {
      if (progress > 0.8) return
      var c = canvasCtx
      c.save()
      // Random horizontal offsets (VHS tracking effect)
      var glitchProb = 0.1 + progress * 0.3
      for (var i = 0; i < glitchLines.length; i++) {
        var gl = glitchLines[i]
        gl.timer++
        if (gl.timer > gl.duration) {
          gl.y = Math.random() * h
          gl.h = 2 + Math.random() * 6
          gl.xOff = (Math.random() - 0.5) * (15 + progress * 20)
          gl.alpha = 0.2 + Math.random() * 0.5
          gl.duration = 30 + Math.random() * 100
          gl.timer = 0
        }
        if (Math.random() < glitchProb * 0.08) {
          c.fillStyle = 'rgba(255,255,255,' + (gl.alpha * 0.3) + ')'
          c.fillRect(0, gl.y, w, gl.h)
          // Chromatic shift
          c.fillStyle = 'rgba(255,0,0,' + (gl.alpha * 0.15) + ')'
          c.fillRect(-gl.xOff * 0.5, gl.y, w, gl.h)
          c.fillStyle = 'rgba(0,100,255,' + (gl.alpha * 0.15) + ')'
          c.fillRect(gl.xOff * 0.5, gl.y, w, gl.h)
        }
      }
      // Random full-screen glitch flicker
      if (Math.random() < glitchProb * 0.15) {
        c.fillStyle = 'rgba(255,255,255,0.05)'
        c.fillRect(0, 0, w, h)
      }
      c.restore()
    }

    function drawCracks(progress) {
      var c = canvasCtx
      // Purple glow behind cracks
      c.shadowColor = 'rgba(100,0,60,0.3)'
      c.shadowBlur = 8

      // Draw main cracks
      for (var i = 0; i < cracks.length; i++) {
        var cr = cracks[i]
        var pct = Math.max(0, Math.min(1, (progress - cr.delay) * cr.speed * 1.5))
        if (pct <= 0) continue
        var cx = cr.sx + (cr.dx - cr.sx) * pct
        var cy = cr.sy + (cr.dy - cr.sy) * pct
        // Glow trail
        var alpha = 0.3 + progress * 0.4
        c.strokeStyle = 'rgba(120,20,80,' + (alpha * pct) + ')'
        c.lineWidth = cr.width + progress * 1.5
        c.beginPath()
        c.moveTo(cr.sx, cr.sy)
        c.lineTo(cx, cy)
        c.stroke()
        // Inner bright core
        c.strokeStyle = 'rgba(200,80,150,' + (alpha * 0.5 * pct) + ')'
        c.lineWidth = 0.5
        c.beginPath()
        c.moveTo(cr.sx, cr.sy)
        c.lineTo(cx, cy)
        c.stroke()
      }

      // Draw branch cracks
      for (var j = 0; j < branchCracks.length; j++) {
        var bc = branchCracks[j]
        var bpct = Math.max(0, Math.min(1, (progress - bc.delay) * bc.speed))
        if (bpct <= 0) continue
        var bcx = bc.sx + (bc.dx - bc.sx) * bpct
        var bcy = bc.sy + (bc.dy - bc.sy) * bpct
        c.strokeStyle = 'rgba(80,15,50,' + (0.3 * bpct) + ')'
        c.lineWidth = bc.width
        c.beginPath()
        c.moveTo(bc.sx, bc.sy)
        c.lineTo(bcx, bcy)
        c.stroke()
      }
      c.shadowBlur = 0
    }

    function drawTear(progress) {
      var c = canvasCtx
      var maxWidth = w * 0.65
      // Use elastic easing for a more violent tear
      var ripProg = Math.min(1, progress * 1.2)
      var tearEase = ripProg < 0.7
        ? easeInOutCubic(ripProg / 0.7) * 0.5
        : 0.5 + easeOutElastic((ripProg - 0.7) / 0.3) * 0.5
      tearWidth = maxWidth * tearEase
      var leftEdge = w / 2 - tearWidth / 2
      var rightEdge = w / 2 + tearWidth / 2

      // Deep void glow - expanding darkness
      var voidAlpha = Math.min(1, progress * 1.5)
      var vg = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, tearWidth * 1.5)
      vg.addColorStop(0, 'rgba(0,0,0,' + (0.8 * voidAlpha) + ')')
      vg.addColorStop(0.3, 'rgba(5,0,10,' + (0.6 * voidAlpha) + ')')
      vg.addColorStop(0.6, 'rgba(15,0,20,' + (0.3 * voidAlpha) + ')')
      vg.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = vg
      c.fillRect(0, 0, w, h)

      // Tear edge glow
      var edgeColor = Math.min(255, 60 + Math.floor(progress * 100))
      var eg = c.createLinearGradient(leftEdge - 15, 0, leftEdge + 15, 0)
      eg.addColorStop(0, 'rgba(0,0,0,0)')
      eg.addColorStop(0.3, 'rgba(' + edgeColor + ',0,' + Math.floor(edgeColor * 0.6) + ',' + (0.5 * voidAlpha) + ')')
      eg.addColorStop(0.7, 'rgba(' + edgeColor + ',0,' + Math.floor(edgeColor * 0.6) + ',' + (0.5 * voidAlpha) + ')')
      eg.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = eg
      c.fillRect(leftEdge - 15, 0, 30, h)

      var eg2 = c.createLinearGradient(rightEdge - 15, 0, rightEdge + 15, 0)
      eg2.addColorStop(0, 'rgba(0,0,0,0)')
      eg2.addColorStop(0.3, 'rgba(' + edgeColor + ',0,' + Math.floor(edgeColor * 0.6) + ',' + (0.5 * voidAlpha) + ')')
      eg2.addColorStop(0.7, 'rgba(' + edgeColor + ',0,' + Math.floor(edgeColor * 0.6) + ',' + (0.5 * voidAlpha) + ')')
      eg2.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = eg2
      c.fillRect(rightEdge - 15, 0, 30, h)

      // The tear hole - jagged organic edges
      var segments = 50
      var segH = h / segments
      // Dark jagged shape
      c.fillStyle = '#000'
      c.beginPath()
      c.moveTo(leftEdge, 0)
      for (var s = 0; s <= segments; s++) {
        var sy = s * segH
        var jitter = (Math.random() - 0.5) * 12 * (0.5 + progress)
        c.lineTo(leftEdge + jitter, sy)
      }
      c.lineTo(rightEdge, h)
      for (var s2 = segments; s2 >= 0; s2--) {
        var sy2 = s2 * segH
        var jitter2 = (Math.random() - 0.5) * 12 * (0.5 + progress)
        c.lineTo(rightEdge + jitter2, sy2)
      }
      c.closePath()
      c.fill()

      // Pure void interior
      c.fillStyle = '#000'
      c.fillRect(leftEdge + 6, 1, tearWidth - 12, h - 3)

      // Bright edge highlights on torn "fabric"
      c.strokeStyle = 'rgba(180,60,120,' + (0.4 * voidAlpha) + ')'
      c.lineWidth = 1.5
      c.beginPath()
      for (var h1 = 0; h1 < h; h1 += 4) {
        var j1 = (Math.random() - 0.5) * 4
        if (h1 === 0) c.moveTo(leftEdge + j1, h1)
        else c.lineTo(leftEdge + j1, h1)
      }
      c.stroke()
      c.beginPath()
      for (var h2 = 0; h2 < h; h2 += 4) {
        var j2 = (Math.random() - 0.5) * 4
        if (h2 === 0) c.moveTo(rightEdge + j2, h2)
        else c.lineTo(rightEdge + j2, h2)
      }
      c.stroke()

      // Particle sparks at tear edges
      if (progress > 0.3 && progress < 0.95) {
        var sparkCount = Math.floor(5 + progress * 15)
        for (var sp = 0; sp < sparkCount; sp++) {
          var sparkX = leftEdge + (Math.random() - 0.5) * 20
          var sparkY = Math.random() * h
          var sparkSize = 0.5 + Math.random() * 2
          var sparkAlpha = Math.random() * 0.6 * voidAlpha
          c.fillStyle = 'rgba(200,100,150,' + sparkAlpha + ')'
          c.fillRect(sparkX, sparkY, sparkSize, sparkSize)
          // Blue spark
          if (Math.random() > 0.7) {
            c.fillStyle = 'rgba(100,150,255,' + (sparkAlpha * 0.5) + ')'
            c.fillRect(sparkX + (Math.random() - 0.5) * 8, sparkY + (Math.random() - 0.5) * 4, sparkSize * 0.5, sparkSize * 0.5)
          }
        }
      }
    }

    function drawPaw(cx, cy, size, side) {
      var c = canvasCtx
      c.save()
      c.translate(cx, cy)
      c.scale(side, 1)
      var s = size
      // Shadow/depth under paw
      c.shadowColor = 'rgba(200,0,0,0.2)'
      c.shadowBlur = 15

      // Main paw pad body
      c.fillStyle = '#1a0808'
      c.strokeStyle = '#300000'
      c.lineWidth = 2
      c.beginPath()
      c.ellipse(0, 0, s * 0.5, s * 0.55, 0, 0, Math.PI * 2)
      c.fill()
      c.stroke()

      // Main pad (center)
      c.fillStyle = '#2a0e0e'
      c.beginPath()
      c.ellipse(0, s * 0.05, s * 0.2, s * 0.18, 0, 0, Math.PI * 2)
      c.fill()

      // Digital toes
      for (var i = -2; i <= 2; i++) {
        var tx = i * s * 0.14
        var ty = -s * 0.35 + Math.abs(i) * s * 0.03
        c.fillStyle = '#1a0606'
        c.beginPath()
        c.ellipse(tx, ty, s * 0.09, s * 0.14, 0.1, 0, Math.PI * 2)
        c.fill()
        // Claw
        c.fillStyle = '#222'
        c.strokeStyle = '#444'
        c.lineWidth = 0.5
        c.beginPath()
        c.ellipse(tx, ty - s * 0.13, s * 0.02, s * 0.055, 0, 0, Math.PI * 2)
        c.fill()
        c.stroke()
      }
      // Skin creases
      c.strokeStyle = 'rgba(60,5,5,0.4)'
      c.lineWidth = 0.8
      for (var j = -1; j <= 1; j++) {
        c.beginPath()
        c.moveTo(j * s * 0.08, s * 0.02)
        c.quadraticCurveTo(j * s * 0.1, s * 0.1, j * s * 0.12, s * 0.18)
        c.stroke()
      }
      c.shadowBlur = 0
      c.restore()
    }

    function drawPaws(progress) {
      var c = canvasCtx
      var maxWidth = w * 0.65
      // Paws emerge from the tear edges
      var pawPhase = Math.max(0, (progress - 0.25) / 0.55)
      var pawReveal = easeInOutCubic(Math.min(1, pawPhase * 1.8))

      var tearW = maxWidth * 0.9
      var leftEdge = w / 2 - tearW / 2
      var rightEdge = w / 2 + tearW / 2

      // Paws emerge from within the tear
      var pawXOff = (1 - pawReveal) * 60
      var lpX = leftEdge + 10 + pawXOff
      var rpX = rightEdge - 10 - pawXOff
      var pawY = h / 2 + Math.sin(progress * Math.PI * 2) * 8
      var pawS = 60 + 50 * pawReveal

      // Shadow glow behind paws
      c.shadowColor = 'rgba(150,0,0,0.15)'
      c.shadowBlur = 25 * pawReveal

      drawPaw(lpX, pawY, pawS, 1)
      drawPaw(rpX, pawY, pawS, -1)

      c.shadowBlur = 0
    }

    function drawEyes(progress) {
      if (progress < 0.45) return
      var c = canvasCtx
      var eyeAlpha = easeInOutCubic(Math.min(1, (progress - 0.45) / 0.3))
      var eyeGlow = Math.min(1, (progress - 0.45) / 0.2)
      var eyeY = h * 0.38 + Math.sin(progress * 3) * 5
      var eyeSpacing = 50 + Math.sin(progress * 2) * 10

      // Glowing aura
      c.shadowColor = 'rgba(200,0,0,0.8)'
      c.shadowBlur = 40 * eyeGlow

      for (var ei = -1; ei <= 1; ei += 2) {
        var ex = w / 2 + ei * eyeSpacing
        var ey = eyeY

        // Outer glow
        var og = c.createRadialGradient(ex, ey, 0, ex, ey, 25 * eyeAlpha)
        og.addColorStop(0, 'rgba(200,20,20,' + (0.4 * eyeAlpha) + ')')
        og.addColorStop(0.5, 'rgba(150,0,0,' + (0.2 * eyeAlpha) + ')')
        og.addColorStop(1, 'rgba(100,0,0,0)')
        c.fillStyle = og
        c.fillRect(ex - 30, ey - 30, 60, 60)

        // Eye white (red)
        c.fillStyle = 'rgba(180,10,10,' + eyeAlpha + ')'
        c.beginPath()
        c.ellipse(ex, ey, 14 * eyeAlpha, 10 * eyeAlpha, 0, 0, Math.PI * 2)
        c.fill()

        // Pupil
        c.fillStyle = 'rgba(0,0,0,' + eyeAlpha + ')'
        c.beginPath()
        c.ellipse(ex + ei * 3, ey, 5 * eyeAlpha, 8 * eyeAlpha, 0, 0, Math.PI * 2)
        c.fill()

        // Pupil glint
        c.fillStyle = 'rgba(255,150,150,' + (0.3 * eyeAlpha) + ')'
        c.beginPath()
        c.ellipse(ex - ei * 2, ey - 2, 2 * eyeAlpha, 3 * eyeAlpha, 0, 0, Math.PI * 2)
        c.fill()
      }
      c.shadowBlur = 0
    }

    function drawVignette(progress) {
      var c = canvasCtx
      var vAlpha = 0.3 + progress * 0.4
      var vg = c.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.8)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(0.5, 'rgba(0,0,0,' + (vAlpha * 0.3) + ')')
      vg.addColorStop(1, 'rgba(0,0,0,' + vAlpha + ')')
      c.fillStyle = vg
      c.fillRect(0, 0, w, h)
    }

    function drawVHSNoise(progress) {
      if (progress > 0.9) return
      var c = canvasCtx
      var noiseAlpha = 0.03 + progress * 0.06
      for (var i = 0; i < 4; i++) {
        if (Math.random() > 0.08) continue
        var ny = Math.random() * h
        var nh = 1 + Math.random() * 3
        c.fillStyle = 'rgba(255,255,255,' + (noiseAlpha * Math.random()) + ')'
        c.fillRect(0, ny, w, nh)
      }
    }

    function animate() {
      var elapsed = performance.now() - startTime
      var progress = Math.min(1, elapsed / duration)

      // Clear with slight motion blur trail
      canvasCtx.fillStyle = 'rgba(0,0,0,0.15)'
      canvasCtx.fillRect(0, 0, w, h)

      drawBackground(progress)
      drawBaseContent(progress)
      drawGlitch(progress)
      drawCracks(progress)
      drawTear(progress)
      drawVignette(progress)
      drawEyes(progress)
      drawPaws(progress)
      drawVHSNoise(progress)

      // Screen shake via canvas transform
      var shake = 0
      if (progress < 0.3) shake = progress * 8
      else if (progress < 0.65) shake = 1.5 + Math.sin(progress * 50 + elapsed * 0.01) * (0.8 + (progress - 0.3) * 3)
      else if (progress < 0.85) shake = Math.max(0, 3 - (progress - 0.65) * 15)
      if (shake > 1) {
        canvasCtx.fillStyle = 'rgba(0,0,0,' + (shake * 0.01) + ')'
        canvasCtx.fillRect(0, 0, w, h)
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Final black - fade to pure void
        canvasCtx.fillStyle = '#000'
        canvasCtx.fillRect(0, 0, w, h)
        // Brief flash before black
        if (callback) {
          setTimeout(function () { callback() }, 600)
        }
      }
    }
    animate()
  }

  // ── Egg State Management ──
  // Controla o estado do easter egg (isEggActive / start / end),
  // trava o chat da Shiva durante a sequência final e gerencia
  // o contador de passos (eggStep) que shiva.js avança a cada
  // interação para reproduzir EGG_SEQUENCE.
  function lockChat() {
    chatLocked = true
    var input = document.getElementById('shivaInput')
    var send = document.getElementById('shivaSend')
    if (input) { input.disabled = true; input.placeholder = '...' }
    if (send) send.disabled = true
  }

  function isChatLocked() { return chatLocked }

  function isEggActive() { return eggActive }

  function startEgg() { eggActive = true }

  function endEgg() { eggActive = false }

  var eggStep = 0
  var stepCallbacks = []

  function setStepCallbacks(cbs) { stepCallbacks = cbs }

  function getEggStep() { return eggStep }

  function advanceEgg() {
    eggStep++
    return eggStep
  }

  function setEggStep(s) { eggStep = s }

  function doAfterEgg(cb) { afterCallback = cb }

  function triggerAfter() {
    if (afterCallback) {
      var cb = afterCallback
      afterCallback = null
      cb()
    }
  }

  // ── Expose para shiva.js ──
  window.Horror = {
    startStatic: startStatic,
    setStaticVolume: setStaticVolume,
    stopStatic: stopStatic,
    stopMusic: stopMusic,
    setDim: setDim,
    fadeDim: fadeDim,
    createCanvasOverlay: createCanvasOverlay,
    playCreakDoor: playCreakDoor,
    playDogBark: playDogBark,
    animateTear: animateTear,
    lockChat: lockChat,
    isChatLocked: isChatLocked,
    isEggActive: isEggActive,
    startEgg: startEgg,
    endEgg: endEgg,
    getEggStep: getEggStep,
    advanceEgg: advanceEgg,
    setEggStep: setEggStep,
    setStepCallbacks: setStepCallbacks,
    doAfterEgg: doAfterEgg,
    triggerAfter: triggerAfter
  }
})()
