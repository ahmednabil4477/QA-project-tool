import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('admin-bookings-tbody');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user || user.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  const nameEl = document.querySelector('.admin-profile-name');
  if (nameEl) nameEl.innerText = user.firstName;

  let bookings = [];
  let currentPage = 1;
  const itemsPerPage = 5;

  const loadBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      bookings = await res.json();
      renderBookings();
    } catch (err) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="5">Error loading bookings.</td></tr>';
    }
  };

  const renderBookings = () => {
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

    const paginationText = document.querySelector('.admin-pagination-text');
    if (paginationText) {
      const end = Math.min(startIndex + itemsPerPage, bookings.length);
      paginationText.innerText = `Showing ${bookings.length > 0 ? startIndex + 1 : 0} to ${end} of ${bookings.length} bookings`;
    }

    tbody.innerHTML = paginatedBookings.map(b => `
      <tr>
        <td>
          <span class="t-badge-dark">#USR-${b.userId}</span>
        </td>
        <td>
          <div style="font-size: 0.875rem; color: #0f172a; font-weight: 600;">${b.userName || 'Guest'}</div>
        </td>
        <td>
          <div class="t-user-info">
            <span class="t-user-email" style="color:#0f172a; font-weight:600;">${b.arrivalCity || 'Destination'}</span>
          </div>
        </td>
        <td>
          <div style="font-size: 0.875rem; color: #475569; font-weight: 500;">${b.airlineName || 'Airline'}</div>
          <div style="font-size: 0.75rem; color: #9ca3af; margin-top: 2px;">Flight ${b.flightId}</div>
        </td>
        <td>
          <span class="t-date" style="color: #0f172a; font-weight: 600;">€${b.totalPrice}</span>
          <div style="font-size: 0.75rem; color: ${(b.status || 'Confirmed').toLowerCase() === 'confirmed' ? '#10b981' : '#f59e0b'}; margin-top: 2px;">${(b.status || 'Confirmed').toUpperCase()}</div>
        </td>
        <td style="text-align: right;">
          <button class="t-action-btn" onclick="openAdminModal('delete-booking-modal', ${b.id})" style="display:inline-flex;">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
    
    renderPagination();
  };
  
  const renderPagination = () => {
    const controls = document.querySelector('.admin-pagination-controls');
    if (!controls) return;
    
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    if (totalPages <= 1) {
      controls.innerHTML = '';
      return;
    }
    
    let html = `<button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${currentPage === i ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
    
    controls.innerHTML = html;
  };
  
  window.changePage = (page) => {
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderBookings();
  };

  await loadBookings();

  let bookingToDelete = null;

  window.openAdminModal = (id, bookingId) => {
    bookingToDelete = bookingId;
    document.getElementById(id).classList.add('active');
  };

  window.closeAdminModal = (id) => {
    bookingToDelete = null;
    document.getElementById(id).classList.remove('active');
  };

  window.confirmDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await loadBookings();
      } else {
        alert("Failed to delete booking.");
      }
    } catch (err) {
      alert("Network error.");
    }
    window.closeAdminModal('delete-booking-modal');
  };

  window.logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  };
});
