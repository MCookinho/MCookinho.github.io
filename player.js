(function () {
  var songs = []
  var folders = []
  var CACHE_KEY = 'mcookinho_playlist'
  var COLLAPSED_KEY = 'mcookinho_folders'
  var CACHE_TTL = 5 * 60 * 1000
  var API_BASE = 'https://api.github.com/repos/MCookinho/MCookinho.github.io/contents'

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
  var playerStop = document.getElementById('playerStop')
  var playerRestart = document.getElementById('playerRestart')
  var playerSpeed = document.getElementById('playerSpeed')
  var playerProgress = document.getElementById('playerProgress')
  var playerProgressFill = document.getElementById('playerProgressFill')
  var playerCurrentTime = document.getElementById('playerCurrentTime')
  var playerDuration = document.getElementById('playerDuration')
  var playerVolume = document.getElementById('playerVolume')
  var playerVolBtn = document.getElementById('playerVolBtn')
  var playerVolumeSlider = document.getElementById('playerVolumeSlider')
  var volPct = document.getElementById('volPct')
  var musicClose = document.getElementById('musicClose')
  var musicTitle = document.querySelector('.music-title')

  var currentIndex = -1
  var isPlaying = false
  var playbackRate = 1
  var speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]
  var speedIndex = 2
  var overlayOpen = false

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

  function getCollapsed() {
    try { return JSON.parse(localStorage.getItem(COLLAPSED_KEY)) || {} } catch (e) { return {} }
  }

  function saveCollapsed(name, val) {
    var o = getCollapsed()
    o[name] = val
    localStorage.setItem(COLLAPSED_KEY, JSON.stringify(o))
  }

  function fetchDir(path) {
    return fetch(API_BASE + '/' + path).then(function (r) {
      if (r.status === 404) throw new Error('NOT_FOUND')
      if (r.status === 403) throw new Error('RATE_LIMIT')
      if (!r.ok) throw new Error('FAILED')
      return r.json()
    })
  }

  var RAW_BASE = 'https://raw.githubusercontent.com/MCookinho/MCookinho.github.io/main/assets/sound/playlist'

  function buildUrl(file) {
    return RAW_BASE + '/' + file.split('/').map(encodeURIComponent).join('/')
  }

  function fetchDynamicPlaylist() {
    var cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        var data = JSON.parse(cached)
        var pl = data.playlist
        if (!pl || Array.isArray(pl) || !Array.isArray(pl.songs)) { localStorage.removeItem(CACHE_KEY); throw 'OLD_FORMAT' }
        if (Date.now() - data.ts < CACHE_TTL) {
          return Promise.resolve(pl)
        }
      } catch (e) {}
    }

    return fetch('assets/sound/playlist/playlist.json').then(function (r) {
      if (!r.ok) throw new Error('NO_MANIFEST')
      return r.json().then(function (manifest) {
        var allSongs = manifest.songs.map(function (s) {
          return {
            title: s.title,
            file: s.file,
            url: buildUrl(s.file),
            dur: null,
            folder: s.folder,
            artist: s.artist
          }
        })
        var allFolders = (manifest.folders || []).map(function (f) {
          return {
            name: f.name,
            songs: f.songs.map(function (fp) {
              return allSongs.find(function (s) { return s.file === fp })
            }).filter(Boolean)
          }
        })
        var playlist = { songs: allSongs, folders: allFolders }
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), playlist: playlist }))
        return playlist
      })
    }).catch(function () {
      return fetchFromAPI()
    })
  }

  function fetchFromAPI() {
    return fetchDir('assets/sound/playlist').then(function (items) {
      if (!Array.isArray(items)) throw new Error('INVALID')
      var mp3s = items.filter(function (f) { return f.name.toLowerCase().endsWith('.mp3') })
      if (mp3s.length === 0) return null
      var dirs = items.filter(function (f) { return f.type === 'dir' })
      var rootSongs = mp3s.map(function (f) {
        return { title: titleFromName(f.name), file: f.name, url: f.download_url, dur: null, folder: null, artist: null }
      })
      var dirPromises = dirs.map(function (dir) {
        return fetchDir(dir.path).then(function (subItems) {
          if (!Array.isArray(subItems)) return { name: dir.name, songs: [] }
          var subMp3s = subItems.filter(function (f) { return f.name.toLowerCase().endsWith('.mp3') })
          return {
            name: dir.name,
            songs: subMp3s.map(function (f) {
              return { title: titleFromName(f.name), file: f.name, url: f.download_url, dur: null, folder: dir.name, artist: titleFromName(dir.name) }
            })
          }
        })
      })
      return Promise.all(dirPromises).then(function (folderData) {
        var allSongs = rootSongs.slice()
        var allFolders = []
        folderData.forEach(function (f) {
          if (f.songs.length > 0) {
            allFolders.push({ name: f.name, songs: f.songs })
            allSongs = allSongs.concat(f.songs)
          }
        })
        var playlist = { songs: allSongs, folders: allFolders }
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), playlist: playlist }))
        return playlist
      })
    }).catch(function () { return null })
  }

  function updateStatus(msg) {
    listEl.innerHTML = '<div class="music-status">' + msg + '</div>'
  }

  function renderSongItem(song, idx) {
    var durText = song.dur || '?:??'
    var active = currentIndex === idx
    return '<div class="music-item' + (active ? ' active' : '') + '" data-idx="' + idx + '">' +
      '<span class="music-item-num">' + pad(idx + 1) + '</span>' +
      '<div class="music-item-info">' +
        '<span class="music-item-title">' + song.title + '</span>' +
        (song.artist ? '<span class="music-item-artist">' + song.artist + '</span>' : '') +
      '</div>' +
      '<span class="music-item-duration">' + durText + '</span>' +
      '<span class="music-item-play">' + (active && isPlaying ? '\u25B6' : '\u266A') + '</span>' +
    '</div>'
  }

  function renderList() {
    if (songs.length === 0) {
      updateStatus(
        '<span class="music-status-icon">♪</span>' +
        'ADICIONE ARQUIVOS .MP3 EM<br/><strong>ASSETS/SOUND/PLAYLIST/</strong>'
      )
      return
    }

    var collapsed = getCollapsed()
    var html = ''

    // Root songs (no folder)
    songs.forEach(function (song, i) {
      if (song.folder) return
      html += renderSongItem(song, i)
    })

    // Folders
    folders.forEach(function (f) {
      var isCollapsed = !!collapsed[f.name]
      html += '<div class="music-folder">'
      html += '<div class="music-folder-header" data-folder="' + f.name + '">'
      html += '<span class="music-folder-arrow">' + (isCollapsed ? '\u25B6' : '\u25BC') + '</span>'
      html += '<span class="music-folder-name">' + f.name.toUpperCase() + '</span>'
      html += '<span class="music-folder-count">(' + f.songs.length + ')</span>'
      html += '</div>'
      if (!isCollapsed) {
        html += '<div class="music-folder-songs">'
        songs.forEach(function (song, i) {
          if (song.folder === f.name) html += renderSongItem(song, i)
        })
        html += '</div>'
      }
      html += '</div>'
    })

    listEl.innerHTML = html

    listEl.querySelectorAll('.music-folder-header').forEach(function (header) {
      header.addEventListener('click', function () {
        var name = header.getAttribute('data-folder')
        var collapsed = getCollapsed()
        saveCollapsed(name, !collapsed[name])
        renderList()
      })
    })

    listEl.querySelectorAll('.music-item').forEach(function (item) {
      var idx = parseInt(item.getAttribute('data-idx'), 10)
      if (!isNaN(idx)) {
        item.addEventListener('click', function () {
          if (idx === currentIndex && isPlaying) { stopSong() }
          else { playSong(idx) }
        })
      }
    })
  }

  function playSong(idx) {
    if (idx < 0 || idx >= songs.length) return
    currentIndex = idx

    var src = songs[idx].url
    audio.src = src
    audio.load()
    audio.play().then(function () {
      isPlaying = true
      updateUI()
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
      }).catch(function () {})
    } else {
      audio.pause()
      isPlaying = false
      updateUI()
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
      }).catch(function () {})
    }
  }

  function stopSong() {
    if (currentIndex < 0 && !isPlaying) return
    audio.pause()
    audio.currentTime = 0
    currentIndex = -1
    isPlaying = false
    playerProgressFill.style.width = '0%'
    playerCurrentTime.textContent = '0:00'
    playerDuration.textContent = '0:00'
    updateUI()
    hidePlayerBar()
  }

  function cycleSpeed() {
    speedIndex = (speedIndex + 1) % speedOptions.length
    playbackRate = speedOptions[speedIndex]
    audio.playbackRate = playbackRate
    playerSpeed.textContent = playbackRate + '\u00D7'
  }

  function updateProgress() {
    if (audio.paused && !isPlaying) return
    var d = audio.duration
    if (!d || isNaN(d) || !isFinite(d)) {
      playerCurrentTime.textContent = formatTime(audio.currentTime)
      if (currentIndex >= 0 && songs[currentIndex] && songs[currentIndex].dur) {
        playerDuration.textContent = songs[currentIndex].dur
      } else {
        playerDuration.textContent = '?:??'
      }
      return
    }
    var pct = (audio.currentTime / d) * 100
    playerProgressFill.style.width = Math.min(pct, 100) + '%'
    playerCurrentTime.textContent = formatTime(audio.currentTime)
    playerDuration.textContent = formatTime(d)
  }

  function updateUI() {
    if (isPlaying) {
      cdIcon.classList.remove('cd-paused'); cdIcon.classList.add('cd-spin')
      playerCdMini.classList.remove('paused'); playerCdMini.classList.add('spin')
    } else if (currentIndex >= 0) {
      cdIcon.classList.add('cd-paused'); playerCdMini.classList.add('paused')
    } else {
      cdIcon.classList.remove('cd-spin', 'cd-paused')
      playerCdMini.classList.remove('spin', 'paused')
    }

    if (currentIndex >= 0) {
      var song = songs[currentIndex]
      cdNowPlaying.textContent = song.title
      cdNowPlaying.classList.add('visible')
      playerSongName.textContent = song.title
      playerArtistName.textContent = song.artist || ''
      playerArtistName.style.display = song.artist ? 'inline' : 'none'
    } else {
      cdNowPlaying.textContent = 'ABRIR BIBLIOTECA MUSICAL'
      cdNowPlaying.classList.add('visible')
      playerSongName.textContent = 'NENHUMA MÚSICA'
      playerArtistName.textContent = ''
      playerArtistName.style.display = 'none'
    }

    playerPlay.textContent = isPlaying ? '\u23F8' : '\u25B6'
    playerSpeed.textContent = playbackRate + '\u00D7'

    renderList()
  }

  function showPlayerBar() { playerBar.classList.add('open') }
  function hidePlayerBar() { playerBar.classList.remove('open') }

  function toggleOverlay() {
    overlayOpen = !overlayOpen
    if (overlayOpen) { overlay.classList.add('open'); renderList() }
    else { overlay.classList.remove('open') }
  }

  function closeOverlay() { overlayOpen = false; overlay.classList.remove('open') }

  function loadPlaylist() {
    musicTitle.textContent = '// CARREGANDO...'

    fetchDynamicPlaylist().then(function (dynamic) {
      if (dynamic && dynamic.songs && dynamic.songs.length > 0) {
        songs = dynamic.songs
        folders = dynamic.folders || []
        var total = songs.length
        musicTitle.textContent = '// MINHA PLAYLIST (' + total + ')'
      } else {
        songs = []
        folders = []
        musicTitle.textContent = '// MINHA PLAYLIST'
      }
      renderList()
    })
  }

  // Audio events
  audio.addEventListener('ended', function () {
    if (currentIndex < songs.length - 1) {
      playSong(currentIndex + 1)
    } else {
      isPlaying = false; updateUI()
    }
  })

  audio.addEventListener('error', function () {
    isPlaying = false; updateUI()
    if (currentIndex >= 0 && songs[currentIndex]) {
      songs[currentIndex].dur = 'ERRO'
    }
  })

  audio.addEventListener('loadedmetadata', function () {
    if (currentIndex >= 0 && songs[currentIndex]) {
      songs[currentIndex].dur = formatTime(audio.duration)
      renderList()
    }
    playerDuration.textContent = formatTime(audio.duration)
  })

  audio.addEventListener('timeupdate', function () {
    updateProgress()
  })

  // UI events
  cdBtn.addEventListener('click', toggleOverlay)
  musicClose.addEventListener('click', closeOverlay)
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay() })
  playerPlay.addEventListener('click', togglePlay)
  playerPrev.addEventListener('click', prevSong)
  playerNext.addEventListener('click', nextSong)
  playerStop.addEventListener('click', stopSong)
  playerRestart.addEventListener('click', restartSong)
  playerSpeed.addEventListener('click', cycleSpeed)

  playerVolume.addEventListener('input', function () {
    var v = parseFloat(playerVolume.value)
    audio.volume = v
    playerVolBtn.textContent = v === 0 ? '×' : v < 0.4 ? '♩' : '♪'
    volPct.textContent = Math.round(v * 100) + '%'
  })

  playerVolBtn.addEventListener('click', function () {
    playerVolumeSlider.classList.toggle('open')
  })

  document.addEventListener('click', function (e) {
    if (!playerVolBtn.contains(e.target) && !playerVolumeSlider.contains(e.target)) {
      playerVolumeSlider.classList.remove('open')
    }
  })

  playerProgress.addEventListener('click', function (e) {
    var rect = playerProgress.getBoundingClientRect()
    var pct = (e.clientX - rect.left) / rect.width
    if (audio.duration && isFinite(audio.duration)) {
      audio.currentTime = pct * audio.duration
    }
  })

  document.addEventListener('keydown', function (e) {
    if ((e.key === 'm' || e.key === 'M') && document.activeElement && document.activeElement.tagName !== 'INPUT') {
      if (!document.querySelector('.tetris-overlay.tetris-open')) toggleOverlay()
    }
  })

  // Inline styles
  var style = document.createElement('style')
  style.textContent =
    '.music-status { padding: 40px 20px; text-align: center; font-family: var(--font); font-size: 7px; color: var(--dim); line-height: 2; }' +
    '.music-status-icon { display: block; font-size: 20px; margin-bottom: 12px; color: var(--purple); }' +
    '.music-status strong { color: var(--cyan); }' +
    '.music-folder { border-bottom: 1px solid rgba(42,42,62,0.4); }' +
    '.music-folder-header { display: flex; align-items: center; gap: 10px; padding: 14px 20px; cursor: pointer; transition: background 0.15s; }' +
    '.music-folder-header:hover { background: rgba(168,85,247,0.06); }' +
    '.music-folder-arrow { font-size: 10px; color: var(--cyan); min-width: 16px; }' +
    '.music-folder-name { font-family: var(--font); font-size: 9px; color: var(--purple); letter-spacing: 1px; }' +
    '.music-folder-count { font-family: var(--font); font-size: 8px; color: var(--dim); margin-left: auto; }' +
    '.music-folder-songs { border-top: 1px solid rgba(42,42,62,0.2); }'
  document.head.appendChild(style)

  loadPlaylist()

  // Init volume
  audio.volume = parseFloat(playerVolume.value)
  playerVolBtn.textContent = '♪'

  // Expose for external toggle
  window.__toggleMusic = toggleOverlay
  window.__closeMusic = closeOverlay

  // Allow external stop
  window.playerAudio = audio
  window.addEventListener('horrorStopMusic', function () {
    if (currentIndex >= 0 || isPlaying) stopSong()
  })
})()
