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
    Backspace: 'ctrl-select',
    Enter: 'ctrl-start',
    b: 'ctrl-b',
    a: 'ctrl-a',
    B: 'ctrl-b',
    A: 'ctrl-a',
  }

  var buttons = document.querySelectorAll('.ctrl-btn')

  function dispatch(key, type) {
    document.dispatchEvent(new KeyboardEvent(type, { key: key, bubbles: true }))
  }

  // Click/tap -> dispatch + visual
  buttons.forEach(function (btn) {
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

  // Keyboard -> visual
  document.addEventListener('keydown', function (e) {
    var cls = keyMap[e.key]
    if (cls) {
      var el = document.querySelector('.' + cls)
      if (el) el.classList.add('pressed')
    }
  })
  document.addEventListener('keyup', function (e) {
    var cls = keyMap[e.key]
    if (cls) {
      var el = document.querySelector('.' + cls)
      if (el) el.classList.remove('pressed')
    }
  })
})()
