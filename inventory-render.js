/* ══════════════════════════════════════════════════════════
   inventory-render.js — render CarNext inventory (mirrored from
   Super Speed Car) into the Tailwind inventory page.
   Uses clone.js's global applyLang() + I18N for translations.
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

  const dict = () => (typeof I18N !== 'undefined' ? (I18N[document.documentElement.lang] || I18N.en) : {});

  function card(v) {
    const price = v.price > 0 ? '$' + fmt(v.price) : '—';
    const miles = v.mileage ? fmt(v.mileage) + ' mi' : '—';
    const name = ((v.make || '') + ' ' + String(v.title || v.name || '').replace(/^\d{4}\s*/, '')).trim();
    const badge = v.body || '';
    return `
      <article class="vehicle-card group bg-brand-black border border-brand-white/10 rounded-2xl overflow-hidden hover:border-brand-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" data-make="${v.make || ''}" data-year="${v.year || 0}" data-miles="${v.mileage || 0}" data-price="${v.price || 0}">
        <a href="${v.url}" target="_blank" rel="noopener" class="block relative overflow-hidden aspect-[16/10]">
          <img src="${v.image}" alt="${name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.style.opacity=0" />
          ${badge ? `<div class="absolute top-3 left-3"><span class="bg-brand-yellow text-brand-black text-xs font-bold px-2.5 py-1 rounded-full">${badge}</span></div>` : ''}
        </a>
        <div class="p-5">
          <p class="text-brand-white/50 text-xs uppercase tracking-wider">${v.make || ''}</p>
          <h3 class="text-brand-white font-bold text-base leading-tight mt-0.5">${name}</h3>
          <div class="flex items-center justify-between mt-3">
            <p class="text-brand-white font-black text-sm uppercase tracking-wider">${price}</p>
            <p class="text-brand-white/40 text-xs">${miles}</p>
          </div>
          <div class="flex gap-2 mt-4">
            <a href="${v.url}" target="_blank" rel="noopener" class="flex-1 text-center text-sm font-semibold text-brand-white bg-brand-white/10 hover:bg-brand-white hover:text-brand-black px-3 py-2.5 rounded-xl transition-all" data-i18n="invf.details">Details</a>
            <a href="index.html#test-drive" class="flex-1 text-center text-sm font-semibold text-brand-black bg-brand-yellow hover:bg-brand-amber px-3 py-2.5 rounded-xl transition-all" data-i18n="invf.finance">Finance This</a>
          </div>
        </div>
      </article>`;
  }

  function updateCount(shown) {
    if (!els.count) return;
    const d = dict();
    const showing = d['inv.showing'] || 'Showing', of = d['inv.of'] || 'of', veh = d['inv.vehicles'] || 'vehicles';
    els.count.textContent = `${showing} ${shown} ${of} ${VEHICLES.length} ${veh}`;
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
        if (m === 120001) { if (cMiles <= 120000) ok = false; }
        else if (cMiles > m) ok = false;
      }
      if (price) {
        const p = parseInt(price, 10);
        if (p === 75001) { if (cPrice <= 75000) ok = false; }
        else if (cPrice > p) ok = false;
      }
      c.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    updateCount(shown);
  }

  function populateFilters() {
    const makes = [...new Set(VEHICLES.map(v => v.make).filter(Boolean))].sort();
    els.make.insertAdjacentHTML('beforeend', makes.map(m => `<option value="${m}">${m}</option>`).join(''));
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
      const opt = [...els.make.options].find(o => o.value.toLowerCase() === make.toLowerCase());
      if (opt) els.make.value = opt.value;
    }
    if (max) {
      const maxN = parseInt(max, 10);
      // pick the smallest bracket >= requested max
      const brackets = [...els.price.options].map(o => parseInt(o.value, 10)).filter(n => n && n < 75001).sort((a, b) => a - b);
      const pick = brackets.find(b => b >= maxN);
      if (pick) els.price.value = String(pick);
    }
  }

  async function init() {
    try {
      const res = await fetch('assets/data/inventory.json', { cache: 'no-cache' });
      const data = await res.json();
      VEHICLES = (data && data.vehicles) || [];
    } catch (e) { VEHICLES = []; }

    if (els.loading) els.loading.remove();

    if (!VEHICLES.length) {
      grid.innerHTML = `<p class="col-span-full text-center text-brand-white/50 py-16" data-i18n="inv.empty">Inventory is being updated. Please check back shortly.</p>`;
      if (typeof applyLang === 'function') applyLang(document.documentElement.lang || 'en');
      if (els.count) els.count.textContent = '';
      return;
    }

    grid.innerHTML = VEHICLES.map(card).join('');
    populateFilters();
    applyURLParams();
    applyFilters();
    if (typeof applyLang === 'function') applyLang(document.documentElement.lang || 'en');

    [els.make, els.yearFrom, els.yearTo, els.miles, els.price].forEach(s => s && s.addEventListener('change', applyFilters));
    if (els.clear) els.clear.addEventListener('click', () => {
      [els.make, els.yearFrom, els.yearTo, els.miles, els.price].forEach(s => { if (s) s.value = ''; });
      applyFilters();
    });
    // Re-localize the count when language changes
    document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setTimeout(applyFilters, 0)));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
