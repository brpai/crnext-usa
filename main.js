/* ═══════════════════════════════════════════════════
   CARNEXT USA — main.js
═══════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ── i18n — Language Switcher ───────────────────────── */
const TRANSLATIONS = {
  en: {
    /* Nav */
    nav_inventory: 'Inventory', nav_fleet: 'Rental Cars', nav_airport: 'Airport Pickup',
    nav_contact: 'Contact Us', nav_cta: 'Schedule Test Drive',
    /* Hero tags */
    tag_inspected: 'Inspected Vehicles', tag_financing: 'Flexible Financing',
    tag_family: 'Family Ready SUVs', tag_tradein: 'Trade-In Available', tag_approval: 'Fast Approval',
    /* Hero */
    hero_title: 'Find Your Next Car', hero_find: 'Find Your', hero_next: 'Next', hero_car: 'Car', hero_title_gradient: 'with Confidence',
    hero_sub: 'Premium pre-owned vehicles, transparent deals, and a dealership experience designed around you.',
    hero_cta1: 'View Inventory', hero_cta2: 'Schedule Test Drive', hero_cta3: 'Search on CarGurus',
    stat_vehicles: 'Vehicles Available', stat_satisfaction: 'Customer Satisfaction', stat_financing: 'Fast Financing',
    scroll: 'Scroll',
    /* Airport */
    airport_eyebrow: 'CONCIERGE DELIVERY',
    airport_title: 'We Pick You Up',
    airport_title_gradient: 'at the Airport',
    airport_desc: 'Just landed in Orlando? We come to you. Our team will meet you at the airport, escort you to our showroom, and make sure you drive home the same day — stress-free.',
    airport_feat1_title: 'Schedule in Advance', airport_feat1_text: 'Tell us your flight details. We\'ll coordinate pickup and have your vehicle ready.',
    airport_feat2_title: 'Same-Day Purchase', airport_feat2_text: 'Browse online, choose your vehicle, and finalize the deal the moment you arrive.',
    airport_feat3_title: 'Fully Bilingual Team', airport_feat3_text: 'English, Portuguese, and Spanish. We speak your language from arrival to delivery.',
    airport_feat4_title: 'Orlando, FL Coverage', airport_feat4_text: 'MCO Airport and all surrounding areas. Convenient, professional, and personal.',
    airport_cta: 'Book Airport Pickup',
    /* Fleet */
    fleet_eyebrow: 'FLEET & RENTAL PROGRAM',
    fleet_title: 'Exclusive Conditions<br /><span class="text-gradient">for Rental Companies</span>',
    fleet_desc: 'We understand the demands of rental and fleet operators. CARNEXT USA offers bulk pricing, priority inspection, and dedicated account management for your business.',
    fleet_c1_title: 'Volume Pricing', fleet_c1_text: 'Competitive bulk discounts starting at 5+ units with dedicated fleet pricing tiers.',
    fleet_c2_title: 'Inspected & Certified', fleet_c2_text: 'Every vehicle passes our 150-point inspection before fleet delivery.',
    fleet_c3_title: 'Fleet Financing', fleet_c3_text: 'Tailored financing solutions with extended terms and flexible payment structures.',
    fleet_c4_title: 'Dedicated Account Manager', fleet_c4_text: 'Personal point of contact for quotes, logistics, and ongoing fleet support.',
    fleet_cta: 'Talk to Fleet Team',
    /* Pain / Trust */
    pain_eyebrow: 'THE OLD WAY',
    pain_title: 'Tired of the', pain_title_gradient: 'Same Old Dealership?',
    pain_1_title: 'Poor After-Sales Support', pain_1_text: 'You buy, then they forget you exist. You\'re just another number on their list.',
    pain_2_title: 'Predatory Financing', pain_2_text: 'Rates designed to trap, not help. Complex terms, high interest, buried clauses.',
    pain_3_title: 'Unreliable Vehicles', pain_3_text: 'No inspection history, unknown accidents, and zero accountability.',
    pain_4_title: 'Pressure Tactics', pain_4_text: 'Aggressive sales, false urgency, and a process that ignores your needs.',
    solution_eyebrow: 'THE CARNEXT WAY',
    solution_title: 'A Better Experience.', solution_title_gradient: 'Built for You.',
    solution_1_title: 'Premium After-Sales', solution_1_text: 'We take care of you — because now you\'re part of the club.',
    solution_cta: 'Acquire Fleet',
    solution_2_title: 'Fair Financing', solution_2_text: 'Simple terms, competitive rates, and options built around your budget.',
    solution_3_title: '150-Point Inspected', solution_3_text: 'Every vehicle fully inspected, documented, and verified before sale.',
    solution_4_title: 'You-First Process', solution_4_text: 'Your timeline, your terms. A team that listens before they talk.',
    /* Hero search */
    hs_make: 'Make', hs_any_make: 'Any Make', hs_price: 'Max Price', hs_any_price: 'No Limit', hs_search: 'Search',
    /* Reviews */
    reviews_eyebrow: 'CUSTOMER REVIEWS', reviews_title: 'What Our', reviews_title_gradient: 'Clients Say',
    gr_based: 'Rated by our', gr_reviews: 'CarNext customers', t_verified: 'Verified Purchase',
    /* Featured */
    featured_eyebrow: 'FEATURED', featured_title: 'Featured', featured_title_gradient: 'Vehicles',
    featured_sub: 'Hand-picked, inspected, and ready to drive.',
    fv_details: 'View Details', fv_finance: 'Finance This', featured_viewall: 'View All Inventory',
    /* Financing */
    fin_eyebrow: 'FLEXIBLE FINANCING', fin_title: 'Get Financed', fin_title_gradient: 'Today',
    fin_desc: 'Through our network of trusted lenders, we help buyers across Orlando get approved — good credit, rebuilding credit, or first-time buyer. Every situation, every score.',
    fin_b1: 'All credit types', fin_b2: 'Approval in 24h', fin_b3: 'No obligation', fin_cta: 'Apply Now',
    ps_stat1_label: 'Vehicles Sold', ps_stat2_label: 'Satisfaction Rate', ps_stat3_label: 'Average Rating', ps_stat4_label: 'Average Approval',
    t1_text: '"The smoothest car-buying experience I\'ve ever had. No pressure, total transparency, and the vehicle was exactly as described. I drove home in my Outlander the same day."',
    t2_text: '"We were nervous about buying used after a bad experience elsewhere. CARNEXT USA completely changed our minds. They handled our trade-in and financing in one visit — outstanding."',
    t3_text: '"As a rental company owner, I\'ve bought fleets from many dealers. CARNEXT gave us pricing, condition, and service that no one else could match. Our go-to supplier now."',
    /* Contact */
    contact_eyebrow: 'GET IN TOUCH', contact_title: 'We\'re Here When', contact_title_gradient: 'You\'re Ready',
    contact_phone_label: 'Phone', contact_email_label: 'Email',
    contact_location_label: 'Location', contact_location_val: 'Orlando, Florida — USA',
    contact_hours_label: 'Business Hours',
    contact_hours_1: 'Mon–Fri: 9:00 AM – 6:00 PM', contact_hours_2: 'Saturday: 10:00 AM – 2:00 PM', contact_hours_3: 'Sunday: By Appointment',
    contact_directions: 'Get Directions',
    /* Footer */
    footer_tagline: 'Premium pre-owned vehicles.<br />Transparent deals. Designed for you.',
    /* Test Drive */
    td_eyebrow: 'BOOK YOUR EXPERIENCE', td_title: 'Schedule Your', td_title2: 'Test Drive',
    td_desc: 'Experience the vehicle before you commit. Our team will have it prepped, inspected, and ready for you.',
    td_trust1: 'No commitment required', td_trust2: 'We come to you (available)', td_trust3: 'Response within 2 hours',
    form_name: 'Full Name', form_name_ph: 'John Smith', form_phone: 'Phone',
    form_email: 'Email', form_vehicle: 'Preferred Vehicle', form_vehicle_ph: 'Select a vehicle...',
    form_vehicle_other: 'Other (specify in message)',
    form_date: 'Preferred Date', form_time: 'Preferred Time', form_time_ph: 'Select time...',
    form_message: 'Message (Optional)', form_message_ph: 'Any questions or special requests...',
    form_passport: 'I\'m interested in <strong>Passport Financing</strong>',
    form_submit: 'Schedule My Test Drive',
    form_disclaimer: 'Your information is secure and will never be shared with third parties.',
    /* Modal + inventory CTAs */
    modal_title: 'Schedule Your Test Drive',
    modal_sub: 'Fill out the form and our team will get back to you shortly.',
    form_select_vehicle: 'Select a vehicle...',
    form_select_time: 'Select time...',
    modal_success_title: 'Thank you!',
    modal_success_text: 'Our team will be in touch with you shortly.',
    modal_close: 'Close',
    vc_test_drive: 'Test Drive',
    vc_contact_more: 'Contact Us for More',
    /* Fleet inquiry modal */
    fleet_modal_title: 'Fleet Inquiry',
    fleet_modal_sub: 'Tell us about your operation and we\'ll prepare a custom proposal.',
    field_company_name: 'Rental Company Name',
    field_current_fleet: 'Current Fleet Size',
    field_full_name: 'Full Name',
    field_contact: 'Contact',
    field_email: 'Email',
    field_interested_count: 'How Many Vehicles Interested?',
    field_select_size: 'Select fleet size...',
    field_select_qty: 'Select quantity...',
    fleet_submit: 'Request Fleet Quote',
    /* Inventory filters */
    inv_f_model: 'Model', inv_f_all_models: 'All Models', inv_f_year: 'Year', inv_f_from: 'From', inv_f_to: 'To',
    inv_f_miles: 'Mileage', inv_f_any_miles: 'Any mileage', inv_f_below50: 'Under 50k mi', inv_f_upto70: 'Up to 70k mi', inv_f_upto90: 'Up to 90k mi', inv_f_upto110: 'Up to 110k mi', inv_f_above110: 'Over 110k mi',
    inv_f_price: 'Price', inv_f_any_price: 'Any price', inv_f_upto5: 'Up to $5k', inv_f_upto10: 'Up to $10k', inv_f_upto15: 'Up to $15k', inv_f_upto20: 'Up to $20k', inv_f_above20: 'Over $20k', inv_f_clear: 'Clear',
  },
  pt: {
    /* Nav */
    nav_inventory: 'Estoque', nav_fleet: 'Locadoras', nav_airport: 'Busca no Aeroporto',
    nav_contact: 'Fale Conosco', nav_cta: 'Agendar Test Drive',
    /* Hero tags */
    tag_inspected: 'Veículos Vistoriados', tag_financing: 'Financiamento Flexível',
    tag_family: 'SUVs para Família', tag_tradein: 'Aceita Troca', tag_approval: 'Aprovação Rápida',
    /* Hero */
    hero_title: 'Encontre Seu Próximo Carro', hero_find: 'Encontre Seu', hero_next: 'Próximo', hero_car: 'Carro', hero_title_gradient: 'com Confiança',
    hero_sub: 'Veículos seminovos premium, negociações transparentes e uma experiência de concessionária feita para você.',
    hero_cta1: 'Ver Estoque', hero_cta2: 'Agendar Test Drive', hero_cta3: 'Buscar no CarGurus',
    stat_vehicles: 'Veículos Disponíveis', stat_satisfaction: 'Satisfação dos Clientes', stat_financing: 'Financiamento Rápido',
    scroll: 'Rolar',
    /* Airport */
    airport_eyebrow: 'ENTREGA CONCIERGE',
    airport_title: 'Te Buscamos',
    airport_title_gradient: 'no Aeroporto',
    airport_desc: 'Acabou de pousar em Orlando? A gente vai até você. Nossa equipe te recebe no aeroporto, te leva à nossa loja e garante que você saia de carro no mesmo dia — sem estresse.',
    airport_feat1_title: 'Agende com Antecedência', airport_feat1_text: 'Nos informe os detalhes do seu voo. Coordenamos a busca e deixamos seu veículo pronto.',
    airport_feat2_title: 'Compra no Mesmo Dia', airport_feat2_text: 'Escolha online, defina o veículo e feche o negócio no momento em que chegar.',
    airport_feat3_title: 'Equipe Bilíngue', airport_feat3_text: 'Inglês, português e espanhol. Falamos o seu idioma do desembarque à entrega.',
    airport_feat4_title: 'Cobertura em Orlando, FL', airport_feat4_text: 'Aeroporto MCO e toda a região. Conveniente, profissional e personalizado.',
    airport_cta: 'Agendar Busca no Aeroporto',
    /* Fleet */
    fleet_eyebrow: 'PROGRAMA DE FROTA E LOCADORAS',
    fleet_title: 'Condições Exclusivas<br /><span class="text-gradient">para Locadoras</span>',
    fleet_desc: 'Entendemos as demandas de operadoras de locação e frotas. A CARNEXT USA oferece preços por volume, inspeção prioritária e gestão de conta dedicada para o seu negócio.',
    fleet_c1_title: 'Preço por Volume', fleet_c1_text: 'Descontos competitivos em lotes a partir de 5 unidades com tabelas de frota dedicadas.',
    fleet_c2_title: 'Vistoriado e Certificado', fleet_c2_text: 'Cada veículo passa pela nossa vistoria de 150 pontos antes da entrega para a frota.',
    fleet_c3_title: 'Financiamento de Frota', fleet_c3_text: 'Soluções de financiamento personalizadas com prazos estendidos e condições flexíveis.',
    fleet_c4_title: 'Gerente de Conta Dedicado', fleet_c4_text: 'Ponto de contato exclusivo para cotações, logística e suporte contínuo à frota.',
    fleet_cta: 'Falar com a Equipe de Frotas',
    /* Pain / Trust */
    pain_eyebrow: 'O JEITO ANTIGO',
    pain_title: 'Cansado do', pain_title_gradient: 'Mesmo Dealer de Sempre?',
    pain_1_title: 'Suporte Precário', pain_1_text: 'Você compra e eles esquecem de você. Você é apenas um número na lista.',
    pain_2_title: 'Financiamento Abusivo', pain_2_text: 'Taxas feitas para prender, não ajudar. Cláusulas escondidas, juros altos.',
    pain_3_title: 'Veículos Duvidosos', pain_3_text: 'Sem histórico de inspeção, acidentes desconhecidos e zero responsabilidade.',
    pain_4_title: 'Pressão de Venda', pain_4_text: 'Vendas agressivas, urgência falsa e um processo que ignora suas necessidades.',
    solution_eyebrow: 'O JEITO CARNEXT',
    solution_title: 'Uma Experiência Melhor.', solution_title_gradient: 'Feita para Você.',
    solution_1_title: 'Pós Venda Premium', solution_1_text: 'Cuidamos de você — afinal, agora você faz parte do clube.',
    solution_cta: 'Adquirir Frota',
    solution_2_title: 'Financiamento Justo', solution_2_text: 'Termos simples, taxas competitivas e opções adequadas ao seu orçamento.',
    solution_3_title: '150 Pontos Vistoriado', solution_3_text: 'Todo veículo inspecionado, documentado e verificado antes da venda.',
    solution_4_title: 'Você em Primeiro', solution_4_text: 'Seu prazo, suas condições. Uma equipe que ouve antes de falar.',
    /* Hero search */
    hs_make: 'Marca', hs_any_make: 'Qualquer Marca', hs_price: 'Preço Máx.', hs_any_price: 'Sem Limite', hs_search: 'Buscar',
    /* Featured */
    featured_eyebrow: 'DESTAQUES', featured_title: 'Veículos em', featured_title_gradient: 'Destaque',
    featured_sub: 'Selecionados a dedo, inspecionados e prontos para rodar.',
    fv_details: 'Ver Detalhes', fv_finance: 'Financiar', featured_viewall: 'Ver Todo o Estoque',
    /* Financing */
    fin_eyebrow: 'FINANCIAMENTO FLEXÍVEL', fin_title: 'Seja Aprovado', fin_title_gradient: 'Hoje',
    fin_desc: 'Através da nossa rede de parceiros financeiros, ajudamos compradores em toda Orlando a serem aprovados — crédito bom, em recuperação ou primeiro carro. Toda situação, todo score.',
    fin_b1: 'Todos os perfis de crédito', fin_b2: 'Aprovação em 24h', fin_b3: 'Sem compromisso', fin_cta: 'Solicitar Agora',
    gr_based: 'Avaliado pelos nossos', gr_reviews: 'clientes CarNext', t_verified: 'Compra Verificada',
    /* Reviews */
    reviews_eyebrow: 'AVALIAÇÕES', reviews_title: 'O Que Nossos', reviews_title_gradient: 'Clientes Dizem',
    ps_stat1_label: 'Veículos Vendidos', ps_stat2_label: 'Taxa de Satisfação', ps_stat3_label: 'Avaliação Média', ps_stat4_label: 'Aprovação Média',
    t1_text: '"A experiência de compra de carro mais tranquila que já tive. Sem pressão, total transparência e o veículo era exatamente como descrito. Fui para casa no mesmo dia no meu Outlander."',
    t2_text: '"Estávamos com medo de comprar usado após uma experiência ruim. A CARNEXT USA mudou completamente nossa visão. Resolveram nossa troca e o financiamento em uma visita — incrível."',
    t3_text: '"Como dono de locadora, já comprei frotas de muitas revendas. A CARNEXT nos ofereceu preço, estado e atendimento que ninguém conseguiu igualar. Agora são nosso fornecedor principal."',
    /* Contact */
    contact_eyebrow: 'FALE CONOSCO', contact_title: 'Estamos Aqui Quando', contact_title_gradient: 'Você Estiver Pronto',
    contact_phone_label: 'Telefone', contact_email_label: 'E-mail',
    contact_location_label: 'Localização', contact_location_val: 'Orlando, Flórida — EUA',
    contact_hours_label: 'Horário de Funcionamento',
    contact_hours_1: 'Seg–Sex: 9h às 18h', contact_hours_2: 'Sábado: 10h às 14h', contact_hours_3: 'Domingo: Mediante Agendamento',
    contact_directions: 'Como Chegar',
    /* Footer */
    footer_tagline: 'Veículos seminovos premium.<br />Negociações transparentes. Feito para você.',
    /* Test Drive */
    td_eyebrow: 'AGENDE SUA EXPERIÊNCIA', td_title: 'Agende Seu', td_title2: 'Test Drive',
    td_desc: 'Experimente o veículo antes de decidir. Nossa equipe deixará tudo preparado, vistoriado e pronto para você.',
    td_trust1: 'Sem compromisso', td_trust2: 'Podemos ir até você', td_trust3: 'Resposta em até 2 horas',
    form_name: 'Nome Completo', form_name_ph: 'João Silva', form_phone: 'Telefone',
    form_email: 'E-mail', form_vehicle: 'Veículo de Interesse', form_vehicle_ph: 'Selecione um veículo...',
    form_vehicle_other: 'Outro (especificar na mensagem)',
    form_date: 'Data Preferida', form_time: 'Horário Preferido', form_time_ph: 'Selecione o horário...',
    form_message: 'Mensagem (Opcional)', form_message_ph: 'Dúvidas ou pedidos especiais...',
    form_passport: 'Tenho interesse em <strong>Financiamento no Passaporte</strong>',
    form_submit: 'Agendar Meu Test Drive',
    form_disclaimer: 'Suas informações são seguras e nunca serão compartilhadas com terceiros.',
    /* Modal + inventory CTAs */
    modal_title: 'Agende Seu Test Drive',
    modal_sub: 'Preencha o formulário e nosso time entrará em contato em breve.',
    form_select_vehicle: 'Selecione um veículo...',
    form_select_time: 'Selecione um horário...',
    modal_success_title: 'Obrigado!',
    modal_success_text: 'Em breve nosso time entrará em contato com você.',
    modal_close: 'Fechar',
    vc_test_drive: 'Test Drive',
    vc_contact_more: 'Saber Mais',
    /* Fleet inquiry modal */
    fleet_modal_title: 'Solicitação para Locadora',
    fleet_modal_sub: 'Conte sobre sua operação e prepararemos uma proposta personalizada.',
    field_company_name: 'Nome da Locadora',
    field_current_fleet: 'Frota Atual',
    field_full_name: 'Nome Completo',
    field_contact: 'Contato',
    field_email: 'Email',
    field_interested_count: 'Quantos Veículos Está Interessado?',
    field_select_size: 'Selecione o tamanho da frota...',
    field_select_qty: 'Selecione a quantidade...',
    fleet_submit: 'Solicitar Cotação',
    /* Inventory filters */
    inv_f_model: 'Modelo', inv_f_all_models: 'Todos os Modelos', inv_f_year: 'Ano', inv_f_from: 'De', inv_f_to: 'Até',
    inv_f_miles: 'Milhas', inv_f_any_miles: 'Qualquer km', inv_f_below50: 'Abaixo de 50k mi', inv_f_upto70: 'Até 70k mi', inv_f_upto90: 'Até 90k mi', inv_f_upto110: 'Até 110k mi', inv_f_above110: 'Acima de 110k mi',
    inv_f_price: 'Valor', inv_f_any_price: 'Qualquer valor', inv_f_upto5: 'Até $5k', inv_f_upto10: 'Até $10k', inv_f_upto15: 'Até $15k', inv_f_upto20: 'Até $20k', inv_f_above20: 'Acima de $20k', inv_f_clear: 'Limpar',
  },
  es: {
    /* Nav */
    nav_inventory: 'Inventario', nav_fleet: 'Rentadoras', nav_airport: 'Recogida en Aeropuerto',
    nav_contact: 'Contáctanos', nav_cta: 'Agendar Test Drive',
    /* Hero tags */
    tag_inspected: 'Vehículos Inspeccionados', tag_financing: 'Financiamiento Flexible',
    tag_family: 'SUVs Familiares', tag_tradein: 'Aceptamos Tu Auto', tag_approval: 'Aprobación Rápida',
    /* Hero */
    hero_title: 'Encuentra Tu Próximo Auto', hero_find: 'Encuentra Tu', hero_next: 'Próximo', hero_car: 'Auto', hero_title_gradient: 'con Confianza',
    hero_sub: 'Vehículos seminuevos premium, tratos transparentes y una experiencia de concesionaria diseñada para ti.',
    hero_cta1: 'Ver Inventario', hero_cta2: 'Agendar Test Drive', hero_cta3: 'Buscar en CarGurus',
    stat_vehicles: 'Vehículos Disponibles', stat_satisfaction: 'Satisfacción del Cliente', stat_financing: 'Financiamiento Rápido',
    scroll: 'Scroll',
    /* Airport */
    airport_eyebrow: 'ENTREGA CONCIERGE',
    airport_title: 'Te Recogemos',
    airport_title_gradient: 'en el Aeropuerto',
    airport_desc: '¿Acabas de llegar a Orlando? Vamos a buscarte. Nuestro equipo te recibirá en el aeropuerto, te llevará a nuestra tienda y te aseguramos que te vas manejando el mismo día — sin estrés.',
    airport_feat1_title: 'Agenda con Anticipación', airport_feat1_text: 'Compártenos los detalles de tu vuelo. Coordinamos la recogida y tendremos tu vehículo listo.',
    airport_feat2_title: 'Compra el Mismo Día', airport_feat2_text: 'Elige en línea, selecciona tu vehículo y cierra el trato en cuanto llegues.',
    airport_feat3_title: 'Equipo Completamente Bilingüe', airport_feat3_text: 'Inglés, portugués y español. Hablamos tu idioma desde la llegada hasta la entrega.',
    airport_feat4_title: 'Cobertura Orlando, FL', airport_feat4_text: 'Aeropuerto MCO y todas las áreas aledañas. Conveniente, profesional y personalizado.',
    airport_cta: 'Reservar Recogida en Aeropuerto',
    /* Fleet */
    fleet_eyebrow: 'PROGRAMA DE FLOTA Y ALQUILER',
    fleet_title: 'Condiciones Exclusivas<br /><span class="text-gradient">para Empresas de Alquiler</span>',
    fleet_desc: 'Entendemos las exigencias de los operadores de alquiler y flota. CARNEXT USA ofrece precios por volumen, inspección prioritaria y gestión de cuenta dedicada para tu negocio.',
    fleet_c1_title: 'Precios por Volumen', fleet_c1_text: 'Descuentos competitivos en lotes desde 5 unidades con tablas de precios de flota dedicadas.',
    fleet_c2_title: 'Inspeccionado y Certificado', fleet_c2_text: 'Cada vehículo pasa nuestra inspección de 150 puntos antes de la entrega a la flota.',
    fleet_c3_title: 'Financiamiento de Flota', fleet_c3_text: 'Soluciones de financiamiento personalizadas con plazos extendidos y pagos flexibles.',
    fleet_c4_title: 'Gerente de Cuenta Dedicado', fleet_c4_text: 'Punto de contacto exclusivo para cotizaciones, logística y soporte continuo a la flota.',
    fleet_cta: 'Hablar con el Equipo de Flota',
    /* Pain / Trust */
    pain_eyebrow: 'LA FORMA ANTIGUA',
    pain_title: '¿Cansado del', pain_title_gradient: 'Mismo Dealer de Siempre?',
    pain_1_title: 'Soporte Deficiente', pain_1_text: 'Compras y se olvidan de ti. Eres solo un número más en la lista.',
    pain_2_title: 'Financiamiento Abusivo', pain_2_text: 'Tasas diseñadas para atrapar, no ayudar. Cláusulas escondidas, intereses altos.',
    pain_3_title: 'Vehículos Dudosos', pain_3_text: 'Sin historial de inspección, accidentes desconocidos y cero responsabilidad.',
    pain_4_title: 'Tácticas de Presión', pain_4_text: 'Ventas agresivas, urgencia falsa y un proceso que ignora tus necesidades.',
    solution_eyebrow: 'LA FORMA CARNEXT',
    solution_title: 'Una Mejor Experiencia.', solution_title_gradient: 'Hecha para Ti.',
    solution_1_title: 'Postventa Premium', solution_1_text: 'Cuidamos de ti — ahora eres parte del club.',
    solution_cta: 'Adquirir Flota',
    solution_2_title: 'Financiamiento Justo', solution_2_text: 'Términos simples, tasas competitivas y opciones para tu presupuesto.',
    solution_3_title: '150 Puntos Inspeccionado', solution_3_text: 'Cada vehículo inspeccionado, documentado y verificado antes de la venta.',
    solution_4_title: 'Tú Primero', solution_4_text: 'Tu tiempo, tus condiciones. Un equipo que escucha antes de hablar.',
    /* Hero search */
    hs_make: 'Marca', hs_any_make: 'Cualquier Marca', hs_price: 'Precio Máx.', hs_any_price: 'Sin Límite', hs_search: 'Buscar',
    /* Featured */
    featured_eyebrow: 'DESTACADOS', featured_title: 'Vehículos', featured_title_gradient: 'Destacados',
    featured_sub: 'Seleccionados a mano, inspeccionados y listos para conducir.',
    fv_details: 'Ver Detalles', fv_finance: 'Financiar', featured_viewall: 'Ver Todo el Inventario',
    /* Financing */
    fin_eyebrow: 'FINANCIAMIENTO FLEXIBLE', fin_title: 'Aprobación', fin_title_gradient: 'Hoy',
    fin_desc: 'A través de nuestra red de prestamistas de confianza, ayudamos a compradores en todo Orlando a ser aprobados — buen crédito, en recuperación o primer auto. Cada situación, cada score.',
    fin_b1: 'Todos los tipos de crédito', fin_b2: 'Aprobación en 24h', fin_b3: 'Sin compromiso', fin_cta: 'Solicitar Ahora',
    gr_based: 'Valorado por nuestros', gr_reviews: 'clientes CarNext', t_verified: 'Compra Verificada',
    /* Reviews */
    reviews_eyebrow: 'RESEÑAS', reviews_title: 'Lo Que Dicen', reviews_title_gradient: 'Nuestros Clientes',
    ps_stat1_label: 'Vehículos Vendidos', ps_stat2_label: 'Tasa de Satisfacción', ps_stat3_label: 'Calificación Promedio', ps_stat4_label: 'Aprobación Promedio',
    t1_text: '"La experiencia de compra de auto más fluida que he tenido. Sin presión, total transparencia y el vehículo era exactamente como lo describían. Me fui a casa en mi Outlander el mismo día."',
    t2_text: '"Estábamos nerviosos por comprar usado tras una mala experiencia. CARNEXT USA cambió completamente nuestra opinión. Manejaron nuestro intercambio y financiamiento en una visita — excelente."',
    t3_text: '"Como dueño de una empresa de alquiler, he comprado flotas de muchos dealers. CARNEXT nos dio precio, condición y servicio que nadie más pudo igualar. Ahora son nuestro proveedor principal."',
    /* Contact */
    contact_eyebrow: 'CONTÁCTENOS', contact_title: 'Estamos Aquí Cuando', contact_title_gradient: 'Estés Listo',
    contact_phone_label: 'Teléfono', contact_email_label: 'Correo Electrónico',
    contact_location_label: 'Ubicación', contact_location_val: 'Orlando, Florida — EE.UU.',
    contact_hours_label: 'Horario de Atención',
    contact_hours_1: 'Lun–Vie: 9:00 AM – 6:00 PM', contact_hours_2: 'Sábado: 10:00 AM – 2:00 PM', contact_hours_3: 'Domingo: Con Cita Previa',
    contact_directions: 'Cómo Llegar',
    /* Footer */
    footer_tagline: 'Vehículos seminuevos premium.<br />Tratos transparentes. Diseñado para ti.',
    /* Test Drive */
    td_eyebrow: 'RESERVA TU EXPERIENCIA', td_title: 'Agenda Tu', td_title2: 'Test Drive',
    td_desc: 'Experimenta el vehículo antes de comprometerte. Nuestro equipo lo tendrá preparado, inspeccionado y listo para ti.',
    td_trust1: 'Sin compromiso', td_trust2: 'Podemos ir a tu ubicación', td_trust3: 'Respuesta en 2 horas',
    form_name: 'Nombre Completo', form_name_ph: 'Juan García', form_phone: 'Teléfono',
    form_email: 'Correo Electrónico', form_vehicle: 'Vehículo de Interés', form_vehicle_ph: 'Selecciona un vehículo...',
    form_vehicle_other: 'Otro (especificar en el mensaje)',
    form_date: 'Fecha Preferida', form_time: 'Horario Preferido', form_time_ph: 'Selecciona el horario...',
    form_message: 'Mensaje (Opcional)', form_message_ph: 'Preguntas o solicitudes especiales...',
    form_passport: 'Me interesa el <strong>Financiamiento con Pasaporte</strong>',
    form_submit: 'Agendar Mi Test Drive',
    form_disclaimer: 'Tu información es segura y nunca será compartida con terceros.',
    /* Modal + inventory CTAs */
    modal_title: 'Agenda Tu Test Drive',
    modal_sub: 'Completa el formulario y nuestro equipo se pondrá en contacto contigo en breve.',
    form_select_vehicle: 'Selecciona un vehículo...',
    form_select_time: 'Selecciona un horario...',
    modal_success_title: '¡Gracias!',
    modal_success_text: 'Nuestro equipo se pondrá en contacto contigo en breve.',
    modal_close: 'Cerrar',
    vc_test_drive: 'Test Drive',
    vc_contact_more: 'Más Información',
    /* Fleet inquiry modal */
    fleet_modal_title: 'Solicitud para Rentadora',
    fleet_modal_sub: 'Cuéntanos sobre tu operación y prepararemos una propuesta personalizada.',
    field_company_name: 'Nombre de la Rentadora',
    field_current_fleet: 'Flota Actual',
    field_full_name: 'Nombre Completo',
    field_contact: 'Contacto',
    field_email: 'Email',
    field_interested_count: '¿Cuántos Vehículos Te Interesan?',
    field_select_size: 'Selecciona el tamaño de la flota...',
    field_select_qty: 'Selecciona la cantidad...',
    fleet_submit: 'Solicitar Cotización',
    /* Inventory filters */
    inv_f_model: 'Modelo', inv_f_all_models: 'Todos los Modelos', inv_f_year: 'Año', inv_f_from: 'Desde', inv_f_to: 'Hasta',
    inv_f_miles: 'Kilometraje', inv_f_any_miles: 'Cualquier km', inv_f_below50: 'Menos de 50k mi', inv_f_upto70: 'Hasta 70k mi', inv_f_upto90: 'Hasta 90k mi', inv_f_upto110: 'Hasta 110k mi', inv_f_above110: 'Más de 110k mi',
    inv_f_price: 'Precio', inv_f_any_price: 'Cualquier precio', inv_f_upto5: 'Hasta $5k', inv_f_upto10: 'Hasta $10k', inv_f_upto15: 'Hasta $15k', inv_f_upto20: 'Hasta $20k', inv_f_above20: 'Más de $20k', inv_f_clear: 'Limpiar',
  }
};

function setLanguage(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;
  /* Update all data-i18n text nodes */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  /* Update placeholder attributes */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
  });
  /* Update active button */
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });
  /* Update html lang attribute */
  document.documentElement.lang = lang;
  /* Persist */
  localStorage.setItem('cnx_lang', lang);
  /* Update email mailto body per language */
  const emailBodies = {
    en: { subject: 'Contact from Website - CarNext USA', body: 'Hello CarNext USA Team,\n\nI would like to get more information about your vehicles and services.\n\nName: \nPhone: \nMessage: \n\nThank you!' },
    pt: { subject: 'Contato pelo Site - CarNext USA', body: 'Olá, equipe CarNext USA!\n\nGostaria de obter mais informações sobre seus veículos e serviços.\n\nNome: \nTelefone: \nMensagem: \n\nObrigado!' },
    es: { subject: 'Contacto desde el Sitio - CarNext USA', body: 'Hola, equipo CarNext USA!\n\nMe gustaría obtener más información sobre sus vehículos y servicios.\n\nNombre: \nTeléfono: \nMensaje: \n\n¡Gracias!' }
  };
  const emailLink = document.querySelector('a[href^="mailto:nex@carnextusa.com"]');
  if (emailLink && emailBodies[lang]) {
    const { subject, body } = emailBodies[lang];
    emailLink.href = `mailto:nex@carnextusa.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

/* Init language switcher */
(function initLang() {
  const saved = localStorage.getItem('cnx_lang') || 'en';
  setLanguage(saved);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });
})();

/* ── Smooth Nav ────────────────────────────────────── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile Menu ────────────────────────────────────── */
const toggle = document.getElementById('mobileToggle');
const menu   = document.getElementById('mobileMenu');
toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  const spans = toggle.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    menu.classList.remove('open');
    const spans = toggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


/* ── Hero Canvas Particles (fallback when no video) ── */
(function initHeroParticles() {
  const video  = document.querySelector('.hero-video');
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.vx  = (Math.random() - 0.5) * 0.3;
      this.vy  = -Math.random() * 0.4 - 0.1;
      this.r   = Math.random() * 1.5 + 0.5;
      this.a   = 0;
      this.maxA = Math.random() * 0.5 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.hue = Math.random() > 0.5 ? 200 : 270;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.life++;
      const t = this.life / this.maxLife;
      this.a = t < 0.2 ? (t / 0.2) * this.maxA
             : t > 0.8 ? ((1 - t) / 0.2) * this.maxA
             : this.maxA;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) {
    const p = new Particle();
    p.life = Math.floor(Math.random() * p.maxLife);
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  /* Only start particles if video fails */
  const fallback = document.getElementById('heroFallback');
  if (!video || video.src === '') {
    fallback.style.zIndex = 1; loop();
  } else {
    video.addEventListener('error', () => { fallback.style.zIndex = 1; loop(); });
    video.addEventListener('canplay', () => { fallback.style.zIndex = -1; });
  }
})();

/* ── Showcase Canvas (background grid — pauses when offscreen) ── */
(function initShowcaseCanvas() {
  const canvas = document.getElementById('showcaseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, rafId = null, visible = false;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let offset = 0, lastT = 0;
  function draw(t) {
    if (!visible) { rafId = null; return; }
    if (t - lastT < 50) { rafId = requestAnimationFrame(draw); return; } // ~20fps
    lastT = t;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(14,165,233,0.06)';
    ctx.lineWidth = 1;
    const grid = 60;
    for (let x = (offset % grid) - grid; x < W + grid; x += grid) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H + grid; y += grid) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    offset += 0.3;
    rafId = requestAnimationFrame(draw);
  }

  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !rafId) rafId = requestAnimationFrame(draw);
  }, { threshold: 0.05 }).observe(canvas.closest('section') || canvas);
})();


/* ── Hero GSAP Entrance — only animates elements that exist ── */
(function initHeroEntrance() {
  const tl = gsap.timeline({ delay: 0.2 });
  const steps = [
    ['.hero-title',       { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, 0],
    ['.hero-sub',         { opacity: 0, y: 24, duration: 0.6, ease: 'power2.out' }, '-=0.4'],
    ['.hero-ctas',        { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3'],
    ['.hero-stats',       { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' }, '-=0.2'],
    ['.scroll-indicator', { opacity: 0, duration: 0.5 },                            '-=0.2'],
  ];
  steps.forEach(([sel, vars, pos]) => {
    if (document.querySelector(sel)) tl.from(sel, vars, pos);
  });
})();

/* ── Stat Counters — counts UP from 0 to target ────── */
function animateCounter(el) {
  if (el.dataset.counted === '1') return;
  el.dataset.counted = '1';
  const target = parseInt(el.dataset.count, 10);
  if (!Number.isFinite(target)) return;
  const proxy = { val: 0 };
  el.textContent = '0';
  gsap.to(proxy, {
    val: target,
    duration: 1.6,
    ease: 'power2.out',
    onUpdate() { el.textContent = Math.round(proxy.val); },
    scrollTrigger: { trigger: el, start: 'top 90%', once: true }
  });
}
document.querySelectorAll('[data-count]').forEach(animateCounter);

/* ── Reveal on Scroll ───────────────────────────────── */
document.querySelectorAll('.reveal-block').forEach((el, i) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 78%',
    once: true,
    onEnter: () => {
      gsap.to(el, {
        opacity: 1, y: 0,
        duration: 0.35,
        delay: (i % 4) * 0.03,
        ease: 'power2.out',
        onStart: () => el.classList.add('revealed')
      });
    }
  });
});

/* ── Inventory Filters ──────────────────────────────── */
(function initInventoryFilters() {
  const modeloSelect = document.getElementById('filterModelo');
  const anoDeSelect  = document.getElementById('filterAnoDe');
  const anoAteSelect = document.getElementById('filterAnoAte');
  const milhasSelect = document.getElementById('filterMilhas');
  const valorSelect  = document.getElementById('filterValor');
  const resetBtn     = document.getElementById('filterReset');

  if (!anoDeSelect) return;

  // Populate year dropdowns 2026 → 1996
  for (let y = 2026; y >= 1996; y--) {
    [anoDeSelect, anoAteSelect].forEach(sel => {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      sel.appendChild(opt);
    });
  }

  function applyFilters() {
    const modelo  = modeloSelect.value.toLowerCase();
    const anoDe   = anoDeSelect.value  ? parseInt(anoDeSelect.value)  : null;
    const anoAte  = anoAteSelect.value ? parseInt(anoAteSelect.value) : null;
    const milhas  = milhasSelect.value;
    const valor   = valorSelect.value;

    document.querySelectorAll('.vehicle-card').forEach(card => {
      const cardName  = (card.querySelector('.vc-name')?.textContent || '').toLowerCase();
      const cardYear  = parseInt(card.dataset.year  || card.querySelector('.vc-year')?.textContent || '0');
      const cardMiles = parseInt(card.dataset.miles || '0');
      const priceText = (card.querySelector('.vc-price')?.textContent || '').replace(/[^0-9]/g, '');
      const price     = parseInt(priceText, 10) || 0;

      let show = true;

      if (modelo  && cardName !== modelo)      show = false;
      if (anoDe   && cardYear < anoDe)         show = false;
      if (anoAte  && cardYear > anoAte)        show = false;

      if (milhas) {
        const maxMi = parseInt(milhas, 10);
        if (maxMi === 110001) { if (cardMiles <= 110000) show = false; }
        else                  { if (cardMiles > maxMi)   show = false; }
      }

      if (valor) {
        const maxVal = parseInt(valor, 10);
        if (maxVal === 20001) { if (price <= 20000) show = false; }
        else                  { if (price > maxVal) show = false; }
      }

      gsap.to(card, { opacity: show ? 1 : 0.18, scale: show ? 1 : 0.97, duration: 0.3, ease: 'power2.out' });
      card.style.pointerEvents = show ? '' : 'none';
    });
  }

  [modeloSelect, anoDeSelect, anoAteSelect, milhasSelect, valorSelect].forEach(sel => {
    sel.addEventListener('change', applyFilters);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      [modeloSelect, anoDeSelect, anoAteSelect, milhasSelect, valorSelect].forEach(s => s.value = '');
      document.querySelectorAll('.vehicle-card').forEach(c => { c.style.display = ''; });
      applyFilters();
    });
  }

  /* Hero search (?make & ?max) → pre-filter inventory */
  (function applyURLSearch() {
    const params = new URLSearchParams(location.search);
    const make = (params.get('make') || '').toLowerCase().trim();
    const max  = params.get('max') ? parseInt(params.get('max'), 10) : null;
    if (!make && !max) return;

    let shown = 0;
    document.querySelectorAll('.vehicle-card').forEach(card => {
      const name  = (card.querySelector('.vc-name')?.textContent || '').toLowerCase();
      const price = parseInt((card.querySelector('.vc-price')?.textContent || '').replace(/[^0-9]/g, ''), 10) || 0;
      let show = true;
      if (make && !name.includes(make)) show = false;
      if (max  && price > max)          show = false;
      card.style.display = show ? '' : 'none';
      if (show) shown++;
    });

    // Reflect max price in the price select for consistency
    if (max && valorSelect) {
      [...valorSelect.options].forEach(o => { if (parseInt(o.value, 10) === max) valorSelect.value = o.value; });
    }

    // Empty-result note
    if (shown === 0) {
      const grid = document.querySelector('.inventory-grid');
      if (grid) {
        const note = document.createElement('p');
        note.style.cssText = 'grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:40px 0;font-size:1rem;';
        note.textContent = 'No vehicles match that search right now — showing all inventory instead.';
        grid.prepend(note);
        document.querySelectorAll('.vehicle-card').forEach(c => { c.style.display = ''; });
      }
    }
  })();
})();

/* ── Vehicle Showcase Parallax (guarded) ────────────── */
(function initShowcaseParallax() {
  const showcase = document.querySelector('.showcase');
  const wrap = document.getElementById('vehicleWrap');
  if (!showcase || !wrap) return;
  ScrollTrigger.create({
    trigger: showcase,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate(self) { gsap.set(wrap, { y: self.progress * -40 }); }
  });
})();

/* ── Pacifica Explode Scroll Interaction ────────────── */
(function initExplode() {
  const stage = document.getElementById('vehicleStage');
  const img   = document.getElementById('vehicleImg');
  if (!stage || !img) return;

  const labels = stage.querySelectorAll('.float-label');
  if (labels.length < 4) return;
  let exploded = false;

  function explode(progress) {
    if (progress > 0.3 && !exploded) {
      exploded = true;
      gsap.to(img, { scale: 1.12, filter: 'brightness(1.15) saturate(1.3)', duration: 0.8, ease: 'power2.out' });
      gsap.to(labels[0], { x: -30, y: -20, duration: 0.8, ease: 'power2.out' });
      gsap.to(labels[1], { x: 30, y: -10, duration: 0.8, ease: 'power2.out' });
      gsap.to(labels[2], { x: -20, y: 20, duration: 0.8, ease: 'power2.out' });
      gsap.to(labels[3], { x: 25, y: 15, duration: 0.8, ease: 'power2.out' });
    } else if (progress <= 0.3 && exploded) {
      exploded = false;
      gsap.to(img, { scale: 1, filter: 'none', duration: 0.6, ease: 'power2.inOut' });
      labels.forEach(l => gsap.to(l, { x: 0, y: 0, duration: 0.6, ease: 'power2.inOut' }));
    }
  }

  ScrollTrigger.create({
    trigger: '.showcase',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate(self) { explode(self.progress); }
  });
})();

/* ══════════════════════════════════════════════════════
   PREMIUM SCROLL REVEAL SYSTEM
   — clip-path word reveals, blur-in, parallax, stagger
══════════════════════════════════════════════════════ */

/* ── Utility: split heading into word spans ─────────── */
function splitWords(el) {
  const html = el.innerHTML;
  // preserve <span class="text-gradient"> and <br>
  const parts = [];
  const regex = /(<[^>]+>.*?<\/[^>]+>|<br\s*\/?>|[^\s<]+)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const token = match[0];
    if (token.startsWith('<br')) {
      parts.push('<br/>');
    } else if (token.startsWith('<')) {
      // wrap inner text of gradient span
      parts.push(token.replace(/>([^<]+)</, (_, t) =>
        `>${t.split(' ').map(w => `<span class="word-wrap"><span class="word">${w}</span></span>`).join(' ')}<`
      ));
    } else {
      parts.push(`<span class="word-wrap"><span class="word">${token}</span></span>`);
    }
  }
  el.innerHTML = parts.join(' ');
  return el.querySelectorAll('.word');
}

/* ── Airport Section: feature items slide-in ────────── */
(function initAirportItems() {
  const section = document.getElementById('airport');
  if (!section) return;
  const items = section.querySelectorAll('.af-item');
  if (!items.length) return;

  gsap.set(items, { opacity: 0, x: 80 });
  ScrollTrigger.create({
    trigger: section, start: 'top 75%', once: true,
    onEnter: () => {
      gsap.to(items, {
        opacity: 1, x: 0,
        duration: 0.5, stagger: 0.1, ease: 'power3.out'
      });
    }
  });
})();

/* helper: should we skip a child animation because parent .reveal-block handles it? */
function insideReveal(el) { return !!el.closest('.reveal-block'); }

/* ── Generic Section Titles: simple fade-up reveal ──── */
document.querySelectorAll('.section-title').forEach(el => {
  if (insideReveal(el)) return; // parent reveal-block handles it
  gsap.set(el, { opacity: 0, y: 24 });
  gsap.to(el, {
    opacity: 1, y: 0,
    duration: 0.6, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
  });
});

/* ── Section Eyebrows: draw-in ───────────────────────── */
document.querySelectorAll('.section-eyebrow').forEach(el => {
  if (insideReveal(el)) return;
  gsap.set(el, { opacity: 0, x: -16 });
  gsap.to(el, {
    opacity: 1, x: 0, duration: 0.35, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true }
  });
});

/* ── Glass Cards: scale + fade stagger ──────────────── */
document.querySelectorAll('.glass-card').forEach((card, i) => {
  if (card.closest('.td-form-wrap')) return; // skip form (handled separately)
  if (insideReveal(card) || card.classList.contains('reveal-block')) return; // parent handles
  gsap.set(card, { opacity: 0, y: 12, scale: 0.98 });
  gsap.to(card, {
    opacity: 1, y: 0, scale: 1,
    duration: 0.35, ease: 'power2.out',
    scrollTrigger: { trigger: card, start: 'top 92%', once: true },
    delay: (i % 4) * 0.03
  });
});

/* ── Trust Pain/Solution items: alternating slide ────── */
document.querySelectorAll('.pain-item, .solution-item').forEach((el, i) => {
  const fromX = el.classList.contains('pain-item') ? -16 : 16;
  gsap.set(el, { opacity: 0, x: fromX });
  gsap.to(el, {
    opacity: 1, x: 0, duration: 0.35, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    delay: i * 0.03
  });
});

/* ── Fleet cards: cascade ────────────────────────────── */
if (document.querySelector('.fleet-card')) {
  gsap.set('.fleet-card', { opacity: 0, y: 12 });
  gsap.to('.fleet-card', {
    opacity: 1, y: 0, stagger: 0.04, duration: 0.35, ease: 'power2.out',
    scrollTrigger: { trigger: '.fleet-cards', start: 'top 85%', once: true }
  });
}

/* ── Hero Parallax ──────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.hero',
  start: 'top top',
  end: 'bottom top',
  scrub: true,
  onUpdate(self) {
    const content = document.getElementById('heroContent');
    if (content) gsap.set(content, { y: self.progress * 80 });
  }
});

/* ── Web3Forms submission helper ────────────────────── */
// Replace WEB3FORMS_ACCESS_KEY with your key from https://web3forms.com
// (sign up free with nex@carnextusa.com to receive submissions by email)
const WEB3FORMS_KEY = '4add076b-74eb-489f-8bcf-0511b9e93fd8';

async function submitToWeb3Forms(form) {
  const data = new FormData(form);
  data.append('access_key', WEB3FORMS_KEY);
  data.append('from_name', 'CarNext USA Website');
  // Subject from hidden field or derive from form id
  if (!data.get('subject')) {
    const subjects = {
      testDriveForm: 'Test Drive Request - CarNext USA',
      fleetModalForm: 'Fleet Inquiry - CarNext USA'
    };
    data.append('subject', subjects[form.id] || 'Contact - CarNext USA');
  }
  // Reply-to so the team can reply directly to the client
  const email = data.get('email');
  if (email) data.append('replyto', email);
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: data
  });
  return res.ok;
}

/* ── Test Drive Form (inline on homepage) ───────────── */
document.getElementById('testDriveForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span>Sending…</span>';
  btn.disabled = true;
  const ok = await submitToWeb3Forms(e.target);
  if (ok) {
    btn.innerHTML = '<span>Sent! We\'ll contact you within 2 hours. ✓</span>';
    btn.style.background = 'linear-gradient(90deg, #10B981, #059669)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 5000);
  } else {
    btn.innerHTML = '<span>Error — please try again or call us.</span>';
    btn.style.background = 'linear-gradient(90deg, #EF4444, #DC2626)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
  }
});

/* ── Smooth Anchor Scroll ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Testimonial Cards Entrance (skip those inside reveal-block) ─── */
(function initTestimonials() {
  const cards = [...document.querySelectorAll('.testimonial')].filter(c => !insideReveal(c) && !c.classList.contains('reveal-block'));
  if (!cards.length) return;
  gsap.set(cards, { opacity: 0, y: 16 });
  gsap.to(cards, {
    opacity: 1, y: 0, stagger: 0.05, duration: 0.35, ease: 'power2.out',
    scrollTrigger: { trigger: '.testimonials-grid', start: 'top 88%', once: true }
  });
})();

/* ── Vehicle Cards (only on inventory page) ──────────── */
if (document.querySelector('.inventory-grid') && document.querySelector('.vehicle-card')) {
  ScrollTrigger.create({
    trigger: '.inventory-grid',
    start: 'top 88%',
    once: true,
    onEnter: () => {
      gsap.fromTo('.vehicle-card',
        { opacity: 0, y: 14, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.35, ease: 'power2.out' }
      );
    }
  });
}

/* ── Showcase Content Entrance ──────────────────────── */
if (document.querySelector('.showcase-content')) {
  gsap.from('.showcase-content > *', {
    opacity: 0, x: 16, stagger: 0.04, duration: 0.35, ease: 'power2.out',
    scrollTrigger: { trigger: '.showcase', start: 'top 85%', once: true }
  });
}

/* ── Footer Entrance ────────────────────────────────── */
if (document.querySelector('.footer')) {
  gsap.from('.footer-brand, .footer-col', {
    opacity: 0, y: 10, stagger: 0.04, duration: 0.3, ease: 'power2.out',
    scrollTrigger: { trigger: '.footer', start: 'top 90%', once: true }
  });
}

/* ══════════════════════════════════════════════════════
   SAFETY NET — fail-open for any reveal-block stuck invisible
   (covers ScrollTrigger edge cases, missed thresholds, etc.)
══════════════════════════════════════════════════════ */
document.querySelectorAll('.reveal-block').forEach(block => {
  ScrollTrigger.create({
    trigger: block,
    start: 'top 95%',
    once: true,
    onEnter: () => block.classList.add('revealed')
  });
});

/* On window load, force-reveal anything in viewport (anchor-nav fix) */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal-block:not(.revealed)').forEach(block => {
      const r = block.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        block.classList.add('revealed');
      }
    });
    ScrollTrigger.refresh();
  }, 100);
});


/* ════════════════════════════════════════════════════
   TEST DRIVE MODAL — open / close / submit handlers
   ═══════════════════════════════════════════════════ */
(function initTdModal() {
  const modal = document.getElementById("tdModal");
  if (!modal) return;
  const form = document.getElementById("tdModalForm");
  const vehicleSelect = document.getElementById("tdModalVehicle");
  const step1 = modal.querySelector("[data-step=\"1\"]");
  const step2 = modal.querySelector("[data-step=\"2\"]");
  let lastFocus = null;

  function open(e) {
    lastFocus = document.activeElement;
    // Try to detect vehicle name from the clicked button context
    const btn = e?.currentTarget;
    const card = btn?.closest(".vehicle-card");
    const vName = card?.querySelector(".vc-name")?.textContent?.trim();
    const vYear = card?.querySelector(".vc-year")?.textContent?.trim();
    if (vName && vehicleSelect) {
      const target = `${vYear ? vYear + " " : ""}${vName}`.trim();
      // Find matching option
      const match = [...vehicleSelect.options].find(o => o.textContent.trim().toLowerCase().includes(vName.toLowerCase()));
      if (match) vehicleSelect.value = match.value || match.textContent;
    }
    step1.hidden = false;
    step2.hidden = true;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("td-modal-open");
    setTimeout(() => modal.querySelector("input,select,textarea")?.focus(), 100);
  }

  function close() {
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("td-modal-open");
    setTimeout(() => {
      form.reset();
      step1.hidden = false;
      step2.hidden = true;
      lastFocus?.focus?.();
    }, 250);
  }

  // Open triggers
  document.querySelectorAll(".td-modal-trigger").forEach(btn => {
    btn.addEventListener("click", open);
  });

  // Close triggers
  modal.querySelectorAll("[data-modal-close]").forEach(el => {
    el.addEventListener("click", close);
  });

  // Esc to close
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") close();
  });

  // Form submit -> Web3Forms -> step 2
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span>';
    btn.disabled = true;
    const ok = await submitToWeb3Forms(form);
    btn.innerHTML = orig;
    btn.disabled = false;
    if (ok) { step1.hidden = true; step2.hidden = false; }
    else { alert('Could not send. Please call us at (978) 584-5424.'); }
  });
})();


/* ════════════════════════════════════════════════════
   FLEET INQUIRY MODAL — open / close / submit handlers
   ═══════════════════════════════════════════════════ */
(function initFleetModal() {
  const modal = document.getElementById("fleetModal");
  if (!modal) return;
  const form = document.getElementById("fleetModalForm");
  const step1 = modal.querySelector('[data-fleet-step="1"]');
  const step2 = modal.querySelector('[data-fleet-step="2"]');
  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    step1.hidden = false;
    step2.hidden = true;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("td-modal-open");
    setTimeout(() => modal.querySelector("input,select,textarea")?.focus(), 100);
  }

  function close() {
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("td-modal-open");
    setTimeout(() => {
      form.reset();
      step1.hidden = false;
      step2.hidden = true;
      lastFocus?.focus?.();
    }, 250);
  }

  // Open triggers (both .fleet-modal-trigger CTAs: Acquire Fleet + Talk to Fleet Team)
  document.querySelectorAll(".fleet-modal-trigger").forEach(btn => {
    btn.addEventListener("click", open);
  });

  // Close triggers
  modal.querySelectorAll("[data-fleet-close]").forEach(el => {
    el.addEventListener("click", close);
  });

  // Esc to close
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") close();
  });

  // Form submit -> Web3Forms -> step 2
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span>';
    btn.disabled = true;
    const ok = await submitToWeb3Forms(form);
    btn.innerHTML = orig;
    btn.disabled = false;
    if (ok) { step1.hidden = true; step2.hidden = false; }
    else { alert('Could not send. Please call us at (978) 584-5424.'); }
  });
})();


/* ── Phone link: WhatsApp on desktop, tel: on mobile ── */
(function () {
  const phoneLink = document.getElementById('contactPhone');
  if (!phoneLink) return;
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  if (!isMobile) {
    const waMsg = encodeURIComponent("Hello CarNext USA! I found your website and would like to get more information about your vehicles.");
    phoneLink.href = `https://wa.me/19785845424?text=${waMsg}`;
    phoneLink.setAttribute('target', '_blank');
    phoneLink.setAttribute('rel', 'noopener');
  }
})();
