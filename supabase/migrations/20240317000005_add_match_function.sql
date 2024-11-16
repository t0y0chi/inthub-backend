create or replace function match_emails (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
returns table (
  id text,
  user_id uuid,
  thread_id text,
  subject text,
  "from" text,
  date timestamp with time zone,
  body text,
  url text,
  created_at timestamp with time zone,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    emails.id,
    emails.user_id,
    emails.thread_id,
    emails.subject,
    emails."from",
    emails.date,
    emails.body,
    emails.url,
    emails.created_at,
    1 - (emails.embedding <=> query_embedding) as similarity
  from emails
  where 
    emails.user_id = p_user_id
    and 1 - (emails.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$; 
