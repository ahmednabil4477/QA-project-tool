import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const flightId = urlParams.get('flightId');
  
  if (!flightId) {
    alert("No flight selected.");
    window.location.href = 'flights.html';
    return;
  }
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (!token) {
    alert("Please log in to complete your booking.");
    window.location.href = 'login.html';
    return;
  }

  let flightPrice = 0;

  // Fetch flight details
  try {
    const res = await fetch(`${API_URL}/flights`);
    const flights = await res.json();
    const flight = flights.find(f => f.id == flightId);
    if (!flight) throw new Error("Flight not found");
    
    flightPrice = flight.price;
    document.getElementById('totalPrice').innerText = `€${flightPrice.toFixed(2)}`;
  } catch (err) {
    console.error(err);
  }

  const expiryDateInput = document.getElementById('expiryDate');
  expiryDateInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, ''); // remove all non-digits
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    e.target.value = val;
  });

  const payBtn = document.getElementById('payBtn');
  payBtn.addEventListener('click', async () => {
    // Clear errors
    document.querySelectorAll('.c-error').forEach(el => { el.innerText = ''; el.style.display = 'none'; });
    let isValid = true;
    
    const showError = (id, msg) => {
      const el = document.getElementById(id);
      el.innerText = msg;
      el.style.display = 'block';
      isValid = false;
    };

    // Passenger Details
    const fullName = document.getElementById('fullName').value.trim();
    const passportNumber = document.getElementById('passportNumber').value.trim();
    const dob = document.getElementById('dob').value;
    
    if (!fullName) showError('fullNameError', 'This field is required');
    else if (!/^[a-zA-Z\s]+$/.test(fullName)) showError('fullNameError', 'Only alphabetic characters are allowed');
    else if (fullName.length < 3 || fullName.length > 30) showError('fullNameError', 'Name must be between 3 and 30 characters');
    
    if (!passportNumber) showError('passportNumberError', 'This field is required');
    else if (!/^[A-Za-z0-9]+$/.test(passportNumber)) showError('passportNumberError', 'Invalid passport format');
    
    if (!dob) {
      showError('dobError', 'This field is required');
    } else {
      const dobDate = new Date(dob);
      const today = new Date();
      if (dobDate > today) {
        showError('dobError', 'Future dates are not allowed');
      } else {
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        if (age <= 18) {
          showError('dobError', 'Age must be higher than 18 years');
        }
      }
    }

    // Payment Details
    const cardHolderName = document.getElementById('cardHolderName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvc = document.getElementById('cvc').value.trim();

    if (!cardHolderName) showError('cardHolderNameError', 'This field is required');

    if (!cardNumber) showError('cardNumberError', 'This field is required');
    else if (!/^\d{16}$/.test(cardNumber)) showError('cardNumberError', 'Invalid card number format');
    
    if (!expiryDate) showError('expiryDateError', 'This field is required');
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) showError('expiryDateError', 'Invalid expiry date format');
    
    if (!cvc) showError('cvcError', 'This field is required');
    else if (!/^\d{3,4}$/.test(cvc)) showError('cvcError', 'Invalid CVV');

    if (!isValid) return;

    // API Call to create booking
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          flight_id: parseInt(flightId, 10),
          passengers: [{
            fullName,
            passportNumber,
            dateOfBirth: dob
          }],
          payment: {
            cardNumber,
            cardholderName: cardHolderName,
            expiryDate,
            cvv: cvc
          }
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert("Booking completed successfully!");
        window.location.href = 'my-bookings.html';
      } else {
        showError('generalError', data.message || 'Booking failed');
      }
    } catch (err) {
      showError('generalError', 'Network error');
    }
  });
});
