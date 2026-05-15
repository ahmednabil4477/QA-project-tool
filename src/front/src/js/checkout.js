import { API_URL } from './config.js';

let isValid = true;
let flightPrice = 0;

const getEl = (id) => document.getElementById(id);

const showError = (id, msg) => {
  const el = getEl(id);
  if (!el) return;

  el.textContent = msg;
  el.style.display = 'block';
  isValid = false;
};

const clearErrors = () => {
  document.querySelectorAll('.c-error').forEach((el) => {
    el.textContent = '';
    el.style.display = 'none';
  });
  isValid = true;
};

const getTodayISO = () => new Date().toISOString().split('T')[0];

const setupDateLimits = () => {
  const dobInput = getEl('dob');
  if (dobInput) dobInput.setAttribute('max', getTodayISO());

  const flightDateInput = getEl('flightDate');
  if (flightDateInput) flightDateInput.setAttribute('min', getTodayISO());
};

const setupExpiryFormatter = () => {
  const expiryDateInput = getEl('expiryDate');

  expiryDateInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');

    if (val.length > 2) {
      val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
    }

    e.target.value = val;
  });
};

const populateBookingSummary = (flight) => {
  flightPrice = flight.price;

  getEl('totalPrice').textContent = `€${flightPrice.toFixed(2)}`;

  const summaryRoute = getEl('summary-route');
  if (summaryRoute) {
    summaryRoute.textContent = `${flight.departureCity} to ${flight.arrivalCity}`;
  }

  const summaryDates = getEl('summary-dates');
  if (summaryDates) {
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const dep = new Date(flight.departureTime).toLocaleDateString('en-US', dateOptions);
    const arr = new Date(flight.arrivalTime).toLocaleDateString('en-US', dateOptions);

    summaryDates.textContent = `${dep} — ${arr}`;
  }

  const depCode = getEl('summary-dep-code');
  const arrCode = getEl('summary-arr-code');

  if (depCode) depCode.textContent = flight.departureCity.substring(0, 3).toUpperCase();
  if (arrCode) arrCode.textContent = flight.arrivalCity.substring(0, 3).toUpperCase();
};

const fetchFlight = async (flightId) => {
  const res = await fetch(`${API_URL}/flights/${flightId}`);
  const flight = await res.json();

  if (!res.ok) {
    throw new Error('Flight not found');
  }

  return flight;
};

const validateFullName = (fullName) => {
  if (!fullName) {
    showError('fullNameError', 'This field is required');
  } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
    showError('fullNameError', 'Only alphabetic characters are allowed');
  } else if (fullName.length < 3 || fullName.length > 30) {
    showError('fullNameError', 'Name must be between 3 and 30 characters');
  }
};

const validatePassportNumber = (passportNumber) => {
  if (!passportNumber) {
    showError('passportNumberError', 'This field is required');
  } else if (!/^[A-Za-z0-9]+$/.test(passportNumber)) {
    showError('passportNumberError', 'Invalid passport format');
  }
};

const validateDob = (dob) => {
  if (!dob) {
    showError('dobError', 'This field is required');
    return;
  }

  const dobDate = new Date(dob);
  const today = new Date();
  const age18 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  if (dobDate > age18) {
    showError('dobError', 'Passenger must be older than 18 years');
  }
};

const validateCardHolderName = (cardHolderName) => {
  if (!cardHolderName) {
    showError('cardHolderNameError', 'This field is required');
  }
};

const validateCardNumber = (cardNumber) => {
  if (!cardNumber) {
    showError('cardNumberError', 'This field is required');
  } else if (!/^\d{16}$/.test(cardNumber)) {
    showError('cardNumberError', 'Invalid card number format');
  }
};

const validateExpiryDate = (expiryDate) => {
  if (!expiryDate) {
    showError('expiryDateError', 'This field is required');
  } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
    showError('expiryDateError', 'Invalid expiry date format');
  }
};

const validateCvc = (cvc) => {
  if (!cvc) {
    showError('cvcError', 'This field is required');
  } else if (!/^\d{3,4}$/.test(cvc)) {
    showError('cvcError', 'Invalid CVV');
  }
};

const getPassengerDetails = () => ({
  fullName: getEl('fullName').value.trim(),
  passportNumber: getEl('passportNumber').value.trim(),
  dob: getEl('dob').value,
});

const getPaymentDetails = () => ({
  cardHolderName: getEl('cardHolderName').value.trim(),
  cardNumber: getEl('cardNumber').value.replace(/\s+/g, ''),
  expiryDate: getEl('expiryDate').value.trim(),
  cvc: getEl('cvc').value.trim(),
});

const validatePassengerDetails = ({ fullName, passportNumber, dob }) => {
  validateFullName(fullName);
  validatePassportNumber(passportNumber);
  validateDob(dob);
};

const validatePaymentDetails = ({ cardHolderName, cardNumber, expiryDate, cvc }) => {
  validateCardHolderName(cardHolderName);
  validateCardNumber(cardNumber);
  validateExpiryDate(expiryDate);
  validateCvc(cvc);
};

const submitBooking = async (flightId, token, passengerDetails, paymentDetails) => {
  const { fullName, passportNumber, dob } = passengerDetails;
  const { cardHolderName, cardNumber, expiryDate, cvc } = paymentDetails;

  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      flight_id: parseInt(flightId, 10),
      passengers: [{ fullName, passportNumber, dateOfBirth: dob }],
      payment: {
        cardNumber,
        cardholderName: cardHolderName,
        expiryDate,
        cvv: cvc,
      },
    }),
  });

  return {
    ok: res.ok,
    data: await res.json(),
  };
};

const handlePayClick = async (flightId, token) => {
  clearErrors();

  const passengerDetails = getPassengerDetails();
  const paymentDetails = getPaymentDetails();

  validatePassengerDetails(passengerDetails);
  validatePaymentDetails(paymentDetails);

  if (!isValid) return;

  try {
    const { ok, data } = await submitBooking(
      flightId,
      token,
      passengerDetails,
      paymentDetails
    );

    if (ok) {
      alert('Booking completed successfully!');
      window.location.href = 'my-bookings.html';
    } else {
      showError('generalError', data.message || 'Booking failed');
    }
  } catch {
    showError('generalError', 'Network error');
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const flightId = urlParams.get('flightId');

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

  setupDateLimits();
  setupExpiryFormatter();

  try {
    const flight = await fetchFlight(flightId);
    populateBookingSummary(flight);
  } catch (err) {
    console.error(err);
  }

  getEl('payBtn')?.addEventListener('click', () => {
    handlePayClick(flightId, token);
  });
});