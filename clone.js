/* ══════════════════════════════════════════════════════════
   CARNEXT USA — clone.js
   SSCar-structure clone: data injection, i18n (EN/PT/ES),
   header, mobile menu, test-drive form.
══════════════════════════════════════════════════════════ */

/* ---------- Featured vehicles (CarNext inventory) ---------- */
const VEHICLES = [
  { make: 'Mitsubishi', name: '2022 Outlander SE',   price: '$22,995', miles: '34,200', trans: 'Automatic', drive: 'AWD', badge: 'SUV',     img: 'vehicle-01.png' },
  { make: 'Jeep',       name: '2021 Grand Cherokee',  price: '$28,900', miles: '38,700', trans: 'Automatic', drive: '4x4', badge: 'SUV',     img: 'vehicle-06.png' },
  { make: 'Toyota',     name: '2022 Sienna XLE',      price: '$36,500', miles: '29,300', trans: 'eCVT',      drive: 'AWD', badge: 'Minivan', img: 'vehicle-05.png' },
  { make: 'Chrysler',   name: '2021 Pacifica',        price: '$25,490', miles: '41,800', trans: 'Automatic', drive: 'FWD', badge: 'Minivan', img: 'vehicle-02.png' },
  { make: 'Toyota',     name: '2020 Camry SE',        price: '$19,990', miles: '47,100', trans: 'Automatic', drive: 'FWD', badge: 'Sedan',   img: 'vehicle-04.png' },
  { make: 'Honda',      name: '2019 CR-V EX',         price: '$18,750', miles: '58,400', trans: 'CVT',       drive: 'AWD', badge: 'SUV',     img: 'vehicle-03.png' },
];

/* ---------- Reviews (PLACEHOLDER — replace with CarNext's real Google reviews) ---------- */
const REVIEWS = [
  { name: 'Marcus R.', flag: '🇺🇸', text: "Smoothest car-buying experience I've ever had. No pressure, total transparency, and the vehicle was exactly as described." },
  { name: 'Bruna S.',  flag: '🇧🇷', text: 'Atendimento impecável e bilíngue. Financiaram meu carro no mesmo dia, sem enrolação. Super recomendo!' },
  { name: 'Andrés M.', flag: '🇻🇪', text: 'Excelente atención. Me ayudaron con el financiamiento y todo el proceso fue rápido y honesto.' },
  { name: 'Sarah K.',  flag: '🇺🇸', text: 'Handled our trade-in and financing in one visit. Outstanding service from start to finish.' },
  { name: 'Pedro L.',  flag: '🇵🇷', text: '100% recomendado. Proceso fácil, buen precio y me entregaron el carro el mismo día.' },
  { name: 'James M.',  flag: '🇺🇸', text: 'As a rental company owner, CarNext gave us pricing and service no one else could match. Our go-to now.' },
];

/* ---------- i18n dictionaries (from SSCar translations, adapted) ---------- */
const I18N = {
  en: {
    'nav.inventory': 'Inventory', 'nav.experience': 'Business', 'nav.financing': 'Financing', 'nav.reviews': 'Reviews', 'nav.contact': 'Contact',
    'hero.chip': 'Orlando, FL · Premium Pre-Owned', 'hero.headline': "Drive What's Next in Orlando",
    'hero.subhead': 'Premium pre-owned vehicles. Transparent deals. Honest financing.',
    'hero.searchName': 'Search by make, model or year...', 'hero.searchMake': 'Make', 'hero.searchPrice': 'Max Price', 'hero.searchBtn': 'Search', 'hero.scroll': 'Scroll',
    'reviews.eyebrow': 'Customer Reviews', 'reviews.title': 'What Our Clients Say', 'reviews.subtitle': 'Real reviews from real customers', 'reviews.ratingNote': '· Rated by our customers', 'reviews.verified': 'Verified Purchase',
    'concierge.eyebrow': 'Corporate Program', 'concierge.title': 'Special Conditions for Companies', 'concierge.subtitle': 'Volume pricing, flexible terms, and priority service — designed for businesses that move fast',
    'concierge.c1t': 'Volume Pricing', 'concierge.c1d': 'Exclusive wholesale rates for companies acquiring 2 or more vehicles. The more you buy, the better the deal.',
    'concierge.c2t': 'Direct Delivery', 'concierge.c2d': 'We deliver directly to your location in the Orlando metro area. Zero logistics hassle for your team.',
    'concierge.c3t': 'Business Financing', 'concierge.c3d': 'Dedicated credit lines for corporate vehicle acquisitions. Fast approval and flexible terms built around your operation.',
    'concierge.c4t': 'Dedicated Support', 'concierge.c4d': 'A dedicated account manager for corporate partners. Fast turnaround on documentation, titles, and trade-ins.',
    'concierge.cta': 'Talk to a Business Specialist',
    'featured.eyebrow': 'Featured', 'featured.title': 'Featured Vehicles', 'featured.subtitle': 'Hand-picked, inspected and ready to drive', 'featured.viewAll': 'View All Inventory', 'featured.details': 'View Details', 'featured.financing': 'Finance This', 'featured.miles': 'miles',
    'fin.eyebrow': 'Flexible Financing', 'fin.title': 'Get Financed Today', 'fin.body': "Through our partnerships with multiple lenders, we can help anybody in Orlando, FL get financed! Good credit, rebuilding credit, first-time buyer? Our lenders work with all types of scores and situations.", 'fin.cta': 'Apply Now',
    'contact.title': 'Get in Touch', 'contact.address': 'Address', 'contact.directions': 'Get Directions', 'contact.hours': 'Business Hours', 'contact.hoursVal': 'Mon – Sat: 9:00 AM – 6:00 PM', 'contact.phone': 'Phone', 'contact.email': 'Email', 'contact.whatsapp': 'Chat on WhatsApp',
    'td.eyebrow': 'Schedule', 'td.title': 'Schedule a Test Drive', 'td.name': 'Full Name', 'td.phone': 'Phone', 'td.email': 'Email', 'td.vehicle': 'Vehicle of Interest', 'td.anyVehicle': 'Any vehicle / Open to suggestions', 'td.date': 'Preferred Date', 'td.time': 'Preferred Time', 'td.anyTime': 'Any time', 'td.message': 'Additional Notes', 'td.financing': "I'm interested in financing", 'td.success': "Test drive scheduled! We'll confirm within the hour.", 'td.submit': 'Schedule Now', 'td.whatsappFallback': 'Or contact us directly on WhatsApp',
    'footer.tagline': "Premium Pre-Owned. Orlando's Best.", 'footer.inventory': 'Inventory', 'footer.company': 'Company', 'footer.legal': 'Legal', 'footer.allInventory': 'All Vehicles', 'footer.testDrive': 'Test Drive', 'footer.contact': 'Contact', 'footer.privacy': 'Privacy Policy', 'footer.terms': 'Terms of Service', 'footer.rights': 'All rights reserved.', 'footer.by': 'Developed by',
  },
  pt: {
    'nav.inventory': 'Estoque', 'nav.experience': 'Empresas', 'nav.financing': 'Financiamento', 'nav.reviews': 'Avaliações', 'nav.contact': 'Contato',
    'hero.chip': 'Orlando, FL · Seminovos Premium', 'hero.headline': 'Encontre Seu Próximo Carro em Orlando',
    'hero.subhead': 'Seminovos premium. Negócios transparentes. Financiamento honesto.',
    'hero.searchName': 'Buscar por marca, modelo ou ano...', 'hero.searchMake': 'Marca', 'hero.searchPrice': 'Preço Máx.', 'hero.searchBtn': 'Buscar', 'hero.scroll': 'Rolar',
    'reviews.eyebrow': 'Avaliações', 'reviews.title': 'O Que Nossos Clientes Dizem', 'reviews.subtitle': 'Avaliações reais de clientes reais', 'reviews.ratingNote': '· Avaliado pelos nossos clientes', 'reviews.verified': 'Compra Verificada',
    'concierge.eyebrow': 'Programa Corporativo', 'concierge.title': 'Condições Especiais para Empresas', 'concierge.subtitle': 'Preço por volume, termos flexíveis e atendimento prioritário — feito para empresas que não param',
    'concierge.c1t': 'Preço por Volume', 'concierge.c1d': 'Valores exclusivos no atacado para empresas que adquirem 2 ou mais veículos. Quanto mais, melhor o negócio.',
    'concierge.c2t': 'Entrega Direta', 'concierge.c2d': 'Entregamos diretamente na sua empresa na região de Orlando. Sem complicação logística para sua equipe.',
    'concierge.c3t': 'Financiamento Empresarial', 'concierge.c3d': 'Linhas de crédito dedicadas para aquisições corporativas de veículos. Aprovação rápida e condições adaptadas à sua operação.',
    'concierge.c4t': 'Suporte Dedicado', 'concierge.c4d': 'Gerente de conta exclusivo para parceiros corporativos. Agilidade na documentação, títulos e trocas.',
    'concierge.cta': 'Falar com um Especialista Empresarial',
    'featured.eyebrow': 'Em Destaque', 'featured.title': 'Veículos em Destaque', 'featured.subtitle': 'Selecionados, inspecionados e prontos para rodar', 'featured.viewAll': 'Ver Todo o Estoque', 'featured.details': 'Ver Detalhes', 'featured.financing': 'Financiar Este', 'featured.miles': 'milhas',
    'fin.eyebrow': 'Financiamento Flexível', 'fin.title': 'Consiga seu Financiamento Hoje', 'fin.body': 'Através de parcerias com várias financeiras, conseguimos ajudar qualquer pessoa em Orlando, FL a financiar! Crédito bom, crédito em recuperação, primeira compra? Nossas financeiras trabalham com todos os tipos de score e situação.', 'fin.cta': 'Aplicar Agora',
    'contact.title': 'Entre em Contato', 'contact.address': 'Endereço', 'contact.directions': 'Como Chegar', 'contact.hours': 'Horário de Funcionamento', 'contact.hoursVal': 'Seg – Sáb: 9:00 – 18:00', 'contact.phone': 'Telefone', 'contact.email': 'E-mail', 'contact.whatsapp': 'Falar no WhatsApp',
    'td.eyebrow': 'Agendar', 'td.title': 'Agendar Test Drive', 'td.name': 'Nome Completo', 'td.phone': 'Telefone', 'td.email': 'E-mail', 'td.vehicle': 'Veículo de Interesse', 'td.anyVehicle': 'Qualquer veículo / Aberto a sugestões', 'td.date': 'Data Preferida', 'td.time': 'Horário Preferido', 'td.anyTime': 'Qualquer horário', 'td.message': 'Observações', 'td.financing': 'Tenho interesse em financiamento', 'td.success': 'Test drive agendado! Confirmaremos em breve.', 'td.submit': 'Agendar Agora', 'td.whatsappFallback': 'Ou fale direto no WhatsApp',
    'footer.tagline': 'Seminovos Premium. O Melhor de Orlando.', 'footer.inventory': 'Estoque', 'footer.company': 'Empresa', 'footer.legal': 'Jurídico', 'footer.allInventory': 'Todos os Veículos', 'footer.testDrive': 'Test Drive', 'footer.contact': 'Contato', 'footer.privacy': 'Política de Privacidade', 'footer.terms': 'Termos de Serviço', 'footer.rights': 'Todos os direitos reservados.', 'footer.by': 'Desenvolvido por',
  },
  es: {
    'nav.inventory': 'Inventario', 'nav.experience': 'Empresas', 'nav.financing': 'Financiamiento', 'nav.reviews': 'Reseñas', 'nav.contact': 'Contacto',
    'hero.chip': 'Orlando, FL · Seminuevos Premium', 'hero.headline': 'Encuentra Tu Próximo Auto en Orlando',
    'hero.subhead': 'Vehículos seminuevos premium. Tratos transparentes. Financiamiento honesto.',
    'hero.searchName': 'Buscar por marca, modelo o año...', 'hero.searchMake': 'Marca', 'hero.searchPrice': 'Precio Máx.', 'hero.searchBtn': 'Buscar', 'hero.scroll': 'Desliza',
    'reviews.eyebrow': 'Reseñas', 'reviews.title': 'Lo Que Dicen Nuestros Clientes', 'reviews.subtitle': 'Reseñas reales de clientes reales', 'reviews.ratingNote': '· Valorado por nuestros clientes', 'reviews.verified': 'Compra Verificada',
    'concierge.eyebrow': 'Programa Corporativo', 'concierge.title': 'Condiciones Especiales para Empresas', 'concierge.subtitle': 'Precios por volumen, términos flexibles y servicio prioritario — diseñado para empresas que no se detienen',
    'concierge.c1t': 'Precio por Volumen', 'concierge.c1d': 'Tarifas exclusivas al por mayor para empresas que adquieren 2 o más vehículos. Cuanto más, mejor el trato.',
    'concierge.c2t': 'Entrega Directa', 'concierge.c2d': 'Entregamos directamente en tu empresa en el área de Orlando. Sin complicaciones logísticas para tu equipo.',
    'concierge.c3t': 'Financiamiento Empresarial', 'concierge.c3d': 'Líneas de crédito dedicadas para adquisiciones corporativas de vehículos. Aprobación rápida y condiciones adaptadas a tu operación.',
    'concierge.c4t': 'Soporte Dedicado', 'concierge.c4d': 'Gerente de cuenta exclusivo para socios corporativos. Agilidad en documentación, títulos y permutas.',
    'concierge.cta': 'Hablar con un Especialista Empresarial',
    'featured.eyebrow': 'Destacados', 'featured.title': 'Vehículos Destacados', 'featured.subtitle': 'Seleccionados, inspeccionados y listos para manejar', 'featured.viewAll': 'Ver Todo el Inventario', 'featured.details': 'Ver Detalles', 'featured.financing': 'Financiar Éste', 'featured.miles': 'millas',
    'fin.eyebrow': 'Financiamiento Flexible', 'fin.title': 'Obtén tu Financiamiento Hoy', 'fin.body': '¡A través de alianzas con varios prestamistas, podemos ayudar a cualquier persona en Orlando, FL a financiar! ¿Buen crédito, crédito en recuperación, primer comprador? Nuestros prestamistas trabajan con todo tipo de puntajes y situaciones.', 'fin.cta': 'Aplicar Ahora',
    'contact.title': 'Contáctanos', 'contact.address': 'Dirección', 'contact.directions': 'Cómo Llegar', 'contact.hours': 'Horario de Atención', 'contact.hoursVal': 'Lun – Sáb: 9:00 AM – 6:00 PM', 'contact.phone': 'Teléfono', 'contact.email': 'Correo', 'contact.whatsapp': 'Chatear en WhatsApp',
    'td.eyebrow': 'Agendar', 'td.title': 'Agendar Test Drive', 'td.name': 'Nombre Completo', 'td.phone': 'Teléfono', 'td.email': 'Correo', 'td.vehicle': 'Vehículo de Interés', 'td.anyVehicle': 'Cualquier vehículo / Abierto a sugerencias', 'td.date': 'Fecha Preferida', 'td.time': 'Hora Preferida', 'td.anyTime': 'Cualquier hora', 'td.message': 'Notas Adicionales', 'td.financing': 'Me interesa el financiamiento', 'td.success': '¡Test drive agendado! Confirmaremos en breve.', 'td.submit': 'Agendar Ahora', 'td.whatsappFallback': 'O contáctanos directamente por WhatsApp',
    'footer.tagline': 'Seminuevos Premium. Lo Mejor de Orlando.', 'footer.inventory': 'Inventario', 'footer.company': 'Empresa', 'footer.legal': 'Legal', 'footer.allInventory': 'Todos los Vehículos', 'footer.testDrive': 'Test Drive', 'footer.contact': 'Contacto', 'footer.privacy': 'Política de Privacidad', 'footer.terms': 'Términos de Servicio', 'footer.rights': 'Todos los derechos reservados.', 'footer.by': 'Desarrollado por',
  },
};

/* ---------- Star SVG ---------- */
const STAR = '<svg class="w-4 h-4 text-brand-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';

/* ---------- Inject featured vehicles ---------- */
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  grid.innerHTML = VEHICLES.map((v, i) => `
    <article class="group bg-brand-black border border-brand-white/10 rounded-2xl overflow-hidden hover:border-brand-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <a href="inventory.html" class="block relative overflow-hidden aspect-[16/10]">
        <img src="assets/images/vehicles/${v.img}" alt="${v.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="${i === 0 ? 'eager' : 'lazy'}" width="800" height="500" onerror="this.style.opacity=0" />
        <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span class="bg-brand-yellow text-brand-black text-xs font-bold px-2.5 py-1 rounded-full">${v.badge}</span>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-black to-transparent"></div>
      </a>
      <div class="p-5">
        <div class="flex items-start justify-between gap-2 mb-3">
          <div>
            <p class="text-brand-white/50 text-xs uppercase tracking-wider">${v.make}</p>
            <h3 class="text-brand-white font-bold text-lg leading-tight">${v.name}</h3>
          </div>
          <p class="text-brand-white font-black text-sm uppercase tracking-wider flex-shrink-0">${v.price}</p>
        </div>
        <div class="flex items-center gap-3 text-brand-white/40 text-xs mb-5">
          <span class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            ${v.miles} <span data-i18n="featured.miles">miles</span>
          </span>
          <span>·</span><span>${v.trans}</span><span>·</span><span>${v.drive}</span>
        </div>
        <div class="flex gap-2">
          <a href="inventory.html" data-i18n="featured.details" class="flex-1 text-center text-sm font-semibold text-brand-white bg-brand-white/10 hover:bg-brand-white hover:text-brand-black px-4 py-2.5 rounded-xl transition-all">View Details</a>
          <a href="#test-drive" data-i18n="featured.financing" class="flex-1 text-center text-sm font-semibold text-brand-black bg-brand-yellow hover:bg-brand-amber px-4 py-2.5 rounded-xl transition-all">Finance This</a>
        </div>
      </div>
    </article>`).join('');
}

/* ---------- Inject reviews ---------- */
function renderReviews() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;
  grid.innerHTML = REVIEWS.map(r => `
    <div class="bg-brand-black border border-brand-white/10 rounded-2xl p-6 hover:border-brand-white/20 transition-all duration-300 relative">
      <div class="text-brand-white/10 text-6xl font-serif leading-none absolute top-4 right-6 pointer-events-none">"</div>
      <div class="flex mb-4">${STAR.repeat(5)}</div>
      <p class="text-brand-white/70 text-sm leading-relaxed mb-5 relative z-10">"${r.text}"</p>
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-brand-white/10 border border-brand-white/20 flex items-center justify-center text-lg">${r.flag}</div>
        <div>
          <p class="text-brand-white font-semibold text-sm">${r.name}</p>
          <p class="text-brand-white/30 text-xs" data-i18n="reviews.verified">Verified Purchase</p>
        </div>
      </div>
    </div>`).join('');
}

/* ---------- Rating stars ---------- */
function renderRatingStars() {
  const el = document.getElementById('rating-stars');
  if (el) el.innerHTML = STAR.replace(/w-4 h-4/g, 'w-5 h-5').repeat(5);
}

/* ---------- i18n ---------- */
function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = dict[el.getAttribute('data-i18n')];
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = dict[el.getAttribute('data-i18n-ph')];
    if (v != null) el.setAttribute('placeholder', v);
  });
  document.querySelectorAll('.lang-btn').forEach(b => {
    const active = b.getAttribute('data-lang') === lang;
    b.classList.toggle('text-brand-white', active);
    b.classList.toggle('text-brand-white/50', !active);
  });
  try { localStorage.setItem('cnx-lang', lang); } catch (e) {}
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderReviews();
  renderRatingStars();

  const saved = (() => { try { return localStorage.getItem('cnx-lang'); } catch (e) { return null; } })();
  applyLang(saved && I18N[saved] ? saved : 'en');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.getAttribute('data-lang')));
  });

  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Header scroll: transparent -> solid */
  const header = document.getElementById('site-header');
  const inner = document.getElementById('header-inner');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('bg-brand-black/95', 'shadow-lg', 'backdrop-blur-md');
      inner.classList.replace('py-4', 'py-3');
    } else {
      header.classList.remove('bg-brand-black/95', 'shadow-lg', 'backdrop-blur-md');
      inner.classList.replace('py-3', 'py-4');
    }
  }, { passive: true });

  /* Mobile menu */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const b1 = document.getElementById('burger-1'), b2 = document.getElementById('burger-2'), b3 = document.getElementById('burger-3');
  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
    b1.classList.remove('rotate-45', 'translate-y-2'); b2.classList.remove('opacity-0'); b3.classList.remove('-rotate-45', '-translate-y-2');
  };
  menuBtn.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('hidden');
    if (open) { closeMenu(); return; }
    mobileMenu.classList.remove('hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    b1.classList.add('rotate-45', 'translate-y-2'); b2.classList.add('opacity-0'); b3.classList.add('-rotate-45', '-translate-y-2');
  });
  mobileMenu.querySelectorAll('a, .lang-btn').forEach(a => a.addEventListener('click', closeMenu));

  /* Test-drive form -> mailto + success message */
  const form = document.getElementById('td-form');
  const success = document.getElementById('td-success');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.website && form.website.value) return; // honeypot
    const d = Object.fromEntries(new FormData(form).entries());
    const lang = document.documentElement.lang || 'en';
    const subject = encodeURIComponent('Test Drive Request — CarNext USA');
    const body = encodeURIComponent(
      `Name: ${d.name || ''}\nPhone: ${d.phone || ''}\nEmail: ${d.email || ''}\n` +
      `Vehicle: ${d.vehicle || 'Any'}\nDate: ${d.preferredDate || '-'}\nTime: ${d.preferredTime || '-'}\n` +
      `Interested in financing: ${d.interestFinancing ? 'Yes' : 'No'}\n\nNotes: ${d.message || ''}`
    );
    window.location.href = `mailto:nex@carnextusa.com?subject=${subject}&body=${body}`;
    success.textContent = (I18N[lang] || I18N.en)['td.success'];
    success.classList.remove('hidden');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.reset();
  });
});
