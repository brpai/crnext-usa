/* ══════════════════════════════════════════════════════════
   inventory-render.js — render CarNext inventory from the
   mirrored Super Speed Car feed (assets/data/inventory.json).
   Owns the filter UI (main.js's old filter init bails because
   the select IDs were renamed to inv*).
══════════════════════════════════════════════════════════ */
(function () {
  const grid = document.getElementById('inventoryGrid');
  if (!grid) return;

  const els = {
    make: document.getElementById('invMake'),
    yearFrom: document.getElementById('invYearFrom'),
    yearTo: document.getElementById('invYearTo'),
    miles: document.getElementById('invMiles'),
    price: document.getElementById('invPrice'),
    clear: document.getElementById('invClear'),
    count: document.getElementById('invCount'),
    loading: document.getElementById('invLoading'),
  };

  const fmt = n => Number(n).toLocaleString('en-US');
  let VEHICLES = [];

  function card(v) {
    const price = v.price > 0 ? '$' + fmt(v.price) : 'Consult';
    const est = v.price > 0 ? Math.round(v.price / 70) : 0;
    const name = ((v.make || '') + ' ' + String(v.title || v.name || '').replace(/^\d{4}\s*/, '')).trim();
    const miles = v.mileage ? fmt(v.mileage) + ' mi' : '—';
    return `
      <div class="vehicle-card glass-card" data-make="${v.make || ''}" data-year="${v.year || 0}" data-miles="${v.mileage || 0}" data-price="${v.price || 0}" data-body="${v.body || ''}">
        <div class="vc-image-wrap">
          <a href="${v.url}" target="_blank" rel="noopener" aria-label="${name}">
            <img src="${v.image}" alt="${name}" class="vc-image" loading="lazy" onerror="this.style.display='none'" />
          </a>
          ${v.body ? `<div class="vc-badge">${v.body}</div>` : ''}
        </div>
        <div class="vc-body">
          <div class="vc-meta">
            <span class="vc-year mono">${v.year || ''}</span>
            <span class="vc-dot">·</span>
            <span class="vc-miles mono">${miles}</span>
          </div>
          <h3 class="vc-name">${name}</h3>
          <div class="vc-pricing">
            <div class="vc-price mono">${price}</div>
            ${est ? `<div class="vc-finance">Est. $${fmt(est)}/mo</div>` : ''}
          </div>
          <div class="vc-actions">
            <button type="button" class="btn btn-primary btn-sm td-modal-trigger" data-i18n="vc_test_drive">Test Drive</button>
            <a href="${v.url}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Details</a>
          </div>
        </div>
      </div>`;
  }

  function applyFilters() {
    const make = els.make.value;
    const yFrom = parseInt(els.yearFrom.value, 10) || null;
    const yTo = parseInt(els.yearTo.value, 10) || null;
    const miles = els.miles.value;
    const price = els.price.value;
    let shown = 0;

    grid.querySelectorAll('.vehicle-card').forEach(c => {
      const cMake = c.dataset.make;
      const cYear = parseInt(c.dataset.year, 10) || 0;
      const cMiles = parseInt(c.dataset.miles, 10) || 0;
      const cPrice = parseInt(c.dataset.price, 10) || 0;
      let ok = true;
      if (make && cMake !== make) ok = false;
      if (yFrom && cYear < yFrom) ok = false;
      if (yTo && cYear > yTo) ok = false;
      if (miles) {
        const m = parseInt(miles, 10);
        if (m === 110001) { if (cMiles <= 110000) ok = false; }
        else if (cMiles > m) ok = false;
      }
      if (price) {
        const p = parseInt(price, 10);
        if (p === 20001) { if (cPrice <= 20000) ok = false; }
        else if (cPrice > p) ok = false;
      }
      c.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });

    if (els.count) els.count.textContent = `Showing ${shown} of ${VEHICLES.length} vehicles`;
  }

  function populateFilters() {
    // Makes
    const makes = [...new Set(VEHICLES.map(v => v.make).filter(Boolean))].sort();
    els.make.insertAdjacentHTML('beforeend', makes.map(m => `<option value="${m}">${m}</option>`).join(''));
    // Years (desc)
    const years = [...new Set(VEHICLES.map(v => v.year).filter(Boolean))].sort((a, b) => b - a);
    const opts = years.map(y => `<option value="${y}">${y}</option>`).join('');
    els.yearFrom.insertAdjacentHTML('beforeend', opts);
    els.yearTo.insertAdjacentHTML('beforeend', opts);
  }

  function applyURLParams() {
    const p = new URLSearchParams(location.search);
    const make = p.get('make');
    const max = p.get('max');
    if (make) {
      // match case-insensitively against option values
      const opt = [...els.make.options].find(o => o.value.toLowerCase() === make.toLowerCase());
      if (opt) els.make.value = opt.value;
    }
    if (max) {
      const maxN = parseInt(max, 10);
      const opt = [...els.price.options].find(o => parseInt(o.value, 10) === maxN);
      if (opt) els.price.value = opt.value;
    }
  }

  async function init() {
    try {
      const res = await fetch('assets/data/inventory.json', { cache: 'no-cache' });
      const data = await res.json();
      VEHICLES = (data && data.vehicles) || [];
    } catch (e) {
      VEHICLES = [];
    }

    if (els.loading) els.loading.remove();

    if (!VEHICLES.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:60px 0;">Inventory is being updated. Please check back shortly or contact us.</p>';
      if (els.count) els.count.textContent = '';
      return;
    }

    grid.innerHTML = VEHICLES.map(card).join('');
    populateFilters();
    applyURLParams();
    applyFilters();

    // Re-translate injected labels (Test Drive button)
    if (typeof setLanguage === 'function') {
      try { setLanguage(localStorage.getItem('cnx_lang') || 'en'); } catch (e) {}
    }

    // Filter listeners
    [els.make, els.yearFrom, els.yearTo, els.miles, els.price].forEach(s => s && s.addEventListener('change', applyFilters));
    if (els.clear) els.clear.addEventListener('click', () => {
      [els.make, els.yearFrom, els.yearTo, els.miles, els.price].forEach(s => { if (s) s.value = ''; });
      applyFilters();
    });

    // Test-drive modal (delegated — cards are dynamic)
    grid.addEventListener('click', e => {
      const trigger = e.target.closest('.td-modal-trigger');
      if (!trigger) return;
      const modal = document.getElementById('tdModal');
      if (!modal) return;
      const card = trigger.closest('.vehicle-card');
      const sel = document.getElementById('tdModalVehicle');
      const vName = card?.querySelector('.vc-name')?.textContent?.trim();
      if (vName && sel) {
        const match = [...sel.options].find(o => o.textContent.trim().toLowerCase().includes(vName.toLowerCase()));
        if (match) sel.value = match.value || match.textContent;
      }
      const s1 = modal.querySelector('[data-step="1"]'); const s2 = modal.querySelector('[data-step="2"]');
      if (s1) s1.hidden = false; if (s2) s2.hidden = true;
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('td-modal-open');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
