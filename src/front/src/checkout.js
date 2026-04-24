document.addEventListener('DOMContentLoaded', () => {
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
  let currentFlight = null;

  // SYNCED: All available mock flights (matching flights.js)
  const flights = [
    { id: 1,  origin: 'London (LHR)',    destination: 'Paris (CDG)',     departureTime: '08:45', arrivalTime: '10:15', price: 1240 },
    { id: 2,  origin: 'London (LHR)',    destination: 'Paris (CDG)',     departureTime: '14:20', arrivalTime: '15:55', price: 482  },
    { id: 3,  origin: 'London (LHR)',    destination: 'Paris (CDG)',     departureTime: '19:15', arrivalTime: '20:45', price: 620  },
    { id: 4,  origin: 'London (LHR)',    destination: 'Paris (CDG)',     departureTime: '22:15', arrivalTime: '23:45', price: 1310 },
    { id: 5,  origin: 'London (LHR)',    destination: 'Rome (FCO)',      departureTime: '10:15', arrivalTime: '13:45', price: 520  },
    { id: 6,  origin: 'London (LHR)',    destination: 'Rome (FCO)',      departureTime: '15:30', arrivalTime: '19:00', price: 840  },
    { id: 7,  origin: 'London (LHR)',    destination: 'Rome (FCO)',      departureTime: '07:20', arrivalTime: '10:50', price: 310  },
    { id: 8,  origin: 'London (LHR)',    destination: 'Milan (MXP)',     departureTime: '07:00', arrivalTime: '10:00', price: 380  },
    { id: 9,  origin: 'London (LHR)',    destination: 'Milan (MXP)',     departureTime: '16:45', arrivalTime: '19:45', price: 550  },
    { id: 10, origin: 'London (LHR)',    destination: 'Cairo (CAI)',     departureTime: '09:00', arrivalTime: '15:30', price: 1100 },
    { id: 11, origin: 'London (LHR)',    destination: 'Cairo (CAI)',     departureTime: '22:30', arrivalTime: '05:00', price: 890  },
    { id: 12, origin: 'New York (JFK)',  destination: 'London (LHR)',    departureTime: '20:00', arrivalTime: '08:00', price: 850  },
    { id: 13, origin: 'New York (JFK)',  destination: 'London (LHR)',    departureTime: '18:30', arrivalTime: '06:30', price: 1220 },
    { id: 14, origin: 'New York (JFK)',  destination: 'Paris (CDG)',     departureTime: '18:30', arrivalTime: '07:45', price: 920  },
    { id: 15, origin: 'New York (JFK)',  destination: 'Paris (CDG)',     departureTime: '21:00', arrivalTime: '10:15', price: 1450 },
    { id: 16, origin: 'Dubai (DXB)',     destination: 'London (LHR)',    departureTime: '02:15', arrivalTime: '06:45', price: 680  },
    { id: 17, origin: 'Dubai (DXB)',     destination: 'London (LHR)',    departureTime: '09:45', arrivalTime: '14:15', price: 950  },
    { id: 18, origin: 'Paris (CDG)',     destination: 'Milan (MXP)',     departureTime: '14:00', arrivalTime: '15:30', price: 290  },
    { id: 19, origin: 'Paris (CDG)',     destination: 'Rome (FCO)',      departureTime: '09:30', arrivalTime: '11:45', price: 410  },
    { id: 20, origin: 'Rome (FCO)',      destination: 'Athens (ATH)',    departureTime: '11:15', arrivalTime: '13:00', price: 180  },
    { id: 21, origin: 'Athens (ATH)',    destination: 'Cairo (CAI)',     departureTime: '18:00', arrivalTime: '19:45', price: 240  },
    { id: 22, origin: 'London (LHR)',    destination: 'Athens (ATH)',    departureTime: '06:30', arrivalTime: '12:15', price: 340  },
    { id: 23, origin: 'London (LHR)',    destination: 'Nice (NCE)',      departureTime: '11:45', arrivalTime: '13:45', price: 195  },
    { id: 24, origin: 'London (LHR)',    destination: 'Barcelona (BCN)', departureTime: '15:00', arrivalTime: '18:15', price: 280  },
    { id: 25, origin: 'London (LHR)',    destination: 'Venice (VCE)',    departureTime: '08:15', arrivalTime: '11:25', price: 440  },
    { id: 26, origin: 'London (LHR)',    destination: 'Florence (FLR)',  departureTime: '13:20', arrivalTime: '16:30', price: 580  },
    { id: 27, origin: 'London (LHR)',    destination: 'Istanbul (IST)',  departureTime: '10:00', arrivalTime: '15:50', price: 620  }
  ];
  
  try {
    currentFlight = flights.find(f => f.id == flightId);
    if (!currentFlight) throw new Error("Flight not found");
    
    flightPrice = currentFlight.price;
    const taxes = Math.round(flightPrice * 0.237 * 100) / 100;
    const serviceCharge = 12.00;
    const total = flightPrice + taxes + serviceCharge;
    
    document.getElementById('totalPrice').innerText = `£${total.toFixed(2)}`;
    
    const originCode = currentFlight.origin.match(/\(([^)]+)\)/)?.[1] || currentFlight.origin;
    const destCode = currentFlight.destination.match(/\(([^)]+)\)/)?.[1] || currentFlight.destination;
    const originCity = currentFlight.origin.replace(/\s*\([^)]*\)/, '');
    const destCity = currentFlight.destination.replace(/\s*\([^)]*\)/, '');
    
    const routeEl = document.querySelector('.summary-route');
    if (routeEl) {
      routeEl.innerHTML = `${originCode} <svg style="width:20px; height: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg> ${destCode}`;
    }
    
    const routeValue = document.getElementById('routeValue');
    if (routeValue) routeValue.innerText = `${originCity} to ${destCity}`;
    
    const baseFareEl = document.getElementById('baseFare');
    const taxesEl = document.getElementById('taxesFees');
    const serviceEl = document.getElementById('serviceCharge');
    if (baseFareEl) baseFareEl.innerText = `£${flightPrice.toFixed(2)}`;
    if (taxesEl) taxesEl.innerText = `£${taxes.toFixed(2)}`;
    if (serviceEl) serviceEl.innerText = `£${serviceCharge.toFixed(2)}`;
    
  } catch (err) {
    console.error(err);
  }

  // --- Modal Star Logic ---
  let currentRating = 4;
  const renderStars = () => {
    const starContainer = document.getElementById('star-container');
    if (!starContainer) return;
    let html = '';
    for(let i=1; i<=5; i++) {
      const isFilled = i <= currentRating;
      const path = isFilled 
        ? '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' 
        : '<path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>';
      html += `
        <div class="modal-star ${isFilled ? 'active' : ''}" data-value="${i}" style="cursor:pointer; padding: 4px;">
          <svg viewBox="0 0 24 24" fill="${isFilled ? '#f97316' : '#cbd5e1'}" style="width:32px; height:32px;">
            ${path}
          </svg>
        </div>
      `;
    }
    starContainer.innerHTML = html;
    starContainer.querySelectorAll('.modal-star').forEach(star => {
      star.onclick = () => {
        currentRating = parseInt(star.getAttribute('data-value'));
        renderStars();
      };
    });
  };

  const payBtn = document.getElementById('payBtn');
  payBtn.addEventListener('click', () => {
    document.querySelectorAll('.c-error').forEach(el => { el.innerText = ''; el.style.display = 'none'; });
    let isValid = true;
    
    const showError = (id, msg) => {
      const el = document.getElementById(id);
      el.innerText = msg;
      el.style.display = 'block';
      isValid = false;
    };

    const fullName = document.getElementById('fullName').value.trim();
    const passportNumber = document.getElementById('passportNumber').value.trim();
    const dob = document.getElementById('dob').value;
    
    if (!fullName) showError('fullNameError', 'This field is required');
    else if (!/^[a-zA-Z\s]+$/.test(fullName)) showError('fullNameError', 'Only alphabetic characters are allowed');
    
    if (!passportNumber) showError('passportNumberError', 'This field is required');
    else if (!/^[A-Za-z0-9]+$/.test(passportNumber)) showError('passportNumberError', 'Invalid passport format');
    
    if (!dob) showError('dobError', 'This field is required');

    const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvc = document.getElementById('cvc').value.trim();

    if (!cardNumber) showError('cardNumberError', 'This field is required');
    else if (!/^\d{16}$/.test(cardNumber)) showError('cardNumberError', 'Invalid card number format');
    
    if (!expiryDate) showError('expiryDateError', 'This field is required');
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) showError('expiryDateError', 'Invalid expiry date format');
    
    if (!cvc) showError('cvcError', 'This field is required');
    else if (!/^\d{3,4}$/.test(cvc)) showError('cvcError', 'Invalid CVV');

    if (!isValid) return;

    // SAVE BOOKING
    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const newBooking = {
        id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
        userId: user.id,
        flightId: parseInt(flightId, 10),
        flight_id: currentFlight ? `FL-${currentFlight.id}` : `FL-${flightId}`,
        arrivalCity: currentFlight ? currentFlight.destination : 'Unknown',
        airlineName: currentFlight ? `FL-${currentFlight.id}` : 'Unknown',
        bookingDate: new Date().toISOString(),
        status: 'CONFIRMED',
        totalPrice: flightPrice,
        title: currentFlight ? `${currentFlight.origin.replace(/\s*\([^)]*\)/, '')} to ${currentFlight.destination.replace(/\s*\([^)]*\)/, '')}` : 'Flight Booking',
        dateRange: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        tags: ['FLIGHT', 'CONFIRMED'],
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop',
        origin: currentFlight ? currentFlight.origin : 'London (LHR)',
        destination: currentFlight ? currentFlight.destination : 'Paris (CDG)',
        passenger: { fullName, passportNumber, dob }
      };
      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      const reviewTextarea = document.getElementById('reviewText');
      if (reviewTextarea) reviewTextarea.value = ''; 
      
      renderStars();
      document.getElementById('review-modal').classList.add('active');
      
    } catch (err) {
      showError('generalError', 'Booking failed');
    }
  });

  // --- Modal Actions ---
  document.getElementById('closeReviewModal').onclick = () => { window.location.href = 'bookings.html'; };
  document.getElementById('cancelReview').onclick = () => { window.location.href = 'bookings.html'; };
  
  document.getElementById('submitReviewBtn').onclick = () => {
    const text = document.getElementById('reviewText').value.trim();
    if (text) {
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      reviews.push({
        name: `${user.firstName} ${user.lastName}`,
        location: 'TRAVELER',
        rating: currentRating,
        text: `"${text}"`,
        date: new Date().toISOString()
      });
      localStorage.setItem('reviews', JSON.stringify(reviews));
    }
    alert('Booking confirmed and review shared! Enjoy your journey.');
    window.location.href = 'bookings.html';
  };
});
