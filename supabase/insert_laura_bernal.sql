-- ==============================================================================
-- INSERTAR INVITADO: Laura Bernal
-- Ejecutar en Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nwsxbilhvfdezlnucnyg/sql/new
-- ==============================================================================

insert into guests (name, phone, max_companions, token)
select 'Laura Bernal', '312 7671838', 0, 'f46aac866420'
where not exists (
  select 1 from guests where name = 'Laura Bernal' or phone = '312 7671838'
);

-- Consulta para verificar y ver el enlace personal de Laura Bernal:
select 
  id, 
  name, 
  phone, 
  max_companions, 
  token,
  'https://invitacion-manuela-maciej.vercel.app/?g=' || token as enlace_personal
from guests 
where name = 'Laura Bernal';
