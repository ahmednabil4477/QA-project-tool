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

  const container = document.getElementById('bookings-container');

  if (!token || !user) {
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 64px 24px; background: white; border-radius: 24px; border: 1px solid var(--border-color);">
          <div style="width: 80px; height: 80px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
            <svg style="width: 40px; height: 40px; color: #64748b;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Sign in first</h2>
          <p style="color: #64748b; margin-bottom: 32px;">Please sign in to your account to view and manage your curated bookings.</p>
          <a href="login.html" class="btn-primary" style="display: inline-flex; width: auto; padding: 14px 40px;">SIGN IN</a>
        </div>
      `;
      // Hide profile section if not logged in
      const profileSection = document.querySelector('.profile-section');
      if (profileSection) profileSection.style.display = 'none';
      const heading = document.querySelector('h2');
      if (heading && heading.innerText === 'Past Bookings') heading.style.display = 'none';
    }
    return;
  }

  // Update profile info from localStorage
  const nameEl = document.getElementById('user-full-name');
  const idEl = document.getElementById('user-id-badge');
  const emailEl = document.getElementById('user-email-text');
  
  if (nameEl) nameEl.innerText = `${user.firstName} ${user.lastName}`;
  if (idEl) idEl.innerText = `#USR-${user.id}`;
  if (emailEl) emailEl.innerText = user.email;

  if (container) {
    try {
      const res = await fetch(`${API_URL}/bookings/my-bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      window.allBookings = data;
      window.currentPage = 1;
      window.itemsPerPage = 3;
      window.renderBookings();
    } catch (err) {
      container.innerHTML = '<p>Error loading bookings.</p>';
    }
  }

  // Setup stars
  initStars();
});

window.renderBookings = () => {
  const container = document.getElementById('bookings-container');
  if (!container) return;

  if (window.allBookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px; background: white; border-radius: 24px; border: 1px solid var(--border-color);">
        <p style="color: var(--text-muted); font-weight: 500;">You haven't curated any journeys yet.</p>
        <a href="index.html" class="btn-primary" style="display: inline-flex; width: auto; margin-top: 24px; padding: 12px 32px;">View Gallery</a>
      </div>
    `;
    return;
  }

  const start = (window.currentPage - 1) * window.itemsPerPage;
  const end = start + window.itemsPerPage;
  const pageItems = window.allBookings.slice(start, end);
  const totalPages = Math.ceil(window.allBookings.length / window.itemsPerPage);

  let html = pageItems.map(b => `
    <div class="booking-card">
      <img src="${b.destinationImage || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=600&auto=format&fit=crop'}" alt="${b.destinationName}" class="booking-img" />
      <div class="booking-details">
        <h3 class="booking-title">${b.destinationName}</h3>
        <div class="booking-date">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Departure: ${new Date(b.departureTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div class="booking-tags">
          <span class="booking-tag" style="background: ${b.status === 'confirmed' ? '#dcfce7' : '#fee2e2'}; color: ${b.status === 'confirmed' ? '#166534' : '#991b1b'}; text-transform: uppercase;">${b.status}</span>
          <span class="booking-tag">€${b.totalPrice}</span>
          <span class="booking-tag">${b.airlineName}</span>
        </div>
      </div>
      <div class="booking-action" style="display: flex; gap: 12px;">
        <button class="btn-outline" onclick="window.location.href='flights.html?destination=${encodeURIComponent(b.destinationName)}'">Book Again</button>
        <button class="btn-outline" onclick="openModal(${b.flight.destinationId})">Share Review</button>
      </div>
    </div>
  `).join('');

  if (totalPages > 1) {
    html += `
      <div class="admin-pagination" style="margin-top: 24px; border-radius: 16px; border: 1px solid var(--border-color);">
        <div class="admin-pagination-text">Showing ${start + 1} to ${Math.min(end, window.allBookings.length)} of ${window.allBookings.length} entries</div>
        <div class="admin-pagination-controls">
          <button class="page-btn" ${window.currentPage === 1 ? 'disabled style="opacity:0.5"' : `onclick="changePage(${window.currentPage - 1})"`}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
            <button class="page-btn ${p === window.currentPage ? 'active' : ''}" onclick="changePage(${p})">${p}</button>
          `).join('')}
          <button class="page-btn" ${window.currentPage === totalPages ? 'disabled style="opacity:0.5"' : `onclick="changePage(${window.currentPage + 1})"`}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
};

window.changePage = (page) => {
  window.currentPage = page;
  window.renderBookings();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

let currentRating = 4;
function initStars() {
  const container = document.getElementById('star-container');
  if (!container) return;
  
  renderStars();
}

function renderStars() {
  const container = document.getElementById('star-container');
  let html = '';
  for(let i=1; i<=5; i++) {
    const isFilled = i <= currentRating;
    const path = isFilled 
      ? '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' 
      : '<path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>';
    
    html += `
      <div class="modal-star ${isFilled ? 'active' : ''}" onclick="setRating(${i})">
        <svg viewBox="0 0 24 24" fill="${isFilled ? 'currentColor' : '#cbd5e1'}">
          ${path}
        </svg>
      </div>
    `;
  }
  container.innerHTML = html;
}

window.setRating = (rating) => {
  currentRating = rating;
  renderStars();
};

let currentDestId = null;

window.openModal = (destId) => {
  currentDestId = destId;
  document.getElementById('review-modal').classList.add('active');
};

window.closeModal = () => {
  currentDestId = null;
  document.getElementById('review-comment').value = '';
  document.getElementById('review-modal').classList.remove('active');
};

window.submitReview = async () => {
  if (!currentDestId) return;
  const token = localStorage.getItem('token');
  const comment = document.getElementById('review-comment').value.trim();
  
  if (!comment) {
    alert("Please write a comment.");
    return;
  }
  
  try {
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        comment,
        rating: currentRating,
        destination_id: currentDestId
      })
    });
    
    if (res.ok) {
      alert('Review submitted successfully!');
      window.closeModal();
    } else {
      alert('Failed to submit review.');
    }
  } catch (err) {
    alert('Network error while submitting review.');
  }
};
