import { API_URL } from './config.js';

const isFieldEmpty = (value) => {
  return !value;
};

const validateNameFormat = (name) => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
};

const validateNameLength = (name) => {
  return name.length >= 2 && name.length <= 50;
};

const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePasswordLength = (password) => {
  return password.length >= 8;
};

const validatePasswordRules = (password) => {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>';\/\\\[\]~`\-_=+]/.test(password);
  
  return hasLower && hasUpper && hasNumber && hasSpecial;
};

const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

const isEmailAlreadyExistsError = (data) => {
  return data.message === 'Email already exists.';
};

const submitRegister = async (firstName, lastName, email, password) => {
  return await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password })
  });
};

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
  if (isFieldEmpty(firstName)) showError('firstNameError', 'This field is required');
  if (isFieldEmpty(lastName)) showError('lastNameError', 'This field is required');
  if (isFieldEmpty(email)) showError('emailError', 'This field is required');
  if (isFieldEmpty(password)) showError('passwordError', 'This field is required');
  if (isFieldEmpty(confirmPassword)) showError('confirmPasswordError', 'This field is required');

  if (!isValid) return; // Stop if any required fields are missing

  // Name format validation
  if (!validateNameFormat(firstName)) {
    showError('firstNameError', 'Only alphabetic characters are allowed');
  } else if (!validateNameLength(firstName)) {
    showError('firstNameError', 'Name should be between 2 and 50 characters');
  }

  if (!validateNameFormat(lastName)) {
    showError('lastNameError', 'Only alphabetic characters are allowed');
  } else if (!validateNameLength(lastName)) {
    showError('lastNameError', 'Name should be between 2 and 50 characters');
  }

  // Email validation
  if (!validateEmailFormat(email)) {
    showError('emailError', 'Invalid email format');
  }

  // Password validation
  if (!validatePasswordLength(password)) {
    showError('passwordError', 'password cannot be less than 8 characters');
  } else {
    if (!validatePasswordRules(password)) {
      showError('passwordError', 'password should have one small letter,one capital letter,one number and one special character');
    }
  }

  // Confirm password
  if (!validatePasswordMatch(password, confirmPassword)) {
    showError('confirmPasswordError', "password doesn't match");
  }

  if (!isValid) return;

  // API Call
  try {
    const res = await submitRegister(firstName, lastName, email, password);
    
    const data = await res.json();
    
    if (res.ok) {
      window.location.href = 'login.html';
    } else {
      if (isEmailAlreadyExistsError(data)) {
        showError('generalError', 'Email already has an account');
      } else {
        showError('generalError', data.message || 'Registration failed');
      }
    }
  } catch (err) {
    showError('generalError', 'Network error. Please try again later.');
  }
});