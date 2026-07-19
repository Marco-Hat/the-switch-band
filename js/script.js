document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  const skipBtn = document.getElementById('skipIntro');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = '2026';

  // fall+impact ~1.1s, logo full-brightness ~1.1s+0.4s, tagline fades in at 2.1s+0.7s
  const INTRO_DURATION = 2000; // ms

  let revealed = false;
  function revealSite() {
    if (revealed) return;
    revealed = true;
    intro.classList.add('hide');
    site.classList.add('show');
    document.body.style.overflow = 'auto';
    setTimeout(() => { intro.style.display = 'none'; }, 850);
  }

  // Lock scroll during intro
  document.body.style.overflow = 'hidden';

  const autoTimer = setTimeout(revealSite, INTRO_DURATION);

  skipBtn.addEventListener('click', () => {
    clearTimeout(autoTimer);
    revealSite();
  });

  intro.addEventListener('click', () => {
    clearTimeout(autoTimer);
    revealSite();
  });

  // Background music — starts muted (autoplay policy), unmutes on toggle or first interaction
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  function syncToggleIcon() {
    musicToggle.textContent = bgMusic.muted || bgMusic.paused ? '🔇' : '🔊';
  }

  function unmuteMusic() {
    bgMusic.muted = false;
    bgMusic.play().catch(() => {});
    syncToggleIcon();
  }

  syncToggleIcon();

  // Browsers allow muted autoplay; unmute on the visitor's first interaction.
  ['click', 'scroll', 'keydown'].forEach(evt => {
    document.addEventListener(evt, function firstInteract() {
      unmuteMusic();
      document.removeEventListener(evt, firstInteract);
    }, { once: true });
  });

  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.muted || bgMusic.paused) {
      unmuteMusic();
    } else {
      bgMusic.muted = true;
      syncToggleIcon();
    }
  });
});
