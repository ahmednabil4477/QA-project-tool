const locationsList = [
  'London (LHR)', 'Paris (CDG)', 'Rome (FCO)', 'Milan (MXP)', 'New York (JFK)',
  'Tokyo (NRT)', 'Dubai (DXB)', 'Cairo (CAI)', 'Istanbul (IST)', 'Barcelona (BCN)',
  'Amsterdam (AMS)', 'Berlin (BER)', 'Vienna (VIE)', 'Athens (ATH)', 'Zurich (ZRH)',
  'Singapore (SIN)', 'Sydney (SYD)', 'Los Angeles (LAX)', 'Toronto (YYZ)', 'Mumbai (BOM)',
  'Bangkok (BKK)', 'Hong Kong (HKG)', 'Lisbon (LIS)', 'Madrid (MAD)', 'Nice (NCE)',
  'Florence (FLR)', 'Venice (VCE)', 'Naples (NAP)', 'Dublin (DUB)', 'Edinburgh (EDI)',
  'Copenhagen (CPH)', 'Stockholm (ARN)', 'Oslo (OSL)', 'Helsinki (HEL)', 'Prague (PRG)',
  'Budapest (BUD)', 'Warsaw (WAW)', 'Moscow (SVO)', 'Beijing (PEK)', 'Shanghai (PVG)',
  'Seoul (ICN)', 'Taipei (TPE)', 'Manila (MNL)', 'Kuala Lumpur (KUL)', 'Jakarta (CGK)',
  'Johannesburg (JNB)', 'Cape Town (CPT)', 'Nairobi (NBO)', 'Lagos (LOS)', 'Casablanca (CMN)',
  'Mexico City (MEX)', 'São Paulo (GRU)', 'Buenos Aires (EZE)', 'Lima (LIM)', 'Bogotá (BOG)',
  'Doha (DOH)', 'Abu Dhabi (AUH)', 'Riyadh (RUH)', 'Jeddah (JED)', 'Muscat (MCT)'
];

const allFlights = [
  // LHR -> CDG (Paris)
  { id: 1, origin: 'London (LHR)', destination: 'Paris (CDG)', departureTime: '08:45', arrivalTime: '10:15', duration: '1H 30M', price: 1240, stops: 'NON-STOP' },
  { id: 2, origin: 'London (LHR)', destination: 'Paris (CDG)', departureTime: '14:20', arrivalTime: '15:55', duration: '1H 35M', price: 482, stops: 'NON-STOP' },
  { id: 3, origin: 'London (LHR)', destination: 'Paris (CDG)', departureTime: '19:15', arrivalTime: '20:45', duration: '1H 30M', price: 620, stops: 'NON-STOP' },
  { id: 4, origin: 'London (LHR)', destination: 'Paris (CDG)', departureTime: '22:15', arrivalTime: '23:45', duration: '1H 30M', price: 1310, stops: 'NON-STOP' },

  // LHR -> FCO (Rome)
  { id: 5, origin: 'London (LHR)', destination: 'Rome (FCO)', departureTime: '10:15', arrivalTime: '13:45', duration: '2H 30M', price: 520, stops: 'NON-STOP' },
  { id: 6, origin: 'London (LHR)', destination: 'Rome (FCO)', departureTime: '15:30', arrivalTime: '19:00', duration: '2H 30M', price: 840, stops: 'NON-STOP' },
  { id: 7, origin: 'London (LHR)', destination: 'Rome (FCO)', departureTime: '07:20', arrivalTime: '10:50', duration: '2H 30M', price: 310, stops: 'NON-STOP' },

  // LHR -> MXP (Milan)
  { id: 8, origin: 'London (LHR)', destination: 'Milan (MXP)', departureTime: '07:00', arrivalTime: '10:00', duration: '2H 00M', price: 380, stops: 'NON-STOP' },
  { id: 9, origin: 'London (LHR)', destination: 'Milan (MXP)', departureTime: '16:45', arrivalTime: '19:45', duration: '2H 00M', price: 550, stops: 'NON-STOP' },

  // LHR -> CAI (Cairo)
  { id: 10, origin: 'London (LHR)', destination: 'Cairo (CAI)', departureTime: '09:00', arrivalTime: '15:30', duration: '5H 30M', price: 1100, stops: 'NON-STOP' },
  { id: 11, origin: 'London (LHR)', destination: 'Cairo (CAI)', departureTime: '22:30', arrivalTime: '05:00', duration: '5H 30M', price: 890, stops: 'NON-STOP' },

  // JFK -> LHR (London)
  { id: 12, origin: 'New York (JFK)', destination: 'London (LHR)', departureTime: '20:00', arrivalTime: '08:00', duration: '7H 00M', price: 850, stops: 'NON-STOP' },
  { id: 13, origin: 'New York (JFK)', destination: 'London (LHR)', departureTime: '18:30', arrivalTime: '06:30', duration: '7H 00M', price: 1220, stops: 'NON-STOP' },

  // JFK -> CDG (Paris)
  { id: 14, origin: 'New York (JFK)', destination: 'Paris (CDG)', departureTime: '18:30', arrivalTime: '07:45', duration: '7H 15M', price: 920, stops: 'NON-STOP' },
  { id: 15, origin: 'New York (JFK)', destination: 'Paris (CDG)', departureTime: '21:00', arrivalTime: '10:15', duration: '7H 15M', price: 1450, stops: 'NON-STOP' },

  // DXB -> LHR
  { id: 16, origin: 'Dubai (DXB)', destination: 'London (LHR)', departureTime: '02:15', arrivalTime: '06:45', duration: '7H 30M', price: 680, stops: 'NON-STOP' },
  { id: 17, origin: 'Dubai (DXB)', destination: 'London (LHR)', departureTime: '09:45', arrivalTime: '14:15', duration: '7H 30M', price: 950, stops: 'NON-STOP' },

  // Internal European
  { id: 18, origin: 'Paris (CDG)', destination: 'Milan (MXP)', departureTime: '14:00', arrivalTime: '15:30', duration: '1H 30M', price: 290, stops: 'NON-STOP' },
  { id: 19, origin: 'Paris (CDG)', destination: 'Rome (FCO)', departureTime: '09:30', arrivalTime: '11:45', duration: '2H 15M', price: 410, stops: 'NON-STOP' },
  { id: 20, origin: 'Rome (FCO)', destination: 'Athens (ATH)', departureTime: '11:15', arrivalTime: '13:00', duration: '1H 45M', price: 180, stops: 'NON-STOP' },
  { id: 21, origin: 'Athens (ATH)', destination: 'Cairo (CAI)', departureTime: '18:00', arrivalTime: '19:45', duration: '1H 45M', price: 240, stops: 'NON-STOP' },

  // More LHR routes to Destinations
  { id: 22, origin: 'London (LHR)', destination: 'Athens (ATH)', departureTime: '06:30', arrivalTime: '12:15', duration: '3H 45M', price: 340, stops: 'NON-STOP' },
  { id: 23, origin: 'London (LHR)', destination: 'Nice (NCE)', departureTime: '11:45', arrivalTime: '13:45', duration: '2H 00M', price: 195, stops: 'NON-STOP' },
  { id: 24, origin: 'London (LHR)', destination: 'Barcelona (BCN)', departureTime: '15:00', arrivalTime: '18:15', duration: '2H 15M', price: 280, stops: 'NON-STOP' },
  { id: 25, origin: 'London (LHR)', destination: 'Venice (VCE)', departureTime: '08:15', arrivalTime: '11:25', duration: '2H 10M', price: 440, stops: 'NON-STOP' },
  { id: 26, origin: 'London (LHR)', destination: 'Florence (FLR)', departureTime: '13:20', arrivalTime: '16:30', duration: '2H 10M', price: 580, stops: 'NON-STOP' },
  { id: 27, origin: 'London (LHR)', destination: 'Istanbul (IST)', departureTime: '10:00', arrivalTime: '15:50', duration: '3H 50M', price: 620, stops: 'NON-STOP' }
];

function setupAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    if (val.length < 1) {
      dropdown.style.display = 'none';
      dropdown.innerHTML = '';
      return;
    }
    const matches = locationsList.filter(loc => loc.toLowerCase().startsWith(val)).slice(0, 6);
    if (matches.length === 0) {
      dropdown.style.display = 'none';
      dropdown.innerHTML = '';
      return;
    }
    dropdown.innerHTML = matches.map(m => `<div class="autocomplete-item">${m}</div>`).join('');
    dropdown.style.display = 'block';

    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
      item.onclick = () => {
        input.value = item.textContent;
        dropdown.style.display = 'none';
      };
    });
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('flights-container');
  const resultsTitle = document.getElementById('results-title');
  const searchBtn = document.getElementById('flightSearchBtn');

  setupAutocomplete('flightFrom', 'fromDropdown');
  setupAutocomplete('flightTo', 'toDropdown');

  // --- Premium Calendar Logic ---
  const calendarDropdown = document.getElementById('calendarDropdown');
  const dateInputDisplay = document.getElementById('flightDate');
  let currentCalDate = new Date();
  let selectedCalDate = null;

  const renderCalendar = (date) => {
    if (!calendarDropdown) return;
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = date.toLocaleString('default', { month: 'long' });

    let html = `
      <div class="cal-header">
        <button class="cal-nav-btn" id="calPrev"><svg style="width:16px; height:16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
        <div class="cal-month-title">${monthName} ${year}</div>
        <button class="cal-nav-btn" id="calNext"><svg style="width:16px; height:16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
      </div>
      <div class="cal-grid">
        <div class="cal-day-label">Su</div><div class="cal-day-label">Mo</div><div class="cal-day-label">Tu</div><div class="cal-day-label">We</div><div class="cal-day-label">Th</div><div class="cal-day-label">Fr</div><div class="cal-day-label">Sa</div>
    `;

    for (let i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const isToday = d.getTime() === today.getTime();
      const isSelected = selectedCalDate && d.getTime() === selectedCalDate.getTime();
      const isDisabled = d < today;
      html += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" data-day="${day}">${day}</div>`;
    }
    html += '</div>';
    calendarDropdown.innerHTML = html;

    document.getElementById('calPrev').addEventListener('click', (e) => { e.stopPropagation(); currentCalDate.setMonth(currentCalDate.getMonth() - 1); renderCalendar(currentCalDate); });
    document.getElementById('calNext').addEventListener('click', (e) => { e.stopPropagation(); currentCalDate.setMonth(currentCalDate.getMonth() + 1); renderCalendar(currentCalDate); });

    calendarDropdown.querySelectorAll('.cal-day:not(.empty):not(.disabled)').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const day = parseInt(el.getAttribute('data-day'));
        selectedCalDate = new Date(year, month, day);
        dateInputDisplay.value = selectedCalDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        calendarDropdown.style.display = 'none';
      });
    });
  };

  if (dateInputDisplay) {
    dateInputDisplay.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = calendarDropdown.style.display === 'block';
      calendarDropdown.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) renderCalendar(currentCalDate);
    });
  }

  document.addEventListener('click', (e) => {
    if (calendarDropdown && !calendarDropdown.contains(e.target) && e.target !== dateInputDisplay) {
      calendarDropdown.style.display = 'none';
    }
  });

  const renderFlights = (flights) => {
    if (!container) return;
    if (flights.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 64px 24px;"><svg style="width:64px; height:64px; color: #cbd5e1; margin-bottom:16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><h3 style="font-size: 1.25rem; font-weight: 700; color: #334155; margin-bottom: 8px;">No flights found</h3><p style="color: #94a3b8; font-size: 0.875rem;">Try adjusting your search criteria or explore different routes.</p></div>`;
      return;
    }
    container.innerHTML = flights.map(flight => `
      <div class="flight-card">
        <div class="fc-left">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=200&auto=format&fit=crop" alt="Flight" class="fc-img" />
          <div class="fc-details">
            <div class="fc-timebox" style="text-align: left;"><div class="fc-time">${flight.departureTime}</div><div class="fc-loc">${flight.origin}</div></div>
            <div class="fc-route"><span class="fc-duration">${flight.duration}</span><div class="fc-line"><div class="fc-dot"></div><div class="fc-dash"></div><svg class="fc-plane" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></div><span class="fc-stops">${flight.stops}</span></div>
            <div class="fc-timebox" style="text-align: right;"><div class="fc-time">${flight.arrivalTime}</div><div class="fc-loc">${flight.destination}</div></div>
          </div>
        </div>
        <div class="fc-right"><div><div class="fc-price-label">PER PERSON</div><div class="fc-price">£${flight.price.toLocaleString()}</div></div><button class="btn-fc-select" onclick="window.location.href='checkout.html?flightId=${flight.id}'">Select Journey<svg style="width:16px; height: 16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></button></div>
      </div>
    `).join('');
  };

  const performSearch = () => {
    document.querySelectorAll('.f-error').forEach(el => { el.innerText = ''; el.style.display = 'none'; });
    const from = document.getElementById('flightFrom').value.trim();
    const to = document.getElementById('flightTo').value.trim();
    const date = document.getElementById('flightDate').value;
    let isValid = true;
    const showError = (id, msg) => {
      const el = document.getElementById(id);
      el.innerText = msg;
      el.style.display = 'block';
      isValid = false;
    };

    if (!from) showError('flightFromError', 'This field is required');
    if (!to) showError('flightToError', 'This field is required');
    if (!date) showError('flightDateError', 'This field is required');
    if (from && to && from.toLowerCase() === to.toLowerCase()) {
      showError('flightToError', 'Destination cannot be the same as Departure');
    }

    if (!isValid) return;

    const fromVal = from.toLowerCase();
    const toVal = to.toLowerCase();

    const flights = allFlights.filter(f =>
      f.origin.toLowerCase().includes(fromVal) &&
      f.destination.toLowerCase().includes(toVal)
    );

    if (resultsTitle) resultsTitle.textContent = flights.length > 0 ? `Found ${flights.length} Curated Journey${flights.length > 1 ? 's' : ''}` : '';
    renderFlights(flights);
  };

  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const prefillFrom = urlParams.get('from');
  const prefillTo = urlParams.get('to');

  if (prefillFrom || prefillTo) {
    const fromInput = document.getElementById('flightFrom');
    const toInput = document.getElementById('flightTo');

    if (fromInput && prefillFrom) fromInput.value = prefillFrom;
    if (toInput && prefillTo) toInput.value = prefillTo;

    // Default departure if only 'to' is provided
    if (fromInput && !fromInput.value) fromInput.value = 'London (LHR)';

    if (toInput && toInput.value) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      selectedCalDate = defaultDate;
      dateInputDisplay.value = defaultDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

      performSearch();
    }
  } else {
    if (container) {
      if (resultsTitle) resultsTitle.textContent = '';
      container.innerHTML = `<div style="text-align: center; padding: 64px 24px;"><svg style="width:64px; height:64px; color: #cbd5e1; margin-bottom:16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><h3 style="font-size: 1.25rem; font-weight: 700; color: #334155; margin-bottom: 8px;">No search results</h3><p style="color: #94a3b8; font-size: 0.875rem;">Enter your departure and destination above to discover curated flight journeys.</p></div>`;
    }
  }
});
