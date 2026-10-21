/**
 * ========================================================
 * ANIMATED BACKGROUND (Motion Primitives inspired)
 * ========================================================
 * Recreates the Framer Motion `AnimatedBackground` component
 * with spring physics (bounce: 0.2, duration: 0.3s) in pure
 * high-performance Vanilla JavaScript and CSS.
 *
 * Provides layout-aware gliding backgrounds for:
 * 1. Navigation menu tabs (AnimatedTabsHover)
 * 2. Project filter tabs
 * 3. Card grids (About, Skills, Projects, Certificates)
 * 4. Hero clickable logo cards
 */

export class AnimatedBackground {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) return;

    this.options = {
      itemSelector: options.itemSelector || '[data-id]',
      className: options.className || 'animated-bg-default',
      enableHover: options.enableHover !== false,
      syncWithActive: Boolean(options.syncWithActive),
      activeSelector: options.activeSelector || '.active',
      springTiming: options.springTiming || 'cubic-bezier(0.2, 0.95, 0.3, 1.15)',
      duration: options.duration || '0.32s',
      onHoverChange: options.onHoverChange || null,
      trackCursor: Boolean(options.trackCursor),
      ...options
    };

    this.bg = null;
    this.isHovering = false;
    this.activeItem = null;
    this.currentTarget = null;
    this.rafId = null;

    this.init();
  }

  init() {
    // 1. Ensure container is relative for absolute coordinate tracking
    const compPos = window.getComputedStyle(this.container).position;
    if (compPos === 'static') {
      this.container.style.position = 'relative';
    }

    // 2. Create the gliding animated background element
    this.bg = document.createElement('div');
    this.bg.className = `animated-motion-bg ${this.options.className}`;
    this.bg.setAttribute('aria-hidden', 'true');
    this.container.insertBefore(this.bg, this.container.firstChild);

    // 3. Attach event listeners
    this.bindEvents();

    // 4. Position initially if syncWithActive
    if (this.options.syncWithActive) {
      setTimeout(() => {
        this.syncActive(true);
      }, 60);
    }
  }

  bindEvents() {
    // Container Mouse Enter
    this.container.addEventListener('mouseenter', () => {
      // Prepared for hover
    });

    // Container Mouse Leave
    this.container.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.currentTarget = null;

      if (this.options.syncWithActive) {
        this.syncActive(false);
      } else {
        this.hide();
      }

      if (typeof this.options.onHoverChange === 'function') {
        this.options.onHoverChange(null);
      }
    });

    // Mouse Move across children (Delegated)
    this.container.addEventListener('mouseover', (e) => {
      const item = e.target.closest(this.options.itemSelector);
      if (!item || !this.container.contains(item)) return;
      if (item.offsetParent === null) return; // Skip hidden elements

      if (this.currentTarget === item) return;

      const isFirstEntry = !this.isHovering;
      this.isHovering = true;
      this.currentTarget = item;
      this.moveTo(item, isFirstEntry);

      if (typeof this.options.onHoverChange === 'function') {
        this.options.onHoverChange(item);
      }
    });

    // Optional Cursor Tracking Spotlight for Card Grids
    if (this.options.trackCursor) {
      this.container.addEventListener('mousemove', (e) => {
        const item = e.target.closest(this.options.itemSelector);
        if (!item || !this.container.contains(item)) return;
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        item.style.setProperty('--card-mouse-x', `${x}px`);
        item.style.setProperty('--card-mouse-y', `${y}px`);
      }, { passive: true });
    }

    // Window Resize / Orientation Change Handler
    window.addEventListener('resize', () => {
      if (!this.isHovering && this.options.syncWithActive) {
        this.syncActive(true);
      } else if (this.isHovering && this.currentTarget) {
        this.moveTo(this.currentTarget, true);
      }
    }, { passive: true });
  }

  moveTo(item, immediate = false) {
    if (!item || !this.bg) return;

    const parentRect = this.container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const x = itemRect.left - parentRect.left + this.container.scrollLeft;
    const y = itemRect.top - parentRect.top + this.container.scrollTop;
    const width = itemRect.width;
    const height = itemRect.height;
    const style = window.getComputedStyle(item);
    const radius = style.borderRadius || '16px';

    if (immediate) {
      // First entry: fade in without flying from (0,0)
      this.bg.style.transition = 'opacity 0.2s ease';
      this.bg.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      this.bg.style.width = `${width}px`;
      this.bg.style.height = `${height}px`;
      this.bg.style.borderRadius = radius;
      this.bg.style.opacity = '1';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (this.bg) {
            this.bg.style.transition = '';
          }
        });
      });
    } else {
      // Spring gliding between items
      this.bg.style.transition = '';
      this.bg.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      this.bg.style.width = `${width}px`;
      this.bg.style.height = `${height}px`;
      this.bg.style.borderRadius = radius;
      this.bg.style.opacity = '1';
    }
  }

  hide() {
    if (!this.bg) return;
    this.bg.style.opacity = '0';
  }

  syncActive(immediate = false) {
    const activeItem = this.container.querySelector(this.options.activeSelector);
    if (activeItem && activeItem.offsetParent !== null) {
      this.activeItem = activeItem;
      this.moveTo(activeItem, immediate);
    } else {
      this.hide();
    }
  }

  update() {
    if (!this.isHovering && this.options.syncWithActive) {
      this.syncActive(false);
    }
  }
}

/**
 * Initialize all AnimatedBackground instances across the site:
 * 1. Top Navbar Links (AnimatedTabsHover)
 * 2. Project Filter Tabs
 * 3. About Section Cards
 * 4. Skills Section Cards
 * 5. Projects Grid Cards
 * 6. Certificates Grid Cards
 * 7. Hero Clickable Logo Cards
 */
export function initAllAnimatedBackgrounds() {
  const instances = {};

  // 1. Navigation Menu Tabs
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    instances.nav = new AnimatedBackground(navMenu, {
      itemSelector: '.nav-link',
      className: 'animated-bg-nav',
      enableHover: true,
      syncWithActive: true,
      activeSelector: '.nav-link.active',
      duration: '0.3s'
    });

    // Observe active class changes on nav links (e.g. from scroll spy)
    const observer = new MutationObserver(() => {
      if (instances.nav && !instances.nav.isHovering) {
        instances.nav.syncActive(false);
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      observer.observe(link, { attributes: true, attributeFilter: ['class'] });
    });
  }

  // 2. Project Filter Tabs
  const filterBar = document.querySelector('.showcase-filter-bar, .projects-filter-bar');
  if (filterBar) {
    instances.filter = new AnimatedBackground(filterBar, {
      itemSelector: '.showcase-filter-btn, .filter-btn',
      className: 'animated-bg-filter',
      enableHover: true,
      syncWithActive: true,
      activeSelector: '.showcase-filter-btn.active, .filter-btn.active',
      duration: '0.3s'
    });

    filterBar.querySelectorAll('.showcase-filter-btn, .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          instances.filter?.syncActive(false);
        }, 20);
      });
    });
  }

  // 3. About Feature Cards
  const aboutCardsCol = document.querySelector('.about-cards-column');
  if (aboutCardsCol) {
    instances.about = new AnimatedBackground(aboutCardsCol, {
      itemSelector: '.about-feature-card',
      className: 'animated-bg-card',
      enableHover: true,
      syncWithActive: false,
      trackCursor: true,
      duration: '0.34s'
    });
  }

  // 4. Skills Category Cards Grid
  const skillsGrid = document.querySelector('.skills-cards-grid');
  if (skillsGrid) {
    instances.skills = new AnimatedBackground(skillsGrid, {
      itemSelector: '.skill-category-card',
      className: 'animated-bg-card',
      enableHover: true,
      syncWithActive: false,
      trackCursor: true,
      duration: '0.34s'
    });
  }

  // 5. Projects Grid Cards
  const projectsGrid = document.querySelector('.projects-grid');
  if (projectsGrid) {
    instances.projects = new AnimatedBackground(projectsGrid, {
      itemSelector: '.project-card',
      className: 'animated-bg-card',
      enableHover: true,
      syncWithActive: false,
      trackCursor: true,
      duration: '0.34s'
    });
  }

  // 6. Certificates Grid Cards
  const certsGrid = document.querySelector('.cert-gallery-grid, .certificates-grid');
  if (certsGrid) {
    instances.certs = new AnimatedBackground(certsGrid, {
      itemSelector: '.cert-gallery-card, .certificate-card',
      className: 'animated-bg-card',
      enableHover: true,
      syncWithActive: false,
      trackCursor: true,
      duration: '0.34s'
    });
  }

  // 7. Hero Clickable Logo Cards
  const heroLogos = document.querySelector('.hero-socials.hero-logo-cards');
  if (heroLogos) {
    instances.heroLogos = new AnimatedBackground(heroLogos, {
      itemSelector: '.social-logo-card',
      className: 'animated-bg-logo',
      enableHover: true,
      syncWithActive: false,
      duration: '0.28s'
    });
  }

  return instances;
}
