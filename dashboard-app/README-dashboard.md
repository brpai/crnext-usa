# Portal do Investidor CarNext — protótipo

Protótipo navegável do Portal do Investidor e do Painel Administrativo, com
**dados fictícios**. Sem backend, sem banco, sem autenticação real.

Vive em `dashboard-app/`, isolado do site estático de marketing em
`carnext-usa/` — que segue como está, com Tailwind via CDN e sem build.

---

## 1. Rodar

```bash
cd dashboard-app
npm install
npm run dev      # http://localhost:3100/dashboard/login
npm run build    # build de produção
npm run typecheck
```

Stack: Next.js 14 (App Router) · React 18 · TypeScript · Tailwind ·
Radix (accordion, dialog) · Recharts · lucide-react.

O tema usa a paleta institucional CarNext em fundo claro: `#F3EEEA` de fundo,
`#043A53` (azul petróleo) como tinta e marca, `#6AA4A8` como acento, Poppins.
Lucro e prejuízo são a única cor fora da paleta — e o prejuízo tem exatamente
o mesmo peso visual do lucro. Trocar de tema é editar `tailwind.config.ts`:
os nomes dos tokens (`brand-black` = fundo, `brand-white` = tinta) foram
mantidos justamente para que a paleta viva num arquivo só.

### Como entrar

Só entra quem está na lista de **acessos autorizados** — não existe cadastro
aberto nem seletor de perfil. O papel vem do acesso cadastrado.

Por enquanto (decisão de 10/09/2026) **somente `nex@carnextusa.com` (Admin)**
está autorizado.

1. Abra `/dashboard/login`, informe o e-mail e clique em **Receber código**.
2. No protótipo nenhum e-mail é enviado: informe o **código de acesso**,
   combinado diretamente com o Bruno. O código não fica neste repositório (que é
   público) — só o hash SHA-256, em `lib/data/mock/access.ts`.

Novos acessos são criados por um admin em `/dashboard/admin/acessos`, uma vez
por pessoa. No protótipo a lista fica no `localStorage` do navegador (chave
`cnx_access_grants_v2`) e vale só naquele navegador. A sessão é o cookie
`cnx_email`; "Sair" o apaga.

---

## 2. Rotas

### Investidor
| Rota | Tela |
|---|---|
| `/dashboard/login` | Login por e-mail + código — só e-mails autorizados |
| `/dashboard` | Visão geral: cards, histórico realizado, distribuição do capital, avisos |
| `/dashboard/veiculos` | Grid com filtro por status e ordenação por aging |
| `/dashboard/veiculos/[id]` | Ficha, galeria, cascata financeira, custos por categoria, timeline |
| `/dashboard/extrato` | Movimentos com filtro, saldo corrente e exportação CSV |
| `/dashboard/contratos` | Resumo em linguagem simples + visualizador de PDF |
| `/dashboard/aporte` | Solicitação de aporte + histórico realizado da operação |
| `/dashboard/suporte` | FAQ (11 perguntas) + tickets com thread |

### Admin
| Rota | Tela |
|---|---|
| `/dashboard/admin` | Capital sob gestão, conciliação de caixa, P&L em 3 buckets, estoque, vendas |
| `/dashboard/admin/investidores` | Tabela + `/[id]` com posição, alocações, extrato e contratos |
| `/dashboard/admin/veiculos` | Estoque, lançamento de custo por VIN, marcação de venda com rateio |
| `/dashboard/admin/alocacoes` | Alocação com as duas validações do domínio |
| `/dashboard/admin/contratos` | Upload e vínculo de contrato |
| `/dashboard/admin/solicitacoes` | Fila de aprovar/recusar |
| `/dashboard/admin/suporte` | Fila de tickets |
| `/dashboard/admin/auditoria` | Log de eventos |
| `/dashboard/admin/acessos` | Autorizar, revogar e reativar e-mails — **somente admin** |
| `/dashboard/admin/financeiro` | Financeiro: fluxo de caixa, resultado mensal, saídas por grupo e centro de custo, saldo por conta — **somente admin** |
| `/dashboard/admin/financeiro/lancamentos` | Entradas e saídas: filtros, novo lançamento, baixa, cancelamento, estorno e CSV |
| `/dashboard/admin/financeiro/contas` | Contas a pagar e a receber por vencimento, com baixa |

---

## 3. Onde estão os mocks

```
lib/data/mock/
├── investors.ts    4 investidores
├── vehicles.ts     12 veículos (6 vendidos, 4 à venda, 2 em preparo)
├── costs.ts        63 lançamentos de custo por VIN
├── allocations.ts  22 alocações (vários carros com 2–3 investidores)
├── movements.ts    51 movimentos de capital
├── contracts.ts    3 contratos
├── requests.ts     3 solicitações de aporte
├── tickets.ts      3 tickets
├── audit.ts        12 eventos
└── operating.ts    custos operacionais + caixa da empresa
```

Fotos: SVGs locais em `public/mock/` — carregam sem rede.

Perfil da base: custo final médio dos vendidos **US$ 7.185**, lucro líquido
médio **US$ 1.947**, com **uma venda no prejuízo** (BMW 328i, −US$ 855) e um
veículo com **113 dias** em estoque. A aritmética fecha: `landed = aquisição +
Σ custos`, e a soma das alocações nunca passa do custo do veículo.

**Nenhum componente importa mock diretamente.** Todo acesso passa por
`lib/data/*`.

---

## 4. Como a regra de conformidade está codificada

Não é disciplina de revisão — é tipo e é arquivo único.

**No tipo** (`lib/types.ts`): `Vehicle` é uma união discriminada.
`VehicleInStock` **não tem** os campos `salePriceCents`, `saleDate`,
`grossProfitCents`, `netProfitCents`. Tentar ler lucro de um veículo não
vendido é **erro de compilação**, não bug de UI. O type guard `isSold()` é o
único caminho para os campos de resultado.

`InvestorPosition.realizedShareCents` é `Cents | null` — `null` enquanto não
houver venda. Nunca zero, nunca estimativa.

**No texto** (`lib/copy.ts`): todo texto de conformidade mora em um arquivo só —
rótulo do direito, nota de resultados passados, rodapé de risco, resumo da
solicitação e as 11 perguntas do FAQ. Revisar linguagem é ler esse arquivo.

**Na tela**: a cascata financeira (`components/finance.tsx`) recebe apenas os
passos que a página montou. Veículo em estoque para no custo final e encerra
com "Resultado apurado somente na venda"; vendido segue até o share.

**Verificado no HTML renderizado**, não só no código: as 8 telas do investidor
foram varridas atrás de termos proibidos. As únicas ocorrências de "prazo",
"rendimento", "previsão", "estimativa" e "garantido" estão em frases de
**negação** ("Não há promessa de prazo, de valor ou de rendimento"). Nenhum
veículo em estoque renderiza campo de lucro, share ou preço de venda.

### Origem de aquisição

O canal de compra (leilão, praça, fornecedor) **não é modelado**. Não existe
campo `source` no tipo, na tabela nem no mock, e por isso não aparece na tela
nem no payload da página. A ficha do veículo mostra data de compra e preço de
aquisição; onde ele foi comprado é informação comercial da CarNext. Se um dia
for preciso no admin, entra em tabela separada com leitura restrita a admin.

### Pendências de contrato

Quatro respostas do FAQ e um bullet do resumo de contrato dependem de termos
que ainda não existem em documento: **tratamento do prejuízo sobre o capital,
saída antecipada, rateio do custo operacional fixo e renovação da vigência**.
Estão marcados com `TODO: CONFIRMAR` e renderizados com tarja âmbar visível —
não são texto inventado. Estão em `lib/copy.ts` (`TODO_CONTRACT` e o campo
`pendingContract` de cada item do FAQ).

---

## 5. Mapa para plugar o Supabase

Trocar o mock por backend é reescrever o **corpo** das funções abaixo. As
assinaturas são o contrato — nenhum componente muda.

### Funções a reescrever

| Arquivo | Função | Vira |
|---|---|---|
| `lib/data/vehicles.ts` | `listVehicles()` | `select * from vehicles order by purchase_date desc` |
| | `getVehicle(id)` | `select * from vehicles where id = $1` |
| | `getVehicleCosts(id)` | `select * from vehicle_costs where vehicle_id = $1` |
| `lib/data/investors.ts` | `listInvestors()` / `getInvestor(id)` | `select * from investors` |
| `lib/data/portfolio.ts` | `getInvestorPositions(id)` | join `allocations × vehicles` + distribuições |
| | `getInvestorPortfolio(id)` | agregação; candidata a view `investor_portfolio` |
| | `getRealizedTrackRecord()` | agregação só sobre `status = 'vendido'` |
| `lib/data/movements.ts` | `getInvestorMovements(id, filtro)` | `select * from capital_movements where investor_id = $1` |
| `lib/data/contracts.ts` | `getInvestorContracts(id)` | `contracts` + URL assinada do Storage |
| `lib/data/requests.ts` | `getInvestorRequests(id)` / `listRequests()` | `capital_requests` |
| `lib/data/tickets.ts` | `getInvestorTickets(id)` / `listTickets()` | `support_tickets` + `ticket_messages` |
| `lib/data/admin.ts` | `getAdminOverview()` | views agregadas; **exige papel admin** |
| | `listAllocations()`, `getVehicleFunding(id)` | `allocations` |
| | `getAuditLog()` | `audit_events` |
| `lib/session.ts` | `readSession()` / `clearSession()` | `supabase.auth.getSession()` + o próprio `access_grants` / `signOut()` |
| `lib/data/access.ts` | `requestLoginCode()` / `verifyLoginCode()` | `signInWithOtp()` / `verifyOtp({ type: "email" })` |
| | `listAccessGrants()`, `createAccessGrant()`, `revokeAccessGrant()`, `reactivateAccessGrant()` | `access_grants` (RLS: somente admin) — seção 5.1 |

Cada ponto está marcado com `TODO(supabase):` no código.

Escritas hoje simuladas em estado local, a virar server actions: criar ticket e
responder (`suporte`), solicitar aporte (`aporte`), lançar custo, marcar venda,
alocar capital, aprovar/recusar solicitação.

### Esquema sugerido

Dinheiro em **`bigint` de centavos**. Nunca `float`, nunca `money`.

```sql
create type vehicle_status  as enum ('em_preparo','a_venda','vendido');
create type cost_category   as enum ('aquisicao_taxas','transporte','mecanica',
                                     'funilaria','detail','pecas','documentacao','outros');
create type movement_type   as enum ('aporte','alocacao','devolucao','distribuicao_lucro');
create type request_status  as enum ('pendente','em_analise','aprovado','recusado');
create type app_role        as enum ('investidor','colaborador','admin');

-- papel e vínculo de cada pessoa vêm de `access_grants` (seção 5.1).
-- Não há tabela profiles: o acesso ATIVO do e-mail é a fonte da verdade.

create table investors (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid unique references auth.users(id),
  name          text not null,
  email         text not null unique,
  phone         text,
  joined_at     date not null default current_date,
  status        text not null default 'ativo',
  created_at    timestamptz not null default now()
);

create table vehicles (
  id                      uuid primary key default gen_random_uuid(),
  vin                     text not null unique,
  year                    int  not null,
  make                    text not null,
  model                   text not null,
  trim                    text,
  mileage                 int,
  color                   text,
  purchase_date           date not null,
  -- sem coluna de origem: onde o veículo foi comprado não trafega para o portal
  photos                  text[] not null default '{}',
  acquisition_cost_cents  bigint not null check (acquisition_cost_cents >= 0),
  asking_price_cents      bigint not null check (asking_price_cents >= 0),
  status                  vehicle_status not null default 'em_preparo',
  sale_price_cents        bigint,
  sale_date               date,
  -- o banco impede resultado em veículo não vendido:
  constraint resultado_so_se_vendido check (
    (status = 'vendido'  and sale_price_cents is not null and sale_date is not null)
    or
    (status <> 'vendido' and sale_price_cents is null     and sale_date is null)
  )
);

create table vehicle_costs (
  id           uuid primary key default gen_random_uuid(),
  vehicle_id   uuid not null references vehicles(id) on delete cascade,
  category     cost_category not null,
  description  text not null,
  amount_cents bigint not null check (amount_cents >= 0),
  date         date not null,
  supplier     text,
  receipt_path text            -- caminho no bucket 'receipts'
);
create index on vehicle_costs (vehicle_id);

-- custo final derivado, nunca digitado
create view vehicles_with_cost as
select v.*,
       coalesce(c.total, 0)                        as variable_costs_cents,
       v.acquisition_cost_cents + coalesce(c.total,0) as landed_cost_cents,
       case when v.status = 'vendido'
            then v.sale_price_cents - v.acquisition_cost_cents end as gross_profit_cents,
       case when v.status = 'vendido'
            then v.sale_price_cents - (v.acquisition_cost_cents + coalesce(c.total,0))
       end as net_profit_cents
from vehicles v
left join (select vehicle_id, sum(amount_cents) total
           from vehicle_costs group by vehicle_id) c on c.vehicle_id = v.id;

create table allocations (
  id            uuid primary key default gen_random_uuid(),
  investor_id   uuid not null references investors(id),
  vehicle_id    uuid not null references vehicles(id),
  amount_cents  bigint not null check (amount_cents > 0),
  share_percent numeric(6,2) not null check (share_percent > 0 and share_percent <= 100),
  date          date not null default current_date,
  unique (investor_id, vehicle_id)
);
create index on allocations (vehicle_id);

create table capital_movements (
  id             uuid primary key default gen_random_uuid(),
  investor_id    uuid not null references investors(id),
  type           movement_type not null,
  amount_cents   bigint not null,
  date           date not null,
  vehicle_id     uuid references vehicles(id),
  bank_reference text,
  note           text
);
create index on capital_movements (investor_id, date);

create table contracts (
  id             uuid primary key default gen_random_uuid(),
  investor_id    uuid not null references investors(id),
  title          text not null,
  signed_at      date not null,
  valid_from     date not null,
  valid_until    date not null,
  status         text not null default 'vigente',
  pdf_path       text,                     -- bucket 'contracts', privado
  summary_bullets text[] not null default '{}'
);

create table capital_requests (
  id             uuid primary key default gen_random_uuid(),
  investor_id    uuid not null references investors(id),
  amount_cents   bigint not null check (amount_cents > 0),
  method         text not null,
  message        text,
  status         request_status not null default 'pendente',
  created_at     timestamptz not null default now(),
  responded_at   timestamptz,
  admin_response text
);

create table support_tickets (
  id          uuid primary key default gen_random_uuid(),
  investor_id uuid not null references investors(id),
  subject     text not null,
  category    text not null,
  status      text not null default 'aberto',
  priority    text not null default 'normal',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table ticket_messages (
  id          uuid primary key default gen_random_uuid(),
  ticket_id   uuid not null references support_tickets(id) on delete cascade,
  author      text not null,           -- 'investidor' | 'carnext'
  author_name text not null,
  body        text not null,
  created_at  timestamptz not null default now()
);

create table audit_events (
  id        uuid primary key default gen_random_uuid(),
  at        timestamptz not null default now(),
  actor     text not null,
  action    text not null,
  entity    text not null,
  entity_id text not null,
  detail    text
);
```

**Invariante que precisa virar trigger** (validar só no cliente não protege
nada): a soma das alocações de um veículo não pode passar do seu custo final,
e uma alocação não pode exceder o capital disponível do investidor.

```sql
create or replace function check_allocation() returns trigger as $$
declare total bigint; landed bigint; available bigint;
begin
  select landed_cost_cents into landed
    from vehicles_with_cost where id = new.vehicle_id;

  select coalesce(sum(amount_cents),0) into total
    from allocations
   where vehicle_id = new.vehicle_id and id <> coalesce(new.id, gen_random_uuid());

  if total + new.amount_cents > landed then
    raise exception 'Alocações (%) excedem o custo final do veículo (%)',
      total + new.amount_cents, landed;
  end if;

  select coalesce(sum(case when type in ('aporte','devolucao') then amount_cents
                           when type = 'alocacao' then -amount_cents else 0 end), 0)
    into available
    from capital_movements where investor_id = new.investor_id;

  if new.amount_cents > available then
    raise exception 'Alocação (%) excede o capital disponível do investidor (%)',
      new.amount_cents, available;
  end if;

  return new;
end $$ language plpgsql;

create trigger allocations_guard
before insert or update on allocations
for each row execute function check_allocation();
```

### RLS — cada investidor só enxerga as próprias linhas

```sql
alter table investors         enable row level security;
alter table allocations       enable row level security;
alter table capital_movements enable row level security;
alter table contracts         enable row level security;
alter table capital_requests  enable row level security;
alter table support_tickets   enable row level security;
alter table ticket_messages   enable row level security;
alter table vehicles          enable row level security;
alter table vehicle_costs     enable row level security;
alter table audit_events      enable row level security;
alter table access_grants     enable row level security;

-- helpers: papel e vínculo vêm do acesso ATIVO do e-mail autenticado.
-- Revogar zera estes helpers na hora, mesmo com um JWT ainda válido.
create or replace function is_admin() returns boolean as $$
  select exists (select 1 from access_grants
                  where email = lower(auth.jwt() ->> 'email')
                    and status = 'ativo' and role = 'admin');
$$ language sql stable security definer set search_path = public;

-- admin + colaborador: operam o painel
create or replace function is_staff() returns boolean as $$
  select exists (select 1 from access_grants
                  where email = lower(auth.jwt() ->> 'email')
                    and status = 'ativo' and role in ('admin','colaborador'));
$$ language sql stable security definer set search_path = public;

create or replace function my_investor_id() returns uuid as $$
  select investor_id from access_grants
   where email = lower(auth.jwt() ->> 'email')
     and status = 'ativo' and role = 'investidor';
$$ language sql stable security definer set search_path = public;

-- o investidor lê a própria linha; admin lê todas
create policy investors_self on investors for select
  using (id = my_investor_id() or is_staff());

create policy allocations_self on allocations for select
  using (investor_id = my_investor_id() or is_staff());

create policy movements_self on capital_movements for select
  using (investor_id = my_investor_id() or is_staff());

create policy contracts_self on contracts for select
  using (investor_id = my_investor_id() or is_staff());

-- solicitação: o investidor lê e cria as próprias; só admin muda status
create policy requests_self_select on capital_requests for select
  using (investor_id = my_investor_id() or is_staff());
create policy requests_self_insert on capital_requests for insert
  with check (investor_id = my_investor_id());
create policy requests_admin_update on capital_requests for update
  using (is_staff());

create policy tickets_self on support_tickets for all
  using (investor_id = my_investor_id() or is_staff())
  with check (investor_id = my_investor_id() or is_staff());

create policy messages_self on ticket_messages for all
  using (exists (select 1 from support_tickets t
                  where t.id = ticket_id
                    and (t.investor_id = my_investor_id() or is_staff())))
  with check (exists (select 1 from support_tickets t
                       where t.id = ticket_id
                         and (t.investor_id = my_investor_id() or is_staff())));

-- veículo e custos: o investidor só vê os carros em que TEM capital alocado
create policy vehicles_allocated on vehicles for select
  using (is_staff() or exists (
    select 1 from allocations a
     where a.vehicle_id = vehicles.id and a.investor_id = my_investor_id()));

create policy costs_allocated on vehicle_costs for select
  using (is_staff() or exists (
    select 1 from allocations a
     where a.vehicle_id = vehicle_costs.vehicle_id
       and a.investor_id = my_investor_id()));

-- escrita no domínio: somente admin
create policy vehicles_admin_write   on vehicles      for all using (is_staff()) with check (is_staff());
create policy costs_admin_write      on vehicle_costs for all using (is_staff()) with check (is_staff());
create policy allocations_admin_write on allocations  for all using (is_staff()) with check (is_staff());
create policy movements_admin_write  on capital_movements for all using (is_staff()) with check (is_staff());

-- auditoria: leitura só admin, escrita só por trigger (security definer)
create policy audit_admin_read on audit_events for select using (is_staff());
```

Buckets do Storage: `receipts` e `contracts`, ambos **privados**, servidos por
URL assinada gerada no servidor. O investidor só recebe URL de comprovante de
veículo em que tem alocação.

**Views que a RLS não cobre sozinha:** `getAdminOverview()` agrega dados de
todos os investidores. Exponha como RPC `security definer` com
`if not is_staff() then raise exception`, ou mantenha a chamada apenas em
server component protegido por `requireAdmin()` **e** com policy de admin.

---

### 5.1 Acessos autorizados — só entra e-mail cadastrado

Regra do produto: ninguém cria conta sozinho. Um **admin** autoriza o e-mail
**uma vez** na tela Acessos, escolhendo o papel. Daí em diante a pessoa entra
sozinha sempre que quiser: digita o e-mail, recebe um código de 6 dígitos e
entra. Revogar corta o acesso.

| Papel | Abre | Gerencia acessos |
|---|---|---|
| Investidor | `/dashboard` — só a própria carteira | não |
| Colaborador | `/dashboard/admin` — opera o painel | não |
| Admin | `/dashboard/admin` + Acessos | sim |

Onde fica a barreira de verdade:

1. **Trigger em `auth.users`** recusa criar usuário cujo e-mail não tem acesso
   ativo — o código nem chega a ser enviado.
2. **Revogar** apaga o usuário de `auth.users`: derruba a sessão, e um novo
   pedido de código cai no item 1.
3. **Helpers da RLS** só reconhecem acesso **ativo**: um JWT ainda válido deixa
   de ver dados no mesmo instante.
4. O que roda no navegador (portão do `<head>`, `useRequireRole`) é só
   navegação — nunca segurança.

```sql
create table access_grants (
  id           uuid primary key default gen_random_uuid(),
  email        text not null check (email = lower(btrim(email))),
  name         text not null,
  role         app_role not null,
  investor_id  uuid references investors(id),
  status       text not null default 'ativo' check (status in ('ativo','revogado')),
  created_at   timestamptz not null default now(),
  created_by   uuid references auth.users(id) on delete set null,
  revoked_at   timestamptz,
  revoked_by   uuid references auth.users(id) on delete set null,
  constraint investidor_tem_vinculo
    check ((role = 'investidor') = (investor_id is not null))
);

-- um único acesso ativo por e-mail
create unique index access_grants_email_ativo
  on access_grants (email) where status = 'ativo';

-- 1) só e-mail autorizado vira usuário
create or replace function public.exigir_acesso_autorizado() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.access_grants
                  where email = lower(new.email) and status = 'ativo') then
    raise exception 'email_nao_autorizado';
  end if;
  return new;
end $$;

create trigger exigir_acesso_autorizado
  before insert on auth.users
  for each row execute function public.exigir_acesso_autorizado();

-- 2) revogar derruba o usuário; nunca revoga o último admin ativo
create or replace function public.ao_revogar_acesso() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'revogado' and old.status = 'ativo' then
    if old.role = 'admin' and not exists (
      select 1 from public.access_grants
       where role = 'admin' and status = 'ativo' and id <> old.id) then
      raise exception 'ultimo_admin_ativo';
    end if;
    delete from auth.users where lower(email) = old.email;
  end if;
  return new;
end $$;

create trigger ao_revogar_acesso
  before update of status on access_grants
  for each row execute function public.ao_revogar_acesso();

-- admin gerencia; cada pessoa lê só o próprio acesso ativo (para saber o papel)
create policy grants_admin_all on access_grants for all
  using (is_admin()) with check (is_admin());
create policy grants_self_read on access_grants for select
  using (email = lower(auth.jwt() ->> 'email') and status = 'ativo');
```

**Configuração no painel do Supabase**

- *Authentication → Sign In / Providers → Email*: ativo, com cadastro de novos
  usuários **permitido** — quem barra é o trigger. Desligar o cadastro impede o
  primeiro login de um e-mail que acabou de ser autorizado.
- *Authentication → Email Templates → Magic Link*: o corpo deve exibir
  `{{ .Token }}` (o código de 6 dígitos) em vez do link.
- *Authentication → SMTP*: SMTP próprio (ex.: Resend com domínio da CarNext).
  O envio padrão do Supabase tem limite baixo e não serve para produção.
- **Primeiro admin**, uma única vez, no SQL Editor:
  `insert into access_grants (email, name, role) values ('voce@carnextusa.com', 'Seu nome', 'admin');`

Validar os dois triggers no projeto real antes de convidar investidores: as
permissões do Supabase sobre o schema `auth` já mudaram mais de uma vez.

### 5.2 Financeiro da empresa — somente admin (protótipo)

Decisões do Bruno (10/09/2026): telas com dados fictícios primeiro; acesso
**somente Admin**; dados reais só depois da fundação segura (Supabase +
verificação em duas etapas), com backup do Supabase **e** cópia no Google
Drive, e o portal num repositório privado com Netlify/Vercel.

Regras que o código já cumpre e o banco precisa repetir:

- Valor sempre positivo em centavos; o sentido é `direction` (entrada/saída).
- **Nada é apagado.** Conta pendente é baixada ou cancelada; lançamento pago
  só se corrige com **estorno** (lançamento oposto ligado ao original).
- **Capital de investidores** (aporte, distribuição) passa pelo caixa, mas
  fica **fora do resultado** da empresa.
- Grupos: receita · custo de veículos · custo fixo · custo variável
  operacional · impostos · capital de investidores. Centros de custo: loja ·
  veículos · comercial · administrativo.

No protótipo, a base fictícia é gerada em `lib/data/mock/ledger.ts` a partir
dos veículos, custos e movimentos de investidor já existentes, e as alterações
ficam no `localStorage` (`cnx_ledger_v1`).

```sql
create type ledger_direction as enum ('entrada','saida');
create type ledger_group     as enum ('receita','custo_veiculo','custo_fixo',
                                      'custo_variavel_operacional','impostos','capital_investidor');
create type ledger_status    as enum ('pago','pendente','cancelado');

create table finance_accounts (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  kind                  text not null check (kind in ('banco','caixa')),
  opening_balance_cents bigint not null default 0
);

create table ledger_entries (
  id            uuid primary key default gen_random_uuid(),
  entry_date    date not null,
  direction     ledger_direction not null,
  entry_group   ledger_group not null,
  category      text not null,
  cost_center   text not null check (cost_center in ('loja','veiculos','comercial','administrativo')),
  description   text not null,
  amount_cents  bigint not null check (amount_cents > 0),
  account_id    uuid not null references finance_accounts(id),
  method        text not null,
  counterparty  text not null,
  vehicle_id    uuid references vehicles(id),
  status        ledger_status not null,
  due_date      date,
  paid_at       date,
  receipt_path  text,            -- bucket privado, servido por URL assinada
  created_by    uuid not null default auth.uid() references auth.users(id),
  created_at    timestamptz not null default now(),
  reversal_of   uuid references ledger_entries(id),
  constraint pendente_tem_vencimento check (status <> 'pendente' or due_date is not null),
  constraint pago_tem_data           check (status <> 'pago' or paid_at is not null)
);

alter table finance_accounts enable row level security;
alter table ledger_entries   enable row level security;

create policy fin_accounts_admin on finance_accounts for all
  using (is_admin()) with check (is_admin());
create policy ledger_admin_read   on ledger_entries for select using (is_admin());
create policy ledger_admin_insert on ledger_entries for insert with check (is_admin());
-- sem update/delete direto: baixa, cancelamento e estorno só por funções
-- security definer que validam o estado e gravam a auditoria.
```

## 6. Deploy

O app tem build (o site de marketing não). Duas opções:

1. **Deploy separado** (Vercel/Netlify) e proxy de `carnextusa.com/dashboard`
   para ele. Mantém o site estático no GitHub Pages como está.
2. **Export estático** (`output: 'export'` no `next.config.mjs`) publicado em
   `/dashboard/` do mesmo repo. Exige `generateStaticParams` nas rotas `[id]`
   e desliga server actions — com Supabase no cliente ainda funciona, mas os
   guards de rota passam a ser só de navegação, não de segurança. A proteção
   real, em qualquer das duas opções, é a RLS.

---

## 7. Aviso

Todos os dados deste protótipo são **fictícios**. Investidores, VINs, valores,
comprovantes e contratos foram inventados para demonstração. Nenhuma tela foi
validada juridicamente; a redação final da comunicação com investidores deve
ser revista por advogado antes de qualquer uso real.
