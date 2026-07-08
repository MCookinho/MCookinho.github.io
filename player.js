(function () {
  var STATIC_SONGS = [
    { title: 'PIXEL DREAMS',       file: 'track01.mp3', dur: '3:30' },
    { title: 'NEON NIGHTS',        file: 'track02.mp3', dur: '4:12' },
    { title: 'RETRO WAVE',         file: 'track03.mp3', dur: '3:45' },
    { title: 'CHIP TUNE SUNRISE',  file: 'track04.mp3', dur: '2:58' },
    { title: 'MIDNIGHT CODE',      file: 'track05.mp3', dur: '4:01' },
    { title: 'CAFÉ E BIT',         file: 'track06.mp3', dur: '3:22' },
    { title: 'TERMINAL LOVE',      file: 'track07.mp3', dur: '3:55' },
    { title: '8-BIT SOUL',         file: 'track08.mp3', dur: '2:44' },
    { title: 'VOID WALKER',        file: 'track09.mp3', dur: '4:30' },
    { title: 'CYBER CITY',         file: 'track10.mp3', dur: '3:18' },
    { title: 'LATE NIGHT LOOP',    file: 'track11.mp3', dur: '5:02' },
    { title: 'GLITCH GARDEN',      file: 'track12.mp3', dur: '3:36' },
    { title: 'SHIVA WALK',         file: 'track13.mp3', dur: '4:15' },
    { title: 'PURPLE SKIES',       file: 'track14.mp3', dur: '3:42' },
    { title: 'ARCADE AFTERNOON',   file: 'track15.mp3', dur: '2:30' },
    { title: 'HEXAGON',            file: 'track16.mp3', dur: '4:48' },
    { title: 'BOSS FIGHT',         file: 'track17.mp3', dur: '3:08' },
    { title: 'MENU SCREEN',        file: 'track18.mp3', dur: '2:55' },
    { title: 'RAINY BYTES',        file: 'track19.mp3', dur: '5:20' },
    { title: 'CURSOR BLINK',       file: 'track20.mp3', dur: '3:14' },
    { title: 'DUNGEON DEPTHS',     file: 'track21.mp3', dur: '4:05' },
    { title: 'STARFIELD',          file: 'track22.mp3', dur: '6:00' },
    { title: 'PASSWORD SCREEN',    file: 'track23.mp3', dur: '2:18' },
    { title: 'FINAL LEVEL',        file: 'track24.mp3', dur: '4:33' },
    { title: 'CRT NOISE',          file: 'track25.mp3', dur: '3:50' },
    { title: 'SHELL GAME',         file: 'track26.mp3', dur: '3:27' },
    { title: 'EMPTY ROOM',         file: 'track27.mp3', dur: '4:44' },
    { title: 'LOADING...',         file: 'track28.mp3', dur: '1:55' },
    { title: 'SECRET AREA',        file: 'track29.mp3', dur: '5:10' },
    { title: 'CREDITS SCROLL',     file: 'track30.mp3', dur: '6:30' },
    { title: 'BOOT SEQUENCE',      file: 'track31.mp3', dur: '2:40' },
    { title: 'OVERWORLD',          file: 'track32.mp3', dur: '4:22' },
    { title: 'CAOS ORGANIZADO',    file: 'track33.mp3', dur: '3:48' },
    { title: 'LOOP INFINITO',      file: 'track34.mp3', dur: '5:15' },
  ]

  var songs = []
  var folders = []
  var usingDynamic = false
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

  function fetchDynamicPlaylist() {
    var cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        var data = JSON.parse(cached)
        if (Date.now() - data.ts < CACHE_TTL) {
          return Promise.resolve(data.playlist)
        }
      } catch (e) {}
    }

    return fetchDir('assets/sound/playlist').then(function (items) {
      if (!Array.isArray(items)) throw new Error('INVALID')

      var mp3s = items.filter(function (f) {
        return f.name.toLowerCase().endsWith('.mp3')
      })
      if (mp3s.length === 0) return null

      var dirs = items.filter(function (f) { return f.type === 'dir' })

      var rootSongs = mp3s.map(function (f) {
        return { title: titleFromName(f.name), file: f.name, url: f.download_url, dur: null, folder: null }
      })

      var dirPromises = dirs.map(function (dir) {
        return fetchDir(dir.path).then(function (subItems) {
          if (!Array.isArray(subItems)) return { name: dir.name, songs: [] }
          var subMp3s = subItems.filter(function (f) { return f.name.toLowerCase().endsWith('.mp3') })
          return {
            name: dir.name,
            songs: subMp3s.map(function (f) {
              return { title: titleFromName(f.name), file: f.name, url: f.download_url, dur: null, folder: dir.name }
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
    }).catch(function () {
      return null
    })
  }

  function useStaticPlaylist() {
    songs = STATIC_SONGS.map(function (s, i) { s.id = i + 1; s.folder = null; return s })
    folders = []
    usingDynamic = false
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
        item.addEventListener('click', function () { playSong(idx) })
      }
    })
  }

  function playSong(idx) {
    if (idx < 0 || idx >= songs.length) return
    currentIndex = idx

    var src = songs[idx].url || ('assets/music/' + songs[idx].file)
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
        usingDynamic = true
        var total = songs.length
        musicTitle.textContent = '// MINHA PLAYLIST (' + total + ')'
      } else {
        useStaticPlaylist()
        musicTitle.textContent = '// MINHA PLAYLIST (' + songs.length + ')'
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
  playerRestart.addEventListener('click', restartSong)
  playerSpeed.addEventListener('click', cycleSpeed)

  playerProgress.addEventListener('click', function (e) {
    var rect = playerProgress.getBoundingClientRect()
    var pct = (e.clientX - rect.left) / rect.width
    if (audio.duration && isFinite(audio.duration)) {
      audio.currentTime = pct * audio.duration
    }
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'm' || e.key === 'M') {
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
    '.music-folder-header { display: flex; align-items: center; gap: 8px; padding: 10px 18px; cursor: pointer; transition: background 0.15s; }' +
    '.music-folder-header:hover { background: rgba(168,85,247,0.06); }' +
    '.music-folder-arrow { font-size: 8px; color: var(--cyan); min-width: 14px; }' +
    '.music-folder-name { font-family: var(--font); font-size: 7px; color: var(--purple); letter-spacing: 1px; }' +
    '.music-folder-count { font-family: var(--font); font-size: 6px; color: var(--dim); margin-left: auto; }' +
    '.music-folder-songs { border-top: 1px solid rgba(42,42,62,0.2); }'
  document.head.appendChild(style)

  loadPlaylist()
})()
