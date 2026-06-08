/* ============================================================
   FORMA STUDIO — Architecture Consulting
   Main JavaScript
   ============================================================ */

'use strict';

// ── Utility Helpers ─────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Embedded Project Data ────────────────────────────────────
// Data is inlined here so the site works via file:// without a server.
// To use an external JSON file instead, replace PROJECTS_DATA with a
// fetch('data/projects.json') call and serve via localhost.

// ── Data Cache ───────────────────────────────────────────────
let projectsData = [];

/**
 * Returns project data. Uses inline PROJECTS_DATA so the site works
 * when opened directly via file:// without a local server.
 * Falls back to fetch() if running on http(s):// and the JSON exists.
 */
async function getProjects() {
  if (projectsData.length) return projectsData;

  // If served over HTTP, try fetching the JSON file for easy editing
  if (location.protocol.startsWith('http')) {
    try {
      const response = await fetch('data/projects.json');
      if (response.ok) {
        projectsData = await response.json();
        return projectsData;
      }
    } catch (_) {
      // Fall through to inline data
    }
  }

  // file:// protocol or fetch failed — use embedded data
  projectsData = PROJECTS_DATA;
  return projectsData;
}

// ── Page Loader ──────────────────────────────────────────────
function initLoader() {
  const screen = $('#loading-screen');
  if (!screen) return;
  // Animate loader text letter-by-letter
  const text = screen.querySelector('.loader-text');
  if (text) {
    const words = text.textContent.trim();
    text.innerHTML = '';
    words.split('').forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.animationDelay = `${0.05 + i * 0.04}s`;
      text.appendChild(s);
    });
  }
  // Hide loader after animation
  window.addEventListener('load', () => {
    setTimeout(() => screen.classList.add('hidden'), 1800);
  });
}

// ── Custom Cursor ────────────────────────────────────────────
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('a, button, .project-card, .gallery-item, .filter-btn');
    cursor.classList.toggle('expand', !!el);
  });
}

// ── Navbar ───────────────────────────────────────────────────
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  // Scroll: add 'scrolled' class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Active link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile toggle
  const toggle = $('.nav-toggle');
  const mobileNav = $('.nav-mobile');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  $$('.nav-mobile a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Page Transitions ─────────────────────────────────────────
function initPageTransitions() {
  const overlay = $('#page-overlay');
  if (!overlay) return;

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    // Skip external, hash, or javascript links
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;

    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(() => {
      window.location.href = href;
    }, 600);
  });

  // Reveal on load
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('active');
  });
}

// ── Scroll Reveal ────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal, .reveal-left, .reveal-right, .stagger').forEach(el => observer.observe(el));
}

// ── Lazy Image Loading ───────────────────────────────────────
function initLazyImages() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  $$('img[data-src]').forEach(img => observer.observe(img));
}

// ── Testimonial Slider ───────────────────────────────────────
function initTestimonials() {
  const track = $('.testimonial-track');
  if (!track) return;

  const items = $$('.testimonial-item', track);
  let current = 0;
  let autoplayTimer;

  const dots = $$('.testimonial-dot');

  function goTo(index) {
    current = (index + items.length) % items.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    autoplayTimer = setInterval(next, 5000);
  }
  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  const nextBtn = $('.testimonial-btn.next');
  const prevBtn = $('.testimonial-btn.prev');
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); prev(); startAutoplay(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); });
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });

  goTo(0);
  startAutoplay();
}

// ── HOME: Featured Projects ──────────────────────────────────
async function initFeaturedProjects() {
  const grid = $('#featured-projects-grid');
  if (!grid) return;

  const projects = await getProjects();
  const featured = projects.filter(p => p.featured).slice(0, 4);

  grid.innerHTML = featured.map((p, i) => createProjectCard(p, i === 0)).join('');
  initLazyImages();

  // Re-observe scroll reveals for injected content
  $$('.reveal, .stagger', grid).forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    obs.observe(el);
  });
}

// ── PROJECT CARD template ────────────────────────────────────
function createProjectCard(p, large = false) {
  return `
    <a class="project-card reveal" href="project-details.html?id=${p.id}" aria-label="${p.title}">
      <div class="project-card-img">
        <img data-src="${p.thumbnail}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" alt="${p.title}" loading="lazy">
      </div>
      <div class="project-card-overlay"></div>
      <div class="project-card-info">
        <p class="project-card-cat">${p.category}</p>
        <h3 class="project-card-title">${p.title}</h3>
        <p class="project-card-desc">${p.shortDescription}</p>
      </div>
      <div class="project-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
    </a>
  `;
}

// ── PROJECTS PAGE ────────────────────────────────────────────
async function initProjectsPage() {
  const grid = $('#projects-grid');
  if (!grid) return;

  const projects = await getProjects();
  let currentFilter = 'All';
  let searchQuery = '';

  function render() {
    const filtered = projects.filter(p => {
      const matchCat = currentFilter === 'All' || p.category === currentFilter;
      const matchSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery) ||
        p.shortDescription.toLowerCase().includes(searchQuery) ||
        p.location.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="no-results">
          <i class="fa-regular fa-face-sad-tear"></i>
          <p>No projects found</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(p => createProjectCard(p)).join('');
    initLazyImages();

    // Animate cards in
    $$('.project-card', grid).forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `opacity 0.6s ease ${i * 0.06}s, transform 0.6s ease ${i * 0.06}s`;
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    });
  }

  // Filter buttons
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // Search
  const searchInput = $('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      render();
    });
  }

  render();
}

// ── PROJECT DETAILS PAGE ─────────────────────────────────────
async function initProjectDetails() {
  const detailContainer = $('#project-detail-container');
  if (!detailContainer) return;

  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'));

  const projects = await getProjects();
  const project = projects.find(p => p.id === id);

  if (!project) {
    detailContainer.innerHTML = `
      <div class="error-state">
        <div class="error-num">404</div>
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't seem to exist.</p>
        <a href="projects.html" class="btn btn-outline">
          <i class="fa-solid fa-arrow-left btn-icon" style="transform:rotate(180deg) translateX(0)"></i>
          Back to Projects
        </a>
      </div>`;
    return;
  }

  // Hero
  const heroSection = $('#detail-hero');
  if (heroSection) {
    heroSection.querySelector('.detail-hero-bg img').src = project.heroImage;
    heroSection.querySelector('.detail-cat').textContent = project.category;
    heroSection.querySelector('.detail-title').textContent = project.title;
    document.title = `${project.title} — Forma Studio`;
  }

  // Meta
  $('#meta-location').textContent = project.location;
  $('#meta-year').textContent = project.year;
  $('#meta-client').textContent = project.client;
  $('#meta-category').textContent = project.category;

  // Description
  $('#detail-description').textContent = project.fullDescription;

  // Materials
  const matList = $('#materials-list');
  if (matList) {
    matList.innerHTML = project.materials.map(m => `
      <li class="material-tag">${m}</li>
    `).join('');
  }

  // Gallery
  const galleryGrid = $('#gallery-grid');
  if (galleryGrid) {
    galleryGrid.innerHTML = project.galleryImages.map((img, i) => `
      <div class="gallery-item" data-src="${img}">
        <img src="${img}" alt="${project.title} — Gallery ${i + 1}" loading="lazy">
      </div>
    `).join('');

    // Lightbox
    initLightbox(project.galleryImages, project.title);
  }

  // Prev / Next navigation
  const idx = projects.findIndex(p => p.id === id);
  const prev = projects[idx - 1];
  const next = projects[idx + 1];
  const prevLink = $('#proj-nav-prev');
  const nextLink = $('#proj-nav-next');

  if (prevLink) {
    if (prev) {
      prevLink.href = `project-details.html?id=${prev.id}`;
      prevLink.querySelector('.proj-nav-title').textContent = prev.title;
    } else {
      prevLink.style.visibility = 'hidden';
    }
  }
  if (nextLink) {
    if (next) {
      nextLink.href = `project-details.html?id=${next.id}`;
      nextLink.querySelector('.proj-nav-title').textContent = next.title;
    } else {
      nextLink.style.visibility = 'hidden';
    }
  }

  // Reveal hero image animation
  const heroBgImg = $('#detail-hero .detail-hero-bg img');
  if (heroBgImg) {
    heroBgImg.style.transform = 'scale(1.05)';
    heroBgImg.style.transition = 'transform 12s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    requestAnimationFrame(() => { heroBgImg.style.transform = 'scale(1)'; });
  }

  initScrollReveal();
}

// ── Lightbox ─────────────────────────────────────────────────
function initLightbox(images, title) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <img src="" alt="${title}">
    <button class="lightbox-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  $$('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      lbImg.src = item.dataset.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ── CONTACT FORM ─────────────────────────────────────────────
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  function validate() {
    let valid = true;

    const fields = [
      { id: 'name',    msg: 'Please enter your name' },
      { id: 'email',   msg: 'Please enter a valid email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      { id: 'subject', msg: 'Please select a subject' },
      { id: 'message', msg: 'Please enter a message' },
    ];

    fields.forEach(({ id, msg, regex }) => {
      const group = $(`#field-${id}`);
      const input = $(`#${id}`, form);
      if (!group || !input) return;
      const err = group.querySelector('.field-error');

      const empty = !input.value.trim();
      const invalid = regex && !regex.test(input.value.trim());

      if (empty || invalid) {
        group.classList.add('error');
        if (err) err.textContent = msg;
        valid = false;
      } else {
        group.classList.remove('error');
      }
    });

    return valid;
  }

  // Clear error on input
  $$('input, textarea, select', form).forEach(el => {
    el.addEventListener('input', () => {
      const group = el.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const successMsg = $('#form-success');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    // Simulate async submission
    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) successMsg.classList.add('show');
    }, 1500);
  });
}

// ── Smooth Scroll for Anchors ────────────────────────────────
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    const target = $(link.getAttribute('href'));
    if (target) {
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
}

// ── Init All ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavbar();
  initPageTransitions();
  initScrollReveal();
  initSmoothScroll();
  initTestimonials();
  initFeaturedProjects();
  initProjectsPage();
  initProjectDetails();
  initContactForm();
  initLazyImages();
});
