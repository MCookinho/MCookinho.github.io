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

  function animateTear(callback) {
    createCanvasOverlay()
    canvasEl.style.display = 'block'
    var w = canvasEl.width
    var h = canvasEl.height
    var startTime = performance.now()
    var duration = 2500
    var paws = []
    var tearY = h / 2
    var tearWidth = 0
    var glow = 0
    var crackLines = []
    var maxCracks = 40
    for (var i = 0; i < maxCracks; i++) {
      crackLines.push({
        x: w / 2 + (Math.random() - 0.5) * w * 0.8,
        y: Math.random() * h,
        len: 10 + Math.random() * 60,
        angle: -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.3,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2
      })
    }
    var pawTeeth = []
    for (var p = 0; p < 18; p++) {
      var side = p < 9 ? -1 : 1
      var idx = p < 9 ? p : p - 9
      pawTeeth.push({
        side: side,
        y: (idx / 9) * h + (Math.random() - 0.5) * 30,
        xOff: side * (30 + Math.random() * 40),
        size: 20 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2
      })
    }
    var dogPawLeft = { x: w * 0.25, y: h * 0.3, size: 120, grabY: h / 2, revealed: false }
    var dogPawRight = { x: w * 0.75, y: h * 0.3, size: 120, grabY: h / 2, revealed: false }

    function drawPaw(cx, cy, size, side) {
      var c = canvasCtx
      c.save()
      c.translate(cx, cy)
      c.scale(side, 1)
      var s = size
      c.fillStyle = '#1a0a0a'
      c.strokeStyle = '#2a0000'
      c.lineWidth = 3
      c.beginPath()
      c.ellipse(0, 0, s * 0.5, s * 0.55, 0, 0, Math.PI * 2)
      c.fill()
      c.stroke()
      // Main pad
      c.fillStyle = '#2a1010'
      c.beginPath()
      c.ellipse(0, s * 0.05, s * 0.2, s * 0.18, 0, 0, Math.PI * 2)
      c.fill()
      // Toes
      for (var i = -2; i <= 2; i++) {
        var tx = i * s * 0.14
        var ty = -s * 0.35 + Math.abs(i) * s * 0.03
        c.fillStyle = '#1a0808'
        c.beginPath()
        c.ellipse(tx, ty, s * 0.08, s * 0.13, 0.1, 0, Math.PI * 2)
        c.fill()
        // Claw
        c.fillStyle = '#333'
        c.beginPath()
        c.ellipse(tx, ty - s * 0.12, s * 0.025, s * 0.05, 0, 0, Math.PI * 2)
        c.fill()
      }
      // Creases
      c.strokeStyle = 'rgba(60,10,10,0.3)'
      c.lineWidth = 1
      for (var j = -1; j <= 1; j++) {
        c.beginPath()
        c.moveTo(j * s * 0.08, s * 0.02)
        c.lineTo(j * s * 0.12, s * 0.16)
        c.stroke()
      }
      c.restore()
    }

    function drawBackground() {
      var c = canvasCtx
      // Screen content (what's being torn)
      c.fillStyle = '#0a0a0f'
      c.fillRect(0, 0, w, h)
      // CRT scanlines on the remaining screen
      for (var i = 0; i < h; i += 3) {
        c.fillStyle = 'rgba(0,0,0,0.1)'
        c.fillRect(0, i, w, 1)
      }
      // Cracked glass effect around tear
      var grad = c.createRadialGradient(w / 2, tearY, 0, w / 2, tearY, tearWidth * 2)
      grad.addColorStop(0, 'rgba(0,0,0,0)')
      grad.addColorStop(0.5, 'rgba(10,0,20,0.3)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = grad
      c.fillRect(0, 0, w, h)
    }

    function drawCracks(progress) {
      var c = canvasCtx
      c.strokeStyle = 'rgba(80,20,60,' + (0.3 + progress * 0.5) + ')'
      c.lineWidth = 1.5
      var active = Math.floor(progress * maxCracks)
      for (var i = 0; i < active && i < crackLines.length; i++) {
        var cr = crackLines[i]
        var pct = Math.min(1, (progress - i / maxCracks) * 3)
        if (pct <= 0) continue
        c.beginPath()
        c.moveTo(cr.x, cr.y)
        var ex = cr.x + Math.cos(cr.angle) * cr.len * pct
        var ey = cr.y + Math.sin(cr.angle) * cr.len * pct
        c.lineTo(ex, ey)
        c.stroke()
        // Branch cracks
        if (pct > 0.5 && i % 3 === 0) {
          c.strokeStyle = 'rgba(60,15,40,' + (0.15 + progress * 0.2) + ')'
          c.lineWidth = 0.8
          c.beginPath()
          c.moveTo(ex, ey)
          c.lineTo(ex + (Math.random() - 0.5) * 30, ey + (Math.random() - 0.5) * 30)
          c.stroke()
          c.strokeStyle = 'rgba(80,20,60,' + (0.3 + progress * 0.5) + ')'
          c.lineWidth = 1.5
        }
      }
    }

    function drawTear(progress) {
      var c = canvasCtx
      var maxWidth = w * 0.55
      tearWidth = maxWidth * easeOutBack(progress)
      var leftEdge = w / 2 - tearWidth / 2
      var rightEdge = w / 2 + tearWidth / 2
      // Glow behind tear
      glow = progress
      var g = c.createRadialGradient(w / 2, tearY, 0, w / 2, tearY, tearWidth * 1.2)
      g.addColorStop(0, 'rgba(20,0,30,' + (0.4 * progress) + ')')
      g.addColorStop(0.5, 'rgba(10,0,15,' + (0.2 * progress) + ')')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = g
      c.fillRect(leftEdge - 40, 0, tearWidth + 80, h)
      // The tear itself - jagged edges
      var segments = 40
      var segH = h / segments
      // Left edge
      c.fillStyle = '#000'
      c.beginPath()
      c.moveTo(leftEdge, 0)
      for (var s = 0; s <= segments; s++) {
        var sy = s * segH
        var jitter = (Math.random() - 0.5) * 8 * (1 + progress)
        c.lineTo(leftEdge + jitter, sy)
      }
      c.lineTo(rightEdge, h)
      for (var s2 = segments; s2 >= 0; s2--) {
        var sy2 = s2 * segH
        var jitter2 = (Math.random() - 0.5) * 8 * (1 + progress)
        c.lineTo(rightEdge + jitter2, sy2)
      }
      c.closePath()
      c.fill()
      // Void inside tear - pure black hole
      c.fillStyle = '#000'
      c.fillRect(leftEdge + 4, 2, tearWidth - 8, h - 4)
      // Purple glow edges on the tear
      var eg = c.createLinearGradient(leftEdge - 10, 0, leftEdge + 10, 0)
      eg.addColorStop(0, 'rgba(0,0,0,0)')
      eg.addColorStop(0.5, 'rgba(100,0,60,' + (0.3 * progress) + ')')
      eg.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = eg
      c.fillRect(leftEdge - 10, 0, 20, h)
      var eg2 = c.createLinearGradient(rightEdge - 10, 0, rightEdge + 10, 0)
      eg2.addColorStop(0, 'rgba(0,0,0,0)')
      eg2.addColorStop(0.5, 'rgba(100,0,60,' + (0.3 * progress) + ')')
      eg2.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = eg2
      c.fillRect(rightEdge - 10, 0, 20, h)
    }

    function easeOutBack(t) {
      var c1 = 1.70158
      var c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }

    var pawRevealProgress = 0

    function drawPaws(progress) {
      var c = canvasCtx
      var maxWidth = w * 0.55
      var leftEdge = w / 2 - maxWidth / 2
      var rightEdge = w / 2 + maxWidth / 2
      // Paws come from sides
      var pawAppear = Math.max(0, (progress - 0.3) / 0.5)
      var pawReveal = easeOutBack(Math.min(1, pawAppear * 1.5))
      var lpX = leftEdge + 10
      var rpX = rightEdge - 10
      var pawY = h / 2 - 10
      var pawS = 80 + 30 * pawReveal

      // Shadow behind paws
      c.fillStyle = 'rgba(0,0,0,0.3)'
      c.beginPath()
      c.ellipse(lpX + 5, pawY + 5, pawS * 0.5, pawS * 0.55, 0, 0, Math.PI * 2)
      c.fill()
      c.beginPath()
      c.ellipse(rpX - 5, pawY + 5, pawS * 0.5, pawS * 0.55, 0, 0, Math.PI * 2)
      c.fill()

      // Paw details glowing eyes in the void
      if (progress > 0.6) {
        var eyeAlpha = Math.min(1, (progress - 0.6) / 0.3)
        c.fillStyle = 'rgba(200,20,20,' + eyeAlpha + ')'
        var eyeY = h * 0.4
        var eyeSpacing = 40
        // Glowing red eyes in the darkness of the tear
        for (var ei = -1; ei <= 1; ei += 2) {
          c.shadowColor = '#f00'
          c.shadowBlur = 20 * eyeAlpha
          c.beginPath()
          c.ellipse(w / 2 + ei * eyeSpacing, eyeY, 12 * eyeAlpha, 8 * eyeAlpha, 0, 0, Math.PI * 2)
          c.fill()
          c.shadowBlur = 0
          // Pupil
          c.fillStyle = 'rgba(0,0,0,' + eyeAlpha + ')'
          c.beginPath()
          c.ellipse(w / 2 + ei * eyeSpacing + ei * 3, eyeY, 4 * eyeAlpha, 6 * eyeAlpha, 0, 0, Math.PI * 2)
          c.fill()
          c.fillStyle = 'rgba(200,20,20,' + eyeAlpha + ')'
        }
        c.shadowBlur = 0
      }

      drawPaw(lpX, pawY, pawS, 1)
      drawPaw(rpX, pawY, pawS, -1)
    }

    function animate() {
      var elapsed = performance.now() - startTime
      var progress = Math.min(1, elapsed / duration)
      drawBackground()
      drawTear(progress)
      drawCracks(progress)
      drawPaws(progress)
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Final black
        setTimeout(function () {
          canvasCtx.fillStyle = '#000'
          canvasCtx.fillRect(0, 0, w, h)
          setTimeout(function () {
            if (callback) callback()
          }, 800)
        }, 400)
      }
    }
    animate()
  }

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

  // Called from shiva.js
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
