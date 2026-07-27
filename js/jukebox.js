const JUKEBOX_TRACKS = [
  { title: 'Price Tag', artist: 'Jessie J', cover: 'assets/covers/price-tag.jpg', audio: 'assets/audio/price-tag.m4a' },
  { title: 'Stand By Me / Every Breath You Take', artist: 'Ben E. King / The Police', cover: 'assets/covers/stand-by-me-medley.jpg', audio: 'assets/audio/stand-by-me-medley.m4a' },
  { title: 'Tennessee Whiskey', artist: 'Chris Stapleton', cover: 'assets/covers/tennessee-whiskey.jpg', audio: 'assets/audio/tennessee-whiskey.m4a' },
  { title: 'The Way', artist: 'Fastball', cover: 'assets/covers/the-way.jpg', audio: 'assets/audio/the-way.m4a' },
  { title: "What's Up", artist: '4 Non Blondes', cover: 'assets/covers/whats-up.jpg', audio: 'assets/audio/whats-up.m4a' },
  { title: 'Dreams', artist: 'The Cranberries', cover: 'assets/covers/dreams.jpg', audio: 'assets/audio/dreams.m4a' },
  { title: 'Birds of a Feather', artist: 'Billie Eilish', cover: 'assets/covers/birds-of-a-feather.jpg', audio: 'assets/audio/birds-of-a-feather.m4a' },
  { title: 'Oh! Darling', artist: 'The Beatles', cover: 'assets/covers/oh-darling.jpg', audio: 'assets/audio/oh-darling.m4a' },
  { title: 'Underneath It All', artist: 'No Doubt', cover: 'assets/covers/underneath-it-all.jpg', audio: 'assets/audio/underneath-it-all.m4a' },
  { title: 'I Want to Break Free', artist: 'Queen', cover: 'assets/covers/i-want-to-break-free.jpg', audio: 'assets/audio/i-want-to-break-free.m4a' },
  { title: 'The Story', artist: 'Brandi Carlile', cover: 'assets/covers/the-story.jpg', audio: 'assets/audio/the-story.m4a' },
  { title: 'Whenever, Wherever', artist: 'Shakira', cover: 'assets/covers/whenever-wherever.jpg', audio: 'assets/audio/whenever-wherever.m4a' },
  { title: 'Night Birds', artist: 'Shakatak', cover: 'assets/covers/night-birds.jpg', audio: 'assets/audio/night-birds.m4a' }
];

document.addEventListener('DOMContentLoaded', () => {
  const trackEl = document.getElementById('cfTrack');
  if (!trackEl) return;

  const coverflow = document.getElementById('coverflow');
  const titleEl = document.getElementById('cfTitle');
  const artistEl = document.getElementById('cfArtist');
  const progressEl = document.getElementById('cfProgress');
  const audio = document.getElementById('cfAudio');
  const playBtn = document.getElementById('cfPlay');
  const prevBtn = document.getElementById('cfPrev');
  const nextBtn = document.getElementById('cfNext');

  let current = JUKEBOX_TRACKS.findIndex(t => t.title.startsWith('Stand By Me'));
  if (current < 0) current = 0;
  let isPlaying = false;

  JUKEBOX_TRACKS.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'cf-item';
    item.innerHTML = `
      <div class="cf-cover">
        <img class="cf-art" src="${t.cover}" alt="${t.title}">
        <div class="cf-badge-bg" aria-hidden="true"></div>
        <img class="cf-badge" src="assets/wordmark-poster-logo.png" alt="" aria-hidden="true">
        <img class="cf-reflection" src="${t.cover}" alt="" aria-hidden="true">
      </div>`;
    item.addEventListener('click', () => goTo(i));
    trackEl.appendChild(item);
  });

  const items = Array.from(trackEl.children);
  const total = JUKEBOX_TRACKS.length;

  function formatTime(s) {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function updatePlayBtn() {
    playBtn.textContent = isPlaying ? '⏸' : '▶';
    playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  }

  function render() {
    items.forEach((item, i) => {
      let offset = i - current;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;
      if (Math.abs(offset) > 3) {
        item.style.opacity = 0;
        item.style.pointerEvents = 'none';
        item.removeAttribute('data-offset');
      } else {
        item.dataset.offset = offset;
        item.style.pointerEvents = '';
        item.style.opacity = '';
      }
    });
    const t = JUKEBOX_TRACKS[current];
    titleEl.textContent = t.title;
    artistEl.textContent = t.artist;
  }

  function fadeAudio(el, from, to, duration, done) {
    const steps = 12;
    const stepTime = duration / steps;
    let i = 0;
    el.volume = from;
    clearInterval(el._fadeInterval);
    el._fadeInterval = setInterval(() => {
      i++;
      el.volume = Math.min(1, Math.max(0, from + (to - from) * (i / steps)));
      if (i >= steps) {
        clearInterval(el._fadeInterval);
        if (done) done();
      }
    }, stepTime);
  }

  function loadCurrent(autoplay) {
    const startNext = () => {
      audio.src = JUKEBOX_TRACKS[current].audio;
      progressEl.textContent = '';
      if (autoplay) {
        audio.volume = 0;
        audio.play().then(() => {
          isPlaying = true;
          updatePlayBtn();
          fadeAudio(audio, 0, 1, 400);
        }).catch(() => { isPlaying = false; updatePlayBtn(); });
      } else {
        isPlaying = false;
        updatePlayBtn();
      }
    };

    if (autoplay && audio.src && !audio.paused) {
      fadeAudio(audio, audio.volume, 0, 250, startNext);
    } else {
      startNext();
    }
  }

  let tiltTimeout = null;
  function tiltTrack(dir) {
    trackEl.classList.remove('tilt-left', 'tilt-right');
    void trackEl.offsetWidth; // restart transition when the same direction fires again
    trackEl.classList.add(dir === 1 ? 'tilt-right' : 'tilt-left');
    clearTimeout(tiltTimeout);
    tiltTimeout = setTimeout(() => trackEl.classList.remove('tilt-left', 'tilt-right'), 300);
  }

  function goTo(i) {
    let diff = i - current;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    if (diff !== 0) tiltTrack(diff > 0 ? 1 : -1);

    current = ((i % total) + total) % total;
    render();
    loadCurrent(isPlaying);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  playBtn.addEventListener('click', () => {
    if (!audio.src) { loadCurrent(true); return; }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      updatePlayBtn();
    } else {
      audio.volume = 1;
      audio.play().then(() => { isPlaying = true; updatePlayBtn(); }).catch(() => {});
    }
  });

  audio.addEventListener('ended', () => {
    isPlaying = true;
    goTo(current + 1);
  });

  audio.addEventListener('timeupdate', () => {
    progressEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const rect = coverflow.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    goTo(current + (e.key === 'ArrowRight' ? 1 : -1));
  });

  let touchStartX = null;
  coverflow.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  coverflow.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    touchStartX = null;
  });

  document.addEventListener('site:revealed', () => {
    if (!isPlaying) loadCurrent(true);
    // iOS Safari sometimes fails to render the 3D transforms until something
    // actually moves — nudge the track with a tiny tilt to force it in.
    setTimeout(() => { tiltTrack(1); }, 950);
  });

  render();
});
