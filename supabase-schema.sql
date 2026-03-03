-- YT Digest — Supabase Schema
-- Run this in the Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  security_word text not null,
  created_at    timestamp with time zone default now()
);

-- Videos table
create table if not exists public.videos (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  youtube_url    text not null,
  title          text not null default 'Sin título',
  transcript     text not null default '',
  summary        text not null default '',
  reading_time   integer not null default 5,
  google_doc_url text,
  created_at     timestamp with time zone default now()
);

-- Messages table
create table if not exists public.messages (
  id         uuid primary key default uuid_generate_v4(),
  video_id   uuid not null references public.videos(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists videos_user_id_idx on public.videos(user_id);
create index if not exists videos_created_at_idx on public.videos(created_at desc);
create index if not exists messages_video_id_idx on public.messages(video_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.messages enable row level security;

-- Profiles RLS
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Videos RLS
create policy "Users can view own videos"
  on public.videos for select
  using (auth.uid() = user_id);

create policy "Users can insert own videos"
  on public.videos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own videos"
  on public.videos for update
  using (auth.uid() = user_id);

create policy "Users can delete own videos"
  on public.videos for delete
  using (auth.uid() = user_id);

-- Messages RLS (via video ownership)
create policy "Users can view messages of own videos"
  on public.messages for select
  using (
    exists (
      select 1 from public.videos
      where videos.id = messages.video_id
        and videos.user_id = auth.uid()
    )
  );

create policy "Users can insert messages to own videos"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.videos
      where videos.id = messages.video_id
        and videos.user_id = auth.uid()
    )
  );
