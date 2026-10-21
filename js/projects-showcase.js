/**
 * ===================================================================
 * 3D FLOATING PROJECT SHOWCASE & MOUSE-RESPONSIVE PARALLAX
 * ===================================================================
 * Features:
 * - 3-Card 3D Curved Carousel (AI Patrol Robot, Gripper Arm, Resume Maker)
 * - Fluid Class-Based 3D Slot Transitions (.slot-center, .slot-right, .slot-left)
 * - Click Any Card to Bring it Center Focus
 * - Next / Previous Arrow Navigation & Pagination Dots
 * - Touch Swipe Gestures for Mobile & Tablet
 * - Smooth CSS Variable-Driven Mouse Parallax & Specular Glare
 * ===================================================================
 */

export class ProjectsShowcase {
  constructor() {
    this.stage = document.querySelector('.showcase-3d-stage');
    if (!this.stage) return;

    this.track = document.querySelector('.showcase-cards-track');
    this.cards = Array.from(document.querySelectorAll('.floating-project-card'));
    if (this.cards.length === 0) return;

    this.prevBtn = document.getElementById('showcasePrevBtn');
    this.nextBtn = document.getElementById('showcaseNextBtn');
    this.dots = Array.from(document.querySelectorAll('.showcase-page-dot'));
    this.filterBtns = Array.from(document.querySelectorAll('.showcase-filter-btn'));
    this.comingSoonCards = Array.from(document.querySelectorAll('.coming-soon-card'));
    this.podium = document.querySelector('.showcase-podium-platform');
    this.crystals = Array.from(document.querySelectorAll('.parallax-crystal'));

    this.activeIndex = 0;
    this.isTransitioning = false;
    this.isTouch = window.matchMedia('(pointer: coarse)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse coordinates (Normalized -1 to +1)
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.init();
  }

  init() {
    this.updateCardSlots();
    this.bindEvents();
    if (!this.isTouch && !this.prefersReducedMotion) {
      this.startParallaxLoop();
    }
  }

  bindEvents() {
    // 1. Navigation Header Arrows
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.prev();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.next();
      });
    }

    // 2. Pagination Indicator Dots Click
    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        this.setActiveIndex(idx);
      });
    });

    // 3. Direct Card Click / Tap to Select (Capture phase ensures infallible instant activation)
    this.cards.forEach((card, idx) => {
      // Capture phase click handler: fires immediately before any child element or link can block it
      card.addEventListener('click', (e) => {
        if (this.activeIndex !== idx) {
          e.preventDefault();
          e.stopPropagation();
          this.setActiveIndex(idx);
        }
      }, true);

      // Pointerup handler for instantaneous touch/tap/mouse selection without waiting for click chain
      let pointerStartX = 0;
      let pointerStartY = 0;

      card.addEventListener('pointerdown', (e) => {
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
      }, true);

      card.addEventListener('pointerup', (e) => {
        if (this.activeIndex !== idx) {
          const moveDist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
          // If movement is under 20px, it is an intentional click/tap on the project card
          if (moveDist < 20) {
            e.preventDefault();
            e.stopPropagation();
            this.setActiveIndex(idx);
          }
        }
      }, true);
    });

    // 4. Touch Swipe Gestures (Mobile & Tablet)
    let touchStartX = 0;
    let touchStartY = 0;

    this.stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.stage.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < 0) {
            this.next();
          } else {
            this.prev();
          }
        }
      }
    }, { passive: true });

    // 5. Desktop Mouse Drag / Swipe (Only when dragging center card or stage background)
    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseStartY = 0;
    let dragDistance = 0;

    this.stage.addEventListener('mousedown', (e) => {
      // Never initiate stage drag when clicking on a background side card or button
      const clickedCard = e.target.closest('.floating-project-card');
      if (clickedCard && !clickedCard.classList.contains('slot-center')) return;
      if (e.target.closest('button, a')) return;

      isMouseDown = true;
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
      dragDistance = 0;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      dragDistance = Math.abs(e.clientX - mouseStartX);
    }, { passive: true });

    window.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      if (dragDistance > 50) {
        const deltaX = e.clientX - mouseStartX;
        if (deltaX < -50) {
          this.next();
        } else if (deltaX > 50) {
          this.prev();
        }
      }
    });

    // 6. Horizontal Trackpad Swipe (Wheel Event)
    let wheelLock = false;
    this.stage.addEventListener('wheel', (e) => {
      if (wheelLock) return;
      if (Math.abs(e.deltaX) > 35 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        wheelLock = true;
        if (e.deltaX > 0) {
          this.next();
        } else {
          this.prev();
        }
        setTimeout(() => { wheelLock = false; }, 420);
      }
    }, { passive: true });

    // 7. Mouse Parallax Tracking on Stage
    if (!this.isTouch && !this.prefersReducedMotion) {
      this.stage.addEventListener('mousemove', (e) => {
        const rect = this.stage.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        this.mouse.targetX = (clientX / rect.width) * 2 - 1;
        this.mouse.targetY = (clientY / rect.height) * 2 - 1;

        // Specular highlight on cards
        this.cards.forEach(card => {
          const cardRect = card.getBoundingClientRect();
          const shineX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
          const shineY = ((e.clientY - cardRect.top) / cardRect.height) * 100;
          const shineEl = card.querySelector('.card-specular-shine');
          if (shineEl) {
            shineEl.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)`;
          }
        });
      });

      this.stage.addEventListener('mouseleave', () => {
        this.mouse.targetX = 0;
        this.mouse.targetY = 0;
      });
    }

    // 8. Category Filtering
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleFilterClick(btn);
      });
    });

    // 9. Keyboard Navigation (ArrowLeft / ArrowRight)
    window.addEventListener('keydown', (e) => {
      const rect = this.stage.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });

    // 10. Window Resize
    window.addEventListener('resize', () => {
      this.isTouch = window.matchMedia('(pointer: coarse)').matches;
      this.updateCardSlots();
    }, { passive: true });
  }

  next() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    setTimeout(() => { this.isTransitioning = false; }, 260);
    const nextIdx = (this.activeIndex + 1) % this.cards.length;
    this.setActiveIndex(nextIdx);
  }

  prev() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    setTimeout(() => { this.isTransitioning = false; }, 260);
    const prevIdx = (this.activeIndex - 1 + this.cards.length) % this.cards.length;
    this.setActiveIndex(prevIdx);
  }

  setActiveIndex(index) {
    if (this.activeIndex === index && this.cards[index]?.classList.contains('slot-center')) return;
    this.activeIndex = index;
    this.updateCardSlots();
  }

  updateCardSlots() {
    const count = this.cards.length;
    const isMobile = window.innerWidth <= 768;

    this.cards.forEach((card, idx) => {
      card.classList.remove('slot-center', 'slot-left', 'slot-right', 'card-active');

      if (isMobile) {
        card.classList.add(idx === this.activeIndex ? 'slot-center' : 'slot-right');
        return;
      }

      if (idx === this.activeIndex) {
        card.classList.add('slot-center', 'card-active');
      } else if (idx === (this.activeIndex + 1) % count) {
        card.classList.add('slot-right');
      } else {
        card.classList.add('slot-left');
      }
    });

    // Update Pagination Dots
    this.dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.activeIndex);
    });
  }

  startParallaxLoop() {
    const tick = () => {
      const lerp = 0.08;
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * lerp;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * lerp;

      const isMobile = window.innerWidth <= 768;

      if (!isMobile && this.track) {
        // Set CSS variables on the track container
        // This lets CSS transitions animate slot changes smoothly without being overwritten!
        const px = this.mouse.x * 14;
        const py = this.mouse.y * 10;
        const sidePx = this.mouse.x * 10;
        const rx = -this.mouse.y * 8;
        const ry = this.mouse.x * 10;

        this.track.style.setProperty('--mouse-px', `${px}px`);
        this.track.style.setProperty('--mouse-py', `${py}px`);
        this.track.style.setProperty('--mouse-side-px', `${sidePx}px`);
        this.track.style.setProperty('--mouse-rx', `${rx}deg`);
        this.track.style.setProperty('--mouse-ry', `${ry}deg`);

        // Podium Parallax
        if (this.podium) {
          const podiumX = this.mouse.x * 16;
          const podiumY = this.mouse.y * 8;
          const podiumRotX = 74 + this.mouse.y * 4;
          this.podium.style.transform = `translateX(calc(-50% + ${podiumX}px)) translateY(${podiumY}px) rotateX(${podiumRotX}deg)`;
        }

        // Background Crystals Parallax
        this.crystals.forEach((crystal, idx) => {
          const factor = (idx + 1) * 10;
          const crystalX = -this.mouse.x * factor;
          const crystalY = -this.mouse.y * (factor * 0.7);
          crystal.style.transform = `translate3d(${crystalX}px, ${crystalY}px, 0)`;
        });
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  handleFilterClick(clickedBtn) {
    this.filterBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    const filterVal = clickedBtn.getAttribute('data-filter') || 'all';

    // 1. Highlight relevant featured 3D project
    if (filterVal === 'ai') {
      this.setActiveIndex(0); // AI Patrol Robot
    } else if (filterVal === 'robotics') {
      this.setActiveIndex(1); // Gripper Arm
    } else if (filterVal === 'tools' || filterVal === 'web') {
      this.setActiveIndex(2); // Resume Maker Platform
    }

    // 2. Filter Coming Soon projects below
    this.comingSoonCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const matches = filterVal === 'all' || category.split(' ').includes(filterVal);

      if (matches) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 220);
      }
    });
  }
}

export function initProjectsShowcase() {
  return new ProjectsShowcase();
}
