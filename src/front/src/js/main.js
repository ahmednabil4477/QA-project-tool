import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {

  // ── Auth Check ───────────────────────────────────────────────
  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || 'null');
  const loginLink = document.querySelector('a[href="login.html"]');
  if (token && user && loginLink) {
    loginLink.innerText = 'LOGOUT';
    loginLink.href = '#';
    loginLink.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    });
    const nameSpan = document.createElement('span');
    nameSpan.className = 'nav-user-name';
    nameSpan.innerText = user.firstName;
    nameSpan.style.cssText = 'font-size:0.875rem;font-weight:700;color:#1e3a8a;margin-left:-16px;';
    loginLink.parentNode.insertBefore(nameSpan, loginLink.nextSibling);
  }

  // ── Destination Carousel State ───────────────────────────────
  let allDestinations   = [];
  let filteredDests     = [];
  let destIndex         = 0;

  const destTrack    = document.getElementById('destinations-track');
  const destPrevBtn  = document.getElementById('dest-prev');
  const destNextBtn  = document.getElementById('dest-next');
  const countryTabs  = document.getElementById('country-tabs');

  // ── Build a destination card ─────────────────────────────────
  const destCardHTML = dest => `
    <div class="dest-card" style="flex:0 0 calc((100% - 48px)/3); min-width:calc((100% - 48px)/3);">
      <div class="dest-card-img-wrapper">
        <img src="${dest.images}" alt="${dest.name}" class="dest-card-img" loading="lazy" />
      </div>
      <div class="dest-card-content">
        <div class="dest-card-header">
          <div>
            <h3 class="dest-card-title">${dest.name}</h3>
            <div class="dest-card-rating">
              <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span>${dest.rating}</span>
            </div>
          </div>
          <p class="dest-card-price">€${dest.cost}</p>
        </div>
        <a href="destination.html?id=${dest.id}" class="btn-card-action">View Tour</a>
      </div>
    </div>
  `;

  // ── Render destination carousel for current country ──────────
  const renderDestinations = (country) => {
    filteredDests = allDestinations.filter(d => d.country === country);
    destIndex = 0;
    destTrack.innerHTML = '';

    if (filteredDests.length === 0) {
      destTrack.innerHTML = '<p style="color:var(--text-muted)">No destinations found.</p>';
      return;
    }

    // Clone first 3 for infinite loop
    const cloned = [...filteredDests, ...filteredDests.slice(0, 3)];
    destTrack.innerHTML = cloned.map(destCardHTML).join('');
    destTrack.style.transition = 'none';
    destTrack.style.transform  = 'translateX(0)';
  };

  const slideDestTo = (idx, animate = true) => {
    const slideW = 100 / 3;
    destTrack.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' : 'none';
    destTrack.style.transform  = `translateX(-${idx * slideW}%)`;
  };

  destNextBtn && destNextBtn.addEventListener('click', () => {
    destIndex++;
    slideDestTo(destIndex);
    if (destIndex >= filteredDests.length) {
      setTimeout(() => {
        destIndex = 0;
        slideDestTo(0, false);
      }, 500);
    }
  });

  destPrevBtn && destPrevBtn.addEventListener('click', () => {
    if (destIndex <= 0) {
      destIndex = filteredDests.length;
      slideDestTo(destIndex, false);
      setTimeout(() => {
        destIndex--;
        slideDestTo(destIndex);
      }, 20);
    } else {
      destIndex--;
      slideDestTo(destIndex);
    }
  });

  // ── Fetch all destinations then build country tabs ───────────
  try {
    const res = await fetch(`${API_URL}/destinations`);
    allDestinations = await res.json();

    // Unique countries in order
    const countries = [...new Set(allDestinations.map(d => d.country))];

    countryTabs.innerHTML = countries.map((c, i) => `
      <button class="filter-tag ${i === 0 ? 'active' : ''}" data-country="${c}">
        ${i === 0 ? `<span class="dot"></span>` : ''}${c}
      </button>
    `).join('');

    // Tab click logic
    countryTabs.querySelectorAll('.filter-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        countryTabs.querySelectorAll('.filter-tag').forEach(b => {
          b.classList.remove('active');
          b.innerHTML = b.dataset.country;
        });
        btn.classList.add('active');
        btn.innerHTML = `<span class="dot"></span>${btn.dataset.country}`;
        renderDestinations(btn.dataset.country);
      });
    });

    // Default: first country
    if (countries.length > 0) renderDestinations(countries[0]);

  } catch (err) {
    console.error('Error fetching destinations:', err);
    if (destTrack) destTrack.innerHTML = '<p>Failed to load destinations.</p>';
  }

  // ── Reviews Infinite Carousel ────────────────────────────────
  const testiContainer = document.getElementById('testimonials-container');
  if (testiContainer) {
    try {
      const res = await fetch(`${API_URL}/reviews`);
      if (res.ok) {
        window.allReviews = await res.json();
        window.currentReviewIndex = 0;
        if (window.allReviews.length > 0) {
          window.renderReviews();
        } else {
          testiContainer.innerHTML = '<p>No reviews yet.</p>';
        }
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  }
});

// ── Review Carousel Functions ────────────────────────────────
window.renderReviews = () => {
  const track = document.getElementById('testimonials-container');
  if (!track || !window.allReviews || window.allReviews.length === 0) return;

  if (track.children.length === 0) {
    const toRender = [...window.allReviews, ...window.allReviews.slice(0, 3)];
    track.innerHTML = toRender.map(t => `
      <div class="testi-card">
        <div class="testi-header">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(t.firstName + ' ' + t.lastName)}&background=random" class="testi-avatar" />
          <div>
            <h4 class="testi-name">${t.firstName} ${t.lastName}</h4>
            <p class="testi-loc">Customer</p>
          </div>
        </div>
        <div class="testi-stars">
          ${Array(Math.round(t.rating)).fill('<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>').join('')}
        </div>
        <p class="testi-text">"${t.comment}"</p>
      </div>
    `).join('');
  }

  const slideW = 100 / 3;
  track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  track.style.transform  = `translateX(-${window.currentReviewIndex * slideW}%)`;
};

window.nextReview = () => {
  if (!window.allReviews) return;
  const track = document.getElementById('testimonials-container');
  window.currentReviewIndex++;
  window.renderReviews();
  if (window.currentReviewIndex >= window.allReviews.length) {
    setTimeout(() => {
      track.style.transition = 'none';
      window.currentReviewIndex = 0;
      track.style.transform = 'translateX(0)';
    }, 500);
  }
};

window.prevReview = () => {
  if (!window.allReviews) return;
  const track = document.getElementById('testimonials-container');
  if (window.currentReviewIndex <= 0) {
    track.style.transition = 'none';
    window.currentReviewIndex = window.allReviews.length;
    track.style.transform = `translateX(-${window.currentReviewIndex * (100 / 3)}%)`;
    track.offsetHeight; // force reflow
    window.currentReviewIndex--;
    window.renderReviews();
  } else {
    window.currentReviewIndex--;
    window.renderReviews();
  }
};
