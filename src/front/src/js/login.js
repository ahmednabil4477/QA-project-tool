import { API_URL } from './config.js';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const submitLogin = async (email, password) => {
  return await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
};

const isFieldEmpty = (value) => {
  return !value;
};

const checkUserRole = (role) => {
  if (role === 'admin') {
    window.location.href = 'admin-users.html';
  } else {
    window.location.href = 'index.html';
  }
};

document.getElementById('loginBtn').addEventListener('click', async () => {
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

  if (isFieldEmpty(email)) showError('emailError', 'This field is required');
  if (isFieldEmpty(password)) showError('passwordError', 'This field is required');

  if (!isValid) return;

  if (!validateEmail(email)) {
    showError('emailError', 'Invalid email format');
    return;
  }

  try {
    const res = await submitLogin(email, password);
    
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      checkUserRole(data.user.role);
    } else {
      showError('generalError', 'invalid email or password');
    }
  } catch (err) {
    showError('generalError', 'Network error. Please try again later.');
  }
});