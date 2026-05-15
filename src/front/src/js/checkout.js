import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const flightId  = urlParams.get('flightId');

  if (!flightId) {
    alert('No flight selected.');
    window.location.href = 'flights.html';
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to complete your booking.');
    window.location.href = 'login.html';
    return;
  }

  // ── Bug 6: Enforce 18+ age limit via max attribute on DOB ─────────────────
  const dobInput = document.getElementById('dob');
  if (dobInput) {
    const today    = new Date();
    const maxYear  = today.getFullYear() - 18;
    const maxMonth = String(today.getMonth() + 1).padStart(2, '0');
    const maxDay   = String(today.getDate()).padStart(2, '0');
    // max is set to exactly 18 years ago — the browser date picker
    // will NOT allow selecting any date after this.
    dobInput.setAttribute('max', `${maxYear}-${maxMonth}-${maxDay}`);
  }

  // ── Bug 5: Set min on flight date to prevent past-date keyboard entry ──────
  const flightDateInput = document.getElementById('flightDate');
  if (flightDateInput) {
    flightDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
  }

  let flightPrice = 0;

  // ── Bug 7: Fetch flight data and populate the booking summary dynamically ──
  try {
    const res    = await fetch(`${API_URL}/flights/${flightId}`);
    const flight = await res.json();
    if (!res.ok) throw new Error('Flight not found');

    flightPrice = flight.price;
    document.getElementById('totalPrice').textContent = `€${flightPrice.toFixed(2)}`;

    // Populate route in sidebar
    const summaryRoute = document.getElementById('summary-route');
    if (summaryRoute) {
      summaryRoute.textContent = `${flight.departureCity} to ${flight.arrivalCity}`;
    }

    // Populate travel dates
    const summaryDates = document.getElementById('summary-dates');
    if (summaryDates) {
      const dep = new Date(flight.departureTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const arr = new Date(flight.arrivalTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      summaryDates.textContent = `${dep} — ${arr}`;
    }

    // Populate IATA-style codes on the hero banner
    const depCode = document.getElementById('summary-dep-code');
    const arrCode = document.getElementById('summary-arr-code');
    if (depCode) depCode.textContent = flight.departureCity.substring(0, 3).toUpperCase();
    if (arrCode) arrCode.textContent = flight.arrivalCity.substring(0, 3).toUpperCase();

  } catch (err) {
    console.error(err);
  }

  // ── Expiry date auto-format MM/YY ─────────────────────────────────────────
  const expiryDateInput = document.getElementById('expiryDate');
  expiryDateInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
    e.target.value = val;
  });

  // ── Validation helpers ────────────────────────────────────────────────────
  const showError = (id, msg) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    isValid = false;           // eslint-disable-line no-use-before-define
  };

  let isValid = true;

  // ── Pay button ────────────────────────────────────────────────────────────
  document.getElementById('payBtn')?.addEventListener('click', async () => {
    document.querySelectorAll('.c-error').forEach((el) => { el.textContent = ''; el.style.display = 'none'; });
    isValid = true;

    // Passenger details
    const fullName       = document.getElementById('fullName').value.trim();
    const passportNumber = document.getElementById('passportNumber').value.trim();
    const dob            = document.getElementById('dob').value;

    if (!fullName) {
      showError('fullNameError', 'This field is required');
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      showError('fullNameError', 'Only alphabetic characters are allowed');
    } else if (fullName.length < 3 || fullName.length > 30) {
      showError('fullNameError', 'Name must be between 3 and 30 characters');
    }

    if (!passportNumber) {
      showError('passportNumberError', 'This field is required');
    } else if (!/^[A-Za-z0-9]+$/.test(passportNumber)) {
      showError('passportNumberError', 'Invalid passport format');
    }

    // ── Bug 6: JS validation as second layer (keyboard can bypass max attr) ─
    if (!dob) {
      showError('dobError', 'This field is required');
    } else {
      const dobDate = new Date(dob);
      const today   = new Date();
      const age18   = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      if (dobDate > age18) {
        showError('dobError', 'Passenger must be older than 18 years');
      }
    }

    // Payment details
    const cardHolderName = document.getElementById('cardHolderName').value.trim();
    const cardNumber     = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const expiryDate     = document.getElementById('expiryDate').value.trim();
    const cvc            = document.getElementById('cvc').value.trim();

    if (!cardHolderName) showError('cardHolderNameError', 'This field is required');

    if (!cardNumber) showError('cardNumberError', 'This field is required');
    else if (!/^\d{16}$/.test(cardNumber)) showError('cardNumberError', 'Invalid card number format');

    if (!expiryDate) showError('expiryDateError', 'This field is required');
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) showError('expiryDateError', 'Invalid expiry date format');

    if (!cvc) showError('cvcError', 'This field is required');
    else if (!/^\d{3,4}$/.test(cvc)) showError('cvcError', 'Invalid CVV');

    if (!isValid) return;

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          flight_id:  parseInt(flightId, 10),
          passengers: [{ fullName, passportNumber, dateOfBirth: dob }],
          payment:    { cardNumber, cardholderName: cardHolderName, expiryDate, cvv: cvc },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Booking completed successfully!');
        window.location.href = 'my-bookings.html';
      } else {
        showError('generalError', data.message || 'Booking failed');
      }
    } catch {
      showError('generalError', 'Network error');
    }
  });
});
