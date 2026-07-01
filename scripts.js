function calcAge() {
  const birth = new Date(2005, 3, 18);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

document.getElementById('heroAge').textContent = calcAge() + ' anos';

let lang = 'pt';

const strings = {
  pt: {
    tagline: 'engenheiro da computação \u2022 dev \u2022 criador de jogos',
    quote: 'vivendo a vida da maneira que eu quero viver',
  },
  en: {
    tagline: 'computer engineer \u2022 dev \u2022 game maker',
    quote: 'living life the way I want to live it',
  }
};

document.getElementById('langToggle').addEventListener('click', () => {
  lang = lang === 'pt' ? 'en' : 'pt';
  const s = strings[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (s[key]) el.textContent = s[key];
  });
  document.getElementById('langToggle').textContent = lang === 'pt' ? '[ PT ]' : '[ EN ]';
});

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.section:not(.hero)').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});

document.querySelectorAll('.work-card, .game-card, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
