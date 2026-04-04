/* =============================================
   HOTEL WHITE DREAMS - Main JavaScript
   hotelwhitedreams.com
   ============================================= */

// NAVBAR
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

// MOBILE NAV
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const overlay   = document.getElementById('overlay');
const closeBtn  = document.getElementById('closeBtn');

function openNav() {
  if (!mobileNav) return;
  mobileNav.classList.add('open');
  if (overlay) overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
}
if (hamburger) hamburger.addEventListener('click', openNav);
if (closeBtn)  closeBtn.addEventListener('click', closeNav);
if (overlay)   overlay.addEventListener('click', closeNav);

// HERO SLIDER
const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length > 0) {
  let currentSlide = 0;
  setInterval(() => {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  }, 5000);
}

// TESTIMONIALS SLIDER - fully fixed
(function () {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;

  const GAP    = 24;
  const cards  = Array.from(track.querySelectorAll('.testimonial-card'));
  let   tIndex = 0;

  function getVisible() {
    if (window.innerWidth < 768)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function setCardWidths() {
    const visible   = getVisible();
    const container = track.parentElement.offsetWidth;
    const cardW     = (container - GAP * (visible - 1)) / visible;
    cards.forEach(c => {
      c.style.width     = cardW + 'px';
      c.style.minWidth  = cardW + 'px';
      c.style.flexShrink = '0';
    });
    return cardW;
  }

  function goTo(idx) {
    const visible = getVisible();
    const maxIdx  = Math.max(0, cards.length - visible);
    tIndex = Math.max(0, Math.min(idx, maxIdx));
    const cardW = setCardWidths();
    const stepW = cardW + GAP;
    track.style.transition = 'transform 0.5s ease';
    track.style.transform  = 'translateX(-' + (tIndex * stepW) + 'px)';
  }

  const tPrev = document.querySelector('.t-btn.prev');
  const tNext = document.querySelector('.t-btn.next');
  if (tPrev) tPrev.addEventListener('click', () => goTo(tIndex - 1));
  if (tNext) tNext.addEventListener('click', () => goTo(tIndex + 1));

  // Auto-play every 6 seconds
  setInterval(() => {
    const visible = getVisible();
    goTo(tIndex >= cards.length - visible ? 0 : tIndex + 1);
  }, 6000);

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      track.style.transition = 'none';
      goTo(tIndex);
    }, 100);
  });

  // Init
  goTo(0);
})();

// SCROLL FADE IN
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  fadeEls.forEach(el => observer.observe(el));
}

// GALLERY FILTER
const filterBtns   = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-masonry-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    const cat = btn.dataset.filter;
    galleryItems.forEach(item => {
      item.style.display = (cat === 'all' || item.dataset.category === cat) ? '' : 'none';
    });
  });
});

// LIGHTBOX
(function () {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  if (!lightbox) return;

  let lbIndex = 0;

  function getVisibleItems() {
    return Array.from(document.querySelectorAll('.gallery-masonry-item[data-src]'))
      .filter(el => el.style.display !== 'none');
  }

  function openLb(src, title, idx) {
    lbImg.src = src;
    if (lbCaption) lbCaption.textContent = title || '';
    lbIndex = idx;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-masonry-item[data-src]').forEach((item, i) => {
    item.addEventListener('click', () => openLb(item.dataset.src, item.dataset.title, i));
    item.addEventListener('keydown', e => { if (e.key === 'Enter') openLb(item.dataset.src, item.dataset.title, i); });
  });

  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');

  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lbPrev)  lbPrev.addEventListener('click', () => {
    const items = getVisibleItems();
    lbIndex = (lbIndex - 1 + items.length) % items.length;
    lbImg.src = items[lbIndex].dataset.src;
    if (lbCaption) lbCaption.textContent = items[lbIndex].dataset.title || '';
  });
  if (lbNext)  lbNext.addEventListener('click', () => {
    const items = getVisibleItems();
    lbIndex = (lbIndex + 1) % items.length;
    lbImg.src = items[lbIndex].dataset.src;
    if (lbCaption) lbCaption.textContent = items[lbIndex].dataset.title || '';
  });

  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft'  && lbPrev) lbPrev.click();
    if (e.key === 'ArrowRight' && lbNext) lbNext.click();
  });
})();

// ACTIVE NAV LINK
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
  if (a.getAttribute('href') === currentPage ||
     (currentPage === '' && a.getAttribute('href') === 'index.html')) {
    a.classList.add('active');
  }
});
