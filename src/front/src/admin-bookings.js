document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('admin-bookings-tbody');
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !currentUser || currentUser.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  // Update admin name
  const nameEl = document.querySelector('.admin-profile-name');
  if (nameEl) nameEl.innerText = currentUser.firstName;

  const loadBookings = () => {
    // 1. Load users to map names
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 2. Load "Real" bookings from users
    const realBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // 3. Load/Seed Admin Demo Bookings
    let adminDemoBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
    if (adminDemoBookings.length === 0 && realBookings.length === 0) {
      adminDemoBookings = [
        { id: 5001, userName: 'Elara Vance', destination: 'Amalfi Coast, Italy', flightCode: 'HZ-9920-LHR', date: '2024-10-12', price: 3400, status: 'Confirmed' },
        { id: 5002, userName: 'Julian Ross', destination: 'Paris, France', flightCode: 'HZ-4412-CDG', date: '2024-11-05', price: 2100, status: 'Confirmed' },
        { id: 5003, userName: 'Marcus Dent', destination: 'Cairo, Egypt', flightCode: 'HZ-1105-CAI', date: '2024-09-20', price: 1800, status: 'Pending' },
        { id: 5004, userName: 'Stefan King', destination: 'Tokyo, Japan', flightCode: 'HZ-8833-NRT', date: '2024-12-15', price: 4200, status: 'Confirmed' },
        { id: 5005, userName: 'Aria Brooks', destination: 'Venice, Italy', flightCode: 'HZ-2290-VCE', date: '2024-10-28', price: 3100, status: 'Confirmed' }
      ];
      localStorage.setItem('admin_bookings', JSON.stringify(adminDemoBookings));
    }

    // Combine them for display
    // Note: realBookings need to be mapped to the admin table format
    const formattedRealBookings = realBookings.map(rb => {
      const u = users.find(user => user.id === rb.userId);
      return {
        id: rb.id,
        userName: u ? `${u.firstName} ${u.lastName}` : (rb.passenger ? rb.passenger.fullName : 'Guest User'),
        destination: rb.title || 'Unknown Destination',
        flightCode: rb.flight_id || 'HZ-FLIGHT',
        date: rb.bookingDate || rb.dateRange || new Date().toISOString(),
        price: rb.totalPrice || 0,
        status: rb.status,
        isReal: true // Flag to know which storage to update on cancel
      };
    });

    const allBookings = [...formattedRealBookings, ...adminDemoBookings];
    renderBookings(allBookings);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const renderBookings = (bookings) => {
    if (!tbody) return;
    
    tbody.innerHTML = bookings.map(b => `
      <tr>
        <td>
          <div class="t-user-info">
            <div class="t-avatar-initials">${b.userName.split(' ').map(n => n[0]).join('')}</div>
            <span class="t-user-name">${b.userName}</span>
          </div>
        </td>
        <td>
          <div class="t-detail-top">${b.destination}</div>
          <div class="t-detail-bottom">Curated Experience</div>
        </td>
        <td>
          <div class="t-detail-top">${b.flightCode}</div>
          <div class="t-detail-bottom">${formatDate(b.date)}</div>
        </td>
        <td>
          <span class="t-price">£${b.price.toLocaleString()}</span>
        </td>
        <td style="text-align: right;">
          <button class="t-cancel-text" onclick="handleCancel(${b.id}, ${b.isReal || false})">Cancel</button>
        </td>
      </tr>
    `).join('');
  };

  window.handleCancel = (id, isReal) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const key = isReal ? 'bookings' : 'admin_bookings';
      const bookings = JSON.parse(localStorage.getItem(key) || '[]').filter(b => b.id !== id);
      localStorage.setItem(key, JSON.stringify(bookings));
      loadBookings();
    }
  };

  loadBookings();
});
