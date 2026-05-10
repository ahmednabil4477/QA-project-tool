import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('admin-users-tbody');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user || user.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  const nameEl = document.querySelector('.admin-profile-name');
  if (nameEl && user) nameEl.innerText = user.firstName;

  let users = [];
  let currentPage = 1;
  const itemsPerPage = 5;

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      users = await res.json();
      renderUsers();
    } catch (err) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="4">Error loading users.</td></tr>';
    }
  };

  const renderUsers = () => {
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

    const paginationText = document.querySelector('.admin-pagination-text');
    if (paginationText) {
      const end = Math.min(startIndex + itemsPerPage, users.length);
      paginationText.innerText = `Showing ${users.length > 0 ? startIndex + 1 : 0} to ${end} of ${users.length} accounts`;
    }

    tbody.innerHTML = paginatedUsers.map(u => `
      <tr>
        <td>
          <span class="t-badge-dark">#USR-${u.id}</span>
        </td>
        <td>
          <div style="font-size: 0.875rem; color: #0f172a; font-weight: 600;">${u.firstName} ${u.lastName}</div>
        </td>
        <td>
          <div class="t-user-info">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName + ' ' + u.lastName)}&background=random" class="t-user-avatar" />
            <span class="t-user-email">${u.email}</span>
          </div>
        </td>
        <td style="text-align: right;">
          <button class="t-action-btn" onclick="openAdminModal('delete-user-modal', ${u.id})" style="display:inline-flex;">
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
    
    const totalPages = Math.ceil(users.length / itemsPerPage);
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
    const totalPages = Math.ceil(users.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderUsers();
  };

  await loadUsers();

  let userToDelete = null;

  window.openAdminModal = (id, userId) => {
    userToDelete = userId;
    document.getElementById(id).classList.add('active');
  };

  window.closeAdminModal = (id) => {
    userToDelete = null;
    document.getElementById(id).classList.remove('active');
  };

  window.confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`${API_URL}/users/${userToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await loadUsers();
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      alert("Network error.");
    }
    window.closeAdminModal('delete-user-modal');
  };

  window.logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  };
});
