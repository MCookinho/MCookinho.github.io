(function () {

  // ── Default Config ──
  var DEFAULT_SECTIONS = [
    { id: 'header',     label: 'Cabeçalho',      visible: true },
    { id: 'about',      label: 'Sobre',           visible: true },
    { id: 'experience', label: 'Experiência',     visible: true },
    { id: 'education',  label: 'Formação',        visible: true },
    { id: 'skills',     label: 'Habilidades',     visible: true },
    { id: 'projects',   label: 'Projetos',        visible: true },
    { id: 'contact',    label: 'Contato',         visible: true },
  ]

  var CONFIG_KEY = 'mcookinho_professional_config'

  function loadConfig() {
    try {
      var raw = localStorage.getItem(CONFIG_KEY)
      if (raw) return JSON.parse(raw)
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_SECTIONS))
  }

  function saveConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
  }

  function applyConfig(config) {
    config.forEach(function (sec) {
      var el = document.getElementById('sec-' + sec.id)
      if (el) el.style.display = sec.visible ? '' : 'none'
    })
  }

  // ── Config Panel ──
  var overlay = document.getElementById('configOverlay')
  var listEl = document.getElementById('configSectionList')
  var currentConfig = loadConfig()

  function renderConfigList(config) {
    listEl.innerHTML = ''
    config.forEach(function (sec, i) {
      var item = document.createElement('div')
      item.className = 'config-section-item'
      item.draggable = true
      item.setAttribute('data-index', i)
      item.innerHTML =
        '<span class="drag-handle">⠿</span>' +
        '<input type="checkbox" ' + (sec.visible ? 'checked' : '') + ' data-idx="' + i + '" />' +
        '<label>' + sec.label + '</label>'
      item.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', i)
        item.classList.add('dragging')
      })
      item.addEventListener('dragend', function () {
        item.classList.remove('dragging')
      })
      item.addEventListener('dragover', function (e) {
        e.preventDefault()
      })
      item.addEventListener('drop', function (e) {
        e.preventDefault()
        var from = parseInt(e.dataTransfer.getData('text/plain'), 10)
        var to = i
        if (from === to) return
        var moved = config.splice(from, 1)[0]
        config.splice(to, 0, moved)
        renderConfigList(config)
      })
      var cb = item.querySelector('input[type="checkbox"]')
      cb.addEventListener('change', function () {
        config[i].visible = cb.checked
      })
      listEl.appendChild(item)
    })
  }

  renderConfigList(currentConfig)

  document.getElementById('configSave').addEventListener('click', function () {
    saveConfig(currentConfig)
    applyConfig(currentConfig)
    overlay.classList.remove('open')
  })

  document.getElementById('configReset').addEventListener('click', function () {
    currentConfig = JSON.parse(JSON.stringify(DEFAULT_SECTIONS))
    renderConfigList(currentConfig)
  })

  // ── Open / Close Config ──
  document.querySelector('[data-config="true"]').addEventListener('click', function (e) {
    e.preventDefault()
    currentConfig = loadConfig()
    renderConfigList(currentConfig)
    overlay.classList.add('open')
  })

  document.getElementById('configClose').addEventListener('click', function () {
    overlay.classList.remove('open')
  })

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) overlay.classList.remove('open')
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) overlay.classList.remove('open')
  })

  // ── Apply saved config on load ──
  applyConfig(currentConfig)

  // ── Export PDF ──
  document.getElementById('exportPdf').addEventListener('click', function () {
    window.print()
  })

})()
