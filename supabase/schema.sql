-- ============================================================
-- Calendrier Familial — Schéma Supabase
-- À coller et exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists users (
  id          text primary key,
  name        text not null,
  color       text not null default '#3b82f6',
  emoji       text not null default '👤',
  can_drive   boolean not null default true,
  created_at  timestamptz default now()
);

create table if not exists cars (
  id          text primary key,
  name        text not null,
  model       text not null default '',
  color       text not null default '#e2e8f0',
  emoji       text not null default '🚗',
  created_at  timestamptz default now()
);

create table if not exists events (
  id            text primary key,
  title         text not null,
  category      text not null,
  date          text not null,
  start_time    text,
  end_time      text,
  user_ids      text[] not null default '{}',
  week_type     text not null default 'both',
  notification  boolean not null default false,
  notes         text,
  created_at    timestamptz default now()
);

create table if not exists car_reservations (
  id            text primary key,
  car_id        text not null,
  user_id       text not null,
  date          text not null,
  return_date   text,
  destination   text not null,
  notes         text,
  created_at    timestamptz default now()
);

create table if not exists tasks (
  id                    text primary key,
  title                 text not null,
  assigned_user_ids     text[] not null default '{}',
  completed_by_user_id  text,
  completed_at          text,
  status                text not null default 'pending',
  date                  text not null,
  category              text,
  notes                 text,
  created_at            timestamptz default now()
);

create table if not exists trips (
  id            text primary key,
  destination   text not null,
  days          integer not null,
  flight_type   text not null,
  start_date    text not null,
  end_date      text not null,
  user_ids      text[] not null default '{}',
  notes         text,
  status        text not null default 'planned',
  created_at    timestamptz default now()
);

-- Application familiale privée : accès anonyme autorisé sur toutes les tables
alter table users           disable row level security;
alter table cars            disable row level security;
alter table events          disable row level security;
alter table car_reservations disable row level security;
alter table tasks           disable row level security;
alter table trips           disable row level security;
