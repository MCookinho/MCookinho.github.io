// ── Hero, Nav, Scroll Reveal ──
// Calcula a idade dinamicamente a partir da data de nascimento (18/04/2005)
// e insere no elemento hero. Também configuram efeito de scroll no nav,
// toggle do menu mobile e revelação de seções via IntersectionObserver.
(function() {

  var birth = new Date(2005, 3, 18);
  var today = new Date();
  var age = today.getFullYear() - birth.getFullYear();
  var m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  document.getElementById('heroIdade').textContent = age + ' ' + __('ANOS') + ' // ' + __('SALVADOR, BA');

  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function() {
    links.classList.toggle('open');
  });

  var navAnchors = links.querySelectorAll('a');
  for (var i = 0; i < navAnchors.length; i++) {
    navAnchors[i].addEventListener('click', function() {
      links.classList.remove('open');
    });
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  var sections = document.querySelectorAll('.section');
  for (var i = 0; i < sections.length; i++) {
    sections[i].style.opacity = '0';
    sections[i].style.transform = 'translateY(24px)';
    sections[i].style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(sections[i]);
  }

  var cards = document.querySelectorAll('.projeto-card, .jogo-card, .contato-card, .galeria-item');
  for (var j = 0; j < cards.length; j++) {
    cards[j].style.opacity = '0';
    cards[j].style.transform = 'translateY(16px)';
    cards[j].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(cards[j]);
  }

})();

// ── NES Controller Emulation ──
// Mapeia teclado (setas, Enter, Espaço, A/B) e botões de tela (.ctrl-btn)
// para eventos de teclado virtuais que os jogos (tetris.js, etc.) escutam.
// A função setupControllerBtns() é exposta globalmente para reativar
// eventos em elementos clonados ou injetados dinamicamente.
(function () {
  var keyMap = {
    ArrowUp: 'ctrl-up',
    ArrowDown: 'ctrl-down',
    ArrowLeft: 'ctrl-left',
    ArrowRight: 'ctrl-right',
    ' ': 'ctrl-select',
    Enter: 'ctrl-start',
    b: 'ctrl-b',
    a: 'ctrl-a',
    B: 'ctrl-b',
    A: 'ctrl-a',
  }

  function dispatch(key, type) {
    document.dispatchEvent(new KeyboardEvent(type, { key: key, bubbles: true }))
    if (type === 'keydown' && typeof window.__countControllerPress === 'function') {
      window.__countControllerPress()
    }
  }

  function setupControllerBtns(scope) {
    var btns = (scope || document).querySelectorAll('.ctrl-btn')
    btns.forEach(function (btn) {
      btn.addEventListener('mousedown', function (e) {
        e.preventDefault()
        var key = btn.getAttribute('data-key')
        btn.classList.add('pressed')
        dispatch(key, 'keydown')
      })
      btn.addEventListener('mouseup', function (e) {
        e.preventDefault()
        var key = btn.getAttribute('data-key')
        btn.classList.remove('pressed')
        dispatch(key, 'keyup')
      })
      btn.addEventListener('mouseleave', function () {
        btn.classList.remove('pressed')
      })
      btn.addEventListener('touchstart', function (e) {
        e.preventDefault()
        var key = btn.getAttribute('data-key')
        btn.classList.add('pressed')
        dispatch(key, 'keydown')
      })
      btn.addEventListener('touchend', function (e) {
        e.preventDefault()
        var key = btn.getAttribute('data-key')
        btn.classList.remove('pressed')
        dispatch(key, 'keyup')
      })
    })
  }

  setupControllerBtns()

  window.setupControllerBtns = setupControllerBtns

  document.addEventListener('keydown', function (e) {
    var cls = keyMap[e.key]
    if (cls) {
      document.querySelectorAll('.' + cls).forEach(function (el) { el.classList.add('pressed') })
    }
  })
  document.addEventListener('keyup', function (e) {
    var cls = keyMap[e.key]
    if (cls) {
      document.querySelectorAll('.' + cls).forEach(function (el) { el.classList.remove('pressed') })
    }
  })
})()

// ── Nav Dropdown + Sub-overlays (Configurações / Conquistas) ──
// Dropdown da logo "MC" no canto superior esquerdo. Cada item com
// data-section pode abrir um sub-overlay (settings, achievements) ou
// o overlay de rankings. O item "music" apenas fecha o dropdown (a
// música é controlada pelo player.js). Fecha ao clicar fora ou ESC.
;(function () {
  var navLogo = document.getElementById('navLogo')
  var navDropdown = document.getElementById('navDropdown')
  var dropdownOpen = false

  function openDropdown() {
    dropdownOpen = true
    navLogo.classList.add('open')
    navDropdown.classList.add('open')
  }

  function closeDropdown() {
    dropdownOpen = false
    navLogo.classList.remove('open')
    navDropdown.classList.remove('open')
  }

  function toggleDropdown(e) {
    e.stopPropagation()
    if (dropdownOpen) closeDropdown()
    else openDropdown()
  }

  navLogo.addEventListener('click', toggleDropdown)

  document.addEventListener('click', function (e) {
    if (dropdownOpen && !navLogo.contains(e.target) && !navDropdown.contains(e.target)) {
      closeDropdown()
    }
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && dropdownOpen) closeDropdown()
  })

  function onSectionClick(section) {
    if (section === 'music') return
    closeDropdown()
    if (section === 'rankings') {
      openRankOverlay()
      return
    }
    openSubOverlay(section)
  }

  navDropdown.querySelectorAll('.nd-section').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var section = el.getAttribute('data-section')
      if (section === 'music') {
        closeDropdown()
        return
      }
      onSectionClick(section)
    })
  })

  window.__closeDropdown = closeDropdown

  // ── Sub-overlays (settings / achievements) ──
  // subData define o título, ícone e função content() que retorna o HTML
  // de cada overlay. O settings tem toggle de idioma e notificações;
  // o achievements lista todas as conquistas com estado done/locked.
  var subData = {
    settings: {
      title: function () { return '// ' + __('CONFIGURAÇÕES') },
      icon: '\u2699',
      content: function () {
        var hidden = localStorage.getItem('mcookinho_notify_hidden') === 'true'
        var curLang = window.__lang ? window.__lang() : 'pt'
        return '<div class="sub-settings">' +
          '<div class="sub-setting-row">' +
            '<span class="sub-setting-label">' + __('IDIOMA') + '</span>' +
            '<div class="sub-setting-toggle" id="subLangToggle">' +
              '<span class="sub-toggle-opt' + (curLang === 'pt' ? ' active' : '') + '" data-lang="pt">PT-BR</span>' +
              '<span class="sub-toggle-opt' + (curLang === 'en' ? ' active' : '') + '" data-lang="en">EN-US</span>' +
            '</div>' +
          '</div>' +
          '<div class="sub-setting-row">' +
            '<span class="sub-setting-label">' + __('NOTIFICAÇÕES') + '</span>' +
            '<div class="sub-setting-toggle" id="subNotifyToggle">' +
              '<span class="sub-toggle-opt' + (hidden ? '' : ' active') + '" data-notify="show">' + __('MOSTRAR') + '</span>' +
              '<span class="sub-toggle-opt' + (hidden ? ' active' : '') + '" data-notify="hide">' + __('OCULTAR') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="sub-setting-divider"></div>' +
          '<div class="sub-setting-row">' +
            '<span class="sub-setting-label">' + __('MODO PROFISSIONAL') + '</span>' +
            '<a href="/professional/" class="sub-setting-link">' + __('ATIVAR') + '</a>' +
          '</div>' +
        '</div>'
      }
    },
    achievements: {
      title: function () { return '// ' + __('CONQUISTAS') },
      icon: '\u2B50',
      content: function () {
        var list = ACHIEVEMENTS.slice().sort(function (a, b) {
          if (a.done && !b.done) return -1
          if (!a.done && b.done) return 1
          return 0
        })
        var done = ACHIEVEMENTS.filter(function (a) { return a.done }).length
        var html = '<div class="sub-achieve-header">' + done + ' / ' + ACHIEVEMENTS.length + ' ' + __('CONQUISTAS') + '</div>'
        html += '<div class="sub-achieve-list">'
        list.forEach(function (a) {
          html += '<div class="sub-achieve-item' + (a.done ? ' done' : ' locked') + '">' +
            '<div class="sub-achieve-icon-wrap">' +
              '<span class="sub-achieve-icon">' + (a.done ? a.icon : a.lockedIcon) + '</span>' +
            '</div>' +
            '<div class="sub-achieve-body">' +
              '<span class="sub-achieve-name">' + trAchieveName(a.id) + '</span>' +
              '<span class="sub-achieve-desc">' + (a.done ? __(a.desc) : __(a.hint)) + '</span>' +
            '</div>' +
          '</div>'
        })
        html += '</div>'
        return html
      }
    }
  }

  // ── Achievement Definitions ──
  // Array central de todas as conquistas. Cada objeto tem:
  //   id        — chave única usada em localStorage e hooks
  //   name      — nome para exibição (traduzido via trAchieveName)
  //   icon      — emoji mostrado quando desbloqueada
  //   lockedIcon— cadeado (ícone padrão quando bloqueada)
  //   desc      — descrição mostrada ao desbloquear
  //   hint      — dica exibida quando ainda está bloqueada
  //   done      — estado atual (false até ser desbloqueada)
  // Para adicionar uma nova conquista: insira um objeto aqui, crie
  // o hook de desbloqueio (window.__unlockAchievement(id)) no local
  // apropriado, e adicione a tradução em lang.js se necessário.
  var ACHIEVEMENTS = [
    { id:'visit-social',    name:'EXPLORADOR DIGITAL', icon:'\uD83C\uDF10', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA visitou sua primeira rede social pelo site!', hint:'Clique nos \u00EDcones de rede social no in\u00EDcio da p\u00E1gina...', done:false },
    { id:'view-skill',      name:'SABEDORIA PIXEL',   icon:'\uD83D\uDCD6', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA explorou as habilidades do Peu!',           hint:'Clique em alguma skill na se\u00E7\u00E3o STACK...',   done:false },
    { id:'time-5min',       name:'PAUSA PRO CAF\u00C9', icon:'\u2615',   lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA ficou mais de 5 minutos no site!',          hint:'Fique mais tempo explorando o site...',              done:false },
    { id:'play-song',       name:'MELOMANIA',          icon:'\uD83C\uDFB5', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA colocou uma m\u00FAsica para tocar!',       hint:'Abra a biblioteca musical e escolha uma m\u00FAsica...', done:false },
    { id:'shiva-message',   name:'AU!',                icon:'\uD83D\uDC3E', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA mandou sua primeira mensagem pra Shiva!',  hint:'Tente conversar com a Shiva no fim da p\u00E1gina...', done:false },
    { id:'controller-10',   name:'NOSTALGI-A\u00C7\u00C3O', icon:'\uD83C\uDFAE', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA apertou 10 vezes no controle NES!',         hint:'Fique apertando os bot\u00F5es do controle NES...',   done:false },
    { id:'enter-tetris',    name:'BLOCO CAIU',         icon:'\uD83E\uDDF1', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA invocou o Tetris!',                         hint:'Use o c\u00F3digo Konami (\u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192 BA)', done:false },
    { id:'enter-doghouse',  name:'PASSEIO SOMBRIO',    icon:'\uD83D\uDE31', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA enfrentou o Terror de Shiva!',                hint:'Tente \u201Cpassear\u201D com a Shiva...',             done:false },
    { id:'shiva-100',       name:'MELHOR AMIGO',       icon:'\uD83D\uDC15', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA mandou 100 mensagens pra Shiva! Ela te ama!', hint:'Mande muuuuitas mensagens pra Shiva...',            done:false },
    { id:'tetris-5000',     name:'VICIADO EM TETRIS',  icon:'\uD83D\uDD79\uFE0F', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA fez 5.000+ pontos no Tetris!',               hint:'Jogue Tetris at\u00E9 passar dos 5.000 pontos...',    done:false },
    { id:'time-2h',         name:'SEM VIDA SOCIAL',    icon:'\uD83C\uDFE0', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA passou mais de 2 horas no site!',            hint:'Deixe o site aberto por muito tempo...',             done:false },
    { id:'tetris-15000',    name:'LENDA DO TETRIS',    icon:'\uD83D\uDC51', lockedIcon:'\uD83D\uDD12', desc:'Voc\u00EA fez 15.000+ pontos no Tetris! Lend\u00E1rio!', hint:'15.000+ pontos no Tetris... s\u00F3 os deuses!',     done:false },
  ]
  function trAchieveName(id) {
    var map = { 'visit-social':'EXPLORADOR DIGITAL', 'view-skill':'SABEDORIA PIXEL', 'time-5min':'PAUSA PRO CAF\u00C9', 'play-song':'MELOMANIA', 'shiva-message':'AU!', 'controller-10':'NOSTALGI-A\u00C7\u00C3O', 'enter-tetris':'BLOCO CAIU', 'enter-doghouse':'PASSEIO SOMBRIO', 'shiva-100':'MELHOR AMIGO', 'tetris-5000':'VICIADO EM TETRIS', 'time-2h':'SEM VIDA SOCIAL', 'tetris-15000':'LENDA DO TETRIS' }
    return map[id] ? __(map[id]) : ''
  }

  // ── Achievement Persistence (localStorage) ──
  // Salva apenas os IDs das conquistas desbloqueadas no localStorage
  // (chave "mcookinho_achievements") para persistir entre sessões.
  // loadAchievements() é chamado na inicialização; saveAchievements()
  // após cada novo desbloqueio via window.__unlockAchievement().
  function loadAchievements() {
    try {
      var saved = JSON.parse(localStorage.getItem('mcookinho_achievements'))
      if (saved && saved.length) {
        saved.forEach(function (id) {
          var a = ACHIEVEMENTS.find(function (a) { return a.id === id })
          if (a) a.done = true
        })
      }
    } catch (e) {}
  }
  loadAchievements()

  function saveAchievements() {
    var done = ACHIEVEMENTS.filter(function (a) { return a.done }).map(function (a) { return a.id })
    localStorage.setItem('mcookinho_achievements', JSON.stringify(done))
  }

  window.__unlockAchievement = function (id) {
    var a = ACHIEVEMENTS.find(function (a) { return a.id === id })
    if (!a || a.done) return false
    a.done = true
    saveAchievements()
    showAchieveToast(a)
    updateAchieveBadge()
    if (document.getElementById('subOverlay').classList.contains('open')) {
      var titleEl = document.getElementById('subTitle')
      if (titleEl && titleEl.textContent.indexOf('CONQUISTAS') !== -1) {
        document.getElementById('subBody').innerHTML = subData.achievements.content()
      }
    }
    return true
  }

  // ── Unlock Toast (notificação animada) ──
  // Cria e exibe um toast no canto superior direito quando uma
  // conquista é desbloqueada. A animação é CSS (classe .show).
  // O toast some após 4s. Respeita a preferência "notify_hidden".
  function showAchieveToast(a) {
    if (localStorage.getItem('mcookinho_notify_hidden') === 'true') return
    var toast = document.createElement('div')
    toast.className = 'unlock-toast'
    toast.innerHTML =
      '<div class="unlock-toast-inner">' +
        '<div class="unlock-toast-glow"></div>' +
        '<div class="unlock-toast-icon">' + a.icon + '</div>' +
        '<div class="unlock-toast-body">' +
          '<span class="unlock-toast-label">' + __('CONQUISTA DESBLOQUEADA!') + '</span>' +
          '<span class="unlock-toast-name">' + trAchieveName(a.id) + '</span>' +
        '</div>' +
      '</div>'
    document.body.appendChild(toast)
    requestAnimationFrame(function () { toast.classList.add('show') })
    setTimeout(function () {
      toast.classList.remove('show')
      setTimeout(function () { toast.remove() }, 400)
    }, 4000)
  }

  // ── Achievement Hooks (gatilhos de desbloqueio) ──
  // Cada hook abaixo monitora uma ação do usuário e chama
  // window.__unlockAchievement(id) quando a condição é satisfeita.
  // Para adicionar um novo gatilho: escreva o evento/listener aqui
  // e chame __unlockAchievement com o id definido em ACHIEVEMENTS.

  // Social media click
  var heroLinks = document.querySelectorAll('.hero-redes a')
  for (var hi = 0; hi < heroLinks.length; hi++) {
    heroLinks[hi].addEventListener('click', function () {
      window.__unlockAchievement('visit-social')
    })
  }

  // Time tracking
  var SITE_START = Date.now()
  setInterval(function () {
    var elapsed = Date.now() - SITE_START
    if (elapsed >= 5 * 60 * 1000) window.__unlockAchievement('time-5min')
    if (elapsed >= 2 * 60 * 60 * 1000) window.__unlockAchievement('time-2h')
  }, 15000)

  // Shiva message counter
  window.__shivaMessageCount = parseInt(localStorage.getItem('mcookinho_shiva_count') || '0', 10)
  window.__shivaMessageSent = function () {
    window.__shivaMessageCount++
    localStorage.setItem('mcookinho_shiva_count', window.__shivaMessageCount)
    if (window.__shivaMessageCount >= 1) window.__unlockAchievement('shiva-message')
    if (window.__shivaMessageCount >= 100) window.__unlockAchievement('shiva-100')
  }

  // Controller press counter
  window.__controllerPressCount = parseInt(localStorage.getItem('mcookinho_ctrl_count') || '0', 10)
  window.__countControllerPress = function () {
    window.__controllerPressCount++
    localStorage.setItem('mcookinho_ctrl_count', window.__controllerPressCount)
    if (window.__controllerPressCount >= 10) window.__unlockAchievement('controller-10')
  }

  // Tetris hooks
  window.__tetrisScore = function (score) {
    if (score >= 5000) window.__unlockAchievement('tetris-5000')
    if (score >= 15000) window.__unlockAchievement('tetris-15000')
  }
  window.__enterTetris = function () {
    window.__unlockAchievement('enter-tetris')
  }

  // Doghouse hook (called from shiva.js)
  window.__enterDoghouse = function () {
    window.__unlockAchievement('enter-doghouse')
  }

  // Music play hook (called from player.js)
  window.__songPlayed = function () {
    window.__unlockAchievement('play-song')
  }

  // ── Sub-overlay HTML (settings / achievements) ──
  // Cria o elemento do overlay dinamicamente e o insere no body.
  // O conteúdo é renderizado via subData[section].content().
  // Fecha ao clicar no X, no fundo (backdrop) ou ao pressionar ESC.
  // O event listener delegado no documento trata os toggles de idioma
  // e notificações dentro do overlay.
  var subOverlay = document.createElement('div')
  subOverlay.className = 'sub-overlay'
  subOverlay.id = 'subOverlay'
  subOverlay.innerHTML =
    '<div class="sub-panel">' +
      '<div class="sub-header">' +
        '<h2 class="sub-title" id="subTitle"></h2>' +
        '<button class="sub-close" id="subClose">[ X ]</button>' +
      '</div>' +
      '<div class="sub-body" id="subBody"></div>' +
    '</div>'
  document.body.appendChild(subOverlay)

  function openSubOverlay(section) {
    var data = subData[section]
    if (!data) return
    document.getElementById('subTitle').innerHTML = data.icon + ' ' + data.title()
    document.getElementById('subBody').innerHTML = data.content()
    subOverlay.classList.add('open')
  }

  document.getElementById('subClose').addEventListener('click', function () {
    subOverlay.classList.remove('open')
  })
  subOverlay.addEventListener('click', function (e) {
    if (e.target === subOverlay) subOverlay.classList.remove('open')
  })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && subOverlay.classList.contains('open')) subOverlay.classList.remove('open')
  })

  document.addEventListener('click', function (e) {
    var langToggle = e.target.closest('#subLangToggle .sub-toggle-opt')
    if (langToggle) {
      var lang = langToggle.getAttribute('data-lang')
      document.querySelectorAll('#subLangToggle .sub-toggle-opt').forEach(function (el) {
        el.classList.remove('active')
      })
      langToggle.classList.add('active')
      if (typeof window.__setLang === 'function') {
        window.__setLang(lang)
      }
    }
    var notifyToggle = e.target.closest('#subNotifyToggle .sub-toggle-opt')
    if (notifyToggle) {
      var hide = notifyToggle.getAttribute('data-notify') === 'hide'
      localStorage.setItem('mcookinho_notify_hidden', hide)
      document.querySelectorAll('#subNotifyToggle .sub-toggle-opt').forEach(function (el) {
        el.classList.remove('active')
      })
      notifyToggle.classList.add('active')
    }
  })

  // Re-render overlays on language change
  window.addEventListener('langchange', function () {
    if (document.getElementById('subOverlay') && document.getElementById('subOverlay').classList.contains('open')) {
      var titleEl = document.getElementById('subTitle')
      if (titleEl) {
        var section = titleEl.textContent.indexOf('CONFIGURAÇÕES') !== -1 || titleEl.textContent.indexOf('SETTINGS') !== -1 ? 'settings' :
                      titleEl.textContent.indexOf('CONQUISTAS') !== -1 || titleEl.textContent.indexOf('ACHIEVEMENTS') !== -1 ? 'achievements' : null
        if (section) {
          document.getElementById('subTitle').innerHTML = subData[section].icon + ' ' + subData[section].title()
          document.getElementById('subBody').innerHTML = subData[section].content()
        }
      }
    }
    updateAchieveBadge()
    updateRankBadge()
  })

  // Update achievements count in dropdown
  var ndAchieveSub = document.getElementById('ndAchieveSub')
  function updateAchieveBadge() {
    var done = ACHIEVEMENTS.filter(function (a) { return a.done }).length
    ndAchieveSub.textContent = done + ' / ' + ACHIEVEMENTS.length + ' ' + __('CONQUISTAS')
  }
  updateAchieveBadge()

  // Update rankings sub in dropdown
  var ndRankSub = document.getElementById('ndRankSub')
  function updateRankBadge() {
    ndRankSub.textContent = __('Rankings baseados na minha opinião')
  }
  window.__updateRankBadge = updateRankBadge
  updateRankBadge()

  // ── Rankings (overlay de listas pessoais) ──
  // Carrega dados de arquivos JSON em data/rankings/<tipo>.json.
  // Cada tipo tem seu próprio formato de item: tetris (score/lines/level),
  // filmes/séries (sinopse/review/rating), jogos (review/rating),
  // musicas (artist/spotify/rating). Itens são ordenados por score
  // (tetris) ou rating (demais). O ranking de tetris inclui dinamicamente
  // o recorde do jogador salvo em localStorage.
  // getDefaultData() fornece fallback se o JSON não carregar.
  var rankData = {}
  var rankOrder = ['tetris','filmes','jogos','series','musicas']

  function loadRankData() {
    var loaded = 0; var total = rankOrder.length
    rankOrder.forEach(function (key) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', 'data/rankings/' + key + '.json', true)
      xhr.onload = function () {
        if (xhr.status === 200) {
          try { rankData[key] = JSON.parse(xhr.responseText) } catch (e) { rankData[key] = getDefaultData(key) }
        } else { rankData[key] = getDefaultData(key) }
        loaded++
        if (loaded === total) renderRankTab(getActiveRankTab())
      }
      xhr.onerror = function () { rankData[key] = getDefaultData(key); loaded++; if (loaded === total) renderRankTab(getActiveRankTab()) }
      xhr.send()
    })
  }
  function getActiveRankTab() {
    var active = document.querySelector('#rkTabs .rk-tab.active')
    if (active && active.style.display !== 'none') return active.getAttribute('data-rank')
    return 'filmes'
  }
  function getDefaultData(key) {
    var defs = {
      tetris: [
        {name:'Peu Borges',score:9999,lines:152,level:15},
        {name:'Shiva',score:5000,lines:78,level:9}
      ],
      filmes: [
        {name:'Interestelar',type:'Ficção Científica',synopsis:'...',review:'Obra-prima.',rating:5.0},
        {name:'Clube da Luta',type:'Drama',synopsis:'...',review:'Genial.',rating:5.0}
      ],
      jogos: [
        {name:'Zelda: Breath of the Wild',type:'Aventura',synopsis:'...',review:'Liberdade total.',rating:5.0},
        {name:'Elden Ring',type:'RPG',synopsis:'...',review:'Obra-prima.',rating:5.0}
      ],
      series: [
        {name:'Breaking Bad',type:'Drama',synopsis:'...',review:'Melhor série.',rating:5.0,favoriteEpisode:'Ozymandias'},
        {name:'Dark',type:'Sci-Fi',synopsis:'...',review:'Complexa.',rating:5.0,favoriteEpisode:'Final'}
      ],
      musicas: [
        {name:'Bohemian Rhapsody',artist:'Queen',spotify:'',rating:5.0},
        {name:'Stairway to Heaven',artist:'Led Zeppelin',spotify:'',rating:5.0}
      ]
    }
    return defs[key] || []
  }

  function renderRankTab(key) {
    var body = document.getElementById('rkBody')
    var items = (rankData[key] || []).slice()
    
    if (key === 'tetris') {
      var playerScore = parseInt(localStorage.getItem('tetrisHighScore')) || 0
      var hasPlayer = items.some(function (i) { return i.name === 'VOCÊ' || i.name === 'YOU' })
      if (playerScore > 0 && !hasPlayer) {
        items.push({name:__('VOCÊ'),score:playerScore,lines:0,level:0})
      }
      items.sort(function (a, b) { return b.score - a.score })
    } else {
      items = items.slice().sort(function (a, b) { return b.rating - a.rating })
    }

    var html = ''
    if (key === 'tetris') {
      var hs = parseInt(localStorage.getItem('tetrisHighScore')) || 0
      html += '<div class="rk-score-header">' + __('SEU RECORDE') + ': <strong>' + hs + '</strong> | ' + __('ORDENADO POR SCORE') + '</div>'
    } else {
      html += '<div class="rk-score-header">' + __('ORDENADO POR AVALIAÇÃO PESSOAL') + '</div>'
    }

    if (items.length === 0) {
      html += '<div class="rk-empty">' + __('NENHUM ITEM AINDA') + '</div>'
    } else {
      items.forEach(function (item, i) {
        html += renderRankItem(key, item, i + 1)
      })
    }

    body.innerHTML = html
    requestAnimationFrame(function () {
      body.querySelectorAll('.rk-item').forEach(function (el, idx) {
        el.style.transitionDelay = (idx * 0.04 + 0.05) + 's'
      })
    })

    // click to expand
    body.querySelectorAll('.rk-item').forEach(function (el) {
      el.addEventListener('click', function () {
        el.classList.toggle('open')
      })
    })
  }

  function renderStars(rating) {
    var full = Math.floor(rating)
    var half = rating - full >= 0.5 ? 1 : 0
    var empty = 5 - full - half
    var s = ''
    for (var i = 0; i < full; i++) s += '<span class="rk-star filled">★</span>'
    if (half) s += '<span class="rk-star filled" style="opacity:0.6">★</span>'
    for (var i = 0; i < empty; i++) s += '<span class="rk-star empty">★</span>'
    return s
  }

  function renderRankItem(key, item, pos) {
    var html = '<div class="rk-item">'
    html += '<div class="rk-pos">' + pos + '</div>'
    html += '<div class="rk-item-body">'
    html += '<div class="rk-item-top">'
    html += '<div><div class="rk-item-name">' + item.name + '</div>'
    html += '<div class="rk-item-meta">'

    if (key === 'tetris') {
      html += '<span class="rk-item-detail">' + item.lines + ' ' + __('LINES') + '</span>'
      html += '<span class="rk-item-detail">' + __('LEVEL') + ' ' + item.level + '</span>'
      html += '</div></div>'
      html += '<span class="rk-score-val">' + item.score + '</span>'
    } else {
      if (item.type) html += '<span class="rk-item-type">' + (Array.isArray(item.type) ? item.type.join(' · ') : item.type) + '</span>'
      if (item.artist) html += '<span class="rk-item-detail">' + item.artist + '</span>'
      html += '</div></div>'
      html += '<div class="rk-stars-wrap"><div class="rk-stars">' + renderStars(item.rating) + '</div><div class="rk-rating-text">' + item.rating.toFixed(1).replace('.', ',') + '/5</div></div>'
    }

    html += '</div>' // end item-top

    // Expandable detail
    var hasDetail = false
    var detailHtml = ''
    if (key === 'tetris') {
      // no extra detail for tetris
    } else if (key === 'musicas') {
      if (item.spotify) {
        hasDetail = true
        detailHtml += '<div class="rk-detail-label">🎧 ' + __('OUÇA') + '</div>'
        detailHtml += '<a href="' + item.spotify + '" target="_blank" class="rk-spotify-link">' + __('OPEN SPOTIFY') + '</a>'
      }
    } else {
      if (item.synopsis) {
        hasDetail = true
        detailHtml += '<div class="rk-detail-label">📖 ' + __('SINOPSE') + '</div>'
        detailHtml += '<div class="rk-detail-text">' + item.synopsis + '</div>'
      }
      if (item.review) {
        hasDetail = true
        detailHtml += '<div class="rk-detail-label">💬 ' + __('MINHA OPINIÃO') + '</div>'
        detailHtml += '<div class="rk-detail-text">' + item.review + '</div>'
      }
      if (item.favoriteEpisode) {
        hasDetail = true
        detailHtml += '<div class="rk-fav-ep">⭐ ' + __('EPISÓDIO FAVORITO') + ': <strong>' + item.favoriteEpisode + '</strong></div>'
      }
    }

    if (hasDetail) {
      html += '<div class="rk-detail">' + detailHtml + '</div>'
      html += '<span class="rk-expand-hint">▼</span>'
    }

    html += '</div></div>'
    return html
  }

  // ── Rankings Overlay ──
  var rankOverlay = document.getElementById('rkOverlay')

  function openRankOverlay() {
    var tetrisUnlocked = ACHIEVEMENTS.some(function (a) { return a.id === 'enter-tetris' && a.done })
    var tetrisTab = document.querySelector('#rkTabs .rk-tab[data-rank="tetris"]')
    if (tetrisTab) tetrisTab.style.display = tetrisUnlocked ? '' : 'none'
    var active = getActiveRankTab()
    if (active === 'tetris' && !tetrisUnlocked) active = 'filmes'
    rkSwitchTab(active)
    rankOverlay.classList.add('open')
  }

  function closeRankOverlay() {
    rankOverlay.classList.remove('open')
  }

  function rkSwitchTab(key) {
    document.querySelectorAll('#rkTabs .rk-tab').forEach(function (t) { t.classList.remove('active') })
    var tab = document.querySelector('#rkTabs .rk-tab[data-rank="' + key + '"]')
    if (tab) tab.classList.add('active')
    renderRankTab(key)
  }

  document.getElementById('rkClose').addEventListener('click', closeRankOverlay)
  rankOverlay.addEventListener('click', function (e) {
    if (e.target === rankOverlay) closeRankOverlay()
  })

  document.querySelectorAll('#rkTabs .rk-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      rkSwitchTab(this.getAttribute('data-rank'))
    })
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && rankOverlay.classList.contains('open')) closeRankOverlay()
  })

  loadRankData()
})()

// ── Skill Overlay (modal de habilidades) ──
// Ao clicar em uma skill na seção STACK, abre um modal com:
// nome, categoria, descrição detalhada, nível em % e uma barra
// segmentada (Iniciante/Intermediário/Avançado/Expert).
// O ícone de cada skill é definido no objeto icons{}.
// Dados (desc + pct) no objeto data{} — para adicionar uma skill
// nova, inclua a entrada em ambos os objetos e o <span> no HTML.
;(function () {
    var overlay = document.getElementById('skillOverlay')
    var closeBtn = document.getElementById('skillClose')
    var skillName = document.getElementById('skillName')
    var skillCategory = document.getElementById('skillCategory')
    var skillIcon = document.getElementById('skillIcon')
    var skillDesc = document.getElementById('skillDesc')
    var skillPct = document.getElementById('skillPct')
    var skillBarFill = document.getElementById('skillBarFill')

    var icons = {
      PYTHON: '🐍',
      JAVA: '☕',
      JAVASCRIPT: 'JS',
      TYPESCRIPT: 'TS',
      C: 'C',
      'C++': '++',
      'C#': '#',
      BASH: '>$',
      GML: 'GM',
      GIT: '<>',
      LINUX: '🐧',
      DOCKER: '🐳',
      GODOT: 'GD',
      ARDUINO: '⚡',
      NCURSES: 'nc',
      SQL: 'SQL',
      MONGODB: 'MDB',
      AWS: 'AWS',
      GOOGLECLOUD: 'GC',
      FLSTUDIO: 'FL',
      UNITY: 'UN',
      GAMEMAKER: 'GM',
      'CAF\u00c9 EXTREMO': '☕',
      'C\u00d3DIGO 3AM': '🌙',
      TERMINAL: '>_',
      'CAOS ORGANIZADO': '*',
    }

    var data = {
      PYTHON: { desc: 'Minha linguagem principal. Uso para automação, bots, scripts, back-end e ferramentas de terminal. Já fiz desde web scrapers até port de FNAF pro terminal.', pct: 90 },
      JAVA: { desc: 'Aprendi na faculdade de engenharia. Já fiz projetos com Swing, sockets, threads e sistemas distribuídos. Confortável com OO e padrões de projeto.', pct: 75 },
      JAVASCRIPT: { desc: 'Uso no front-end e back-end (Node). Criei jogos, bots, interfaces interativas e este site. É a linguagem que mais uso no dia a dia junto com Python.', pct: 85 },
      TYPESCRIPT: { desc: 'Uso com React e Node para projetos maiores. A tipagem salva vidas em projetos complexos. Prefiro TS puro JS em projetos sérios.', pct: 70 },
      C: { desc: 'Aprendi na faculdade e por conta própria. Já implementei do zero um port do FNAF pro terminal usando ncurses, incluindo áudio e mecânicas.', pct: 65 },
      'C++': { desc: 'Conhecimento intermediário. Uso para jogos, algoritmos e performance. Já brinquei com Unreal Engine e C++ puro.', pct: 60 },
      'C#': { desc: 'Uso exclusivamente com Unity para desenvolvimento de jogos. Scripts de gameplay, sistemas de física, UI e mecânicas 2D/3D.', pct: 55 },
      BASH: { desc: 'Automação de tarefas, scripts de deploy, ferramentas de terminal. Linux é meu SO principal, então vivo escrevendo shell script.', pct: 80 },
      GML: { desc: 'GameMaker Language. Usei para fazer jogos pequenos e protótipos. Sei criar mecânicas 2D, animação e sistemas de gameplay.', pct: 50 },
      GIT: { desc: 'Versionamento, branches, rebase, resolução de conflitos. Uso diariamente em todos os meus projetos, pessoais e acadêmicos.', pct: 85 },
      LINUX: { desc: 'Meu sistema operacional principal. Arquitetura de sistemas, pacotes, shell scripting, configuração de servidores. Vivo no terminal.', pct: 85 },
      DOCKER: { desc: 'Conteinerização, Dockerfiles, docker-compose. Uso para criar ambientes de desenvolvimento isolados e deploy de aplicações.', pct: 60 },
      GODOT: { desc: 'Engine de jogos open-source. Sei fazer protótipos e jogos 2D completos com GDScript. Acompanho o desenvolvimento da engine.', pct: 55 },
      ARDUINO: { desc: 'Eletrônica, sensores, atuadores, comunicação serial. Projetos da faculdade e hobby. Já fiz desde led blink até sistemas com sensores.', pct: 50 },
      NCURSES: { desc: 'Interfaces de terminal em C. Usei extensivamente no port do FNAF e em ferramentas interativas. Sei criar menus, animações e input handling.', pct: 65 },
      SQL: { desc: 'Consultas, modelagem de dados, joins, subqueries. Uso com PostgreSQL, SQLite e MySQL para análise de dados e back-end.', pct: 70 },
      MONGODB: { desc: 'Banco NoSQL orientado a documentos. Já usei com Node.js para armazenamento flexível e agregações.', pct: 55 },
      AWS: { desc: 'Serviços cloud da Amazon: EC2, S3, Lambda, RDS. Experiência com deploy e infraestrutura básica.', pct: 65 },
      GOOGLECLOUD: { desc: 'Google Cloud Platform: Cloud Run, Firestore, Storage. Uso para deploy de aplicações serverless.', pct: 45 },
      FLSTUDIO: { desc: 'Produção musical, beatmaking, mixing e sound design. Uso para criar trilhas sonoras e efeitos sonoros para jogos.', pct: 60 },
      UNITY: { desc: 'Engine de jogos com C#. Já fiz protótipos 2D/3D, sistemas de física e UI. Conhecimento de prefabs, animação e cenas.', pct: 55 },
      GAMEMAKER: { desc: 'Engine 2D com GML. Usei para criar jogos completos, incluindo sistemas de combate, crafting e diálogos.', pct: 50 },
      'CAF\u00c9 EXTREMO': { desc: 'Combustível oficial do sistema. Se não tem café, não tem código. Média de 5+ xícaras por dia. Já fui confundido com uma máquina de café.', pct: 100 },
      'C\u00d3DIGO 3AM': { desc: 'O código só fica bom depois da meia-noite. Horário oficial de produção. Se você receber commit às 3h, foi proposital.', pct: 95 },
      TERMINAL: { desc: 'Odeio mouse. Vivo no terminal desde 2020. Tmux + Vim + Linux = setup ideal. Prompt personalizado, aliases, tudo no keyboard-driven.', pct: 90 },
      'CAOS ORGANIZADO': { desc: 'Meu código parece uma bagunça até você perceber que cada detalhe tem um motivo. Organização caótica mas funcional. Funciona? Então ta certo.', pct: 85 },
    }

    function closeSkill() {
      overlay.classList.remove('open')
    }

    function openSkill(name, category) {
      var info = data[name]
      if (!info) return

      skillName.textContent = name
      skillCategory.textContent = '// ' + category

      var iconHtml = icons[name] || '&#x25CF;'
      skillIcon.innerHTML = iconHtml

      skillDesc.textContent = info.desc

      var pct = info.pct
      skillPct.textContent = pct + '%'

      overlay.classList.add('open')
      if (typeof window.__unlockAchievement === 'function') {
        window.__unlockAchievement('view-skill')
      }

      skillBarFill.style.width = '0%'
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          skillBarFill.style.width = pct + '%'
        })
      })

      var segEl = document.getElementById('skillBarSegments')
      segEl.innerHTML = ''
      var labels = [__('INICIANTE'), __('INTERMEDI\u00c1RIO'), __('AVAN\u00c7ADO'), __('EXPERT')]
      for (var i = 0; i < labels.length; i++) {
        var s = document.createElement('span')
        s.textContent = labels[i]
        if (pct >= (i + 1) * 25) s.className = 'filled'
        segEl.appendChild(s)
      }
    }

    var spans = document.querySelectorAll('.skill-items span')
    spans.forEach(function (span) {
      span.addEventListener('click', function () {
        var name = span.textContent.trim()
        var bloco = span.closest('.skill-bloco')
        var h3 = bloco ? bloco.querySelector('h3') : null
        var category = h3 ? h3.textContent.trim() : 'SKILL'
        openSkill(name, category)
      })
    })

    closeBtn.addEventListener('click', closeSkill)
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSkill()
    })

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeSkill()
    })
  })()
