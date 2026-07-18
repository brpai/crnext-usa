/* ══════════════════════════════════════════════════════════
   vehicle.js — CarNext vehicle detail page.
   Reads ?slug= from the URL, loads assets/data/inventory.json,
   renders gallery + specs, and offers "Download photos" (ZIP)
   and "Copy details" — mirroring the Super Speed Car page.
══════════════════════════════════════════════════════════ */
(function () {
  const $ = id => document.getElementById(id);
  const grid = $('veh-content');
  if (!grid) return;

  const fmt = n => Number(n).toLocaleString('en-US');
  const dict = () => (typeof I18N !== 'undefined' ? (I18N[document.documentElement.lang] || I18N.en) : {});
  const t = (k, fb) => dict()[k] || fb;

  let vehicle = null;
  let images = [];
  let current = 0;

  /* ---------- Gallery ---------- */
  function show(i) {
    if (!images.length) return;
    current = (i + images.length) % images.length;
    $('veh-main').src = images[current];
    $('veh-counter').textContent = `${current + 1} / ${images.length}`;
    document.querySelectorAll('#veh-thumbs .thumb').forEach((el, idx) => {
      el.classList.toggle('active', idx === current);
    });
  }

  function renderThumbs() {
    $('veh-thumbs').innerHTML = images.slice(0, 12).map((src, i) => `
      <button type="button" class="thumb rounded-lg overflow-hidden aspect-[4/3] border border-brand-white/10" data-i="${i}">
        <img src="${src}" alt="" class="w-full h-full object-cover" loading="lazy" />
      </button>`).join('');
    document.querySelectorAll('#veh-thumbs .thumb').forEach(el => {
      el.addEventListener('click', () => show(parseInt(el.dataset.i, 10)));
    });
  }

  /* ---------- Download all photos as ZIP ---------- */
  function loadJSZip() {
    if (window.JSZip) return Promise.resolve(window.JSZip);
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
      s.onload = () => resolve(window.JSZip);
      s.onerror = () => reject(new Error('JSZip failed to load'));
      document.head.appendChild(s);
    });
  }

  function wireDownload() {
    const btn = $('download-photos');
    const label = $('download-photos-label');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      if (!images.length || btn.disabled) return;
      const original = t('veh.download', 'Download photos');
      btn.disabled = true;
      try {
        const JSZip = await loadJSZip();
        const zip = new JSZip();
        let done = 0;
        await Promise.all(images.map(async (url, i) => {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const ext = (url.split('?')[0].split('.').pop() || 'jpg').slice(0, 4);
              zip.file(`${String(i + 1).padStart(2, '0')}.${ext}`, await res.blob());
            }
          } catch { /* skip a failed photo, keep the rest */ }
          done++;
          label.textContent = `${done}/${images.length}…`;
        }));
        const blob = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${vehicle.slug || 'vehicle'}-photos.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 10000);
        label.textContent = t('veh.downloaded', 'Downloaded!');
      } catch {
        label.textContent = t('veh.failed', 'Failed — retry');
      }
      setTimeout(() => { label.textContent = original; btn.disabled = false; }, 2500);
    });
  }

  /* ---------- Copy details ---------- */
  function wireCopy() {
    const btn = $('copy-details');
    const label = $('copy-details-label');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const price = vehicle.price > 0 ? '$' + fmt(vehicle.price) : 'Ask for price';
      const text = [
        `${vehicle.year} ${vehicle.make} ${String(vehicle.title || '').replace(/^\d{4}\s*/, '')}`.trim(),
        `Price: ${price}`,
        vehicle.mileage ? `Mileage: ${fmt(vehicle.mileage)} mi` : '',
        vehicle.body ? `Body: ${vehicle.body}` : '',
        `More: ${location.href}`,
      ].filter(Boolean).join('\n');
      try {
        await navigator.clipboard.writeText(text);
        label.textContent = t('veh.copied', 'Copied!');
      } catch {
        label.textContent = t('veh.failed', 'Failed — retry');
      }
      setTimeout(() => { label.textContent = t('veh.copy', 'Copy details'); }, 2000);
    });
  }

  /* ---------- Render ---------- */
  function render() {
    const name = ((vehicle.make || '') + ' ' + String(vehicle.title || '').replace(/^\d{4}\s*/, '')).trim();
    document.title = `${vehicle.year} ${name} — CARNEXT USA`;
    $('veh-make').textContent = vehicle.make || '';
    $('veh-title').textContent = `${vehicle.year || ''} ${name}`.trim();
    $('veh-price').textContent = vehicle.price > 0 ? '$' + fmt(vehicle.price) : t('veh.askPrice', 'Ask for price');

    const specs = [
      [t('veh.year', 'Year'), vehicle.year || '—'],
      [t('veh.mileage', 'Mileage'), vehicle.mileage ? fmt(vehicle.mileage) + ' mi' : '—'],
      [t('veh.make', 'Make'), vehicle.make || '—'],
      [t('veh.body', 'Body'), vehicle.body || '—'],
    ];
    $('veh-specs').innerHTML = specs.map(([k, v]) => `
      <div class="bg-brand-black border border-brand-white/10 rounded-xl p-4">
        <p class="text-brand-white/50 text-xs uppercase tracking-wider font-bold">${k}</p>
        <p class="text-brand-white text-sm font-semibold mt-1">${v}</p>
      </div>`).join('');

    const msg = encodeURIComponent(`Hi! I'm interested in the ${vehicle.year} ${name}. Is it still available?`);
    $('veh-whatsapp').href = `https://wa.me/19785845424?text=${msg}`;

    renderThumbs();
    show(0);

    $('veh-loading').classList.add('hidden');
    grid.classList.remove('hidden');
    if (typeof applyLang === 'function') applyLang(document.documentElement.lang || 'en');
  }

  /* ---------- Init ---------- */
  async function init() {
    const slug = new URLSearchParams(location.search).get('slug');
    let data = null;
    try {
      const res = await fetch('assets/data/inventory.json', { cache: 'no-cache' });
      data = await res.json();
    } catch { /* handled below */ }

    vehicle = (data && data.vehicles || []).find(v => v.slug === slug) || null;

    if (!vehicle) {
      $('veh-loading').classList.add('hidden');
      $('veh-notfound').classList.remove('hidden');
      if (typeof applyLang === 'function') applyLang(document.documentElement.lang || 'en');
      return;
    }

    images = (vehicle.images && vehicle.images.length) ? vehicle.images : (vehicle.image ? [vehicle.image] : []);
    render();
    wireDownload();
    wireCopy();

    $('veh-prev').addEventListener('click', () => show(current - 1));
    $('veh-next').addEventListener('click', () => show(current + 1));
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setTimeout(render, 0)));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
