-- Guests are seeded by the couple (dashboard / SQL). RSVPs are written only through RPC.
create extension if not exists pgcrypto;

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  name text not null,
  max_companions int not null default 0
);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references guests(id),
  full_name text not null check (char_length(full_name) between 1 and 120),
  attending boolean not null,
  companions int not null default 0 check (companions between 0 and 20),
  dietary text check (char_length(dietary) <= 500),
  message text check (char_length(message) <= 1000),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- one response per invited guest (edit = update); open-link responses have guest_id null
create unique index if not exists rsvps_guest_unique on rsvps(guest_id) where guest_id is not null;

alter table guests enable row level security;
alter table rsvps enable row level security;
-- No policies => no direct table access for anon/authenticated. Public read is disabled.
revoke all on guests, rsvps from anon, authenticated;

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
      'dietary', r.dietary, 'message', r.message) end);
end $$;

create or replace function submit_rsvp(
  p_token text, p_full_name text, p_attending boolean, p_companions int, p_dietary text, p_message text
) returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare g guests; comp int := greatest(0, coalesce(p_companions, 0));
begin
  if p_token is null or p_token = '' then
    raise exception 'A personal invitation link is required';
  end if;
  select * into g from guests where token = p_token;
  if not found then raise exception 'Invalid invitation token'; end if;
  if not p_attending then comp := 0; end if;
  if comp > g.max_companions then raise exception 'Too many companions'; end if;

  -- rate limit: the partial unique index allows exactly one row per guest (edits update it in place).

  insert into rsvps (guest_id, full_name, attending, companions, dietary, message)
  values (g.id, p_full_name, p_attending, comp, p_dietary, p_message)
  on conflict (guest_id) where guest_id is not null do update set
    full_name = excluded.full_name, attending = excluded.attending, companions = excluded.companions,
    dietary = excluded.dietary, message = excluded.message, updated_at = now();
end $$;

grant execute on function get_guest(text), submit_rsvp(text, text, boolean, int, text, text) to anon;
