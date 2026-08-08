-- MindScroll — Day 1 schema
-- Tables: cards, category_engagement, seen_cards, favorites, chat_threads, chat_messages
-- Card record shape and tier/niche/citation fields follow the Production Readiness Report.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- cards: the shared content pool (seed + AI-generated)
-- ─────────────────────────────────────────────────────────────
create table if not exists cards (
  id                 uuid primary key default gen_random_uuid(),
  external_id        text unique,                 -- legacy id e.g. "biz-001", optional
  group_name         text not null,                -- "The World" / "The Mind" / "Science" / "Curiosity"
  category           text not null,
  tier               smallint not null default 1 check (tier in (1, 2, 3)),
  niche_tags         text[] not null default '{}',
  title              text not null,
  summary            text not null,                -- level1.summary
  how_it_works       text,                          -- level2.howItWorks
  why_it_matters     text,                          -- level2.whyItMatters
  example            text,                          -- level2.example
  source_name        text,                          -- level2.sourceReference.name
  source_url         text,                          -- level2.sourceReference.url
  citation_verified  boolean not null default false,
  resources          jsonb not null default '[]',   -- level2.resources[]
  source             text not null default 'seed' check (source in ('seed', 'ai-generated')),
  moderation_status  text not null default 'approved' check (moderation_status in ('pending', 'approved', 'rejected')),
  model              text,
  prompt_version     text,
  served_count       integer not null default 0,
  generated_at       timestamptz,
  created_at         timestamptz not null default now()
);

create index if not exists cards_category_tier_idx on cards (category, tier);

-- ─────────────────────────────────────────────────────────────
-- category_engagement: per-user, per-category score driving tier/niche
-- ─────────────────────────────────────────────────────────────
create table if not exists category_engagement (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  category    text not null,
  score       integer not null default 0,
  updated_at  timestamptz not null default now(),
  unique (user_id, category)
);

-- ─────────────────────────────────────────────────────────────
-- seen_cards: dedup — cards already shown to a user
-- ─────────────────────────────────────────────────────────────
create table if not exists seen_cards (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references auth.users (id) on delete cascade,
  card_id  uuid not null references cards (id) on delete cascade,
  seen_at  timestamptz not null default now(),
  unique (user_id, card_id)
);

-- ─────────────────────────────────────────────────────────────
-- favorites
-- ─────────────────────────────────────────────────────────────
create table if not exists favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  card_id     uuid not null references cards (id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, card_id)
);

-- ─────────────────────────────────────────────────────────────
-- chat_threads / chat_messages: one thread per (user, card)
-- ─────────────────────────────────────────────────────────────
create table if not exists chat_threads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  card_id     uuid not null references cards (id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, card_id)
);

create table if not exists chat_messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references chat_threads (id) on delete cascade,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists chat_messages_thread_idx on chat_messages (thread_id, created_at);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security — every per-user table is scoped to auth.uid();
-- cards is readable by any authenticated user, writes are service-role only
-- (server-side generation), matching the "no secrets/writes on the client"
-- architecture from the Production Readiness Report.
-- ─────────────────────────────────────────────────────────────
alter table cards enable row level security;
alter table category_engagement enable row level security;
alter table seen_cards enable row level security;
alter table favorites enable row level security;
alter table chat_threads enable row level security;
alter table chat_messages enable row level security;

create policy "cards readable by authenticated users"
  on cards for select
  to authenticated
  using (moderation_status = 'approved');

create policy "own engagement only"
  on category_engagement for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own seen cards only"
  on seen_cards for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own favorites only"
  on favorites for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own chat threads only"
  on chat_threads for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own chat messages only"
  on chat_messages for all
  to authenticated
  using (
    exists (
      select 1 from chat_threads
      where chat_threads.id = chat_messages.thread_id
      and chat_threads.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from chat_threads
      where chat_threads.id = chat_messages.thread_id
      and chat_threads.user_id = auth.uid()
    )
  );
