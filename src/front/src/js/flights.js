import { initPublicNav, getAuth } from './utils/auth.js';
import { apiGet } from './utils/api.js';
import { API_URL } from './config.js';



const cityOptionHTML = (city) => `
  <div class="custom-option" data-value="${city}">
    <div class="custom-option-icon">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    </div>
    <div class="custom-option-text">
      <div class="custom-option-title">${city}</div>
      <div class="custom-option-subtitle">Available journey destination</div>
    </div>
    <div class="custom-option-arrow">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </div>
  </div>
`;

const flightCardHTML = (flight) => `
  <div class="flight-card">
    <div class="fc-left">
      <img
        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=200&auto=format&fit=crop"
        alt="Flight"
        class="fc-img"
      />
      <div class="fc-details">
        <div class="fc-timebox" style="text-align:left;">
          <div class="fc-time">${new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div class="fc-loc">${flight.departureCity}</div>
        </div>
        <div class="fc-route">
          <span class="fc-duration">Flight</span>
          <div class="fc-line">
            <div class="fc-dot"></div>
            <div class="fc-dash"></div>
            <svg class="fc-plane" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <span class="fc-stops">NON-STOP</span>
        </div>
        <div class="fc-timebox" style="text-align:right;">
          <div class="fc-time">${new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div class="fc-loc">${flight.arrivalCity}</div>
        </div>
      </div>
    </div>
    <div class="fc-right">
      <div>
        <div class="fc-price-label">PER PERSON</div>
        <div class="fc-price">€${flight.price}</div>
      </div>
      <button class="btn-fc-select js-select-flight" data-id="${flight.id}">
        Select Journey
        <svg style="width:16px;height:16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </button>
    </div>
  </div>
`;



const showError = (id, msg) => {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
};

const clearErrors = () => {
  document.querySelectorAll('.f-error').forEach((el) => {
    el.textContent = '';
    el.style.display = 'none';
  });
};

const setMinDateToToday = (dateInput) => {
  if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
};
const flightDateInput = document.getElementById('flightDate');


flightDateInput.addEventListener('keydown', (e) => {
  e.preventDefault();
});

flightDateInput.addEventListener('paste', (e) => {
  e.preventDefault();
});

const isFieldEmpty = (value) => {
  return !value;
};

const isSameCity = (from, to) => {
  return from && to && from.toLowerCase() === to.toLowerCase();
};

const navigateToPayment = (flightId) => {
  window.location.href = `checkout.html?flightId=${flightId}`;
};

const searchFlights = async (from, to) => {
  const res = await fetch(`${API_URL}/flights?departureCity=${encodeURIComponent(from)}&arrivalCity=${encodeURIComponent(to)}`);
  return await res.json();
};



const setupDropdown = (dropdownId, triggerId, inputId, menuId) => {
  const dropdown = document.getElementById(dropdownId);
  const trigger = document.getElementById(triggerId);
  const input = document.getElementById(inputId);
  const menu = document.getElementById(menuId);

  if (!dropdown || !trigger || !input || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.custom-dropdown').forEach((d) => {
      if (d !== dropdown) d.classList.remove('open');
    });
    dropdown.classList.toggle('open');
  });

  menu.querySelectorAll('.custom-option').forEach((option) => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      input.value = option.dataset.value;
      trigger.textContent = option.dataset.value;
      dropdown.classList.remove('open');
    });
  });
};

// ── Render flights ────────────────────────────────────────────────────────────

const container = document.getElementById('flights-container');

const renderFlights = (flights) => {
  const titleEl = document.getElementById('flights-result-title');
  if (flights.length === 0) {
    if (titleEl) titleEl.style.display = 'none';
    container.innerHTML = '<p>No flights found for this route.</p>';
    return;
  }

  if (titleEl) {
    titleEl.textContent = `Found ${flights.length} Curated Journey${flights.length > 1 ? 's' : ''}`;
    titleEl.style.display = 'block';
  }

  container.innerHTML = flights.map(flightCardHTML).join('');

  container.querySelectorAll('.js-select-flight').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigateToPayment(btn.dataset.id);
    });
  });
};

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  initPublicNav();


  const dateInput = document.getElementById('flightDate');
  setMinDateToToday(dateInput);


  document.getElementById('flightSearchBtn')?.addEventListener('click', async () => {
    clearErrors();

    const from = document.getElementById('flightFrom').value.trim();
    const to = document.getElementById('flightTo').value.trim();
    const date = document.getElementById('flightDate').value;
    let isValid = true;

    if (isFieldEmpty(from)) { showError('flightFromError', 'This field is required'); isValid = false; }
    if (isFieldEmpty(to)) { showError('flightToError', 'This field is required'); isValid = false; }
    if (isFieldEmpty(date)) { showError('flightDateError', 'This field is required'); isValid = false; }

    if (isSameCity(from, to)) {
      showError('flightToError', 'Destination cannot be the same as Departure');
      isValid = false;
    }

    if (!isValid) return;

    if (container) {
      try {
        const flightsData = await searchFlights(from, to);
        renderFlights(flightsData);
      } catch {
        container.innerHTML = '<p>Error fetching flights</p>';
      }
    }
  });


  if (container) {
    try {
      const [flightsData, destinationsData] = await Promise.all([
        apiGet('/flights').then((r) => r.json()),
        apiGet('/destinations').then((r) => r.json()).catch(() => []),
      ]);

      const allCities = [
        ...new Set([
          ...flightsData.flatMap((f) => [f.departureCity, f.arrivalCity]),
          ...destinationsData.map((d) => d.name),
        ].filter(Boolean)),
      ].sort();

      const fromMenu = document.getElementById('flightFromMenu');
      const toMenu = document.getElementById('flightToMenu');
      const html = allCities.map(cityOptionHTML).join('');
      if (fromMenu) fromMenu.innerHTML = html;
      if (toMenu) toMenu.innerHTML = html;

      setupDropdown('dropdownFrom', 'flightFromTrigger', 'flightFrom', 'flightFromMenu');
      setupDropdown('dropdownTo', 'flightToTrigger', 'flightTo', 'flightToMenu');

      // Pre-fill destination from URL param (e.g. coming from destination page)
      const destParam = new URLSearchParams(window.location.search).get('destination');
      if (destParam) {
        const flightToInput = document.getElementById('flightTo');
        const flightToTrigger = document.getElementById('flightToTrigger');
        if (flightToInput) flightToInput.value = destParam;
        if (flightToTrigger) flightToTrigger.textContent = destParam;
      }

      document.addEventListener('click', () => {
        document.querySelectorAll('.custom-dropdown').forEach((d) => d.classList.remove('open'));
      });
    } catch {
      container.innerHTML = '<p>Error fetching flights</p>';
    }
  }
});