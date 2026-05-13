/**
 * Reads auth state from localStorage.
 * @returns {{ token: string|null, user: object|null }}
 */
export const getAuth = () => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
});

/** Clears auth state and redirects to login. */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
};

/**
 * Guards admin pages — redirects to login if not an authenticated admin.
 * @returns {{ token: string, user: object }} Verified admin credentials.
 */
export const requireAdmin = () => {
  const { token, user } = getAuth();
  if (!token || !user || user.role !== 'admin') {
    window.location.href = 'login.html';
  }
  return { token, user };
};

/**
 * Initialises the public navbar:
 * - Swaps "SIGN IN" link to "LOGOUT" when authenticated.
 * - Injects a greeting with the user's first name.
 */
export const initPublicNav = () => {
  const { token, user } = getAuth();
  const loginLink = document.querySelector('a[href="login.html"]');
  if (!token || !user || !loginLink) return;

  loginLink.innerText = 'LOGOUT';
  loginLink.href = '#';
  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
    window.location.reload();
  });

  const nameSpan = document.createElement('span');
  nameSpan.className = 'nav-user-name';
  nameSpan.textContent = user.firstName;
  loginLink.parentNode.insertBefore(nameSpan, loginLink.nextSibling);
};
