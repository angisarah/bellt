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
const PROJECTS_DATA = [
  {
    "id": 1,
    "title": "the Tower",
    "category": "Commercial",
    "location": "Addis Ababa,Ethiopia",
    "year": 2023,
    "client": "Meridian Holdings",
    "shortDescription": "A 42-floor corporate tower clad in dark glass, redefining the skyline with precision geometry.",
    "fullDescription": "Obsidian Tower stands as a monument to modern corporate ambition. The 42-floor structure employs a faceted dark glass curtain wall that shifts tonality from jet black at dawn to deep cobalt under afternoon sun. The structural system uses a diagrid exoskeleton, eliminating interior columns and allowing 2,000 sqm of uninterrupted floor plates. Sky gardens at floors 14, 28, and 42 introduce biophilic respite within the vertical journey. The building achieves LEED Platinum through integrated photovoltaics within the facade, rainwater harvesting, and AI-driven climate systems that reduce energy consumption by 43% compared to conventional towers.",
    "thumbnail": "public/images/buiding1.jpg",
    "heroImage": "public/images/buiding1.jpg",
    "galleryImages": [
      "images/buiding1.jpg",
      "images/buiding1.jpg",
      "images/buiding1.jpg"
    ],
    "materials": ["Dark tempered glass", "Weathered steel diagrid", "Biophilic green walls", "Reclaimed stone lobbies"],
    "featured": true
  },
  {
    "id": 2,
    "title": "Cascade Residence",
    "category": "Residential",
    "location": "Zurich, Switzerland",
    "year": 2022,
    "client": "Private Client",
    "shortDescription": "A hillside villa that cascades down a forested slope in layered horizontal volumes.",
    "fullDescription": "Perched on a steep Alpine slope, Cascade Residence is composed of four offset horizontal volumes that step down the hillside, each cantilevering over the one below. The structure is anchored by a central concrete core while the floors extend as steel-framed platforms glazed on three sides. Living spaces are arranged to capture valley views while maintaining privacy from the road above. The material palette — board-formed concrete, raw oak cladding, and oxidized copper — references the surrounding landscape of stone, bark, and mineral weathering. Each terrace becomes an outdoor room, and the roofscape forms a garden visible from the driveway above.",
    "thumbnail": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "heroImage": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=90",
    "galleryImages": [
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=900&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80"
    ],
    "materials": ["Board-formed concrete", "Raw white oak", "Oxidized copper", "Floor-to-ceiling glazing"],
    "featured": true
  },
  {
    "id": 3,
    "title": "Meridian Cultural Hub",
    "category": "Urban",
    "location": "Singapore",
    "year": 2023,
    "client": "Singapore Arts Council",
    "shortDescription": "A civic campus weaving cultural programming into a dense urban neighborhood.",
    "fullDescription": "The Meridian Cultural Hub redefines the civic institution as a porous, neighborhood-scaled campus. Rather than a singular monolith, the program is distributed across five interconnected pavilions of varying height, linked by elevated walkways and ground-level plazas. The design deliberately blurs interior and exterior — galleries spill into gardens, performance stages open to sky, and library reading rooms face tree canopy. The facades use a system of terracotta baguettes that filter equatorial sunlight while creating a warm textural presence in the street. Underground, a network of service and logistics spaces frees the surface entirely for public life.",
    "thumbnail": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
    "heroImage": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&q=90",
    "galleryImages": [
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=900&q=80",
      "https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80"
    ],
    "materials": ["Terracotta baguette facade", "Exposed concrete", "Corten steel", "Tropical hardwood"],
    "featured": true
  },
  {
    "id": 4,
    "title": "Noir Interiors — Penthouse",
    "category": "Interior",
    "location": "New York, USA",
    "year": 2022,
    "client": "Private Client",
    "shortDescription": "A full-floor Manhattan penthouse redesigned as a dark, tactile sanctuary above the city.",
    "fullDescription": "This full-floor penthouse atop a Tribeca tower was stripped to its structural bones and rebuilt as a rigorously curated private residence. The design philosophy centers on material honesty: surfaces are left unadorned, seams are exposed, and every element performs both structural and aesthetic roles. Smoked oak panels line the living areas; honed black granite covers kitchen and bathroom surfaces; cast bronze hardware appears throughout as a unifying accent. Lighting is entirely concealed — no visible fixtures, only light and shadow. The result is a space that feels simultaneously ancient and futuristic, an environment that recedes to make the inhabitant and the art the subject.",
    "thumbnail": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    "heroImage": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90",
    "galleryImages": [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80"
    ],
    "materials": ["Smoked white oak", "Honed nero marquina marble", "Cast bronze", "Venetian plaster"],
    "featured": false
  },
  {
    "id": 5,
    "title": "Solaris Office Campus",
    "category": "Commercial",
    "location": "Amsterdam, Netherlands",
    "year": 2021,
    "client": "TechVentures BV",
    "shortDescription": "A sun-responsive office campus that adapts its shading geometry to the season.",
    "fullDescription": "Solaris is a 28,000 sqm office campus built around a single radical idea: the building should respond dynamically to the sun. An outer skin of motorized aluminum fins tracks solar angles throughout the day, opening to admit winter light and closing against summer glare. The result is a facade in constant slow motion — a building that breathes. Inside, four workplace buildings surround a central winter garden: a glass-roofed atrium that serves as the social heart of the campus, housing cafes, meeting zones, and informal collaboration spaces. The campus targets net-zero operations, pairing its adaptive facade with rooftop photovoltaics and a ground-source heat pump system.",
    "thumbnail": "https://images.unsplash.com/photo-1554435493-93422e8220c8?w=800&q=80",
    "heroImage": "https://images.unsplash.com/photo-1554435493-93422e8220c8?w=1600&q=90",
    "galleryImages": [
      "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b9?w=900&q=80",
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=900&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80"
    ],
    "materials": ["Motorized aluminum fins", "Low-iron glass", "Recycled structural steel", "Living wall systems"],
    "featured": true
  },
  {
    "id": 6,
    "title": "The Walled Garden",
    "category": "Residential",
    "location": "Kyoto, Japan",
    "year": 2022,
    "client": "Private Client",
    "shortDescription": "A contemporary Japanese home organized around a series of walled courtyard gardens.",
    "fullDescription": "Situated in a dense Kyoto neighborhood, The Walled Garden uses the ancient tradition of the enclosed court as both spatial organizer and privacy strategy. The house is read from the street as a continuous rammed earth wall — monolithic, grounded, and opaque. Once through the gate, the house reveals itself as a sequence of open and semi-open rooms arranged around three distinct gardens: a moss garden for contemplation, a gravel garden for movement and play, and a planting garden for seasonal change. Interior spaces are defined by sliding shoji screens allowing the plan to reconfigure from fully open to fully enclosed. The construction uses local craftspeople throughout, with joinery techniques passed down over generations.",
    "thumbnail": "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80",
    "heroImage": "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1600&q=90",
    "galleryImages": [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=900&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=900&q=80"
    ],
    "materials": ["Rammed earth", "Hinoki cypress", "Hand-folded copper roofing", "Shoji screen systems"],
    "featured": false
  },
  {
    "id": 7,
    "title": "Archway District Masterplan",
    "category": "Urban",
    "location": "London, UK",
    "year": 2023,
    "client": "London Borough of Islington",
    "shortDescription": "A mixed-use masterplan regenerating 14 hectares of post-industrial land in North London.",
    "fullDescription": "The Archway District Masterplan transforms a fragmented post-industrial site into a cohesive mixed-use neighborhood. The plan introduces 1,800 new homes (35% affordable), 40,000 sqm of commercial and workspace, civic amenities, and 4.2 hectares of new public green space. The urban design strategy establishes a clear hierarchy of streets — from primary boulevards to intimate mews — stitching the new development into the existing urban grain. A central linear park connects the northern and southern edges of the site, doubling as a sustainable urban drainage system. The masterplan follows a design code that ensures typological variety while maintaining coherence, allowing multiple architects to contribute while preserving a legible neighborhood identity.",
    "thumbnail": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    "heroImage": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=90",
    "galleryImages": [
      "https://images.unsplash.com/photo-1486091659600-29b5c880d8d4?w=900&q=80",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&q=80",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&q=80"
    ],
    "materials": ["Brick masonry", "CLT timber frames", "Recycled aggregate concrete", "Biodiverse green roofs"],
    "featured": false
  },
  {
    "id": 8,
    "title": "Studio Loft — Creative Agency",
    "category": "Interior",
    "location": "Berlin, Germany",
    "year": 2021,
    "client": "Forma Studio GmbH",
    "shortDescription": "A Berlin creative agency interior built from salvaged industrial materials.",
    "fullDescription": "Forma Studio occupies a 1960s industrial building in Berlin-Mitte. The brief was simple: make the raw existing fabric the design. Rather than overlay a new aesthetic, the project involved a careful process of selective demolition and curation. Brick walls were exposed and re-pointed; concrete ceilings were cleaned and sealed; original steel windows were refurbished. New interventions are deliberately legible as new — a floating mezzanine library in black steel, custom joinery in carbonized ash, and a reception desk cast in reinforced concrete. The result is a layered interior that holds 60 years of industrial history while functioning as a cutting-edge creative workplace.",
    "thumbnail": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    "heroImage": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=90",
    "galleryImages": [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=900&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80"
    ],
    "materials": ["Exposed salvaged brick", "Black powder-coat steel", "Carbonized ash", "Cast concrete"],
    "featured": true
  }
];

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
    cursor.style.top = e.clientY + 'px';
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
      { id: 'name', msg: 'Please enter your name' },
      { id: 'email', msg: 'Please enter a valid email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
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
