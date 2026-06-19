

/* ==================== CODE BLOCK TAB SWITCHING ==================== */
(() => {
  const modeBtns = document.querySelectorAll('#modeSwitch .mode-btn');
  const codeSections = {
    oneliner: document.getElementById('code-oneliner'),
    npm: document.getElementById('code-npm'),
    hackable: document.getElementById('code-hackable'),
    apps: document.getElementById('code-apps'),
    plans: document.getElementById('code-plans'),
    agent: document.getElementById('code-agent'),
  };
  const osSwitch = document.getElementById('osSwitch');
  const hackableSwitch = document.getElementById('hackableSwitch');
  const pmSwitch = document.getElementById('pmSwitch');

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.mode;
      Object.values(codeSections).forEach(s => {
        if (s) s.classList.add('hidden');
      });
      if (codeSections[mode]) codeSections[mode].classList.remove('hidden');

      if (osSwitch) osSwitch.classList.toggle('hidden', mode !== 'apps');
      if (hackableSwitch) hackableSwitch.classList.toggle('hidden', mode !== 'hackable');
      if (pmSwitch) pmSwitch.classList.toggle('hidden', mode !== 'npm');
    });
  });

  // Hackable sub-switch
  const hackableBtns = document.querySelectorAll('#hackableSwitch .hackable-btn');
  const hackableInstaller = document.getElementById('hackable-installer');
  const hackablePnpm = document.getElementById('hackable-pnpm');

  hackableBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hackableBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.hackable;
      if (hackableInstaller) hackableInstaller.classList.toggle('hidden', val !== 'installer');
      if (hackablePnpm) hackablePnpm.classList.toggle('hidden', val !== 'pnpm');
    });
  });
})();



/* ==================== MOBILE MENU TOGGLE ==================== */
(() => {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.site-nav');
  if (!menuBtn || !nav) return;

  let menuOpen = false;
  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      nav.style.maxHeight = '200px';
      nav.style.overflow = 'visible';
      menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    } else {
      nav.style.maxHeight = '';
      nav.style.overflow = '';
      menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    }
  });
})();

/* ==================== SCROLL ANIMATIONS ==================== */
(() => {
  const sections = document.querySelectorAll('.quickstart, .testimonials, .features, .integrations-preview, .builds-section, .press-section, .sponsors');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(24px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
  });
})();

