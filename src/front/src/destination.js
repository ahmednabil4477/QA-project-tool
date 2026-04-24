import { destinations } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('dest-content');
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));

  const dest = destinations.find(d => d.id === id) || destinations[0];

  if (container) {
    container.innerHTML = `
      <!-- Hero Section -->
      <div class="dest-hero">
        <img src="${dest.images}" class="dest-hero-bg" alt="${dest.name}"/>
        <div class="dest-hero-overlay"></div>
        <div class="container dest-hero-content">
          <span class="dest-tag">${dest.tagline || dest.country.toUpperCase()}</span>
          <h1 class="dest-main-title">${dest.name}</h1>
          <p class="dest-sub-title">${dest.description || 'Discover the ultimate expression of luxury and heritage in this curated destination.'}</p>
        </div>
      </div>

      <!-- Content Section -->
      <div class="container">
        <div class="dest-grid">
          
          <div class="dest-text" style="grid-column: 1 / 2;">
            <h2>The Horizon Experience</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
              <p>Experience the legendary charm of ${dest.name} through our curated lens. From private tours to hidden gems, we provide access to the most exclusive corners. Every detail is meticulously planned.</p>
              <ul>
                ${(dest.highlights || []).map(h => `<li style="margin-bottom: 12px; color: var(--text-muted); font-size: 0.95rem;">• ${h}</li>`).join('')}
              </ul>
            </div>
            
            <div class="visual-cards">
              ${(dest.vCards || []).map(v => `
                <div class="v-card">
                  <img src="${v.img}" class="v-card-img" alt="${v.title}" />
                  <div class="v-card-content">
                    <span class="v-card-tag">${v.tag}</span>
                    <h3 class="v-card-title">${v.title}</h3>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="grid-column: 1 / -1; margin-top: 20px;">
             <style>
                @media(min-width: 1024px) {
                   .dest-sidebar-wrapper { grid-column: 2 / 3; grid-row: 1 / 2; }
                }
             </style>
             <div class="dest-sidebar-wrapper">
                <div class="dest-sidebar">
                  <h3>Plan Your Escape</h3>
                  <button class="btn-primary" id="bookFlightBtn">
                    Book Flight
                    <svg style="width: 20px; height: 20px; margin-left: 8px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </button>
                  <div class="dest-sidebar-footer">
                    SECURE CHECKOUT • 24/7 CONCIERGE
                  </div>
                </div>
             </div>
          </div>
          
      </div>
    `;


    const bookBtn = document.getElementById('bookFlightBtn');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        window.location.href = `flights.html?to=${encodeURIComponent(dest.name)}`;
      });
    }
  }
});
