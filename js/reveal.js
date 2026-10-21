/**
 * ========================================================
 * INTERACTIVE HELMET RIDER REVEAL CONTROLLER
 * Seamless Inner Reveal with Large Radius & Smooth LERP
 * ========================================================
 */

export function initHelmetRiderReveal() {
  const container = document.getElementById('portraitContainer');
  const riderLayer = document.getElementById('riderLayerReveal');
  const mobileToggle = document.getElementById('mobileHoloToggle');

  if (!container || !riderLayer) {
    console.warn('Helmet Rider reveal elements missing.');
    return;
  }

  // Configuration - Focused progressive lens (reveals helmet, jacket, or hand under cursor)
  let baseRadius = 190;
  let currentRadius = baseRadius;
  let targetX = -500;
  let targetY = -500;
  let currentX = -500;
  let currentY = -500;
  let isHovered = false;
  let isMobileActive = false;
  let animationFrameId = null;
  const lerpFactor = 0.22; // Smooth responsive tracking

  function updateRadius() {
    const rect = container.getBoundingClientRect();
    // Scale proportionally if container changes size
    const scale = rect.width / 580;
    currentRadius = Math.max(120, Math.min(205, Math.round(baseRadius * scale)));
    container.style.setProperty('--reveal-r', `${currentRadius}px`);
  }

  updateRadius();
  window.addEventListener('resize', updateRadius);

  // Smooth LERP Animation Loop
  function render() {
    if (isHovered || isMobileActive) {
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      container.style.setProperty('--reveal-x', `${currentX.toFixed(2)}px`);
      container.style.setProperty('--reveal-y', `${currentY.toFixed(2)}px`);
    }

    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);

  function handlePointerMove(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Strict boundary clamping inside portrait container
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    targetX = x;
    targetY = y;

    if (!isHovered) {
      isHovered = true;
      currentX = x;
      currentY = y;
      riderLayer.classList.add('active');
      container.classList.add('reveal-active');
    }
  }

  function handlePointerLeave() {
    isHovered = false;
    riderLayer.classList.remove('active');
    container.classList.remove('reveal-active');
  }

  // Mouse Events
  container.addEventListener('mousemove', handlePointerMove, { passive: true });
  container.addEventListener('mouseenter', handlePointerMove, { passive: true });
  container.addEventListener('mouseleave', handlePointerLeave);

  // Touch Events for Mobile / Tablet
  container.addEventListener('touchstart', (e) => {
    handlePointerMove(e);
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    handlePointerMove(e);
  }, { passive: true });

  container.addEventListener('touchend', () => {
    setTimeout(handlePointerLeave, 1200);
  });

  // Mobile Toggle Button
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      isMobileActive = !isMobileActive;
      mobileToggle.classList.toggle('active', isMobileActive);

      if (isMobileActive) {
        const rect = container.getBoundingClientRect();
        targetX = rect.width * 0.55;
        targetY = rect.height * 0.35; // Centered over helmet
        riderLayer.classList.add('active');
        container.classList.add('reveal-active');
        mobileToggle.innerHTML = `<span>⚡</span> REVERT ORIGINAL PHOTO`;
      } else {
        handlePointerLeave();
        mobileToggle.innerHTML = `<span>⚡</span> SCAN CYBER HELMET`;
      }
    });
  }

  return () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', updateRadius);
  };
}
