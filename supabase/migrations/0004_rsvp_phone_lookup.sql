-- ==============================================================================
-- RUN THIS SCRIPT IN SUPABASE SQL EDITOR:
-- URL: https://supabase.com/dashboard/project/nwsxbilhvfdezlnucnyg/sql/new
-- ==============================================================================

-- 1. Ensure phone column exists on guests and rsvps tables
alter table guests
  add column if not exists phone text,
  add column if not exists email text;

alter table rsvps
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists needs_transport boolean,
  add column if not exists welcome_meeting boolean,
  add column if not exists transport_notes text check (transport_notes is null or char_length(transport_notes) <= 300);

-- Helper function to normalize phones (removes non-digits)
create or replace function normalize_phone(p text) returns text
language sql immutable as $$
  select regexp_replace(coalesce(p, ''), '[^0-9]', '', 'g');
$$;

create index if not exists guests_phone_norm_idx on guests (normalize_phone(phone)) where phone is not null;
create index if not exists rsvps_phone_norm_idx on rsvps (normalize_phone(phone)) where phone is not null;

-- 2. get_guest_by_phone RPC
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

  -- Match guest by normalized phone (exact or matching local 8+ digits)
  select * into g from guests
  where normalize_phone(phone) = v_phone_digits
     or (length(v_phone_digits) >= 8 and normalize_phone(phone) like '%' || v_phone_digits)
     or (length(v_phone_digits) >= 8 and v_phone_digits like '%' || normalize_phone(phone))
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

-- 3. submit_rsvp with strict guest whitelist check
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

  -- 2) If no guest found yet by token, try by phone number
  if v_guest_id is null and length(v_phone_digits) >= 6 then
    select * into g from guests
    where normalize_phone(phone) = v_phone_digits
       or (length(v_phone_digits) >= 8 and normalize_phone(phone) like '%' || v_phone_digits)
       or (length(v_phone_digits) >= 8 and v_phone_digits like '%' || normalize_phone(phone))
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

-- 4. Seed and update all phone numbers in the guests table
insert into guests (name, max_companions, token, phone)
select v.name, v.max_companions, v.token, v.phone
from (values
  ('Vanessa García', 1, '118b6fa64cd7b3bf794104a8', '+97450199807'),
  ('Diana Rozo', 1, '1a7c946adec9c5e373d4d525', '+573118466331'),
  ('Noora Almannai', 1, '305d47c3f0a0265319d77e62', '+97430677767'),
  ('Clara Moreno', 2, '24552a515246220bc025727f', '+34604233191'),
  ('Malory Nikolić', 1, 'b09bfb5281ec5a82ca50e9bb', '+97431131600'),
  ('Jose Cuán', 1, 'ceda3f2c7145380d146d25d6', '+4916094470611'),
  ('María Alejandra Alzate', 1, '03d2d28a1547685347d533cb', '+573174279995'),
  ('Alejandro Monsalve', 1, 'ea45b3673274529ccef85633', '+573186455555'),
  ('Manuela Fedele', 1, '31c545bb053e02026715f306', '+15614549737'),
  ('Carolina Velasquez', 1, 'def28fdc4816522ddaaa11ca', '+573003458492'),
  ('Catalina Salazar', 1, '8999ea591265606df818bb3a', '+573122229530'),
  ('Rodolfo López', 1, 'e0ec7949d90b12103844793a', '+573042463233'),
  ('Elizabeth Alzate', 2, '50eafdda3f979dbdd6f9c4af', '+573128416959'),
  ('Laura Mejia', 5, '07fa12e1a548c7865d0e83f9', '+573192384923'),
  ('Susana González', 2, '2afe059f1197e023527128e0', '+573017935670'),
  ('Laura Yepes', 1, '55c0c45b6c229a885ecd96a6', '+573006678886'),
  ('Ángela Yepes', 1, 'a05adf5bc5697cf7eecaf1d9', '+573117345256'),
  ('Juan Fernando Yepes', 2, 'e907377f75d90f199940d5f9', '+14079783021'),
  ('Perseverance Poho', 1, '15717e72238cd8108dc55b38', '+97439902337'),
  ('Gloriana Zelada', 0, '98b1aed5d4c3be6fbea714dd', '+97433244671'),
  ('Duvan Peña', 0, '099fe64566acdd2efbec0d6f', '+31684344113'),
  ('Daniela Cardona', 0, 'a003b42f27f909466a31bc02', '+97450746200'),
  ('Karen Rodríguez', 0, '505ff021e2284d138ade5c56', '+97466514685'),
  ('Fannor Coronado', 0, 'd49e3ff672462acf30e1764b', '+97455211280'),
  ('Luisa Upegui', 0, '0e0115f7b16bba38fa3a3492', '+97466719312'),
  ('Santiago Alzate', 0, '4cf6bc70f16e6f587dc6ed8e', '+97470927295'),
  ('David Gelvez', 0, '33bcac4d223370b5b60f635e', '+573152286907'),
  ('Felipe Agudelo', 0, '2e0bfbcf919a36f3ad2aaf38', '+97431400218'),
  ('Paula Giraldo', 0, 'd71d895d0db135cf03c601cf', '+573172202704'),
  ('Federico Perez', 0, '59b5143446ded3e21bbbf26c', '+573182543988'),
  ('Santiago González', 0, 'db52a7c9beb5a40a016220ee', '+573207233999'),
  ('Miguel Henao', 0, 'cf3d356b648fe9ba6d3bca71', '+573234572314'),
  ('María Isabel Jaramillo', 0, 'a24b602c02e54685136f18ff', '+573127366153'),
  ('Juliana Velez', 0, '895a71ab749864fea9001459', '+573113899151'),
  ('Patricia Alzate', 0, 'f2f5b20ca664bf1d6eaa35ed', '+573137601986'),
  ('Lia López', 0, '100442102b4071764476d811', '+573104702731'),
  ('Ligia Sierra', 0, '036b7111cd8e8ab1c889ea9e', '+573012526439'),
  ('Simón López', 0, '2baec0ee1bf3a5342964acf8', '+573137465092'),
  ('David López', 0, '6e288921419b17eca16ada85', '+573005661530'),
  ('Alejandro Chamat', 0, 'bdac81bcdb049407d70bee50', '+97466983117'),
  ('Cristina Galbiati', 0, '7475078a434f42dc7b9b632e', '+97466856438'),
  ('Andrea Arias', 0, '106a8b67fb477be0431f698f', '+13053977372'),
  ('Maria Jose Gomez', 0, 'ceb76ce62eff54c69a436447', '+19544222281'),
  ('Joanna Wybieralska', 1, '78854441b79fb44f2aa20ac1', '+48606642626'),
  ('Magdalena Fidziańska', 3, 'a118c1beee9fd299399da6d7', '+48696932780'),
  ('Wiesława Kurzawa', 1, '659e1e7f933e091f9ecfd9c4', '+48695433132'),
  ('Daria Kurzawa', 3, '1efd997e665144f3c35feb37', '+48667531848'),
  ('Ilona Nadolna', 2, 'ebe158163229a02c9995dd83', '+48663860934'),
  ('Marta Puszcz', 2, 'e504e1d2240e01d81b510852', '+48696708223'),
  ('Kamila Bojarska', 3, 'acc180d287264cfc1520a196', '+491741371896'),
  ('Marcel Lebiedziejewski', 3, 'f385768c6ea23235ae4b3bcb', '+48660610944'),
  ('Ksawery Szymański', 1, 'fac4225b11b2ce4ed6a12f83', '+48694196878'),
  ('Kornel Szymański', 1, '95730a737a3c97ad43f61062', '+48664251260'),
  ('Małgorzata Szymańska', 1, '23e6e31a3e92639c9dc4ef19', '+48608460053'),
  ('Konstancja Szymańska-Calvimontes', 2, 'afe84024b2f21e131662f403', null),
  ('Dariusz Przykłota', 1, '2ea331f599f70cb301a7f44c', '+48602513319'),
  ('Karolina Chmielarz', 1, 'ce1d080f618eb66f4c171495', '+48664039109'),
  ('Grażyna Węgrzyn', 1, 'a92ae00fc13937274c2254bd', '+48600312202'),
  ('Andrzej Kamiński', 1, '3606ec33b53290218122ab16', '+48502343036'),
  ('Celina Kwietoń', 1, '5d11a902301b3b50a9c0228d', '+48791990219'),
  ('Weronika Wojtas', 1, '3f3eaf029f34fd6703525e95', '+48782013234'),
  ('Wojtek Wojtas', 1, '2f2c2801d680c1cfe1caf4f4', '+48782013334'),
  ('Izabela Woroniecka', 1, '13caf6376860dab66ad5462a', '+48730359616'),
  ('Szymon Urbański', 1, 'd6f71c69d9c54ad8b77843ea', '+48721060805'),
  ('Mateusz Węgrzyn', 0, 'fef13f4ec424805732c75af0', '+447513521985'),
  ('Karolina Stefańczyk', 0, 'c941f173b836cb91f5c9e970', '+48507581980'),
  ('Gabriela Jaryczewska', 0, 'f6cd7a3fa2adf738d869c671', '+48721582618'),
  ('Daniela Jímenez Navarro', 0, '7bd35286825a3586948a6915', '+97450723758'),
  ('Leandro Gonzalo Piñeiro', 0, 'ab8fc221f0b81531718265f8', '+97477981000'),
  ('Filipe Afonso', 0, '86438bc462b69e26741fd7b3', '+971528035885'),
  ('Szymon Langer', 0, '06e7c63e3d190e8ebbca270d', '+48572592833'),
  ('Jakub Chojnacki', 0, '72d64931aa9d045c2d40eaf0', '+48666878675'),
  ('Babcia Waleria', 0, '830fa6e13fa66a15118163e0', '+48668805562'),
  ('Dziadek Tadeusz', 0, '0b1d4cc58caa5e2d9bbd457c', '+48698556356'),
  ('Mariusz Synoś', 1, '35784ef92486e7f32e5a398d', '+48509677756')
) as v(name, max_companions, token, phone)
on conflict (token) do update set
  phone = excluded.phone,
  name = excluded.name,
  max_companions = excluded.max_companions;

-- Also update existing guests by name if tokens match
update guests as g set
  phone = v.phone
from (values
  ('Vanessa García', '+97450199807'),
  ('Diana Rozo', '+573118466331'),
  ('Noora Almannai', '+97430677767'),
  ('Clara Moreno', '+34604233191'),
  ('Malory Nikolić', '+97431131600'),
  ('Jose Cuán', '+4916094470611'),
  ('María Alejandra Alzate', '+573174279995'),
  ('Alejandro Monsalve', '+573186455555'),
  ('Manuela Fedele', '+15614549737'),
  ('Carolina Velasquez', '+573003458492'),
  ('Catalina Salazar', '+573122229530'),
  ('Rodolfo López', '+573042463233'),
  ('Elizabeth Alzate', '+573128416959'),
  ('Laura Mejia', '+573192384923'),
  ('Susana González', '+573017935670'),
  ('Laura Yepes', '+573006678886'),
  ('Ángela Yepes', '+573117345256'),
  ('Juan Fernando Yepes', '+14079783021'),
  ('Perseverance Poho', '+97439902337'),
  ('Gloriana Zelada', '+97433244671'),
  ('Duvan Peña', '+31684344113'),
  ('Daniela Cardona', '+97450746200'),
  ('Karen Rodríguez', '+97466514685'),
  ('Fannor Coronado', '+97455211280'),
  ('Luisa Upegui', '+97466719312'),
  ('Santiago Alzate', '+97470927295'),
  ('David Gelvez', '+573152286907'),
  ('Felipe Agudelo', '+97431400218'),
  ('Paula Giraldo', '+573172202704'),
  ('Federico Perez', '+573182543988'),
  ('Santiago González', '+573207233999'),
  ('Miguel Henao', '+573234572314'),
  ('María Isabel Jaramillo', '+573127366153'),
  ('Juliana Velez', '+573113899151'),
  ('Patricia Alzate', '+573137601986'),
  ('Lia López', '+573104702731'),
  ('Ligia Sierra', '+573012526439'),
  ('Simón López', '+573137465092'),
  ('David López', '+573005661530'),
  ('Alejandro Chamat', '+97466983117'),
  ('Cristina Galbiati', '+97466856438'),
  ('Andrea Arias', '+13053977372'),
  ('Maria Jose Gomez', '+19544222281'),
  ('Joanna Wybieralska', '+48606642626'),
  ('Magdalena Fidziańska', '+48696932780'),
  ('Wiesława Kurzawa', '+48695433132'),
  ('Daria Kurzawa', '+48667531848'),
  ('Ilona Nadolna', '+48663860934'),
  ('Marta Puszcz', '+48696708223'),
  ('Kamila Bojarska', '+491741371896'),
  ('Marcel Lebiedziejewski', '+48660610944'),
  ('Ksawery Szymański', '+48694196878'),
  ('Kornel Szymański', '+48664251260'),
  ('Małgorzata Szymańska', '+48608460053'),
  ('Dariusz Przykłota', '+48602513319'),
  ('Karolina Chmielarz', '+48664039109'),
  ('Grażyna Węgrzyn', '+48600312202'),
  ('Andrzej Kamiński', '+48502343036'),
  ('Celina Kwietoń', '+48791990219'),
  ('Weronika Wojtas', '+48782013234'),
  ('Wojtek Wojtas', '+48782013334'),
  ('Izabela Woroniecka', '+48730359616'),
  ('Szymon Urbański', '+48721060805'),
  ('Mateusz Węgrzyn', '+447513521985'),
  ('Karolina Stefańczyk', '+48507581980'),
  ('Gabriela Jaryczewska', '+48721582618'),
  ('Daniela Jímenez Navarro', '+97450723758'),
  ('Leandro Gonzalo Piñeiro', '+97477981000'),
  ('Filipe Afonso', '+971528035885'),
  ('Szymon Langer', '+48572592833'),
  ('Jakub Chojnacki', '+48666878675'),
  ('Babcia Waleria', '+48668805562'),
  ('Dziadek Tadeusz', '+48698556356'),
  ('Mariusz Synoś', '+48509677756')
) as v(name, phone)
where g.name = v.name;
