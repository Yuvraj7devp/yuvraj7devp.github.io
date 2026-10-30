/* Yuvraj Bachhav — portfolio interactions */
(() => {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('.section-anchor')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header surface on scroll.
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Mobile navigation.
  const closeMenu = () => {
    navLinks?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('menu-open');
  };
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    navLinks?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  navItems.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });

  // Reveal elements when they enter the viewport. Content remains visible if IO is unavailable.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Keep the navigation state in sync with the visible section.
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navItems.forEach(link => {
          const active = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Functional project filters.
  const filterButtons = [...document.querySelectorAll('.filter-btn')];
  const projectCards = [...document.querySelectorAll('.project-card')];
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projectCards.forEach(card => {
        const categories = (card.dataset.category || '').split(/\s+/);
        const show = filter === 'all' || categories.includes(filter);
        card.classList.toggle('is-hidden', !show);
        if (show && !reducedMotion) {
          card.animate(
            [{ opacity: 0.45, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 260, easing: 'ease-out' }
          );
        }
      });
    });
  });

  // Footer year.
  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();

  // Charts use clearly illustrative values, never project claims.
  if (window.Chart) {
    Chart.defaults.color = '#93a3ba';
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.font.size = 10;
    Chart.defaults.borderColor = 'rgba(190,210,240,.09)';
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: reducedMotion ? false : { duration: 850 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111c31',
          borderColor: 'rgba(0,212,255,.25)',
          borderWidth: 1,
          titleColor: '#f5f7ff',
          bodyColor: '#a7b0c0',
          padding: 11,
          displayColors: false
        }
      }
    };
    const trendCanvas = document.getElementById('trendChart');
    if (trendCanvas) new Chart(trendCanvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Illustrative trend',
          data: [24, 31, 28, 43, 39, 56],
          borderColor: '#00d4ff',
          backgroundColor: context => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(0,212,255,.08)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(0,212,255,.22)');
            gradient.addColorStop(1, 'rgba(0,212,255,0)');
            return gradient;
          },
          fill: true,
          tension: .38,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: '#00d4ff'
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: { beginAtZero: true, grid: { color: 'rgba(190,210,240,.08)' }, border: { display: false }, ticks: { maxTicksLimit: 5 } }
        }
      }
    });
    const categoryCanvas = document.getElementById('categoryChart');
    if (categoryCanvas) new Chart(categoryCanvas, {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C', 'D', 'E'],
        datasets: [{
          label: 'Illustrative value',
          data: [38, 57, 44, 72, 61],
          backgroundColor: ['rgba(0,212,255,.85)', 'rgba(0,212,255,.48)', 'rgba(139,124,255,.65)', 'rgba(0,212,255,.78)', 'rgba(139,124,255,.45)'],
          borderRadius: 5,
          maxBarThickness: 32
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: { beginAtZero: true, grid: { color: 'rgba(190,210,240,.08)' }, border: { display: false }, ticks: { maxTicksLimit: 5 } }
        }
      }
    });
    const segmentCanvas = document.getElementById('segmentChart');
    if (segmentCanvas) new Chart(segmentCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Segment A', 'Segment B', 'Segment C', 'Segment D'],
        datasets: [{
          data: [36, 27, 22, 15],
          backgroundColor: ['#00d4ff', '#7c83ff', '#356079', '#26364d'],
          borderColor: '#0b1220',
          borderWidth: 4,
          hoverOffset: 5
        }]
      },
      options: {
        ...commonOptions,
        cutout: '70%',
        plugins: {
          ...commonOptions.plugins,
          legend: { display: true, position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 6, padding: 16, color: '#93a3ba' } }
        }
      }
    });
  }
})();



/* Visual-refresh interactions: spotlight, tilt, and small polish details. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Subtle pointer spotlight on desktop, with no effect on touch devices.
  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('pointermove', (event) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    }, { passive: true });

    document.querySelectorAll('.focus-card, .skill-group, .project-card, .credential-card, .contact-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--card-pointer-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--card-pointer-y', `${event.clientY - rect.top}px`);
      }, { passive: true });
    });
  }

  // Make project previews feel like interactive dashboard tiles.
  document.querySelectorAll('.project-card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target === card) {
        const link = card.querySelector('.project-link');
        if (link) {
          event.preventDefault();
          link.click();
        }
      }
    });
  });

  // Update current year and add a back-to-top action if one is present.
  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
})();
