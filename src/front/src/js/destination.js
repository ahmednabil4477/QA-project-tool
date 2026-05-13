import { API_URL } from './config.js';

// Visual card images per tag (used to enrich the destination page)
const VISUAL_IMAGES = [
  { tag: 'ARCHITECTURAL HERITAGE', img: 'https://images.unsplash.com/photo-1549646849-fb93be1d4a04?q=80&w=800&auto=format&fit=crop' },
  { tag: 'LOCAL CUISINE',          img: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?q=80&w=800&auto=format&fit=crop' },
  { tag: 'NATURAL WONDERS',        img: 'https://images.unsplash.com/photo-1433477155337-9aea4e790195?q=80&w=800&auto=format&fit=crop' },
  { tag: 'CULTURAL EXPERIENCES',   img: 'https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=800&auto=format&fit=crop' },
];

document.addEventListener('DOMContentLoaded', async () => {

  // ── Auth Check ───────────────────────────────────────────────
  const token    = localStorage.getItem('token');
  const user     = JSON.parse(localStorage.getItem('user') || 'null');
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

  // ── Get destination ID from URL ──────────────────────────────
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.body.innerHTML = '<div style="padding:100px;text-align:center;font-size:1.5rem;">Destination not found.</div>';
    return;
  }

  try {
    const res  = await fetch(`${API_URL}/destinations/${id}`);
    const dest = await res.json();

    if (!res.ok) throw new Error('Destination not found');

    // ── Populate hero ────────────────────────────────────────
    document.title = `Horizon – ${dest.name}`;
    document.getElementById('dest-bg').src       = dest.imageUrl || '';
    document.getElementById('dest-bg').alt       = dest.name;
    document.getElementById('dest-country').innerText = dest.country.toUpperCase();
    document.getElementById('dest-title').innerText   = dest.name;
    document.getElementById('dest-desc').innerText    = dest.description || '';

    // ── Body paragraphs ──────────────────────────────────────
    const sentences = (dest.description || '').split('. ');
    const mid = Math.ceil(sentences.length / 2);
    document.getElementById('dest-body-p1').innerText = sentences.slice(0, mid).join('. ') + '.';
    document.getElementById('dest-body-p2').innerText = sentences.slice(mid).join('. ') + (sentences.slice(mid).length ? '.' : '');

    // ── Visual cards (2 random from palette) ────────────────
    const picks = VISUAL_IMAGES.sort(() => 0.5 - Math.random()).slice(0, 2);
    document.getElementById('visual-cards').innerHTML = picks.map(p => `
      <div class="v-card">
        <img src="${p.img}" class="v-card-img" alt="${p.tag}" />
        <div class="v-card-content">
          <span class="v-card-tag">${p.tag}</span>
          <h3 class="v-card-title">${dest.name} – ${p.tag.split(' ').map(w => w[0] + w.slice(1).toLowerCase()).join(' ')}</h3>
        </div>
      </div>
    `).join('');



    document.getElementById('book-flight-btn').addEventListener('click', () => {
      window.location.href = `flights.html?destination=${encodeURIComponent(dest.name)}`;
    });

  } catch (err) {
    console.error('Error fetching destination:', err);
    document.body.innerHTML = '<div style="padding:100px;text-align:center;font-size:1.5rem;">Failed to load destination. Please try again.</div>';
  }
});
