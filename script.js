(function() {

  // Age
  var birth = new Date(2005, 3, 18);
  var today = new Date();
  var age = today.getFullYear() - birth.getFullYear();
  var m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  document.getElementById('heroIdade').textContent = age + ' ANOS // SALVADOR, BA';

  // Nav scroll
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  // Mobile toggle
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function() {
    links.classList.toggle('open');
  });

  // Close nav on link click
  var navAnchors = links.querySelectorAll('a');
  for (var i = 0; i < navAnchors.length; i++) {
    navAnchors[i].addEventListener('click', function() {
      links.classList.remove('open');
    });
  }

  // Scroll observer
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

  // Keyboard -> visual (affects all controllers)
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

  // Section actions
  function onSectionClick(section) {
    if (section === 'music') return
    closeDropdown()
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

  // ── Sub-overlays ──
  var subData = {
    settings: {
      title: '// CONFIGURAÇÕES',
      icon: '\u2699',
      content: function () {
        return '<div class="sub-settings">' +
          '<div class="sub-setting-row">' +
            '<span class="sub-setting-label">IDIOMA</span>' +
            '<div class="sub-setting-toggle" id="subLangToggle">' +
              '<span class="sub-toggle-opt active" data-lang="pt">PT-BR</span>' +
              '<span class="sub-toggle-opt" data-lang="en">EN-US</span>' +
            '</div>' +
          '</div>' +
        '</div>'
      }
    },
    achievements: {
      title: '// CONQUISTAS',
      icon: '\u2B50',
      content: function () {
        var list = ACHIEVEMENTS
        var done = list.filter(function (a) { return a.done }).length
        var html = '<div class="sub-achieve-header">' + done + ' / ' + list.length + ' CONQUISTAS</div>'
        html += '<div class="sub-achieve-list">'
        list.forEach(function (a) {
          html += '<div class="sub-achieve-item' + (a.done ? ' done' : ' locked') + '">' +
            '<span class="sub-achieve-icon">' + (a.done ? '\u2B50' : '\u25CB') + '</span>' +
            '<div class="sub-achieve-body">' +
              '<span class="sub-achieve-name">' + a.name + '</span>' +
              '<span class="sub-achieve-desc">' + a.desc + '</span>' +
            '</div>' +
          '</div>'
        })
        html += '</div>'
        return html
      }
    },
    rankings: {
      title: '// RANKINGS',
      icon: '\uD83C\uDFC6',
      content: function () {
        var rankings = RANKINGS
        var html = ''
        rankings.forEach(function (r) {
          html += '<div class="sub-rank-block">' +
            '<h4 class="sub-rank-title">' + r.title + '</h4>'
          r.items.forEach(function (item, i) {
            html += '<div class="sub-rank-item">' +
              '<span class="sub-rank-pos">' + (i + 1) + '.</span>' +
              '<span class="sub-rank-name">' + item.name + '</span>' +
              (item.value ? '<span class="sub-rank-value">' + item.value + '</span>' : '') +
            '</div>'
          })
          html += '</div>'
        })
        return html
      }
    }
  }

  var ACHIEVEMENTS = [
    { name: 'PRIMEIRO COMMIT', desc: 'Fez o primeiro commit no portfólio', done: true },
    { name: '5 PROJETOS', desc: 'Publicou 5 projetos no portfólio', done: true },
    { name: 'CÓDIGO 3AM', desc: 'Fez um commit depois da meia-noite', done: true },
    { name: 'SHIVA FAMOSA', desc: 'Shiva apareceu no site', done: true },
    { name: 'PLAYLIST COMPLETA', desc: 'Adicionou 10+ músicas na playlist', done: true },
    { name: 'TETRIS MASTER', desc: 'Fez 10000+ pontos no Tetris', done: false },
    { name: 'OVERTURE', desc: 'Completou o jogo Doghouse', done: false },
    { name: 'POLIGLOTA', desc: 'Usou o site em 2+ idiomas', done: false },
    { name: 'COLECIONADOR', desc: 'Desbloqueou todas as conquistas', done: false },
    { name: 'FÃ NÚMERO 1', desc: 'Visitou o site 100+ vezes', done: false },
  ]

  var RANKINGS = [
    {
      title: 'TETRIS',
      items: [
        { name: 'VOCÊ', value: localStorage.getItem('tetrisHighScore') || '0' },
        { name: 'PEU BORGES', value: '9999' },
        { name: 'SHIVA', value: '🐾' },
      ]
    },
    {
      title: 'PESSOAS MAIS IMPORTANTES',
      items: [
        { name: 'SHIVA', value: 'GOLDEN RETRIEVER' },
        { name: 'FAMÍLIA', value: 'BASE' },
        { name: 'AMIGOS', value: '🚀' },
      ]
    }
  ]

  // ── Sub-overlay HTML ──
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
    document.getElementById('subTitle').innerHTML = data.icon + ' ' + data.title
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
    var toggle = e.target.closest('#subLangToggle .sub-toggle-opt')
    if (toggle) {
      document.querySelectorAll('#subLangToggle .sub-toggle-opt').forEach(function (el) {
        el.classList.remove('active')
      })
      toggle.classList.add('active')
    }
  })

  // Update achievements count in dropdown
  var ndAchieveSub = document.getElementById('ndAchieveSub')
  function updateAchieveBadge() {
    var done = ACHIEVEMENTS.filter(function (a) { return a.done }).length
    ndAchieveSub.textContent = done + ' / ' + ACHIEVEMENTS.length + ' CONQUISTAS'
  }
  updateAchieveBadge()

  // Update rankings sub in dropdown
  var ndRankSub = document.getElementById('ndRankSub')
  function updateRankBadge() {
    var hs = localStorage.getItem('tetrisHighScore')
    ndRankSub.textContent = 'TETRIS: ' + (hs || '0') + ' / PESSOAS'
  }
  updateRankBadge()

  // Update rank values from localStorage
  var tetrisScore = localStorage.getItem('tetrisHighScore')
  if (tetrisScore && RANKINGS[0].items[0]) {
    RANKINGS[0].items[0].value = tetrisScore
  }
})()

;(function () {
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
      BASH: '>$',
      GML: 'GM',
      GIT: '<>',
      LINUX: '🐧',
      DOCKER: '🐳',
      GODOT: 'GD',
      ARDUINO: '⚡',
      NCURSES: 'nc',
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
      BASH: { desc: 'Automação de tarefas, scripts de deploy, ferramentas de terminal. Linux é meu SO principal, então vivo escrevendo shell script.', pct: 80 },
      GML: { desc: 'GameMaker Language. Usei para fazer jogos pequenos e protótipos. Sei criar mecânicas 2D, animação e sistemas de gameplay.', pct: 50 },
      GIT: { desc: 'Versionamento, branches, rebase, resolução de conflitos. Uso diariamente em todos os meus projetos, pessoais e acadêmicos.', pct: 85 },
      LINUX: { desc: 'Meu sistema operacional principal. Arquitetura de sistemas, pacotes, shell scripting, configuração de servidores. Vivo no terminal.', pct: 85 },
      DOCKER: { desc: 'Conteinerização, Dockerfiles, docker-compose. Uso para criar ambientes de desenvolvimento isolados e deploy de aplicações.', pct: 60 },
      GODOT: { desc: 'Engine de jogos open-source. Sei fazer protótipos e jogos 2D completos com GDScript. Acompanho o desenvolvimento da engine.', pct: 55 },
      ARDUINO: { desc: 'Eletrônica, sensores, atuadores, comunicação serial. Projetos da faculdade e hobby. Já fiz desde led blink até sistemas com sensores.', pct: 50 },
      NCURSES: { desc: 'Interfaces de terminal em C. Usei extensivamente no port do FNAF e em ferramentas interativas. Sei criar menus, animações e input handling.', pct: 65 },
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

      skillBarFill.style.width = '0%'
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          skillBarFill.style.width = pct + '%'
        })
      })

      var segEl = document.getElementById('skillBarSegments')
      segEl.innerHTML = ''
      var labels = ['INICIANTE', 'INTERMEDI\u00c1RIO', 'AVAN\u00c7ADO', 'EXPERT']
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
