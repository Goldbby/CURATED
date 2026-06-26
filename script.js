/* ============================================
   CURATED — Gallery filtering + lightbox
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const filterBar = document.getElementById('filter-bar');
  const filterBtns = filterBar.querySelectorAll('.filter-btn');
  const items = Array.from(document.querySelectorAll('.gallery-item'));

  let activeFilter = 'all';
  let currentIndex = 0;

  // ---------- Filtering ----------
  function applyFilter(filter) {
    activeFilter = filter;
    items.forEach(item => {
      const matches = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('is-hidden', !matches);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  // ---------- Lightbox: build markup once ----------
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-label', 'Image viewer');
  lightbox.innerHTML = `
    <div class="lightbox-inner">
      <button class="lb-close" aria-label="Close viewer">&times;</button>
      <button class="lb-nav lb-prev" aria-label="Previous image">&#8249;</button>
      <figure class="lb-figure">
        <img class="lb-image" src="" alt="">
        <figcaption class="lb-caption"></figcaption>
      </figure>
      <button class="lb-nav lb-next" aria-label="Next image">&#8250;</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImage = lightbox.querySelector('.lb-image');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const lbClose = lightbox.querySelector('.lb-close');
  const lbPrev = lightbox.querySelector('.lb-prev');
  const lbNext = lightbox.querySelector('.lb-next');

  function visibleItems() {
    return items.filter(item => !item.classList.contains('is-hidden'));
  }

  function openLightbox(item) {
    currentIndex = visibleItems().indexOf(item);
    renderLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    const visible = visibleItems();
    const item = visible[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbCaption.textContent = item.dataset.category;
  }

  function step(delta) {
    const visible = visibleItems();
    currentIndex = (currentIndex + delta + visible.length) % visible.length;
    renderLightbox();
  }

  items.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => step(-1));
  lbNext.addEventListener('click', () => step(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
});