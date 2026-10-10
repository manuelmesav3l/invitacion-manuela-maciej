-- Client round 3: Add dedicated transport_notes column to rsvps table and update RPCs.
-- Run in the Supabase SQL editor (https://supabase.com/dashboard/project/nwsxbilhvfdezlnucnyg/sql/new).

alter table rsvps
  add column if not exists transport_notes text check (transport_notes is null or char_length(transport_notes) <= 300);

-- Update get_guest to return transport_notes
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

-- Update submit_rsvp with optional p_transport_notes (keeps 10-parameter callers compatible)
create or replace function submit_rsvp(
  p_token text, p_full_name text, p_attending boolean, p_companions int, p_dietary text, p_message text,
  p_email text default null, p_phone text default null,
  p_needs_transport boolean default null, p_welcome_meeting boolean default null,
  p_transport_notes text default null
) returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare
  g guests;
  comp int := greatest(0, coalesce(p_companions, 0));
  v_email text := nullif(trim(coalesce(p_email, '')), '');
  v_phone text := nullif(trim(coalesce(p_phone, '')), '');
  v_notes text := nullif(trim(coalesce(p_transport_notes, '')), '');
begin
  if p_token is null or p_token = '' then
    raise exception 'A personal invitation link is required';
  end if;
  select * into g from guests where token = p_token;
  if not found then raise exception 'Invalid invitation token'; end if;
  if not p_attending then comp := 0; end if;
  if comp > g.max_companions then raise exception 'Too many companions'; end if;
  if v_email is not null and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Invalid email'; end if;
  if v_phone is not null and v_phone !~ '^[0-9+()\-\s.]{3,40}$' then raise exception 'Invalid phone'; end if;

  insert into rsvps (guest_id, full_name, attending, companions, dietary, message, email, phone, needs_transport, welcome_meeting, transport_notes)
  values (g.id, p_full_name, p_attending, comp, p_dietary, p_message, v_email, v_phone,
          case when p_attending then p_needs_transport end,
          case when p_attending then p_welcome_meeting end,
          case when p_attending then v_notes end)
  on conflict (guest_id) where guest_id is not null do update set
    full_name = excluded.full_name, attending = excluded.attending, companions = excluded.companions,
    dietary = excluded.dietary, message = excluded.message, email = excluded.email, phone = excluded.phone,
    needs_transport = excluded.needs_transport, welcome_meeting = excluded.welcome_meeting,
    transport_notes = coalesce(excluded.transport_notes, rsvps.transport_notes), updated_at = now();
end $$;

grant execute on function get_guest(text) to anon;
grant execute on function submit_rsvp(text, text, boolean, int, text, text, text, text, boolean, boolean, text) to anon;
