import { API_URL } from './config.js';

document.getElementById('loginBtn').addEventListener('click', async () => {
  // Clear errors
  document.querySelectorAll('.error-msg').forEach(el => {
    el.innerText = '';
    el.style.display = 'none';
  });

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  let isValid = true;

  const showError = (id, msg) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerText = msg;
      el.style.display = 'block';
    }
    isValid = false;
  };

  if (!email) showError('emailError', 'This field is required');
  if (!password) showError('passwordError', 'This field is required');

  if (!isValid) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('emailError', 'Invalid email format');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role === 'admin') {
        window.location.href = 'admin-users.html';
      } else {
        window.location.href = 'index.html';
      }
    } else {
      showError('generalError', 'invalid email or password');
    }
  } catch (err) {
    showError('generalError', 'Network error. Please try again later.');
  }
});
