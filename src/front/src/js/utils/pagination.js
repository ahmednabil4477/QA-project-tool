/**
 * Builds pagination buttons and wires click handlers.
 *
 * @param {object} opts
 * @param {HTMLElement} opts.controls   - The container element for page buttons.
 * @param {HTMLElement} opts.textEl     - Element that shows "Showing X to Y of Z".
 * @param {number}      opts.total      - Total number of items.
 * @param {number}      opts.current    - Current page (1-based).
 * @param {number}      opts.perPage    - Items per page.
 * @param {string}      opts.label      - Label word used in the count text (e.g. "bookings").
 * @param {Function}    opts.onPage     - Callback invoked with the new page number.
 */
export const renderPagination = ({ controls, textEl, total, current, perPage, label, onPage }) => {
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (current - 1) * perPage;
  const end = Math.min(startIndex + perPage, total);

  if (textEl) {
    textEl.textContent = `Showing ${total > 0 ? startIndex + 1 : 0} to ${end} of ${total} ${label}`;
  }

  if (!controls) return;

  if (totalPages <= 1) {
    controls.innerHTML = '';
    return;
  }

  controls.innerHTML = '';

  const makeBtn = (label, page, disabled, active) => {
    const btn = document.createElement('button');
    btn.className = `page-btn${active ? ' active' : ''}`;
    btn.textContent = label;
    btn.disabled = disabled;
    if (!disabled) btn.addEventListener('click', () => onPage(page));
    return btn;
  };

  controls.appendChild(makeBtn('Prev', current - 1, current === 1, false));
  for (let i = 1; i <= totalPages; i++) {
    controls.appendChild(makeBtn(String(i), i, false, i === current));
  }
  controls.appendChild(makeBtn('Next', current + 1, current === totalPages, false));
};
