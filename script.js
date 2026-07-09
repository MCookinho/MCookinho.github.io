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
  var overlay = document.getElementById('skillOverlay')
  var closeBtn = document.getElementById('skillClose')
  var skillName = document.getElementById('skillName')
  var skillCategory = document.getElementById('skillCategory')
  var skillIcon = document.getElementById('skillIcon')
  var skillDesc = document.getElementById('skillDesc')
  var skillPct = document.getElementById('skillPct')
  var skillBarFill = document.getElementById('skillBarFill')

  var icons = {
    PYTHON: '&#x1F40D;',
    JAVA: '&#x2615;',
    JAVASCRIPT: '{ }',
    TYPESCRIPT: 'TS',
    C: 'C',
    'C++': 'C++',
    BASH: '&#xBB;',
    GML: 'GML',
    GIT: '&#x2248;',
    LINUX: '&#x2728;',
    DOCKER: '&#x1F433;',
    GODOT: '&#x25C6;',
    ARDUINO: '&#x26A1;',
    NCURSES: '&#x25A3;',
    'CAF\u00c9 EXTREMO': '&#x2615;',
    'C\u00d3DIGO 3AM': '&#x1F319;',
    TERMINAL: '&#x25A0;',
    'CAOS ORGANIZADO': '&#x1F4A5;',
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
