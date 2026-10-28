-- Contact form inbox. Run once in the Supabase SQL editor.
-- /api/contact writes here with the server-side service role key (RLS stays closed to the public).
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  ip text,
  user_agent text,
  read boolean not null default false
);

alter table public.contact_messages enable row level security;
-- No policies on purpose: anon/authenticated cannot read or write; the service role bypasses RLS.
revoke all on public.contact_messages from anon, authenticated;
