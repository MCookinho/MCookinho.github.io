(function () {

  var CONFIG_KEY = 'mcookinho_professional_config'

  var THEMES = {
    professional: { name: 'Profissional', primary: '#1a1a2e', bg: '#f8f9fa', text: '#1a1a2e', accent: '#2563eb' },
    minimal:      { name: 'Minimal',      primary: '#333',    bg: '#fff',    text: '#333',    accent: '#666' },
    dark:         { name: 'Escuro',       primary: '#e0e0e0', bg: '#111',    text: '#ddd',    accent: '#00ffc8' },
    nature:       { name: 'Natureza',     primary: '#1a3a2a', bg: '#f5faf5', text: '#1a3a2a', accent: '#2d8a4e' },
    sunset:       { name: 'Pôr do Sol',   primary: '#2a1a1a', bg: '#faf5f0', text: '#2a1a1a', accent: '#c0392b' },
  }

  var FONTS = [
    { id: 'system', label: 'Sistema' },
    { id: 'serif',  label: 'Serif' },
    { id: 'mono',   label: 'Monoespaçada' },
  ]

  var ANIMS = [
    { id: 'fade',  label: 'Fade In' },
    { id: 'slide', label: 'Slide In' },
    { id: 'none',  label: 'Sem animação' },
  ]

  var MARGINS = [
    { id: 'small',  label: 'Pequena' },
    { id: 'normal', label: 'Normal' },
    { id: 'large',  label: 'Grande' },
  ]

  var PDF_FONTS = [
    { id: 'small',  label: 'Pequena' },
    { id: 'normal', label: 'Normal' },
    { id: 'large',  label: 'Grande' },
  ]

  var SECTION_IDS = [
    { id: 'header',     label: 'Cabeçalho' },
    { id: 'about',      label: 'Sobre' },
    { id: 'experience', label: 'Experiência' },
    { id: 'education',  label: 'Formação' },
    { id: 'skills',     label: 'Habilidades' },
    { id: 'projects',   label: 'Projetos' },
    { id: 'contact',    label: 'Contato' },
  ]

  // ── Default Config ──
  function defaultConfig() {
    return {
      theme: 'professional',
      font: 'system',
      animation: 'fade',
      sections: SECTION_IDS.map(function (s) { return { id: s.id, visible: true } }),
      pdf: {
        sections: SECTION_IDS.map(function (s) { return s.id }),
        margins: 'normal',
        fontSize: 'normal',
      }
    }
  }

  // ── Load / Save ──
  function loadConfig() {
    try {
      var raw = localStorage.getItem(CONFIG_KEY)
      if (raw) {
        var parsed = JSON.parse(raw)
        // ensure all section ids exist
        var existing = parsed.sections || []
        SECTION_IDS.forEach(function (s) {
          if (!existing.find(function (e) { return e.id === s.id })) {
            existing.push({ id: s.id, visible: true })
          }
        })
        parsed.sections = existing
        if (!parsed.pdf) parsed.pdf = defaultConfig().pdf
        if (!parsed.pdf.sections) parsed.pdf.sections = SECTION_IDS.map(function (s) { return s.id })
        return parsed
      }
    } catch (e) {}
    return defaultConfig()
  }

  function saveConfig(cfg) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
  }

  // ── URL Hash Encoding ──
  function encodeConfigToHash(cfg) {
    try {
      var json = JSON.stringify(cfg)
      return btoa(unescape(encodeURIComponent(json)))
    } catch (e) {
      return ''
    }
  }

  function decodeHashToConfig(hash) {
    try {
      var json = decodeURIComponent(escape(atob(hash)))
      return JSON.parse(json)
    } catch (e) {
      return null
    }
  }

  function updateShareLink(cfg) {
    var encoded = encodeConfigToHash(cfg)
    if (encoded) {
      var url = window.location.origin + window.location.pathname + '#' + encoded
      window.history.replaceState(null, '', '#' + encoded)
      return url
    }
    return window.location.href
  }

  function loadConfigFromHash() {
    var hash = window.location.hash.replace(/^#/, '')
    if (!hash) return null
    return decodeHashToConfig(hash)
  }

  // ── Load Config (hash > localStorage > default) ──
  function loadConfig() {
    // Try hash first
    var fromHash = loadConfigFromHash()
    if (fromHash) {
      saveConfig(fromHash) // persist to localStorage
      return fromHash
    }
    // Fall back to localStorage
    try {
      var raw = localStorage.getItem(CONFIG_KEY)
      if (raw) {
        var parsed = JSON.parse(raw)
        // ensure all section ids exist
        var existing = parsed.sections || []
        SECTION_IDS.forEach(function (s) {
          if (!existing.find(function (e) { return e.id === s.id })) {
            existing.push({ id: s.id, visible: true })
          }
        })
        parsed.sections = existing
        if (!parsed.pdf) parsed.pdf = defaultConfig().pdf
        if (!parsed.pdf.sections) parsed.pdf.sections = SECTION_IDS.map(function (s) { return s.id })
        return parsed
      }
    } catch (e) {}
    return defaultConfig()
  }

  // ── Apply Config to DOM ──
  function applyConfig(cfg) {
    // Theme
    var theme = THEMES[cfg.theme] || THEMES.professional
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .replace(/font-\w+/g, '')
      .replace(/anim-\w+/g, '')
      .trim()
    document.body.classList.add('theme-' + cfg.theme)
    document.body.classList.add('font-' + cfg.font)
    document.body.classList.add('anim-' + cfg.animation)
    // Apply CSS custom properties for print
    document.body.style.setProperty('--primary', theme.primary)
    document.body.style.setProperty('--bg', theme.bg)
    document.body.style.setProperty('--text', theme.text)
    document.body.style.setProperty('--accent', theme.accent)
    document.body.style.setProperty('--border', lighten(theme.primary, 70))

    // Sections visibility + order
    var main = document.getElementById('mainContent')
    var order = cfg.sections.filter(function (s) { return s.visible }).map(function (s) { return s.id })
    var sections = {}
    SECTION_IDS.forEach(function (s) {
      var el = document.getElementById('sec-' + s.id)
      if (el) sections[s.id] = el
    })
    // reorder
    var parent = main
    order.forEach(function (id) {
      if (sections[id]) parent.appendChild(sections[id])
    })
    // hide hidden
    cfg.sections.forEach(function (s) {
      var el = sections[s.id]
      if (el) el.style.display = s.visible ? '' : 'none'
    })

    // Update theme swatches in config panel
    updateThemeSwatches(cfg.theme)
  }

  function lighten(hex, pct) {
    var r = parseInt(hex.slice(1,3), 16)
    var g = parseInt(hex.slice(3,5), 16)
    var b = parseInt(hex.slice(5,7), 16)
    r = Math.min(255, r + Math.round((255 - r) * pct / 100))
    g = Math.min(255, g + Math.round((255 - g) * pct / 100))
    b = Math.min(255, b + Math.round((255 - b) * pct / 100))
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }

  // ── Animations on scroll ──
  function setupAnimations(cfg) {
    if (cfg.animation === 'none') {
      document.querySelectorAll('.prof-section, .prof-header, .prof-footer').forEach(function (el) {
        el.classList.add('visible')
      })
      return
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.prof-section, .prof-header, .prof-footer').forEach(function (el) {
      el.classList.remove('visible')
      observer.observe(el)
    })
  }

  // ── Init ──
  var config = loadConfig()
  applyConfig(config)
  setupAnimations(config)

  // ── Config Panel ──
  var overlay = document.getElementById('configOverlay')
  var currentConfig = loadConfig()

  function openPanel() {
    currentConfig = loadConfig()
    renderPanel(currentConfig)
    overlay.classList.add('open')
  }

  function closePanel() {
    overlay.classList.remove('open')
  }

  // Render panel UI
  function renderPanel(cfg) {
    // Theme grid
    var themeGrid = document.getElementById('themeGrid')
    themeGrid.innerHTML = ''
    Object.keys(THEMES).forEach(function (key) {
      var t = THEMES[key]
      var div = document.createElement('div')
      div.className = 'theme-opt' + (cfg.theme === key ? ' active' : '')
      div.setAttribute('data-value', key)
      div.innerHTML = '<div class="theme-swatch" style="background:' + t.primary + '"></div><div>' + t.name + '</div>'
      div.addEventListener('click', function () {
        themeGrid.querySelectorAll('.theme-opt').forEach(function (el) { el.classList.remove('active') })
        div.classList.add('active')
        currentConfig.theme = key
      })
      themeGrid.appendChild(div)
    })

    // Font group
    renderBtnGroup('fontGroup', FONTS, cfg.font, function (id) { currentConfig.font = id })

    // Animation group
    renderBtnGroup('animGroup', ANIMS, cfg.animation, function (id) { currentConfig.animation = id })

    // Sections list (draggable)
    renderSectionList(cfg.sections)

    // PDF sections
    renderPdfSectionList(cfg)

    // PDF margins
    renderBtnGroup('marginGroup', MARGINS, cfg.pdf.margins, function (id) { currentConfig.pdf.margins = id })

    // PDF font size
    renderBtnGroup('pdfFontGroup', PDF_FONTS, cfg.pdf.fontSize, function (id) { currentConfig.pdf.fontSize = id })
  }

  function renderBtnGroup(containerId, items, activeId, onChange) {
    var container = document.getElementById(containerId)
    container.innerHTML = ''
    items.forEach(function (item) {
      var btn = document.createElement('button')
      btn.className = 'config-btn-opt' + (activeId === item.id ? ' active' : '')
      btn.textContent = item.label
      btn.addEventListener('click', function () {
        container.querySelectorAll('.config-btn-opt').forEach(function (el) { el.classList.remove('active') })
        btn.classList.add('active')
        onChange(item.id)
      })
      container.appendChild(btn)
    })
  }

  function renderSectionList(sections) {
    var list = document.getElementById('configSectionList')
    list.innerHTML = ''
    sections.forEach(function (sec, i) {
      var info = SECTION_IDS.find(function (s) { return s.id === sec.id })
      if (!info) return
      var item = document.createElement('div')
      item.className = 'config-section-item'
      item.draggable = true
      item.setAttribute('data-index', i)
      item.innerHTML =
        '<span class="drag-handle">⠿</span>' +
        '<input type="checkbox" ' + (sec.visible ? 'checked' : '') + ' data-idx="' + i + '" />' +
        '<label>' + info.label + '</label>'
      item.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', i)
        item.classList.add('dragging')
      })
      item.addEventListener('dragend', function () { item.classList.remove('dragging') })
      item.addEventListener('dragover', function (e) { e.preventDefault() })
      item.addEventListener('drop', function (e) {
        e.preventDefault()
        var from = parseInt(e.dataTransfer.getData('text/plain'), 10)
        var to = i
        if (from === to) return
        var moved = currentConfig.sections.splice(from, 1)[0]
        currentConfig.sections.splice(to, 0, moved)
        renderSectionList(currentConfig.sections)
      })
      var cb = item.querySelector('input[type="checkbox"]')
      cb.addEventListener('change', function () {
        currentConfig.sections[i].visible = cb.checked
      })
      list.appendChild(item)
    })
  }

  function renderPdfSectionList(cfg) {
    var list = document.getElementById('pdfSectionList')
    list.innerHTML = ''
    SECTION_IDS.forEach(function (sec) {
      var checked = cfg.pdf.sections.indexOf(sec.id) !== -1
      var item = document.createElement('div')
      item.className = 'config-pdf-item'
      item.innerHTML =
        '<input type="checkbox" ' + (checked ? 'checked' : '') + ' data-pdf-sec="' + sec.id + '" />' +
        '<label>' + sec.label + '</label>'
      var cb = item.querySelector('input[type="checkbox"]')
      cb.addEventListener('change', function () {
        var idx = currentConfig.pdf.sections.indexOf(sec.id)
        if (cb.checked && idx === -1) currentConfig.pdf.sections.push(sec.id)
        else if (!cb.checked && idx !== -1) currentConfig.pdf.sections.splice(idx, 1)
      })
      list.appendChild(item)
    })
  }

  function updateThemeSwatches(activeKey) {
    var grid = document.getElementById('themeGrid')
    if (!grid) return
    grid.querySelectorAll('.theme-opt').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-value') === activeKey)
    })
  }

  // ── Panel Events ──
  document.getElementById('openConfig').addEventListener('click', openPanel)
  document.getElementById('configClose').addEventListener('click', closePanel)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePanel()
  })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closePanel()
  })

  // Tab switching
  document.querySelectorAll('.config-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.config-tab').forEach(function (t) { t.classList.remove('active') })
      document.querySelectorAll('.config-tab-content').forEach(function (c) { c.classList.remove('active') })
      tab.classList.add('active')
      document.getElementById('tab-' + tab.getAttribute('data-tab')).classList.add('active')
    })
  })

  // Save
  document.getElementById('configSave').addEventListener('click', function () {
    saveConfig(currentConfig)
    config = currentConfig
    applyConfig(config)
    setupAnimations(config)
    updateShareLink(config)
    closePanel()
  })

  // Reset
  document.getElementById('configReset').addEventListener('click', function () {
    currentConfig = defaultConfig()
    renderPanel(currentConfig)
  })

  // ── Share Link ──
  function showCopyToast(msg) {
    var existing = document.getElementById('shareToast')
    if (existing) existing.remove()
    var toast = document.createElement('div')
    toast.id = 'shareToast'
    toast.style.cssText =
      'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
      'background:#1a1a2e;color:#fff;padding:12px 24px;font-size:13px;' +
      'z-index:3000;box-shadow:0 4px 20px rgba(0,0,0,0.2);' +
      'transition:opacity 0.3s;opacity:0;'
    toast.textContent = msg
    document.body.appendChild(toast)
    requestAnimationFrame(function () { toast.style.opacity = '1' })
    setTimeout(function () {
      toast.style.opacity = '0'
      setTimeout(function () { toast.remove() }, 400)
    }, 2500)
  }

  document.getElementById('configShare').addEventListener('click', function () {
    var encoded = encodeConfigToHash(currentConfig)
    if (!encoded) { showCopyToast('Erro ao gerar link'); return }
    var url = window.location.origin + window.location.pathname + '#' + encoded
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showCopyToast('Link copiado! Compartilhe com任何人.')
      }).catch(function () {
        fallbackCopy(url)
      })
    } else {
      fallbackCopy(url)
    }
  })

  function fallbackCopy(url) {
    var ta = document.createElement('textarea')
    ta.value = url
    ta.style.position = 'fixed'; ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      showCopyToast('Link copiado! Compartilhe com qualquer um.')
    } catch (e) {
      showCopyToast('Erro ao copiar. Link: ' + url)
    }
    ta.remove()
  }

  // ── Export PDF ──
  document.getElementById('exportPdf').addEventListener('click', function () {
    var cfg = loadConfig()
    // Hide sections not in PDF
    var allSections = document.querySelectorAll('[data-section]')
    allSections.forEach(function (el) {
      var secId = el.getAttribute('data-section')
      if (cfg.pdf.sections.indexOf(secId) === -1) {
        el.style.display = 'none'
      }
    })

    // Set print margins
    var marginMap = { small: '0.3in', normal: '0.5in', large: '0.8in' }
    var margin = marginMap[cfg.pdf.margins] || '0.5in'

    // Set print font size
    var fontSizeMap = { small: '80%', normal: '100%', large: '120%' }
    var fs = fontSizeMap[cfg.pdf.fontSize] || '100%'

    // Inject print style
    var style = document.createElement('style')
    style.id = 'pdf-temp-style'
    style.textContent =
      '@page { margin: ' + margin + '; }' +
      'body { font-size: ' + fs + ' !important; }'
    document.head.appendChild(style)

    window.print()

    // Cleanup after print
    setTimeout(function () {
      document.getElementById('pdf-temp-style').remove()
      // Restore sections visibility from config
      applyConfig(cfg)
      setupAnimations(cfg)
    }, 500)
  })

})()
