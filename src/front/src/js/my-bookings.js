import { initPublicNav, getAuth } from './utils/auth.js';
import { apiGet, apiPost } from './utils/api.js';

// ── Templates ─────────────────────────────────────────────────────────────────

const STAR_FILLED_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
const STAR_EMPTY_PATH  = 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z';

const statusStyle = (status) => {
  const confirmed = (status || 'confirmed').toLowerCase() === 'confirmed';
  return {
    bg:    confirmed ? '#dcfce7' : '#fee2e2',
    color: confirmed ? '#166534' : '#991b1b',
  };
};

const bookingCardHTML = (b) => {
  const st = statusStyle(b.status);
  return `
    <div class="booking-card">
      <img
        src="${b.destinationImage || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=600&auto=format&fit=crop'}"
        alt="${b.destinationName}"
        class="booking-img"
      />
      <div class="booking-details">
        <h3 class="booking-title">${b.destinationName}</h3>
        <div class="booking-date">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Departure: ${new Date(b.departureTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div class="booking-tags">
          <span class="booking-tag" style="background:${st.bg};color:${st.color};text-transform:uppercase;">
            ${(b.status || 'Confirmed').toUpperCase()}
          </span>
          <span class="booking-tag">€${b.totalPrice}</span>
          <span class="booking-tag">${b.airlineName}</span>
        </div>
      </div>
      <div class="booking-action" style="display:flex;gap:12px;">
        <button class="btn-outline js-book-again" data-dest="${encodeURIComponent(b.destinationName)}">
          Book Again
        </button>
        <button class="btn-outline js-open-review" data-dest-id="${b.flight.destinationId}">
          Share Review
        </button>
      </div>
    </div>
  `;
};

const paginationHTML = (current, total, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  if (totalPages <= 1) return '';

  const start = (current - 1) * perPage + 1;
  const end   = Math.min(current * perPage, count);

  const prevDisabled = current === 1    ? 'disabled style="opacity:0.5"' : '';
  const nextDisabled = current === totalPages ? 'disabled style="opacity:0.5"' : '';

  const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map((p) => `<button class="page-btn js-page${p === current ? ' active' : ''}" data-page="${p}">${p}</button>`)
    .join('');

  return `
    <div class="admin-pagination" style="margin-top:24px;border-radius:16px;border:1px solid var(--border-color);">
      <div class="admin-pagination-text">Showing ${start} to ${end} of ${count} entries</div>
      <div class="admin-pagination-controls">
        <button class="page-btn js-page" data-page="${current - 1}" ${prevDisabled}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        ${pageButtons}
        <button class="page-btn js-page" data-page="${current + 1}" ${nextDisabled}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  `;
};

const starHTML = (i, filled) => `
  <div class="modal-star${filled ? ' active' : ''}" data-rating="${i}">
    <svg viewBox="0 0 24 24" fill="${filled ? 'currentColor' : '#cbd5e1'}">
      <path d="${filled ? STAR_FILLED_PATH : STAR_EMPTY_PATH}"/>
    </svg>
  </div>
`;

// ── Validation & SIQ mapped helpers ──────────────────────────────────────────

const renderEmptyBookingsState = (containerElement) => {
  containerElement.innerHTML = `
    <div style="text-align:center;padding:48px;background:white;border-radius:24px;border:1px solid var(--border-color);">
      <p style="color:var(--text-muted);font-weight:500;">You haven't curated any journeys yet.</p>
      <a href="index.html" class="btn-primary" style="display:inline-flex;width:auto;margin-top:24px;padding:12px 32px;">View Gallery</a>
    </div>
  `;
};

const handleBookAgain = (destination) => {
  window.location.href = `flights.html?destination=${destination}`;
};

const handleShareReviewClick = (destId) => {
  openReviewModal(destId);
};

const getDefaultStarRating = () => {
  return 4;
};

const isReviewFeedbackEmpty = (comment) => {
  return !comment;
};

const submitReview = async (comment, rating, destId, token) => {
  return await apiPost('/reviews', { comment, rating, destination_id: destId }, token);
};

// ── State ─────────────────────────────────────────────────────────────────────

let allBookings  = [];
let currentPage  = 1;
let currentRating = getDefaultStarRating();
let currentDestId = null;
const ITEMS_PER_PAGE = 3;

// ── DOM refs ──────────────────────────────────────────────────────────────────

const container    = document.getElementById('bookings-container');
const reviewModal  = document.getElementById('review-modal');
const starContainer = document.getElementById('star-container');
const commentInput  = document.getElementById('review-comment');

// ── Render ────────────────────────────────────────────────────────────────────

const renderBookings = () => {
  if (!container) return;

  if (allBookings.length === 0) {
    renderEmptyBookingsState(container);
    return;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const slice = allBookings.slice(start, start + ITEMS_PER_PAGE);

  container.innerHTML =
    slice.map(bookingCardHTML).join('') +
    paginationHTML(currentPage, currentPage, ITEMS_PER_PAGE, allBookings.length);

  attachBookingListeners();
};

const renderStars = () => {
  if (!starContainer) return;
  starContainer.innerHTML = Array.from({ length: 5 }, (_, i) =>
    starHTML(i + 1, i + 1 <= currentRating)
  ).join('');

  starContainer.querySelectorAll('.modal-star').forEach((star) => {
    star.addEventListener('click', () => {
      currentRating = Number(star.dataset.rating);
      renderStars();
    });
  });
};

// ── Event delegation ──────────────────────────────────────────────────────────

const attachBookingListeners = () => {
  container.querySelectorAll('.js-book-again').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleBookAgain(btn.dataset.dest);
    });
  });

  container.querySelectorAll('.js-open-review').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleShareReviewClick(Number(btn.dataset.destId));
    });
  });

  container.querySelectorAll('.js-page').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = Number(btn.dataset.page);
      if (!btn.disabled && p >= 1) {
        currentPage = p;
        renderBookings();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
};

// ── Modal ─────────────────────────────────────────────────────────────────────

const openReviewModal = (destId) => {
  currentDestId = destId;
  reviewModal?.classList.add('active');
};

const closeReviewModal = () => {
  currentDestId = null;
  if (commentInput) commentInput.value = '';
  reviewModal?.classList.remove('active');
};

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  initPublicNav();

  const { token, user } = getAuth();

  if (!token || !user) {
    if (container) {
      container.innerHTML = `
        <div style="text-align:center;padding:64px 24px;background:white;border-radius:24px;border:1px solid var(--border-color);">
          <div style="width:80px;height:80px;background:#f1f5f9;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;">
            <svg style="width:40px;height:40px;color:#64748b;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 style="font-size:1.5rem;font-weight:700;color:#0f172a;margin-bottom:8px;">Sign in first</h2>
          <p style="color:#64748b;margin-bottom:32px;">Please sign in to your account to view and manage your curated bookings.</p>
          <a href="login.html" class="btn-primary" style="display:inline-flex;width:auto;padding:14px 40px;">SIGN IN</a>
        </div>
      `;
      document.querySelector('.profile-section')?.style.setProperty('display', 'none');
    }
    return;
  }

  // Populate profile
  const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  setText('user-full-name', `${user.firstName} ${user.lastName}`);
  setText('user-id-badge',  `#USR-${user.id}`);
  setText('user-email-text', user.email);

  // Load bookings
  if (container) {
    try {
      const res = await apiGet('/bookings/my-bookings', token);
      if (!res.ok) throw new Error();
      allBookings = await res.json();
      renderBookings();
    } catch {
      container.innerHTML = '<p>Error loading bookings.</p>';
    }
  }

  renderStars();

  // Modal listeners
  document.getElementById('close-review-modal')?.addEventListener('click', closeReviewModal);
  document.getElementById('close-review-modal-cancel')?.addEventListener('click', closeReviewModal);

  document.getElementById('submit-review-btn')?.addEventListener('click', async () => {
    if (!currentDestId) return;
    const comment = commentInput?.value.trim();
    if (isReviewFeedbackEmpty(comment)) { alert('Please write a comment.'); return; }

    try {
      const res = await submitReview(comment, currentRating, currentDestId, token);
      if (res.ok) {
        alert('Review submitted successfully!');
        closeReviewModal();
      } else {
        alert('Failed to submit review.');
      }
    } catch {
      alert('Network error while submitting review.');
    }
  });
});