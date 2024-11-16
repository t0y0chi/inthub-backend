create table public.users (
  id uuid primary key,
  email text unique not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Create policy for anon and authenticated users
create policy "Public users are viewable"
  on public.users
  for select
  to anon, authenticated
  using (true);

-- Create policy for insert and update
create policy "Enable insert and update for all users"
  on public.users
  for all
  to anon, authenticated
  using (true)
  with check (true);
