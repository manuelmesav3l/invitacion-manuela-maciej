-- Optional client round 3: Add dedicated transport_notes column to rsvps table.
-- Run after 0002_rsvp_contact_transport_welcome.sql in the Supabase SQL editor.
-- Note: The frontend is fully backwards-compatible whether or not this migration is executed,
-- because it transparently packs/unpacks transport details into the message payload while
-- preserving the boolean needs_transport flag.

alter table rsvps
  add column if not exists transport_notes text check (transport_notes is null or char_length(transport_notes) <= 300);

create or replace function get_guest(p_token text) returns json
language plpgsql security definer set search_path = public, pg_temp as $$
declare g guests; r rsvps;
begin
  if p_token is null or length(trim(p_token)) < 3 then return null; end if;
  select * into g from guests where token = p_token;
  if not found then return null; end if;
  select * into r from rsvps where guest_id = g.id;
  return json_build_object(
    'name', g.name, 'max_companions', g.max_companions,
    'response', case when r.id is null then null else json_build_object(
      'full_name', r.full_name, 'attending', r.attending, 'companions', r.companions,
      'dietary', r.dietary, 'message', r.message,
      'email', r.email, 'phone', r.phone,
      'needs_transport', r.needs_transport, 'welcome_meeting', r.welcome_meeting,
      'transport_notes', r.transport_notes) end);
end $$;

grant execute on function get_guest(text) to anon;
