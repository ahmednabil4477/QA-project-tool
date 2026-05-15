import { initPublicNav } from './utils/auth.js';
import { apiGet } from './utils/api.js';

// ── Templates ─────────────────────────────────────────────────────────────────

const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

const destCardHTML = (dest) => `
  <div class="dest-card" style="flex:0 0 calc((100% - 48px)/3);min-width:calc((100% - 48px)/3);">
    <div class="dest-card-img-wrapper">
      <img
        src="${dest.imageUrl || ''}"
        alt="${dest.name}"
        class="dest-card-img"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop'"
      />
    </div>
    <div class="dest-card-content">
      <div class="dest-card-header">
        <div>
          <h3 class="dest-card-title">${dest.name}</h3>
          <div class="dest-card-rating">
            <svg viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg>
            <span>${dest.rating || ''}</span>
          </div>
        </div>
        <p class="dest-card-price">${dest.cost ? '€' + dest.cost : ''}</p>
      </div>
      <a href="destination.html?id=${dest.id}" class="btn-card-action">View Tour</a>
    </div>
  </div>
`;

const countryTabHTML = (country, active) => `
  <button class="filter-tag${active ? ' active' : ''}" data-country="${country}">
    ${active ? '<span class="dot"></span>' : ''}${country}
  </button>
`;

const reviewCardHTML = (t) => `
  <div class="testi-card">
    <div class="testi-header">
      <img
        src="https://ui-avatars.com/api/?name=${encodeURIComponent(t.firstName + ' ' + t.lastName)}&background=random"
        class="testi-avatar"
        alt="${t.firstName} ${t.lastName}"
        onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=User&background=random'"
      />
      <div>
        <h4 class="testi-name">${t.firstName} ${t.lastName}</h4>
        <p class="testi-loc">Customer</p>
      </div>
    </div>
    <div class="testi-stars">
      ${Array(Math.round(t.rating)).fill(`<svg viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg>`).join('')}
    </div>
    <p class="testi-text">"${t.comment}"</p>
  </div>
`;

// ── Carousel helpers ──────────────────────────────────────────────────────────

const slideTrack = (track, idx, animate = true) => {
  track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' : 'none';
  track.style.transform  = `translateX(-${idx * (100 / 3)}%)`;
};

// ── Destination carousel ──────────────────────────────────────────────────────

let allDestinations = [];
let filteredDests   = [];
let destIndex       = 0;

const destTrack   = document.getElementById('destinations-track');
const destPrevBtn = document.getElementById('dest-prev');
const destNextBtn = document.getElementById('dest-next');
const countryTabs = document.getElementById('country-tabs');

const renderDestinations = (country) => {
  filteredDests = allDestinations.filter((d) => d.country === country);
  destIndex = 0;
  if (!destTrack) return;

  if (filteredDests.length === 0) {
    destTrack.innerHTML = '<p style="color:var(--text-muted)">No destinations found.</p>';
    return;
  }

  const cloned = [...filteredDests, ...filteredDests.slice(0, 3)];
  destTrack.innerHTML = cloned.map(destCardHTML).join('');
  destTrack.style.transition = 'none';
  destTrack.style.transform  = 'translateX(0)';
};

destNextBtn?.addEventListener('click', () => {
  destIndex++;
  slideTrack(destTrack, destIndex);
  if (destIndex >= filteredDests.length) {
    setTimeout(() => { destIndex = 0; slideTrack(destTrack, 0, false); }, 500);
  }
});

destPrevBtn?.addEventListener('click', () => {
  if (destIndex <= 0) {
    destIndex = filteredDests.length;
    slideTrack(destTrack, destIndex, false);
    setTimeout(() => { destIndex--; slideTrack(destTrack, destIndex); }, 20);
  } else {
    destIndex--;
    slideTrack(destTrack, destIndex);
  }
});

// ── Review carousel ───────────────────────────────────────────────────────────

let allReviews       = [];
let currentReviewIdx = 0;

const reviewTrack = document.getElementById('testimonials-container');

const renderReviews = () => {
  if (!reviewTrack || allReviews.length === 0) return;

  if (reviewTrack.children.length === 0) {
    const toRender = [...allReviews, ...allReviews.slice(0, 3)];
    reviewTrack.innerHTML = toRender.map(reviewCardHTML).join('');
  }

  slideTrack(reviewTrack, currentReviewIdx);
};

document.getElementById('review-next')?.addEventListener('click', () => {
  currentReviewIdx++;
  renderReviews();
  if (currentReviewIdx >= allReviews.length) {
    setTimeout(() => {
      reviewTrack.style.transition = 'none';
      currentReviewIdx = 0;
      reviewTrack.style.transform = 'translateX(0)';
    }, 500);
  }
});

document.getElementById('review-prev')?.addEventListener('click', () => {
  if (currentReviewIdx <= 0) {
    reviewTrack.style.transition = 'none';
    currentReviewIdx = allReviews.length;
    reviewTrack.style.transform = `translateX(-${currentReviewIdx * (100 / 3)}%)`;
    reviewTrack.offsetHeight; // force reflow
    currentReviewIdx--;
    renderReviews();
  } else {
    currentReviewIdx--;
    renderReviews();
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  initPublicNav();

  // Destinations + country tabs
  try {
    const res = await apiGet('/destinations');
    allDestinations = await res.json();

    // Derive unique countries from fetched destinations only (no placeholder countries).
    const countries = [...new Set(allDestinations.map((d) => d.country))];

    if (countryTabs) {
      countryTabs.innerHTML = countries.map((c, i) => countryTabHTML(c, i === 0)).join('');

      countryTabs.querySelectorAll('.filter-tag').forEach((btn) => {
        btn.addEventListener('click', () => {
          countryTabs.querySelectorAll('.filter-tag').forEach((b) => {
            b.classList.remove('active');
            b.innerHTML = b.dataset.country;
          });
          btn.classList.add('active');
          btn.innerHTML = `<span class="dot"></span>${btn.dataset.country}`;
          renderDestinations(btn.dataset.country);
        });
      });
    }

    if (countries.length > 0) renderDestinations(countries[0]);
  } catch (err) {
    console.error('Error fetching destinations:', err);
    if (destTrack) destTrack.innerHTML = '<p>Failed to load destinations.</p>';
  }

  // Reviews
  if (reviewTrack) {
    try {
      const res = await apiGet('/reviews');
      if (res.ok) {
        allReviews = await res.json();
        if (allReviews.length > 0) renderReviews();
        else reviewTrack.innerHTML = '<p>No reviews yet.</p>';
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  }
});
