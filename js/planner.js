/**
 * VOYA - Interactive Client Expedition Customizer
 * Dynamically builds a personalized day-by-day northern Pakistan itinerary dossier
 */

document.addEventListener('DOMContentLoaded', () => {
  // Region day templates for schedule generation
  const regionDayPlans = {
    basho: {
      title: "Basho Pine Sanctuary & Cascading Streams",
      desc: "Morning arrival in Skardu. Scenic 4WD ascent into the secluded pine groves of Basho. Walk across traditional wooden bridges and enjoy high-altitude herbal chai beside glacial streams."
    },
    hunza: {
      title: "Hunza Valley & 700-Year Baltit Castle",
      desc: "Drive the iconic Karakoram Highway along the Hunza River. Guided exploration of ancient Baltit Fort, sunset from Eagles Nest viewpoint, and fresh apricot orchard walk."
    },
    deosai: {
      title: "Deosai Plateau & Sapphire Sheosar Lake",
      desc: "Traverse into the 'Land of the Giants' at 4,114m. Marvel at endless wildflower fields, spot Himalayan Brown Bears, and picnic by the mirrored waters of Sheosar Lake."
    },
    fairymeadows: {
      title: "Raikot Jeep Track & Nanga Parbat Basecamp",
      desc: "Thrilling cliffside 4WD ride to Tato village followed by a scenic pine trail hike to Fairy Meadows. Front-row campfire gazing at the colossal snowfields of the Killer Mountain."
    },
    skardu: {
      title: "Katpana Cold Desert Stargazing & Lower Kachura",
      desc: "Explore the rare high-altitude white sand dunes of Katpana. Sunset boat ride on Shangrila Lake and a warm juniper bonfire under the crystal Milky Way."
    },
    astore: {
      title: "Astore Valley & Emerald Rama Glacial Lake",
      desc: "Journey through deep cedar forests into Rama Meadows. Hike to the turquoise glacial tarn of Rama Lake tucked beneath the eastern face of Nanga Parbat."
    }
  };

  // State
  const clientState = {
    selectedRegions: ['basho', 'hunza'],
    pace: 'relaxed',
    lodgingRate: 8000,
    lodgingName: 'Boutique Heritage',
    experiences: ['stargazing'],
    travelers: 2,
    season: 'Summer Bloom (Jul-Aug)'
  };

  // DOM Elements
  const regionCards = document.querySelectorAll('.pick-region');
  const paceCards = document.querySelectorAll('.pick-pace');
  const lodgingCards = document.querySelectorAll('.pick-lodging');
  const expCards = document.querySelectorAll('.pick-exp');
  const travelersInput = document.getElementById('planTravelers');
  const seasonSelect = document.getElementById('planSeason');

  const dossierDays = document.getElementById('dossierDays');
  const dossierTravelers = document.getElementById('dossierTravelers');
  const dossierPace = document.getElementById('dossierPace');
  const dossierLodging = document.getElementById('dossierLodging');
  const dossierTags = document.getElementById('dossierTags');
  const dossierPrice = document.getElementById('dossierPrice');
  const dossierPriceUsd = document.getElementById('dossierPriceUsd');
  const timelineContainer = document.getElementById('itineraryTimeline');

  // Handle Region Card Clicks
  regionCards.forEach(card => {
    card.addEventListener('click', () => {
      const region = card.getAttribute('data-region');
      card.classList.toggle('selected');

      if (clientState.selectedRegions.includes(region)) {
        if (clientState.selectedRegions.length > 1) {
          clientState.selectedRegions = clientState.selectedRegions.filter(r => r !== region);
        } else {
          // Keep at least one selected
          card.classList.add('selected');
        }
      } else {
        clientState.selectedRegions.push(region);
      }
      updateClientDossier();
    });
  });

  // Handle Pace Selection
  paceCards.forEach(card => {
    card.addEventListener('click', () => {
      paceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      clientState.pace = card.getAttribute('data-pace');
      updateClientDossier();
    });
  });

  // Handle Lodging Selection
  lodgingCards.forEach(card => {
    card.addEventListener('click', () => {
      lodgingCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      clientState.lodgingRate = parseInt(card.getAttribute('data-rate'), 10) || 8000;
      clientState.lodgingName = card.getAttribute('data-name') || 'Heritage';
      updateClientDossier();
    });
  });

  // Handle Experiences Toggle
  expCards.forEach(card => {
    card.addEventListener('click', () => {
      const exp = card.getAttribute('data-exp');
      card.classList.toggle('selected');
      if (clientState.experiences.includes(exp)) {
        clientState.experiences = clientState.experiences.filter(e => e !== exp);
      } else {
        clientState.experiences.push(exp);
      }
      updateClientDossier();
    });
  });

  // Handle Travelers and Season
  travelersInput?.addEventListener('input', () => {
    clientState.travelers = parseInt(travelersInput.value, 10) || 1;
    updateClientDossier();
  });

  seasonSelect?.addEventListener('change', () => {
    clientState.season = seasonSelect.value;
    updateClientDossier();
  });

  // Recalculate & Render
  function updateClientDossier() {
    // 1. Calculate duration based on region count and pace
    let days = Math.max(3, clientState.selectedRegions.length + 1);
    if (clientState.pace === 'relaxed') days += 1;
    if (clientState.selectedRegions.length >= 4) days += 1;

    // 2. Calculate Pricing
    const vehicleCostPerDay = 18000;
    const guideAndPermitCostPerDay = 7000;
    const sharedTransportTotal = (vehicleCostPerDay + guideAndPermitCostPerDay) * days;
    const mealAndLodgingPerPersonDay = clientState.lodgingRate + 3500;
    const individualTotal = mealAndLodgingPerPersonDay * days * clientState.travelers;
    const expCost = clientState.experiences.length * 12000;

    const grandTotalPkr = sharedTransportTotal + individualTotal + expCost;
    const grandTotalUsd = Math.round(grandTotalPkr / 280);

    // 3. Update Sticky Summary
    if (dossierDays) dossierDays.textContent = `${days} Days`;
    if (dossierTravelers) dossierTravelers.textContent = `${clientState.travelers} Explorer${clientState.travelers > 1 ? 's' : ''}`;
    if (dossierPace) {
      const paceNames = { relaxed: 'Unhurried & Mindful', active: 'Active Hiking & Heritage', offroad: '4WD Off-Road Adventure' };
      dossierPace.textContent = paceNames[clientState.pace] || 'Relaxed';
    }
    if (dossierLodging) dossierLodging.textContent = clientState.lodgingName;

    if (dossierPrice) dossierPrice.textContent = `PKR ${grandTotalPkr.toLocaleString()}`;
    if (dossierPriceUsd) dossierPriceUsd.textContent = `Approx. $${grandTotalUsd.toLocaleString()} USD Total`;

    // Render Region Tags
    if (dossierTags) {
      const regionNames = {
        basho: 'Basho Pines',
        hunza: 'Hunza & Passu',
        deosai: 'Deosai Plateau',
        fairymeadows: 'Nanga Parbat Base',
        skardu: 'Katpana Cold Dunes',
        astore: 'Rama Lake & Astore'
      };
      dossierTags.innerHTML = clientState.selectedRegions
        .map(r => `<span class="dossier-tag">🌲 ${regionNames[r] || r}</span>`)
        .join('');
    }

    // 4. Render Day-by-Day Timeline
    if (timelineContainer) {
      let timelineHTML = '';
      let dayCounter = 1;

      // Day 1: Basecamp Briefing & Acclimatization
      timelineHTML += `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <span class="timeline-day-badge">Day 1</span>
          <h4 class="timeline-title">Northern Gateway Arrival & Acclimatization</h4>
          <p class="timeline-body">Arrival via Islamabad or Skardu airport. Welcome tea with native mountain guides, elevation briefing, and local organic herbal dinner.</p>
        </div>
      `;
      dayCounter++;

      // Selected Regions Days
      clientState.selectedRegions.forEach(regKey => {
        const plan = regionDayPlans[regKey];
        if (plan && dayCounter <= days) {
          timelineHTML += `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <span class="timeline-day-badge">Day ${dayCounter}</span>
              <h4 class="timeline-title">${plan.title}</h4>
              <p class="timeline-body">${plan.desc}</p>
            </div>
          `;
          dayCounter++;
        }
      });

      // Extra Rest / Departure Day
      if (dayCounter <= days) {
        timelineHTML += `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <span class="timeline-day-badge">Day ${days}</span>
            <h4 class="timeline-title">Golden Hour Farewell & Mountain Memories</h4>
            <p class="timeline-body">Final sunrise reflections over the peaks, artisanal dry-fruit tasting, and escorted transfer to airport or departure highway.</p>
          </div>
        `;
      }

      timelineContainer.innerHTML = timelineHTML;
    }
  }

  // Finalize / Lock Itinerary Modal
  const lockPlanBtn = document.getElementById('lockPlanBtn');
  const planModal = document.getElementById('customDossierModal');
  const closePlanModal = document.getElementById('closePlanModal');
  const modalDossierContent = document.getElementById('modalDossierContent');

  lockPlanBtn?.addEventListener('click', () => {
    const days = dossierDays?.textContent || '7 Days';
    const cost = dossierPrice?.textContent || '';
    const usd = dossierPriceUsd?.textContent || '';

    if (modalDossierContent) {
      modalDossierContent.innerHTML = `
        <p><strong>Expedition Duration:</strong> ${days}</p>
        <p><strong>Party Size:</strong> ${clientState.travelers} Travelers &bull; <strong>Season:</strong> ${clientState.season}</p>
        <p><strong>Selected Sanctuaries:</strong> ${clientState.selectedRegions.join(', ').toUpperCase()}</p>
        <p><strong>Style:</strong> ${clientState.pace.toUpperCase()} &bull; <strong>Lodging:</strong> ${clientState.lodgingName}</p>
        <p style="margin-top: 1rem; color: var(--color-forest-deep); font-size: 1.1rem;"><strong>Estimated Investment:</strong> ${cost} (${usd})</p>
      `;
    }
    planModal?.classList.add('active');
  });

  closePlanModal?.addEventListener('click', () => {
    planModal?.classList.remove('active');
  });

  planModal?.addEventListener('click', (e) => {
    if (e.target === planModal) planModal.classList.remove('active');
  });

  // Initial calculation
  updateClientDossier();
});
