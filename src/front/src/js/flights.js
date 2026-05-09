import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Auth Check
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const loginLink = document.querySelector('a[href="login.html"]');
  if (token && user && loginLink) {
    loginLink.innerText = 'LOGOUT';
    loginLink.href = '#';
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    });
    // Add User Name
    const nameSpan = document.createElement('span');
    nameSpan.className = 'nav-user-name';
    nameSpan.innerText = user.firstName;
    nameSpan.style.cssText = 'font-size: 0.875rem; font-weight: 700; color: #1e3a8a; margin-left: -16px;';
    loginLink.parentNode.insertBefore(nameSpan, loginLink.nextSibling);
  }

  const container = document.getElementById('flights-container');
  const dateInput = document.getElementById('flightDate');
  
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  const searchBtn = document.getElementById('flightSearchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
      document.querySelectorAll('.f-error').forEach(el => { el.innerText = ''; el.style.display = 'none'; });
      
      const from = document.getElementById('flightFrom').value.trim();
      const to = document.getElementById('flightTo').value.trim();
      const date = document.getElementById('flightDate').value;
      let isValid = true;
      
      if (!from) { document.getElementById('flightFromError').innerText = 'This field is required'; document.getElementById('flightFromError').style.display = 'block'; isValid = false; }
      if (!to) { document.getElementById('flightToError').innerText = 'This field is required'; document.getElementById('flightToError').style.display = 'block'; isValid = false; }
      if (!date) { document.getElementById('flightDateError').innerText = 'This field is required'; document.getElementById('flightDateError').style.display = 'block'; isValid = false; }
      
      if (from && to && from.toLowerCase() === to.toLowerCase()) {
        document.getElementById('flightToError').innerText = 'Destination cannot be the same as Departure'; document.getElementById('flightToError').style.display = 'block'; isValid = false;
      }
      
      if (!isValid) return;
      
      if (container) {
        try {
          const res = await fetch(`${API_URL}/flights?departureCity=${encodeURIComponent(from)}&arrivalCity=${encodeURIComponent(to)}`);
          const flights = await res.json();
          renderFlights(flights);
        } catch (err) {
          container.innerHTML = '<p>Error fetching flights</p>';
        }
      }
    });
  }

  const renderFlights = (flights) => {
    const titleEl = document.getElementById('flights-result-title');
    if (flights.length === 0) {
      if (titleEl) titleEl.style.display = 'none';
      container.innerHTML = '<p>No flights found for this route.</p>';
      return;
    }

    if (titleEl) {
      titleEl.innerText = `Found ${flights.length} Curated Journey${flights.length > 1 ? 's' : ''}`;
      titleEl.style.display = 'block';
    }

    container.innerHTML = flights.map(flight => `
      <div class="flight-card">
        <div class="fc-left">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=200&auto=format&fit=crop" alt="Flight" class="fc-img" />
          <div class="fc-details">
            <div class="fc-timebox" style="text-align: left;">
              <div class="fc-time">${new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div class="fc-loc">${flight.departureCity}</div>
            </div>
            
            <div class="fc-route">
              <span class="fc-duration">Flight</span>
              <div class="fc-line">
                <div class="fc-dot"></div>
                <div class="fc-dash"></div>
                <svg class="fc-plane" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
              </div>
              <span class="fc-stops">NON-STOP</span>
            </div>
            
            <div class="fc-timebox" style="text-align: right;">
              <div class="fc-time">${new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div class="fc-loc">${flight.arrivalCity}</div>
            </div>
          </div>
        </div>
        
        <div class="fc-right">
          <div>
            <div class="fc-price-label">PER PERSON</div>
            <div class="fc-price">€${flight.price}</div>
          </div>
          <button class="btn-fc-select" onclick="window.location.href='checkout.html?flightId=${flight.id}'">
            Select Journey
            <svg style="width:16px; height: 16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  };

  // Initially load some flights just to show and populate cities
  if (container) {
    Promise.all([
      fetch(`${API_URL}/flights`).then(r => r.json()),
      fetch(`${API_URL}/destinations`).then(r => r.json()).catch(() => [])
    ])
    .then(([flightsData, destinationsData]) => {
      // Do not render flights initially
      
      // Extract unique cities from flights
      const flightCities = flightsData.flatMap(f => [f.departureCity, f.arrivalCity]);
      
      // Extract unique cities from destinations
      const destCities = destinationsData.map(d => d.name);
      
      // Combine and get unique cities
      const allCities = [...new Set([...flightCities, ...destCities].filter(Boolean))].sort();

      const fromMenu = document.getElementById('flightFromMenu');
      const toMenu = document.getElementById('flightToMenu');
      
      const renderCustomOption = (city) => `
        <div class="custom-option" data-value="${city}">
          <div class="custom-option-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div class="custom-option-text">
            <div class="custom-option-title">${city}</div>
            <div class="custom-option-subtitle">Available journey destination</div>
          </div>
          <div class="custom-option-arrow">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      `;

      if (fromMenu) {
        fromMenu.innerHTML = allCities.map(city => renderCustomOption(city)).join('');
      }

      if (toMenu) {
        toMenu.innerHTML = allCities.map(city => renderCustomOption(city)).join('');
      }

      // Custom Dropdown Logic
      const setupDropdown = (dropdownId, triggerId, inputId, menuId) => {
        const dropdown = document.getElementById(dropdownId);
        const trigger = document.getElementById(triggerId);
        const input = document.getElementById(inputId);
        const menu = document.getElementById(menuId);
        
        if (!dropdown || !trigger || !input || !menu) return;

        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          // Close other open dropdowns
          document.querySelectorAll('.custom-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
          });
          dropdown.classList.toggle('open');
        });

        menu.querySelectorAll('.custom-option').forEach(option => {
          option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.getAttribute('data-value');
            input.value = value;
            trigger.innerText = value;
            dropdown.classList.remove('open');
          });
        });
      };

      setupDropdown('dropdownFrom', 'flightFromTrigger', 'flightFrom', 'flightFromMenu');
      setupDropdown('dropdownTo', 'flightToTrigger', 'flightTo', 'flightToMenu');

      document.addEventListener('click', () => {
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
      });
    })
    .catch(() => container.innerHTML = '<p>Error fetching flights</p>');
  }
});
