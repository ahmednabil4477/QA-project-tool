import { API_URL } from './config.js';

document.getElementById('registerBtn').addEventListener('click', async () => {
  // Clear all errors
  document.querySelectorAll('.error-msg').forEach(el => {
    el.innerText = '';
    el.style.display = 'none';
  });

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  let isValid = true;

  const showError = (id, msg) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerText = msg;
      el.style.display = 'block';
    }
    isValid = false;
  };

  // Empty validation
  if (!firstName) showError('firstNameError', 'This field is required');
  if (!lastName) showError('lastNameError', 'This field is required');
  if (!email) showError('emailError', 'This field is required');
  if (!password) showError('passwordError', 'This field is required');
  if (!confirmPassword) showError('confirmPasswordError', 'This field is required');

  if (!isValid) return; // Stop if any required fields are missing

  // Name format validation
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(firstName)) {
    showError('firstNameError', 'Only alphabetic characters are allowed');
  } else if (firstName.length < 2 || firstName.length > 50) {
    showError('firstNameError', 'Name should be between 2 and 50 characters');
  }

  if (!nameRegex.test(lastName)) {
    showError('lastNameError', 'Only alphabetic characters are allowed');
  } else if (lastName.length < 2 || lastName.length > 50) {
    showError('lastNameError', 'Name should be between 2 and 50 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('emailError', 'Invalid email format');
  }

  // Password validation
  if (password.length < 8) {
    showError('passwordError', 'password cannot be less than 8 characters');
  } else {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
      showError('passwordError', 'password should have one small letter,one capital letter,one number and one special character');
    }
  }

  // Confirm password
  if (password !== confirmPassword) {
    showError('confirmPasswordError', "password doesn't match");
  }

  if (!isValid) return;

  // API Call
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      window.location.href = 'index.html';
    } else {
      if (data.message === 'Email already exists.') {
        showError('generalError', 'Email already has an account');
      } else {
        showError('generalError', data.message || 'Registration failed');
      }
    }
  } catch (err) {
    showError('generalError', 'Network error. Please try again later.');
  }
});
