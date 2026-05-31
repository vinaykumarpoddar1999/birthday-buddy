-- Create storage buckets for BirthdayBuddy
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('cards', 'cards', true),
  ('memories', 'memories', true)
on conflict (id) do nothing;

-- Storage RLS: users upload to their own folder {user_id}/...
create policy "Avatar uploads by owner"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Avatar read public"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Card uploads by owner"
  on storage.objects for insert
  with check (
    bucket_id = 'cards'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Card read public"
  on storage.objects for select
  using (bucket_id = 'cards');

create policy "Memory uploads by owner"
  on storage.objects for insert
  with check (
    bucket_id = 'memories'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Memory read public"
  on storage.objects for select
  using (bucket_id = 'memories');
