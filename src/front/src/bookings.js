document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('bookings-container');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    window.location.href = 'login.html';
    return;
  }

  // Update profile info
  const nameEl = document.querySelector('.profile-name');
  if (nameEl) nameEl.innerText = `${user.firstName} ${user.lastName}`;

  // Seed demo bookings for the logged-in user if none exist
  const seedUserBookings = () => {
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userBookings = bookings.filter(b => b.userId === user.id);
    
    // Always ensure existing demo bookings for this specific user have origin/destination if they follow the "City to City" title pattern
    bookings = bookings.map(b => {
      if (b.userId === user.id && !b.origin && b.title && b.title.includes(' to ')) {
        const parts = b.title.split(' to ');
        return { ...b, origin: `${parts[0]}`, destination: `${parts[1]}` };
      }
      return b;
    });

    if (userBookings.length === 0 && user.role !== 'admin') {
      const demoUserBookings = [
        {
          id: 2001,
          userId: user.id,
          flightId: 1,
          origin: 'London (LHR)',
          destination: 'Paris (CDG)',
          bookingDate: '2023-10-10T10:00:00Z',
          status: 'CONFIRMED',
          totalPrice: 4250,
          title: 'London to Paris',
          dateRange: 'Oct 10 — Oct 19, 2023',
          tags: ['PREMIUM ALL-INCLUSIVE', 'OCEAN VILLA'],
          image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600&auto=format&fit=crop',
          passenger: { fullName: `${user.firstName} ${user.lastName}`, passportNumber: 'A12345678', dob: '1990-01-01' }
        },
        {
          id: 2002,
          userId: user.id,
          flightId: 4,
          origin: 'London (LHR)',
          destination: 'Paris (CDG)',
          bookingDate: '2023-08-05T14:30:00Z',
          status: 'CONFIRMED',
          totalPrice: 2890,
          title: 'London to Paris',
          dateRange: 'Aug 05 — Aug 12, 2023',
          tags: ['CITY CENTER', 'GRAND VIEW'],
          image: 'https://images.unsplash.com/photo-1543429258-10b8e692a828?q=80&w=600&auto=format&fit=crop',
          passenger: { fullName: `${user.firstName} ${user.lastName}`, passportNumber: 'A12345678', dob: '1990-01-01' }
        },
        {
          id: 2003,
          userId: user.id,
          flightId: 8,
          origin: 'London (LHR)',
          destination: 'Milan (MXP)',
          bookingDate: '2023-01-20T09:15:00Z',
          status: 'CONFIRMED',
          totalPrice: 3120,
          title: 'London to Milan',
          dateRange: 'Jan 20 — Jan 27, 2023',
          tags: ['SKI RESORT', 'WELLNESS SPA'],
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop',
          passenger: { fullName: `${user.firstName} ${user.lastName}`, passportNumber: 'A12345678', dob: '1990-01-01' }
        }
      ];

      bookings = [...bookings, ...demoUserBookings.filter(db => !bookings.some(b => b.id === db.id))];
    }
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return bookings;
  };

  if (container) {
    try {
      const allBookings = seedUserBookings();
      const data = allBookings.filter(b => b.userId === user.id);
      
      if (data.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 48px 24px;">
            <svg style="width:48px; height:48px; color: #cbd5e1; margin-bottom:16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
            <p style="color: #94a3b8; font-size: 0.875rem;">No bookings found. Start exploring destinations!</p>
          </div>
        `;
      } else {
        container.innerHTML = data.map(b => {
          const from = b.origin || '';
          const to = b.destination || '';

          return `
            <div class="booking-card">
              <img src="${b.image || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=600&auto=format&fit=crop'}" alt="${b.title || 'Booking'}" class="booking-img" />
              <div class="booking-details">
                <h3 class="booking-title">${b.title || 'Flight ' + b.flightId}</h3>
                <div class="booking-date">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  ${b.dateRange || new Date(b.bookingDate).toLocaleDateString()}
                </div>
                <div class="booking-tags">
                  ${(b.tags || ['STATUS: ' + b.status, '€' + b.totalPrice]).map(tag => `<span class="booking-tag">${tag}</span>`).join('')}
                </div>
              </div>
              <div class="booking-action">
                <button class="btn-outline" onclick="window.location.href='flights.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}'">Book Again</button>
              </div>
            </div>
          `;
        }).join('');
      }
    } catch (err) {
      container.innerHTML = '<p>Error loading bookings.</p>';
    }
  }
});
