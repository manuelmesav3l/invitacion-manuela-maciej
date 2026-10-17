-- ==============================================================================
-- INSERTAR INVITADO: Fahad Al Haroon
-- Ejecutar en Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nwsxbilhvfdezlnucnyg/sql/new
-- ==============================================================================

insert into guests (name, phone, max_companions, token)
select 'Fahad Al Haroon', '5505 3590', 0, encode(gen_random_bytes(6), 'hex')
where not exists (
  select 1 from guests where name = 'Fahad Al Haroon' or phone = '5505 3590'
);

-- Consulta para verificar que se insertó correctamente y ver su token y enlace personal:
select 
  id, 
  name, 
  phone, 
  max_companions, 
  token,
  'https://YOUR-SITE/?g=' || token as enlace_personal
from guests 
where name = 'Fahad Al Haroon';
