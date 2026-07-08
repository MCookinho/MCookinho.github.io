(function () {
  var songs = [
    { id: 1,  title: 'PIXEL DREAMS',       file: 'track01.mp3', dur: '3:30' },
    { id: 2,  title: 'NEON NIGHTS',        file: 'track02.mp3', dur: '4:12' },
    { id: 3,  title: 'RETRO WAVE',         file: 'track03.mp3', dur: '3:45' },
    { id: 4,  title: 'CHIP TUNE SUNRISE',  file: 'track04.mp3', dur: '2:58' },
    { id: 5,  title: 'MIDNIGHT CODE',      file: 'track05.mp3', dur: '4:01' },
    { id: 6,  title: 'CAFÉ E BIT',         file: 'track06.mp3', dur: '3:22' },
    { id: 7,  title: 'TERMINAL LOVE',      file: 'track07.mp3', dur: '3:55' },
    { id: 8,  title: '8-BIT SOUL',         file: 'track08.mp3', dur: '2:44' },
    { id: 9,  title: 'VOID WALKER',        file: 'track09.mp3', dur: '4:30' },
    { id: 10, title: 'CYBER CITY',         file: 'track10.mp3', dur: '3:18' },
    { id: 11, title: 'LATE NIGHT LOOP',    file: 'track11.mp3', dur: '5:02' },
    { id: 12, title: 'GLITCH GARDEN',      file: 'track12.mp3', dur: '3:36' },
    { id: 13, title: 'SHIVA WALK',         file: 'track13.mp3', dur: '4:15' },
    { id: 14, title: 'PURPLE SKIES',       file: 'track14.mp3', dur: '3:42' },
    { id: 15, title: 'ARCADE AFTERNOON',   file: 'track15.mp3', dur: '2:30' },
    { id: 16, title: 'HEXAGON',            file: 'track16.mp3', dur: '4:48' },
    { id: 17, title: 'BOSS FIGHT',         file: 'track17.mp3', dur: '3:08' },
    { id: 18, title: 'MENU SCREEN',        file: 'track18.mp3', dur: '2:55' },
    { id: 19, title: 'RAINY BYTES',        file: 'track19.mp3', dur: '5:20' },
    { id: 20, title: 'CURSOR BLINK',       file: 'track20.mp3', dur: '3:14' },
    { id: 21, title: 'DUNGEON DEPTHS',     file: 'track21.mp3', dur: '4:05' },
    { id: 22, title: 'STARFIELD',          file: 'track22.mp3', dur: '6:00' },
    { id: 23, title: 'PASSWORD SCREEN',    file: 'track23.mp3', dur: '2:18' },
    { id: 24, title: 'FINAL LEVEL',        file: 'track24.mp3', dur: '4:33' },
    { id: 25, title: 'CRT NOISE',          file: 'track25.mp3', dur: '3:50' },
    { id: 26, title: 'SHELL GAME',         file: 'track26.mp3', dur: '3:27' },
    { id: 27, title: 'EMPTY ROOM',         file: 'track27.mp3', dur: '4:44' },
    { id: 28, title: 'LOADING...',         file: 'track28.mp3', dur: '1:55' },
    { id: 29, title: 'SECRET AREA',        file: 'track29.mp3', dur: '5:10' },
    { id: 30, title: 'CREDITS SCROLL',     file: 'track30.mp3', dur: '6:30' },
    { id: 31, title: 'BOOT SEQUENCE',      file: 'track31.mp3', dur: '2:40' },
    { id: 32, title: 'OVERWORLD',          file: 'track32.mp3', dur: '4:22' },
    { id: 33, title: 'CAOS ORGANIZADO',    file: 'track33.mp3', dur: '3:48' },
    { id: 34, title: 'LOOP INFINITO',      file: 'track34.mp3', dur: '5:15' },
  ]

  var audio = document.getElementById('playerAudio')
  var overlay = document.getElementById('musicOverlay')
  var listEl = document.getElementById('musicList')
  var playerBar = document.getElementById('playerBar')
  var cdBtn = document.getElementById('cdBtn')
  var cdIcon = document.getElementById('cdIcon')
  var cdNowPlaying = document.getElementById('cdNowPlaying')
  var playerCdMini = document.getElementById('playerCdMini')
  var playerSongName = document.getElementById('playerSongName')
  var playerArtistName = document.getElementById('playerArtistName')
  var playerPlay = document.getElementById('playerPlay')
  var playerPrev = document.getElementById('playerPrev')
  var playerNext = document.getElementById('playerNext')
  var playerRestart = document.getElementById('playerRestart')
  var playerSpeed = document.getElementById('playerSpeed')
  var playerProgress = document.getElementById('playerProgress')
  var playerProgressFill = document.getElementById('playerProgressFill')
  var playerCurrentTime = document.getElementById('playerCurrentTime')
  var playerDuration = document.getElementById('playerDuration')
  var musicClose = document.getElementById('musicClose')

  var currentIndex = -1
  var isPlaying = false
  var playbackRate = 1
  var speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]
  var speedIndex = 2
  var progressInterval = null
  var overlayOpen = false

  function pad(n) {
    return n < 10 ? '0' + n : '' + n
  }

  function formatTime(s) {
    if (isNaN(s) || !isFinite(s)) return '0:00'
    var m = Math.floor(s / 60)
    var sec = Math.floor(s % 60)
    return m + ':' + pad(sec)
  }

  function renderList() {
    listEl.innerHTML = ''
    songs.forEach(function (song, i) {
      var item = document.createElement('div')
      item.className = 'music-item'
      if (i === currentIndex) item.classList.add('active')
      item.innerHTML =
        '<span class="music-item-num">' + pad(i + 1) + '</span>' +
        '<div class="music-item-info">' +
          '<span class="music-item-title">' + song.title + '</span>' +
        '</div>' +
        '<span class="music-item-duration">' + song.dur + '</span>' +
        '<span class="music-item-play">' + (i === currentIndex && isPlaying ? '▶' : '♪') + '</span>'
      item.addEventListener('click', function () {
        playSong(i)
      })
      listEl.appendChild(item)
    })
  }

  function playSong(index, auto) {
    if (index < 0 || index >= songs.length) return
    currentIndex = index

    audio.src = 'assets/music/' + songs[index].file
    audio.load()
    audio.play().then(function () {
      isPlaying = true
      updateUI()
      startProgress()
      showPlayerBar()
      closeOverlay()
    }).catch(function () {
      isPlaying = false
      updateUI()
      closeOverlay()
    })
  }

  function togglePlay() {
    if (currentIndex < 0) {
      playSong(0)
      return
    }
    if (audio.paused) {
      audio.play().then(function () {
        isPlaying = true
        updateUI()
        startProgress()
      }).catch(function () {})
    } else {
      audio.pause()
      isPlaying = false
      updateUI()
      stopProgress()
    }
  }

  function prevSong() {
    if (currentIndex <= 0) return
    playSong(currentIndex - 1)
  }

  function nextSong() {
    if (currentIndex >= songs.length - 1) return
    playSong(currentIndex + 1)
  }

  function restartSong() {
    if (currentIndex < 0) return
    audio.currentTime = 0
    if (audio.paused) {
      audio.play().then(function () {
        isPlaying = true
        updateUI()
        startProgress()
      }).catch(function () {})
    }
  }

  function cycleSpeed() {
    speedIndex = (speedIndex + 1) % speedOptions.length
    playbackRate = speedOptions[speedIndex]
    audio.playbackRate = playbackRate
    playerSpeed.textContent = playbackRate + '\u00D7'
  }

  function startProgress() {
    stopProgress()
    progressInterval = setInterval(updateProgress, 100)
  }

  function stopProgress() {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
  }

  function updateProgress() {
    if (!audio.duration || isNaN(audio.duration)) {
      playerCurrentTime.textContent = formatTime(audio.currentTime)
      if (currentIndex >= 0 && songs[currentIndex]) {
        playerDuration.textContent = songs[currentIndex].dur
      } else {
        playerDuration.textContent = '0:00'
      }
      return
    }
    var pct = (audio.currentTime / audio.duration) * 100
    playerProgressFill.style.width = Math.min(pct, 100) + '%'
    playerCurrentTime.textContent = formatTime(audio.currentTime)
    playerDuration.textContent = formatTime(audio.duration)
  }

  function updateUI() {
    // CD icon in navbar
    if (isPlaying) {
      cdIcon.classList.remove('cd-paused')
      cdIcon.classList.add('cd-spin')
      playerCdMini.classList.remove('paused')
      playerCdMini.classList.add('spin')
    } else if (currentIndex >= 0) {
      cdIcon.classList.add('cd-paused')
      playerCdMini.classList.add('paused')
    } else {
      cdIcon.classList.remove('cd-spin', 'cd-paused')
      playerCdMini.classList.remove('spin', 'paused')
    }

    // Now playing text
    if (currentIndex >= 0) {
      cdNowPlaying.textContent = songs[currentIndex].title
      cdNowPlaying.classList.add('visible')
      playerSongName.textContent = songs[currentIndex].title
    } else {
      cdNowPlaying.classList.remove('visible')
      playerSongName.textContent = 'NENHUMA MÚSICA'
    }

    // Play button
    playerPlay.textContent = isPlaying ? '⏸' : '▶'

    // Speed button
    playerSpeed.textContent = playbackRate + '\u00D7'

    // Active item in list
    var items = listEl.querySelectorAll('.music-item')
    items.forEach(function (item, i) {
      item.classList.toggle('active', i === currentIndex)
      var playIcon = item.querySelector('.music-item-play')
      if (playIcon) {
        playIcon.textContent = (i === currentIndex && isPlaying) ? '▶' : '♪'
      }
    })
  }

  function showPlayerBar() {
    playerBar.classList.add('open')
  }

  function hidePlayerBar() {
    playerBar.classList.remove('open')
  }

  function toggleOverlay() {
    overlayOpen = !overlayOpen
    if (overlayOpen) {
      overlay.classList.add('open')
      renderList()
    } else {
      overlay.classList.remove('open')
    }
  }

  function closeOverlay() {
    overlayOpen = false
    overlay.classList.remove('open')
  }

  // Audio ended
  audio.addEventListener('ended', function () {
    if (currentIndex < songs.length - 1) {
      playSong(currentIndex + 1, true)
    } else {
      isPlaying = false
      updateUI()
      stopProgress()
    }
  })

  // Audio error
  audio.addEventListener('error', function () {
    isPlaying = false
    updateUI()
    stopProgress()
  })

  // Metadata loaded
  audio.addEventListener('loadedmetadata', function () {
    playerDuration.textContent = formatTime(audio.duration)
  })

  // Click CD button -> toggle overlay
  cdBtn.addEventListener('click', toggleOverlay)

  // Close overlay
  musicClose.addEventListener('click', closeOverlay)

  // Click outside panel to close
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeOverlay()
  })

  // Player controls
  playerPlay.addEventListener('click', togglePlay)
  playerPrev.addEventListener('click', prevSong)
  playerNext.addEventListener('click', nextSong)
  playerRestart.addEventListener('click', restartSong)
  playerSpeed.addEventListener('click', cycleSpeed)

  // Progress bar click
  playerProgress.addEventListener('click', function (e) {
    if (!audio.duration || isNaN(audio.duration)) return
    var rect = playerProgress.getBoundingClientRect()
    var pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
    updateProgress()
  })

  // Keyboard shortcut: M for music overlay
  document.addEventListener('keydown', function (e) {
    if (e.key === 'm' || e.key === 'M') {
      if (!document.querySelector('.tetris-overlay.tetris-open')) {
        toggleOverlay()
      }
    }
  })

  // Init
  renderList()
})()
