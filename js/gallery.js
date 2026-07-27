document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('galleryGrid');
  const prev = document.getElementById('galPrev');
  const next = document.getElementById('galNext');
  if (!grid || !prev || !next) return;

  function cardStep() {
    const item = grid.querySelector('.gallery-item');
    if (!item) return grid.clientWidth;
    const gap = parseFloat(getComputedStyle(grid).gap) || 0;
    return item.getBoundingClientRect().width + gap;
  }

  function updateArrows() {
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const hasOverflow = maxScroll > 4;
    prev.classList.toggle('hidden', !hasOverflow || grid.scrollLeft <= 4);
    next.classList.toggle('hidden', !hasOverflow || grid.scrollLeft >= maxScroll - 4);
  }

  prev.addEventListener('click', () => grid.scrollBy({ left: -cardStep(), behavior: 'smooth' }));
  next.addEventListener('click', () => grid.scrollBy({ left: cardStep(), behavior: 'smooth' }));
  grid.addEventListener('scroll', updateArrows);
  window.addEventListener('resize', updateArrows);
  updateArrows();
});
