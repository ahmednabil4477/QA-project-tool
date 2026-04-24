import { destinations } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  const destContainer = document.getElementById('destinations-container');

  const renderDestinations = (country) => {
    const filtered = destinations.filter(d => d.country.toLowerCase() === country.toLowerCase()).slice(0, 9);
    if (filtered.length === 0) {
      destContainer.innerHTML = '<p style="color: var(--text-muted); padding: 40px 0; text-align: center; grid-column: 1/-1;">No destinations found for this country.</p>';
      return;
    }
    destContainer.innerHTML = filtered.map(dest => `
      <div class="dest-card">
        <div class="dest-card-img-wrapper">
          <img src="${dest.images}" alt="${dest.name}" class="dest-card-img" />
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
            <p class="dest-card-price">€${dest.cost.toLocaleString()}</p>
          </div>
          <a href="destination-${dest.country.toLowerCase()}.html?id=${dest.id}" class="btn-card-action">View Tour</a>
        </div>
      </div>
    `).join('');
  };

  if (destContainer) {
    renderDestinations('Italy');

    const tabs = document.querySelectorAll('.filter-tag');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => { t.classList.remove('active'); t.innerHTML = t.textContent.trim(); });
        const btn = e.currentTarget;
        btn.classList.add('active');
        const country = btn.textContent.trim();
        btn.innerHTML = `<span class="dot"></span>${country}`;
        renderDestinations(country);
      });
    });
  }

  // --- Dynamic Testimonials Logic ---
  const testiContainer = document.getElementById('testimonials-container');
  if (testiContainer) {
    let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    // PERMANENTLY REMOVE OLD DEMO REVIEWS IF THEY EXIST IN LOCALSTORAGE
    const demoNames = ['Elena Rossi', 'Julian Hayes', 'Marcus Chen'];
    const filteredReviews = reviews.filter(r => !demoNames.includes(r.name));
    
    // Update storage if we found and removed demo reviews
    if (filteredReviews.length !== reviews.length) {
      localStorage.setItem('reviews', JSON.stringify(filteredReviews));
      reviews = filteredReviews;
    }
    
    const lastThree = reviews.slice(-3).reverse();
    
    if (lastThree.length === 0) {
      testiContainer.innerHTML = '<p style="color: var(--text-muted); padding: 40px 0; text-align: center; grid-column: 1/-1; font-weight: 500;">No reviews yet. Be the first to share your experience!</p>';
    } else {
      testiContainer.classList.remove('grid-3');
      testiContainer.classList.add(`reviews-grid-${lastThree.length}`);
      
      testiContainer.innerHTML = lastThree.map(t => `
        <div class="testi-card">
          <div class="testi-header">
            <div>
              <h4 class="testi-name">${t.name}</h4>
              <p class="testi-loc">${t.location || 'TRAVELER'}</p>
            </div>
          </div>
          <div class="testi-stars">
             ${Array(t.rating).fill('<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>').join('')}
          </div>
          <p class="testi-text">${t.text}</p>
        </div>
      `).join('');
    }
  }
});
