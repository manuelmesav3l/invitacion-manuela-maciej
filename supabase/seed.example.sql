-- Example: how to invite guests. Run in the Supabase SQL editor (service role); never from the browser.
-- Each guest gets a secret, unguessable token. The personal link is  https://<site>/?g=<token>
-- max_companions = number of plus ones this guest may bring (0 = none; the form hides the selector).
insert into guests (name, max_companions, token) values
  ('Guest One',  1, encode(gen_random_bytes(12), 'hex')),
  ('Guest Two',  0, encode(gen_random_bytes(12), 'hex'));

-- Personal links to send out (replace the base URL):
select name, 'https://YOUR-SITE/?g=' || token as link from guests order by name;

-- Responses so far (service role / dashboard only: anon cannot read these tables):
select g.name as invited_as, r.full_name, r.attending, r.companions, r.needs_transport, r.welcome_meeting,
       r.email, r.phone, r.dietary, r.message, r.updated_at
from guests g left join rsvps r on r.guest_id = g.id order by g.name;
