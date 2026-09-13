/**
 * VOYA - Folklore & Historical Lore Gallery
 * Handles category filtering and interactive modal lightbox with detailed folklore narratives
 */

document.addEventListener('DOMContentLoaded', () => {
  const loreCards = document.querySelectorAll('.lore-card');
  const modal = document.getElementById('loreModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalLocation = document.getElementById('modalLocation');
  const modalAltitude = document.getElementById('modalAltitude');
  const modalSeason = document.getElementById('modalSeason');
  const modalStory = document.getElementById('modalStory');

  // Filter functionality in gallery
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');

      loreCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open Modal with specific item lore
  loreCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const badge = card.getAttribute('data-badge');
      const location = card.getAttribute('data-location');
      const altitude = card.getAttribute('data-altitude');
      const season = card.getAttribute('data-season');
      const imgSrc = card.querySelector('img')?.src;
      const storyHTML = card.querySelector('.lore-full-story')?.innerHTML;

      if (modalImg && imgSrc) modalImg.src = imgSrc;
      if (modalBadge) modalBadge.textContent = badge || 'Heritage & Nature';
      if (modalTitle) modalTitle.textContent = title;
      if (modalLocation) modalLocation.textContent = location;
      if (modalAltitude) modalAltitude.textContent = altitude;
      if (modalSeason) modalSeason.textContent = season;
      if (modalStory) modalStory.innerHTML = storyHTML || '<p>Discover the untold legends of the Northern ranges.</p>';

      modal?.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent page scroll
    });
  });

  // Close Modal functions
  function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });
});
