import { requireAdmin, logout } from './utils/auth.js';
import { apiGet, apiDelete } from './utils/api.js';
import { renderPagination } from './utils/pagination.js';

const ITEMS_PER_PAGE = 5;

// ── Templates ────────────────────────────────────────────────────────────────

const bookingRowHTML = (b) => `
  <tr>
    <td><span class="t-badge-dark">#BKG-${b.id}</span></td>
    <td><div class="t-cell-primary">${b.userName || 'Guest'}</div></td>
    <td><span class="t-user-email t-cell-primary">${b.arrivalCity || 'Destination'}</span></td>
    <td>
      <div class="t-cell-primary">${b.airlineName || 'Airline'}</div>
      <div class="t-cell-sub">Flight ${b.flightId}</div>
    </td>
    <td>
      <span class="t-cell-primary">€${b.totalPrice}</span>
      <div class="t-cell-status t-cell-status--${(b.status || 'confirmed').toLowerCase()}">
        ${(b.status || 'Confirmed').toUpperCase()}
      </div>
    </td>
    <td class="t-actions" data-booking-id="${b.id}">
      <button class="t-action-btn js-delete-booking" data-id="${b.id}" style="display:inline-flex;">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </td>
  </tr>
`;

// ── State ─────────────────────────────────────────────────────────────────────

let bookings = [];
let currentPage = 1;
let pendingDeleteId = null;

// ── DOM refs ──────────────────────────────────────────────────────────────────

const tbody       = document.getElementById('admin-bookings-tbody');
const modal       = document.getElementById('delete-booking-modal');
const textEl      = document.querySelector('.admin-pagination-text');
const controlsEl  = document.querySelector('.admin-pagination-controls');

// ── Data ──────────────────────────────────────────────────────────────────────

const loadBookings = async (token) => {
  try {
    const res = await apiGet('/bookings', token);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    bookings = await res.json();
    renderPage();
  } catch {
    if (tbody) tbody.innerHTML = '<tr><td colspan="6">Error loading bookings.</td></tr>';
  }
};

// ── Render ────────────────────────────────────────────────────────────────────

const renderPage = () => {
  if (!tbody) return;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const slice = bookings.slice(start, start + ITEMS_PER_PAGE);

  tbody.innerHTML = slice.map(bookingRowHTML).join('');
  attachRowListeners();

  renderPagination({
    controls: controlsEl,
    textEl,
    total: bookings.length,
    current: currentPage,
    perPage: ITEMS_PER_PAGE,
    label: 'bookings',
    onPage: (p) => { currentPage = p; renderPage(); },
  });
};

// ── Row event delegation ──────────────────────────────────────────────────────

const attachRowListeners = () => {
  tbody.querySelectorAll('.js-delete-booking').forEach((btn) => {
    btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.id)));
  });
};

// ── Modal ─────────────────────────────────────────────────────────────────────

const openDeleteModal = (id) => {
  pendingDeleteId = id;
  modal?.classList.add('active');
};

const closeDeleteModal = () => {
  pendingDeleteId = null;
  modal?.classList.remove('active');
};

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  const { token, user } = requireAdmin();

  const nameEl = document.querySelector('.admin-profile-name');
  if (nameEl) nameEl.textContent = user.firstName;

  await loadBookings(token);

  document.getElementById('confirm-delete-booking')
    ?.addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      try {
        const res = await apiDelete(`/bookings/${pendingDeleteId}`, token);
        if (res.ok) {
          await loadBookings(token);
        } else {
          alert('Failed to delete booking.');
        }
      } catch {
        alert('Network error.');
      }
      closeDeleteModal();
    });

  document.getElementById('cancel-delete-booking')
    ?.addEventListener('click', closeDeleteModal);

  document.getElementById('admin-logout-btn')
    ?.addEventListener('click', logout);
});
