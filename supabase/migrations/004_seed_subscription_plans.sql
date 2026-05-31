insert into public.subscription_plans (name, price, interval, features)
values
  ('Free', 0, 'month', '["3 contacts","local reminders"]'::jsonb),
  ('Premium Monthly', 9.99, 'month', '["unlimited contacts","AI wishes","cards","gifts"]'::jsonb),
  ('Premium Yearly', 79.99, 'year', '["unlimited contacts","AI wishes","cards","gifts","priority support"]'::jsonb)
on conflict do nothing;
