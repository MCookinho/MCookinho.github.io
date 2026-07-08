(function () {
  var songs = []
  var CACHE_KEY = 'mcookinho_playlist'
  var CACHE_TTL = 5 * 60 * 1000

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
  var musicTitle = document.querySelector('.music-title')

  var currentIndex = -1
  var isPlaying = false
  var playbackRate = 1
  var speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]
  var speedIndex = 2
  var progressInterval = null
  var overlayOpen = false
  var loading = false

  function pad(n) {
    return n < 10 ? '0' + n : '' + n
  }

  function formatTime(s) {
    if (isNaN(s) || !isFinite(s) || s <= 0) return '0:00'
    var m = Math.floor(s / 60)
    var sec = Math.floor(s % 60)
    return m + ':' + pad(sec)
  }

  function titleFromName(name) {
    return name
      .replace(/\.mp3$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .toUpperCase()
      .trim()
  }

  function fetchPlaylist() {
    var cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        var data = JSON.parse(cached)
        if (Date.now() - data.ts < CACHE_TTL) {
          return Promise.resolve(data.songs)
        }
      } catch (e) {}
    }

    loading = true
    updateStatus('CARREGANDO...')

    return fetch('https://api.github.com/repos/MCookinho/MCookinho.github.io/contents/assets/sound/playlist')
      .then(function (r) {
        if (r.status === 404) throw new Error('NOT_FOUND')
        if (r.status === 403) throw new Error('RATE_LIMIT')
        if (!r.ok) throw new Error('FAILED')
        return r.json()
      })
      .then(function (files) {
        if (!Array.isArray(files)) throw new Error('INVALID')
        var mp3s = files.filter(function (f) {
          return f.name.toLowerCase().endsWith('.mp3') && f.name !== '.gitkeep'
        })
        mp3s.sort(function (a, b) { return a.name.localeCompare(b.name) })

        var parsed = mp3s.map(function (f, i) {
          return {
            id: i + 1,
            title: titleFromName(f.name),
            file: f.name,
            url: f.download_url,
            dur: null
          }
        })

        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), songs: parsed }))
        loading = false
        return parsed
      })
      .catch(function (err) {
        loading = false
        // Try stale cache
        if (cached) {
          try {
            var data = JSON.parse(cached)
            return data.songs
          } catch (e) {}
        }
        throw err
      })
  }

  function updateStatus(msg) {
    listEl.innerHTML = '<div class="music-status">' + msg + '</div>'
  }

  function renderList() {
    if (loading) {
      updateStatus('CARREGANDO...')
      return
    }
    if (songs.length === 0) {
      updateStatus(
        '<span class="music-status-icon">♪</span>' +
        'ADICIONE ARQUIVOS .MP3 EM<br/><strong>ASSETS/SOUND/PLAYLIST/</strong>'
      )
      return
    }

    listEl.innerHTML = ''
    songs.forEach(function (song, i) {
      var item = document.createElement('div')
      item.className = 'music-item'
      if (i === currentIndex) item.classList.add('active')

      var durText = song.dur || '?:??'

      item.innerHTML =
        '<span class="music-item-num">' + pad(i + 1) + '</span>' +
        '<div class="music-item-info">' +
          '<span class="music-item-title">' + song.title + '</span>' +
        '</div>' +
        '<span class="music-item-duration">' + durText + '</span>' +
        '<span class="music-item-play">' + (i === currentIndex && isPlaying ? '▶' : '♪') + '</span>'

      item.addEventListener('click', function () {
        playSong(i)
      })
      listEl.appendChild(item)
    })
  }

  function playSong(index) {
    if (index < 0 || index >= songs.length) return
    currentIndex = index

    audio.src = songs[index].url
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
      if (songs.length > 0) playSong(0)
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
    if (currentIndex > 0) playSong(currentIndex - 1)
  }

  function nextSong() {
    if (currentIndex < songs.length - 1) playSong(currentIndex + 1)
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
      if (currentIndex >= 0 && songs[currentIndex] && songs[currentIndex].dur) {
        playerDuration.textContent = songs[currentIndex].dur
      } else {
        playerDuration.textContent = '?:??'
      }
      return
    }
    var pct = (audio.currentTime / audio.duration) * 100
    playerProgressFill.style.width = Math.min(pct, 100) + '%'
    playerCurrentTime.textContent = formatTime(audio.currentTime)
    playerDuration.textContent = formatTime(audio.duration)
  }

  function updateUI() {
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

    if (currentIndex >= 0) {
      cdNowPlaying.textContent = songs[currentIndex].title
      cdNowPlaying.classList.add('visible')
      playerSongName.textContent = songs[currentIndex].title
    } else {
      cdNowPlaying.classList.remove('visible')
      playerSongName.textContent = 'NENHUMA MÚSICA'
    }

    playerPlay.textContent = isPlaying ? '\u23F8' : '\u25B6'
    playerSpeed.textContent = playbackRate + '\u00D7'

    renderList()
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

  function loadPlaylist() {
    musicTitle.textContent = '// CARREGANDO...'

    fetchPlaylist()
      .then(function (list) {
        songs = list
        musicTitle.textContent = '// MINHA PLAYLIST'
        if (songs.length > 0) {
          musicTitle.textContent += ' (' + songs.length + ')'
        }
        renderList()
      })
      .catch(function (err) {
        musicTitle.textContent = '// MINHA PLAYLIST'
        if (err.message === 'NOT_FOUND') {
          updateStatus(
            '<span class="music-status-icon">✕</span>' +
            'PASTA NÃO ENCONTRADA<br/><strong>ASSETS/SOUND/PLAYLIST/</strong>'
          )
        } else if (err.message === 'RATE_LIMIT') {
          updateStatus(
            '<span class="music-status-icon">⏳</span>' +
            'LIMITE DA API DO GITHUB<br/>TENTE NOVAMENTE MAIS TARDE'
          )
        } else {
          updateStatus(
            '<span class="music-status-icon">✕</span>' +
            'ERRO AO CARREGAR PLAYLIST'
          )
        }
      })
  }

  // Audio events
  audio.addEventListener('ended', function () {
    if (currentIndex < songs.length - 1) {
      playSong(currentIndex + 1)
    } else {
      isPlaying = false
      updateUI()
      stopProgress()
    }
  })

  audio.addEventListener('error', function () {
    isPlaying = false
    updateUI()
    stopProgress()
  })

  audio.addEventListener('loadedmetadata', function () {
    if (currentIndex >= 0 && songs[currentIndex]) {
      var d = formatTime(audio.duration)
      songs[currentIndex].dur = d
      renderList()
    }
    playerDuration.textContent = formatTime(audio.duration)
  })

  // UI events
  cdBtn.addEventListener('click', toggleOverlay)
  musicClose.addEventListener('click', closeOverlay)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeOverlay()
  })

  playerPlay.addEventListener('click', togglePlay)
  playerPrev.addEventListener('click', prevSong)
  playerNext.addEventListener('click', nextSong)
  playerRestart.addEventListener('click', restartSong)
  playerSpeed.addEventListener('click', cycleSpeed)

  playerProgress.addEventListener('click', function (e) {
    if (!audio.duration || isNaN(audio.duration)) return
    var rect = playerProgress.getBoundingClientRect()
    var pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
    updateProgress()
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'm' || e.key === 'M') {
      if (!document.querySelector('.tetris-overlay.tetris-open')) {
        toggleOverlay()
      }
    }
  })

  // Add status style
  var style = document.createElement('style')
  style.textContent = '.music-status { padding: 40px 20px; text-align: center; font-family: var(--font); font-size: 7px; color: var(--dim); line-height: 2; } .music-status-icon { display: block; font-size: 20px; margin-bottom: 12px; color: var(--purple); } .music-status strong { color: var(--cyan); }'
  document.head.appendChild(style)

  loadPlaylist()
})()
