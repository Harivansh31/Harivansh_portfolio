/**
 * ========================================================
 * SENIOR DEVELOPER POLISH & SCROLL REVEAL ENGINE
 * ========================================================
 * 1. IntersectionObserver staggered scroll reveals
 * 2. Magnetic button physics (Stripe/Apple standard)
 * 3. Interactive Code Architecture tab switcher & copy
 */

import { cyberAudio } from './audio.js';

export function initScrollRevealAndPolish() {
  // 1. Staggered Scroll Reveal
  const revealElements = document.querySelectorAll(
    '.section-header, .about-feature-card, .skill-category-card, .project-card, .certificate-card, .timeline-card, .contact-info-card, .contact-form, .exp-split-card, .cert-card-v2, .cert-gallery-card'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Optional audio tick on revealing milestone sections
          if (entry.target.classList.contains('section-header')) {
            cyberAudio.playHover();
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    // Stagger child elements in grids
    const parentGrid = el.closest('.skills-cards-grid, .about-cards-column, .projects-grid, .certificates-grid, .cert-verification-grid, .cert-gallery-grid');
    if (parentGrid) {
      const children = Array.from(parentGrid.children).filter(c => !c.classList.contains('animated-motion-bg'));
      const childIdx = children.indexOf(el);
      if (childIdx >= 0) {
        el.style.transitionDelay = `${childIdx * 0.1}s`;
      }
    }
    observer.observe(el);
  });

  // 2. Magnetic Button Physics (Desktop pointer only to preserve native touch scrolling)
  if (!window.matchMedia('(pointer: coarse)').matches) {
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-resume');

    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Gentle magnetic pull (max 8px)
        const pullX = Math.max(-8, Math.min(8, x * 0.25));
        const pullY = Math.max(-8, Math.min(8, y * 0.25));

        btn.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });

      btn.addEventListener('mouseenter', () => {
        cyberAudio.playHover();
      });

      btn.addEventListener('click', () => {
        cyberAudio.playClick();
      });
    });
  }

  // 3. Audio Toggle in Navigation Header
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  if (audioToggleBtn) {
    const audioOnIcon = audioToggleBtn.querySelector('.audio-on');
    const audioOffIcon = audioToggleBtn.querySelector('.audio-off');

    function updateAudioIcon(enabled) {
      if (enabled) {
        audioOnIcon.style.display = 'inline-block';
        audioOffIcon.style.display = 'none';
        audioToggleBtn.classList.add('active');
        audioToggleBtn.setAttribute('title', 'Cyber Audio SFX: ON (Click to mute)');
      } else {
        audioOnIcon.style.display = 'none';
        audioOffIcon.style.display = 'inline-block';
        audioToggleBtn.classList.remove('active');
        audioToggleBtn.setAttribute('title', 'Cyber Audio SFX: OFF (Click to unmute)');
      }
    }

    updateAudioIcon(cyberAudio.isEnabled());

    audioToggleBtn.addEventListener('click', () => {
      const state = cyberAudio.toggle();
      updateAudioIcon(state);
      showToast(state ? 'Cyber Audio SFX: Enabled' : 'Cyber Audio SFX: Muted');
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('cyberToast');
  const toastMsg = document.getElementById('toastMessage');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }
}
