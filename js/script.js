document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  const skipBtn = document.getElementById('skipIntro');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = '2026';

  // fall+impact ~1.1s, logo full-brightness ~1.1s+0.4s, tagline fades in at 2.1s+0.7s
  const INTRO_DURATION = 3000; // ms

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
});
