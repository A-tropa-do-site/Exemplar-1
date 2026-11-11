/**
 * RESTAURANTE & PIZZARIA — MODELO INSTITUCIONAL
 * Scripts de Interatividade & Drawer Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. HEADER SCROLL EFFECT (60 FPS THROTTLED COM REQUESTANIMATIONFRAME)
  const header = document.querySelector('.header');
  let isScrolling = false;

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // 2. HERO SLIDESHOW COM SLOW ZOOM IN (BARBACOA STYLE)
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let slideshowTimer;
  let heroInView = true;
  function updateMotion() {
    const paused = reducedMotion.matches;
    document.documentElement.dataset.motionPaused = String(paused);
    clearInterval(slideshowTimer);
    if (slides.length > 1 && !paused && !document.hidden && heroInView) {
      slideshowTimer = setInterval(nextSlide, 3500);
    }
    document.dispatchEvent(new Event('motionpreferencechange'));
  }
  reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { heroInView = entry.isIntersecting; updateMotion(); }).observe(document.querySelector('#inicio'));
  }
  updateMotion();

  // 3. MENU HAMBÚRGUER & DRAWER LATERAL (OFF-CANVAS)
  const drawerToggle = document.getElementById('drawerToggle');
  const drawerClose = document.getElementById('drawerClose');
  const navDrawer = document.getElementById('navDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const background = [...document.body.children].filter(element =>
    ![navDrawer, drawerOverlay].includes(element) && element.tagName !== 'SCRIPT');
  let previousInert;
  let previousOverflow;
  let returnFocus;

  function openDrawer() {
    if (navDrawer.classList.contains('open')) return;
    returnFocus = document.activeElement;
    previousInert = background.map(element => element.inert);
    previousOverflow = document.body.style.overflow;
    background.forEach(element => { element.inert = true; });
    navDrawer.inert = false;
    navDrawer.removeAttribute('aria-hidden');
    navDrawer.setAttribute('aria-modal', 'true');
    drawerToggle.setAttribute('aria-expanded', 'true');
    navDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    drawerClose.focus({ preventScroll: true });
  }

  function closeDrawer() {
    if (!navDrawer.classList.contains('open')) return;
    background.forEach((element, index) => { element.inert = previousInert[index]; });
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = previousOverflow;
    navDrawer.removeAttribute('aria-modal');
    drawerToggle.setAttribute('aria-expanded', 'false');
    (returnFocus?.isConnected ? returnFocus : drawerToggle).focus({ preventScroll: true });
    navDrawer.inert = true;
    navDrawer.setAttribute('aria-hidden', 'true');
  }

  navDrawer.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeDrawer(); }
    if (event.key !== 'Tab') return;
    const controls = [...navDrawer.querySelectorAll('button, a[href]')].filter(element => element.getClientRects().length > 0 && !element.disabled);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  if (drawerToggle) drawerToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 5. WHATSAPP GENERATOR PARA ANIVERSÁRIOS & RESERVAS
  const bdayForm = document.getElementById('bdayForm');
  if (bdayForm) {
    bdayForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bdayName').value.trim();
      const date = document.getElementById('bdayDate').value;
      const guests = document.getElementById('bdayGuests').value;

      const message = `Olá! Gostaria de consultar disponibilidade para comemorar um aniversário.\n\n• Nome: ${name}\n• Data: ${date}\n• Nº de Convidados: ${guests} pessoas`;
      const encodedMsg = encodeURIComponent(message);
      
      window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${encodedMsg}`, '_blank');
    });
  }

  // 6. MOSAIC STRIP HOVER / CLICK INTERACTION
  const mosaicItems = document.querySelectorAll('.mosaic-item');
  mosaicItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      mosaicItems.forEach(d => d.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // 7. SMOOTH SCROLL PARA LINKS ÂNCORA
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: reducedMotion.matches ? 'instant' : 'smooth',
          block: 'start'
        });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
});
