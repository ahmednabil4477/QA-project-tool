document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('admin-users-tbody');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user || user.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  const nameEl = document.querySelector('.admin-profile-name');
  if (nameEl) nameEl.innerText = user.firstName;
  const seedDefaultUsers = () => {
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    const demoUsers = [
      { id: 101, firstName: 'Elara', lastName: 'Vance', email: 'elara.vance@horizon.com', role: 'user', registrationDate: '2023-10-24T10:00:00Z' },
      { id: 102, firstName: 'Julian', lastName: 'Ross', email: 'julian.ross@curator.io', role: 'user', registrationDate: '2023-11-02T14:30:00Z' },
      { id: 103, firstName: 'Marcus', lastName: 'Dent', email: 'marcus.dent@horizon.com', role: 'user', registrationDate: '2023-12-19T09:15:00Z' },
      { id: 104, firstName: 'Stefan', lastName: 'King', email: 'stefan.king@travel.admin', role: 'user', registrationDate: '2024-01-08T16:45:00Z' },
      { id: 105, firstName: 'Aria', lastName: 'Brooks', email: 'aria.brooks@explorer.net', role: 'user', registrationDate: '2024-01-08T11:20:00Z' },
      { id: 106, firstName: 'Leo', lastName: 'Martinez', email: 'leo.martinez@travel.admin', role: 'user', registrationDate: '2024-06-08T08:00:00Z' },
      { id: 107, firstName: 'Zoe', lastName: 'Chen', email: 'zoe.chen@voyage.net', role: 'user', registrationDate: '2024-07-12T13:10:00Z' },
      { id: 108, firstName: 'Ahmed', lastName: 'Zahran', email: 'ahmed@gmail.com', role: 'user', registrationDate: '2024-08-23T15:00:00Z' }
    ];

    if (users.length <= 1) {
      demoUsers.forEach(du => {
        if (!users.find(u => u.email === du.email)) {
          users.push(du);
        }
      });
      localStorage.setItem('users', JSON.stringify(users));
    }

    return users;
  };

  let users = [];

  const loadUsers = async () => {
    try {
      let allUsers = seedDefaultUsers();
      users = allUsers.filter(u => u.role !== 'admin');
      renderUsers();
    } catch (err) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="4">Error loading users.</td></tr>';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const getInitials = (firstName, lastName) => {
    return ((firstName || '')[0] || '') + ((lastName || '')[0] || '');
  };

  const renderUsers = () => {
    if (!tbody) return;

    const paginationText = document.querySelector('.admin-pagination-text');
    if (paginationText) {
      paginationText.innerText = `Showing 1 to ${users.length} of ${users.length} accounts`;
    }

    tbody.innerHTML = users.map(u => `
      <tr>
        <td>
          <span class="t-badge-dark">#USR-${String(u.id).padStart(4, '0')}</span>
        </td>
        <td>
          <div class="t-user-info">
            <div class="t-avatar-initials">${getInitials(u.firstName, u.lastName)}</div>
            <span class="t-user-email">${u.email}</span>
          </div>
        </td>
        <td>
          <span class="t-date">${formatDate(u.registrationDate)}</span>
        </td>
        <td style="text-align: right;">
          <button class="t-action-btn" onclick="openAdminModal('delete-user-modal', ${u.id})">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
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
      let localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      localUsers = localUsers.filter(u => u.id !== userToDelete);
      localStorage.setItem('users', JSON.stringify(localUsers));
      await loadUsers();
    } catch (err) {
      console.error(err);
    }
    window.closeAdminModal('delete-user-modal');
  };
});
