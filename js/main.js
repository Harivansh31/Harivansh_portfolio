/**
 * ========================================================
 * HARIVANSH VATS - CYBER PORTFOLIO MAIN ENTRY POINT
 * ========================================================
 */

import { initHelmetRiderReveal } from './reveal.js';
import { initAllParticleTypography } from './particle-typography.js';
import { initWaveBackground } from './wave-background.js';
import { initModals } from './modals.js';
import { initRecruiterAssistant } from './recruiter-ai.js';
import { initAllAnimatedBackgrounds } from './animated-background.js';
import { initCommandPalette } from './command-palette.js';
import { initScrollRevealAndPolish } from './scroll-reveal.js';
import { initAnalyticsOrb } from './analytics-orb.js';
import { initProjectsShowcase } from './projects-showcase.js';
import { initExperienceSection } from './experience.js';
import { initCertificatesSection } from './certificates.js';
import { initContactGlobe } from './contact-globe.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Interactive Helmet Rider Reveal
  initHelmetRiderReveal();

  // 2. Initialize Interactive Particle Typography Headings (Hero + Data Analytics, AI & Automation, Dev & Tools, Eng & IoT)
  initAllParticleTypography();

  // 3. Initialize 3D Silk Particle-Wave Wireframe Mesh Background
  initWaveBackground('particleCanvas');

  // 4. Initialize 3D Animated Holographic Data Analytics Orb Centerpiece (Reference Image Layout)
  initAnalyticsOrb('analyticsOrbCanvas', 'analyticsOrbContainer');

  // 5. Initialize 3D Floating Projects Showcase & Parallax
  initProjectsShowcase();

  // 6. Initialize Modals, Projects, & Toasts
  initModals();

  // 7. Initialize Experience Split-Card Timeline, Parallax Hero, & Certificate Verification
  initExperienceSection();

  // 8. Initialize Dedicated Certificates & Credentials Gallery & Viewer
  initCertificatesSection();

  // 6. Initialize Recruiter AI Query Assistant & Text Interactions
  initRecruiterAssistant();

  // 7. Initialize Motion Primitives AnimatedBackground (Cards, Nav Tabs, Filters, Logos)
  initAllAnimatedBackgrounds();

  // 8. Initialize Command Palette (Cmd+K / Ctrl+K)
  initCommandPalette();

  // 9. Initialize Staggered Scroll Reveals, Magnetic Buttons & Audio Controls
  initScrollRevealAndPolish();

  // 10. Initialize 3D Holographic Globe for Contact Section
  initContactGlobe();

  // 11. Contact Section Direct Detail Copy Handlers (Email, Phone, Location)
  const contactDetailCards = document.querySelectorAll('.contact-detail-card');
  contactDetailCards.forEach(card => {
    const textToCopy = card.getAttribute('data-copy');
    const copyBtn = card.querySelector('.contact-copy-btn');

    function performCopy(e) {
      if (e) e.preventDefault();
      if (!textToCopy) return;

      const notifySuccess = () => {
        if (copyBtn) {
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.classList.remove('copied');
          }, 2000);
        }
        if (window.showCyberToast) {
          window.showCyberToast(`COPIED: ${textToCopy}`);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(notifySuccess).catch(() => {
          fallbackCopy(textToCopy, notifySuccess);
        });
      } else {
        fallbackCopy(textToCopy, notifySuccess);
      }
    }

    function fallbackCopy(text, cb) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.left = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        cb();
      } catch (err) {
        console.error('Failed to copy', err);
      }
      document.body.removeChild(ta);
    }

    card.addEventListener('click', performCopy);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        performCopy(e);
      }
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        performCopy(e);
      });
    }
  });

  // 4. Header Scroll State (Throttled with RAF for 60/120fps fluid scrolling)
  const header = document.querySelector('.site-header');
  let headerRafId = null;
  window.addEventListener('scroll', () => {
    if (!headerRafId) {
      headerRafId = requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          header?.classList.add('scrolled');
        } else {
          header?.classList.remove('scrolled');
        }
        headerRafId = null;
      });
    }
  }, { passive: true });

  // 5. Mobile Navigation Menu Toggle with Full A11y & Escape Support
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function closeMobileNav() {
    if (!mobileToggle || !navMenu) return;
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileNav();
        mobileToggle.focus();
      }
    });
  }

  // 6. High-Performance RAF Scroll-Spy for Navigation Links
  const sections = document.querySelectorAll('section[id]');
  let scrollSpyRafId = null;

  function updateScrollSpy() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const isAtBottom = (scrollY + windowHeight) >= (docHeight - 100);

    let activeSectionId = null;

    if (isAtBottom) {
      activeSectionId = 'contact';
    } else if (scrollY < 200) {
      activeSectionId = 'home';
    } else {
      sections.forEach(current => {
        const sectionTop = current.offsetTop - 140;
        const sectionHeight = current.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          activeSectionId = current.getAttribute('id');
        }
      });
    }

    if (activeSectionId) {
      let navTargetId = activeSectionId;
      if (['skills', 'ai-automation', 'web-development', 'engineering-iot'].includes(activeSectionId)) {
        navTargetId = 'skills';
      }
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href === `#${navTargetId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', () => {
    if (!scrollSpyRafId) {
      scrollSpyRafId = requestAnimationFrame(() => {
        updateScrollSpy();
        scrollSpyRafId = null;
      });
    }
  }, { passive: true });
  updateScrollSpy();

  // 8. Animated Counter Statistics
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const stepTime = 30;
    const totalSteps = duration / stepTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const current = Math.floor(target * progress);
      el.textContent = current + suffix;

      if (step >= totalSteps) {
        el.textContent = target + suffix;
        clearInterval(timer);
      }
    }, stepTime);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach(el => countUp(el));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.about-stats-column') || document.querySelector('#about');
  if (statsSection) observer.observe(statsSection);

  // 9. Back To Top
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 10. Subtle Interactive Hero Mouse Parallax
  const heroSection = document.querySelector('.hero-section');
  const hudOrbit = document.querySelector('.cyber-hud-orbit');
  const backlight = document.querySelector('.portrait-backlight');

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (hudOrbit) {
        hudOrbit.style.transform = `translate(calc(-50% + ${x * 24}px), calc(-50% + ${y * 24}px))`;
      }
      if (backlight) {
        backlight.style.transform = `translate(calc(-50% + ${x * 35}px), calc(-50% + ${y * 35}px))`;
      }
    }, { passive: true });
  }

  console.log('Harivansh Vats Cyber Portfolio initialized successfully.');
});
