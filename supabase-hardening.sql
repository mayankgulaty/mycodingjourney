-- Optional hardening for view counting. Run in the Supabase SQL editor AFTER the
-- app is deployed with the server-side admin client (lib/articles.ts incrementViewCount).
-- Stops anyone from calling the RPC directly with the public anon key and inflating counts.
revoke execute on function public.increment_view_count(text) from anon, authenticated, public;
grant execute on function public.increment_view_count(text) to service_role;
