-- ==============================================================================
-- FIX BUG: Phone lookup matching guests with NULL/empty phone
-- Execute this script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nwsxbilhvfdezlnucnyg/sql/new
-- ==============================================================================

-- 1. Clean up any dummy/test guest record if exists
delete from rsvps where guest_id in (select id from guests where token = 'prueba-vip-2027');
delete from guests where token = 'prueba-vip-2027';

-- 2. Replace get_guest_by_phone with strict non-empty phone checks
create or replace function get_guest_by_phone(p_phone text) returns json
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_phone_digits text := normalize_phone(p_phone);
  g guests;
  r rsvps;
begin
  if length(v_phone_digits) < 6 then
    return null;
  end if;

  -- Match ONLY guests that actually have a registered phone (at least 6 digits)
  select * into g from guests
  where phone is not null
    and length(normalize_phone(phone)) >= 6
    and (
      normalize_phone(phone) = v_phone_digits
      or (length(v_phone_digits) >= 8 and normalize_phone(phone) like '%' || v_phone_digits)
      or (length(normalize_phone(phone)) >= 8 and v_phone_digits like '%' || normalize_phone(phone))
    )
  order by (normalize_phone(phone) = v_phone_digits) desc
  limit 1;

  if found then
    select * into r from rsvps where guest_id = g.id limit 1;
    return json_build_object(
      'token', g.token,
      'name', g.name,
      'max_companions', g.max_companions,
      'response', case when r.id is null then null else json_build_object(
        'full_name', r.full_name,
        'attending', r.attending,
        'companions', r.companions,
        'dietary', r.dietary,
        'message', r.message,
        'email', coalesce(r.email, g.email),
        'phone', coalesce(r.phone, g.phone),
        'needs_transport', r.needs_transport,
        'welcome_meeting', r.welcome_meeting,
        'transport_notes', r.transport_notes
      ) end
    );
  end if;

  return null;
end $$;

-- 3. Replace submit_rsvp with the same strict non-empty phone checks
create or replace function submit_rsvp(
  p_token text, p_full_name text, p_attending boolean, p_companions int, p_dietary text, p_message text,
  p_email text default null, p_phone text default null,
  p_needs_transport boolean default null, p_welcome_meeting boolean default null,
  p_transport_notes text default null
) returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare
  g guests;
  comp int := greatest(0, coalesce(p_companions, 0));
  v_email text := nullif(lower(trim(coalesce(p_email, ''))), '');
  v_phone text := nullif(trim(coalesce(p_phone, '')), '');
  v_phone_digits text := normalize_phone(v_phone);
  v_notes text := nullif(trim(coalesce(p_transport_notes, '')), '');
  v_guest_id uuid := null;
  v_max_comp int := 10;
begin
  if v_email is not null and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Invalid email';
  end if;
  if v_phone is not null and length(v_phone_digits) < 6 then
    raise exception 'Invalid phone number';
  end if;

  -- 1) Try token first if supplied
  if p_token is not null and length(trim(p_token)) >= 3 then
    select * into g from guests where token = trim(p_token);
    if found then
      v_guest_id := g.id;
      v_max_comp := g.max_companions;
    end if;
  end if;

  -- 2) If no guest found yet by token, try by phone number (ONLY guests with registered phone >= 6 digits)
  if v_guest_id is null and length(v_phone_digits) >= 6 then
    select * into g from guests
    where phone is not null
      and length(normalize_phone(phone)) >= 6
      and (
        normalize_phone(phone) = v_phone_digits
        or (length(v_phone_digits) >= 8 and normalize_phone(phone) like '%' || v_phone_digits)
        or (length(normalize_phone(phone)) >= 8 and v_phone_digits like '%' || normalize_phone(phone))
      )
    order by (normalize_phone(phone) = v_phone_digits) desc
    limit 1;

    if found then
      v_guest_id := g.id;
      v_max_comp := g.max_companions;
    end if;
  end if;

  -- 3) Strict guest-list validation: The guest MUST exist in the guests table
  if v_guest_id is null then
    raise exception 'Phone number or invitation link not found in the guest list';
  end if;

  if not p_attending then
    comp := 0;
  end if;

  if comp > v_max_comp then
    raise exception 'Too many companions';
  end if;

  -- 4) Upsert the RSVP tied to the validated guest_id
  insert into rsvps (guest_id, full_name, attending, companions, dietary, message, email, phone, needs_transport, welcome_meeting, transport_notes)
  values (v_guest_id, p_full_name, p_attending, comp, p_dietary, p_message, v_email, v_phone,
          case when p_attending then p_needs_transport end,
          case when p_attending then p_welcome_meeting end,
          case when p_attending then v_notes end)
  on conflict (guest_id) where guest_id is not null do update set
    full_name = excluded.full_name, attending = excluded.attending, companions = excluded.companions,
    dietary = excluded.dietary, message = excluded.message,
    email = coalesce(excluded.email, rsvps.email),
    phone = coalesce(excluded.phone, rsvps.phone),
    needs_transport = excluded.needs_transport, welcome_meeting = excluded.welcome_meeting,
    transport_notes = coalesce(excluded.transport_notes, rsvps.transport_notes), updated_at = now();
end $$;

grant execute on function get_guest_by_phone(text) to anon;
grant execute on function submit_rsvp(text, text, boolean, int, text, text, text, text, boolean, boolean, text) to anon;
