-- Enable pgvector extension
create extension if not exists vector;

-- Create emails table
create table public.emails (
  id text primary key,
  user_id uuid not null,
  thread_id text not null,
  subject text,
  "from" text,
  date timestamp with time zone,
  body text,
  url text,
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint fk_user
    foreign key(user_id)
    references auth.users(id)
    on delete cascade
);

-- Create index for vector similarity search
create index on emails 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Enable RLS
alter table public.emails enable row level security;

-- Create policy
create policy "Users can only access their own emails"
  on public.emails
  for all
  using (auth.uid() = user_id); 
