/**
 * VOYA - Destinations Explorer & Budget Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Destination Filtering & Search ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const destinationCards = document.querySelectorAll('.destination-card');
  const searchInput = document.getElementById('destinationSearch');

  function filterCards() {
    const activeCategory = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    const searchQuery = (searchInput?.value || '').toLowerCase().trim();

    destinationCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const location = card.querySelector('.card-location')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';

      const matchesCategory = (activeCategory === 'all') || (category === activeCategory);
      const matchesSearch = title.includes(searchQuery) || location.includes(searchQuery) || description.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  // --- 2. Interactive Trip Budget Estimator ---
  const daysSlider = document.getElementById('calcDays');
  const daysValue = document.getElementById('calcDaysValue');
  const travelersSlider = document.getElementById('calcTravelers');
  const travelersValue = document.getElementById('calcTravelersValue');
  const vehicleSelect = document.getElementById('calcVehicle');
  const hotelSelect = document.getElementById('calcHotel');

  const totalPkrDisplay = document.getElementById('calcTotalPkr');
  const totalUsdDisplay = document.getElementById('calcTotalUsd');
  const perPersonDisplay = document.getElementById('calcPerPersonPkr');

  function calculateTripBudget() {
    if (!daysSlider || !travelersSlider || !vehicleSelect || !hotelSelect) return;

    const days = parseInt(daysSlider.value, 10);
    const travelers = parseInt(travelersSlider.value, 10);
    const vehicleRatePerDay = parseInt(vehicleSelect.value, 10); // Vehicle daily rental + fuel
    const hotelRatePerPersonDay = parseInt(hotelSelect.value, 10); // Room/tent share per night

    // Base guide + permit fee for Gilgit-Baltistan high-altitude pass
    const guideAndPermitPerDay = 7500;
    // Meals & nourishment per person per day
    const foodPerPersonDay = 3200;

    // Calculation:
    // Vehicle & Guide are shared costs for the whole group
    const sharedTransportCost = (vehicleRatePerDay + guideAndPermitPerDay) * days;
    // Lodging & Food are per-person costs
    const individualCost = (hotelRatePerPersonDay + foodPerPersonDay) * days * travelers;

    const grandTotalPkr = sharedTransportCost + individualCost;
    const perPersonPkr = Math.round(grandTotalPkr / travelers);
    const grandTotalUsd = Math.round(grandTotalPkr / 280);

    // Update UI
    if (daysValue) daysValue.textContent = `${days} ${days === 1 ? 'Day' : 'Days'}`;
    if (travelersValue) travelersValue.textContent = `${travelers} ${travelers === 1 ? 'Person' : 'People'}`;

    if (totalPkrDisplay) {
      totalPkrDisplay.textContent = `PKR ${grandTotalPkr.toLocaleString()}`;
    }
    if (totalUsdDisplay) {
      totalUsdDisplay.textContent = `Approx. $${grandTotalUsd.toLocaleString()} USD`;
    }
    if (perPersonDisplay) {
      perPersonDisplay.textContent = `PKR ${perPersonPkr.toLocaleString()} / person`;
    }
  }

  // Bind event listeners for real-time recalculation
  if (daysSlider && travelersSlider) {
    daysSlider.addEventListener('input', calculateTripBudget);
    travelersSlider.addEventListener('input', calculateTripBudget);
    vehicleSelect?.addEventListener('change', calculateTripBudget);
    hotelSelect?.addEventListener('change', calculateTripBudget);
    // Initial run
    calculateTripBudget();
  }
});
