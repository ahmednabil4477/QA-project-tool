import { requireAdmin, logout } from './utils/auth.js';
import { apiGet, apiDelete } from './utils/api.js';
import { renderPagination } from './utils/pagination.js';

const ITEMS_PER_PAGE = 5;

// ── Templates ─────────────────────────────────────────────────────────────────

const userRowHTML = (u) => `
  <tr>
    <td><span class="t-badge-dark">#USR-${u.id}</span></td>
    <td><div class="t-cell-primary">${u.firstName} ${u.lastName}</div></td>
    <td>
      <div class="t-user-info">
        <img
          src="https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName + ' ' + u.lastName)}&background=random"
          class="t-user-avatar"
          alt="${u.firstName} ${u.lastName}"
        />
        <span class="t-user-email">${u.email}</span>
      </div>
    </td>
    <td class="t-actions" style="text-align:right;">
      <button class="t-action-btn js-delete-user" data-id="${u.id}" style="display:inline-flex;">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </td>
  </tr>
`;

// ── State ─────────────────────────────────────────────────────────────────────

let users = [];
let currentPage = 1;
let pendingDeleteId = null;

// ── DOM refs ──────────────────────────────────────────────────────────────────

const tbody       = document.getElementById('admin-users-tbody');
const modal       = document.getElementById('delete-user-modal');
const textEl      = document.querySelector('.admin-pagination-text');
const controlsEl  = document.querySelector('.admin-pagination-controls');

// ── Validation & SIQ mapped helpers ──────────────────────────────────────────

const handlePagination = (p) => {
  currentPage = p;
  renderPage();
};

const confirmDeleteUser = async (token) => {
  if (!pendingDeleteId) return;
  try {
    const res = await apiDelete(`/users/${pendingDeleteId}`, token);
    if (res.ok) {
      await loadUsers(token);
    } else {
      alert('Failed to delete user.');
    }
  } catch {
    alert('Network error.');
  }
  closeDeleteModal();
};

// ── Data ──────────────────────────────────────────────────────────────────────

const loadUsers = async (token) => {
  try {
    const res = await apiGet('/users', token);
    if (!res.ok) throw new Error('Failed to fetch users');
    users = await res.json();
    renderPage();
  } catch {
    if (tbody) tbody.innerHTML = '<tr><td colspan="4">Error loading users.</td></tr>';
  }
};

// ── Render ────────────────────────────────────────────────────────────────────

const renderPage = () => {
  if (!tbody) return;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const slice = users.slice(start, start + ITEMS_PER_PAGE);

  tbody.innerHTML = slice.map(userRowHTML).join('');
  attachRowListeners();

  renderPagination({
    controls: controlsEl,
    textEl,
    total: users.length,
    current: currentPage,
    perPage: ITEMS_PER_PAGE,
    label: 'accounts',
    onPage: handlePagination,
  });
};

// ── Row event delegation ──────────────────────────────────────────────────────

const attachRowListeners = () => {
  tbody.querySelectorAll('.js-delete-user').forEach((btn) => {
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

  await loadUsers(token);

  document.getElementById('confirm-delete-user')
    ?.addEventListener('click', () => confirmDeleteUser(token));

  document.getElementById('cancel-delete-user')
    ?.addEventListener('click', closeDeleteModal);

  document.getElementById('admin-logout-btn')
    ?.addEventListener('click', logout);
});