/**
 * sync-inventory.mjs — mirror Super Speed Car's public inventory into CarNext.
 *
 * Fetches superspeedcar.com/inventory (server-rendered), parses the vehicle
 * cards, and writes assets/data/inventory.json. Pure Node (global fetch, Node 18+),
 * no dependencies — so GitHub Actions can run it without `npm install`.
 *
 * Run locally:  node scripts/sync-inventory.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = 'https://superspeedcar.com/inventory';
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'data', 'inventory.json');

const attr = (block, name) => {
  const m = block.match(new RegExp(`data-${name}="([^"]*)"`, 'i'));
  return m ? m[1] : '';
};

function titleCase(s) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

async function main() {
  console.log('[sync] fetching', SOURCE);
  const res = await fetch(SOURCE, { headers: { 'User-Agent': 'CarNextInventorySync/1.0' } });
  if (!res.ok) throw new Error(`fetch failed: HTTP ${res.status}`);
  const html = await res.text();

  // Each vehicle is an <article class="vehicle-card" data-*...> ... </article>
  const articles = html.match(/<article[^>]*class="vehicle-card[^"]*"[\s\S]*?<\/article>/gi) || [];
  console.log('[sync] found', articles.length, 'vehicle cards');

  const vehicles = [];
  for (const a of articles) {
    const slugM = a.match(/href="\/inventory\/([^"]+)"/i);
    const imgM = a.match(/<img[^>]+src="([^"]+)"/i);
    const titleM = a.match(/<h3[^>]*>([^<]+)<\/h3>/i);
    const slug = slugM ? slugM[1] : '';
    if (!slug) continue;

    const year = parseInt(attr(a, 'year'), 10) || null;
    const make = attr(a, 'make');
    const price = parseInt(attr(a, 'price'), 10) || 0;
    const mileage = parseInt(attr(a, 'mileage'), 10) || 0;
    const body = attr(a, 'body');
    const name = attr(a, 'name'); // lowercase full name
    const title = titleM ? titleM[1].trim() : titleCase(name); // "2023 Durango SRT ..."
    const image = imgM ? imgM[1] : '';

    vehicles.push({
      slug,
      url: `https://superspeedcar.com/inventory/${slug}`,
      year, make, body, price, mileage,
      title,
      name,
      image,
    });
  }

  // De-dupe by slug (cards are duplicated in markup)
  const seen = new Set();
  const unique = vehicles.filter(v => (seen.has(v.slug) ? false : seen.add(v.slug)));

  // Sort: photos first, then newest year, then price desc
  unique.sort((a, b) => (b.year || 0) - (a.year || 0) || (b.price || 0) - (a.price || 0));

  const payload = {
    source: SOURCE,
    updatedAt: new Date().toISOString(),
    count: unique.length,
    vehicles: unique,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
  console.log('[sync] wrote', unique.length, 'vehicles ->', OUT);

  if (unique.length === 0) {
    console.error('[sync] WARNING: 0 vehicles parsed — source markup may have changed.');
    process.exit(2);
  }
}

main().catch(err => { console.error('[sync] ERROR:', err.message); process.exit(1); });
