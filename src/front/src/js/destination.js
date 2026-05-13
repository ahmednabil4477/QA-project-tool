import { initPublicNav } from './utils/auth.js';
import { apiGet } from './utils/api.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const VISUAL_IMAGES = [
  { tag: 'ARCHITECTURAL HERITAGE', img: 'https://images.unsplash.com/photo-1549646849-fb93be1d4a04?q=80&w=800&auto=format&fit=crop' },
  { tag: 'LOCAL CUISINE',          img: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?q=80&w=800&auto=format&fit=crop' },
  { tag: 'NATURAL WONDERS',        img: 'https://images.unsplash.com/photo-1433477155337-9aea4e790195?q=80&w=800&auto=format&fit=crop' },
  { tag: 'CULTURAL EXPERIENCES',   img: 'https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=800&auto=format&fit=crop' },
];

// ── Templates ─────────────────────────────────────────────────────────────────

const visualCardHTML = (dest, pick) => `
  <div class="v-card">
    <img src="${pick.img}" class="v-card-img" alt="${pick.tag}" />
    <div class="v-card-content">
      <span class="v-card-tag">${pick.tag}</span>
      <h3 class="v-card-title">
        ${dest.name} – ${pick.tag.split(' ').map((w) => w[0] + w.slice(1).toLowerCase()).join(' ')}
      </h3>
    </div>
  </div>
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

const splitParagraphs = (text) => {
  const sentences = (text || '').split('. ');
  const mid = Math.ceil(sentences.length / 2);
  return [
    sentences.slice(0, mid).join('. ') + '.',
    sentences.slice(mid).join('. ') + (sentences.slice(mid).length ? '.' : ''),
  ];
};

const randomPicks = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  initPublicNav();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.body.innerHTML = '<div style="padding:100px;text-align:center;font-size:1.5rem;">Destination not found.</div>';
    return;
  }

  try {
    const res  = await apiGet(`/destinations/${id}`);
    const dest = await res.json();
    if (!res.ok) throw new Error('Destination not found');

    // Page title & hero
    document.title = `Horizon – ${dest.name}`;
    const bgImg = document.getElementById('dest-bg');
    if (bgImg) { bgImg.src = dest.imageUrl || ''; bgImg.alt = dest.name; }

    const setText = (elId, text) => { const el = document.getElementById(elId); if (el) el.textContent = text; };
    setText('dest-country', dest.country.toUpperCase());
    setText('dest-title',   dest.name);
    setText('dest-desc',    dest.description || '');

    // Body paragraphs
    const [p1, p2] = splitParagraphs(dest.description);
    setText('dest-body-p1', p1);
    setText('dest-body-p2', p2);

    // Visual cards
    const visualCards = document.getElementById('visual-cards');
    if (visualCards) {
      visualCards.innerHTML = randomPicks(VISUAL_IMAGES, 2)
        .map((pick) => visualCardHTML(dest, pick))
        .join('');
    }

    // Book flight button
    document.getElementById('book-flight-btn')
      ?.addEventListener('click', () => {
        window.location.href = `flights.html?destination=${encodeURIComponent(dest.name)}`;
      });

  } catch (err) {
    console.error('Error fetching destination:', err);
    document.body.innerHTML = '<div style="padding:100px;text-align:center;font-size:1.5rem;">Failed to load destination. Please try again.</div>';
  }
});
