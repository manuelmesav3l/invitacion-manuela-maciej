-- ==============================================================================
-- MIGRACIÓN 0006: GESTIÓN DE INVITADOS PARA LA NOVIA (ADMIN PANEL)
-- URL para ejecutar en Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nwsxbilhvfdezlnucnyg/sql/new
-- ==============================================================================

-- 1. Agregar columnas created_at y notes en guests si no existen
alter table guests
  add column if not exists created_at timestamptz default now(),
  add column if not exists notes text;

-- 2. Tabla de configuración para PIN de acceso de la novia
create table if not exists app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Insertar PIN por defecto: 'manuela2026' (la novia puede cambiarlo cuando desee)
insert into app_config (key, value)
values ('admin_pin', 'manuela2026')
on conflict (key) do nothing;

alter table app_config enable row level security;
revoke all on app_config from anon, authenticated;

-- Función interna para validar el PIN
create or replace function admin_verify_pin(p_pin text) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_real_pin text;
begin
  select value into v_real_pin from app_config where key = 'admin_pin';
  if v_real_pin is null then
    v_real_pin := 'manuela2026';
  end if;
  return trim(coalesce(p_pin, '')) = v_real_pin;
end $$;

-- 3. RPC para obtener la lista completa de invitados con sus respuestas de RSVP
create or replace function admin_get_guests(p_pin text) returns json
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_result json;
begin
  if not admin_verify_pin(p_pin) then
    raise exception 'Clave de acceso incorrecta';
  end if;

  select coalesce(json_agg(
    json_build_object(
      'id', g.id,
      'name', g.name,
      'phone', g.phone,
      'email', g.email,
      'max_companions', g.max_companions,
      'token', g.token,
      'notes', g.notes,
      'created_at', g.created_at,
      'rsvp', case when r.id is null then null else json_build_object(
        'id', r.id,
        'full_name', r.full_name,
        'attending', r.attending,
        'companions', r.companions,
        'dietary', r.dietary,
        'message', r.message,
        'phone', r.phone,
        'email', r.email,
        'needs_transport', r.needs_transport,
        'welcome_meeting', r.welcome_meeting,
        'transport_notes', r.transport_notes,
        'updated_at', r.updated_at
      ) end
    ) order by g.created_at desc nulls last, g.name asc
  ), '[]'::json) into v_result
  from guests g
  left join rsvps r on r.guest_id = g.id;

  return v_result;
end $$;

-- 4. RPC para crear o actualizar un invitado
create or replace function admin_save_guest(
  p_pin text,
  p_id uuid default null,
  p_name text default null,
  p_phone text default null,
  p_email text default null,
  p_max_companions int default 0,
  p_notes text default null
) returns json
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_guest guests;
  v_token text;
  v_name text := trim(coalesce(p_name, ''));
  v_phone text := nullif(trim(coalesce(p_phone, '')), '');
  v_email text := nullif(lower(trim(coalesce(p_email, ''))), '');
  v_notes text := nullif(trim(coalesce(p_notes, '')), '');
  v_comp int := greatest(0, coalesce(p_max_companions, 0));
begin
  if not admin_verify_pin(p_pin) then
    raise exception 'Clave de acceso incorrecta';
  end if;

  if length(v_name) < 2 then
    raise exception 'El nombre del invitado debe tener al menos 2 caracteres';
  end if;

  if p_id is null then
    -- Crear nuevo invitado con token único aleatorio
    loop
      v_token := encode(gen_random_bytes(6), 'hex');
      exit when not exists (select 1 from guests where token = v_token);
    end loop;

    insert into guests (name, phone, email, max_companions, token, notes, created_at)
    values (v_name, v_phone, v_email, v_comp, v_token, v_notes, now())
    returning * into v_guest;
  else
    -- Actualizar invitado existente
    update guests set
      name = v_name,
      phone = v_phone,
      email = v_email,
      max_companions = v_comp,
      notes = v_notes
    where id = p_id
    returning * into v_guest;

    if not found then
      raise exception 'Invitado no encontrado';
    end if;
  end if;

  return json_build_object(
    'id', v_guest.id,
    'name', v_guest.name,
    'phone', v_guest.phone,
    'email', v_guest.email,
    'max_companions', v_guest.max_companions,
    'token', v_guest.token,
    'notes', v_guest.notes,
    'created_at', v_guest.created_at
  );
end $$;

-- 5. RPC para eliminar un invitado
create or replace function admin_delete_guest(
  p_pin text,
  p_id uuid
) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not admin_verify_pin(p_pin) then
    raise exception 'Clave de acceso incorrecta';
  end if;

  if p_id is null then
    raise exception 'ID de invitado requerido';
  end if;

  -- Eliminar RSVP asociado si existe
  delete from rsvps where guest_id = p_id;
  -- Eliminar invitado
  delete from guests where id = p_id;

  return true;
end $$;

-- 6. RPC para cambiar PIN
create or replace function admin_change_pin(
  p_old_pin text,
  p_new_pin text
) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not admin_verify_pin(p_old_pin) then
    raise exception 'PIN actual incorrecto';
  end if;

  if length(trim(coalesce(p_new_pin, ''))) < 4 then
    raise exception 'El nuevo PIN debe tener al menos 4 caracteres';
  end if;

  insert into app_config (key, value, updated_at)
  values ('admin_pin', trim(p_new_pin), now())
  on conflict (key) do update set value = excluded.value, updated_at = now();

  return true;
end $$;

-- 7. Conceder permisos de ejecución al rol anon
grant execute on function admin_verify_pin(text) to anon;
grant execute on function admin_get_guests(text) to anon;
grant execute on function admin_save_guest(text, uuid, text, text, text, int, text) to anon;
grant execute on function admin_delete_guest(text, uuid) to anon;
grant execute on function admin_change_pin(text, text) to anon;
