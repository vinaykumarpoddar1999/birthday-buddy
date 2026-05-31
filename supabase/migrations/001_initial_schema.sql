-- BirthdayBuddy initial schema with RLS

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  avatar text,
  created_at timestamptz not null default now()
);

-- Contacts
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  phone text,
  email text,
  dob date,
  relationship text,
  notes text,
  created_at timestamptz not null default now()
);

-- Birthdays
create table if not exists public.birthdays (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  birth_date date not null,
  reminder_days int[] default '{7,3,1,0}',
  created_at timestamptz not null default now()
);

-- Wishes
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  generated_text text not null,
  tone text,
  language text,
  created_at timestamptz not null default now()
);

-- Greeting cards
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  template_id text,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  image_url text,
  created_at timestamptz not null default now()
);

-- Memories
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  caption text,
  image_url text,
  created_at timestamptz not null default now()
);

-- Referrals
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer uuid not null references auth.users (id) on delete cascade,
  referred uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  reward_type text not null,
  created_at timestamptz not null default now()
);

-- Subscriptions
create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  interval text not null,
  features jsonb default '[]'::jsonb
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan text not null,
  status text not null default 'inactive',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.purchase_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  platform text not null,
  purchased_at timestamptz not null default now()
);

-- Push device tokens
create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  token text not null,
  platform text not null,
  created_at timestamptz not null default now(),
  unique (user_id, token)
);

-- Storage buckets (run in Supabase dashboard or storage migration)
-- avatars, cards, memories

-- RLS
alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.birthdays enable row level security;
alter table public.wishes enable row level security;
alter table public.cards enable row level security;
alter table public.memories enable row level security;
alter table public.referrals enable row level security;
alter table public.referral_codes enable row level security;
alter table public.referral_rewards enable row level security;
alter table public.subscriptions enable row level security;
alter table public.purchase_history enable row level security;
alter table public.device_tokens enable row level security;
alter table public.subscription_plans enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Contacts policies
create policy "Users manage own contacts"
  on public.contacts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Birthdays (via contact ownership)
create policy "Users manage birthdays for own contacts"
  on public.birthdays for all
  using (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.user_id = auth.uid()
    )
  );

-- Wishes
create policy "Users manage wishes for own contacts"
  on public.wishes for all
  using (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.user_id = auth.uid()
    )
  );

-- Cards
create policy "Users manage cards for own contacts"
  on public.cards for all
  using (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.user_id = auth.uid()
    )
  );

-- Memories
create policy "Users manage memories for own contacts"
  on public.memories for all
  using (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.user_id = auth.uid()
    )
  );

-- Referrals
create policy "Users view referrals they created"
  on public.referrals for select
  using (auth.uid() = referrer);

create policy "Users create referrals"
  on public.referrals for insert
  with check (auth.uid() = referrer);

-- Referral codes
create policy "Users manage own referral code"
  on public.referral_codes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Referral rewards
create policy "Users view own rewards"
  on public.referral_rewards for select
  using (auth.uid() = user_id);

-- Subscriptions
create policy "Users manage own subscription"
  on public.subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can read plans"
  on public.subscription_plans for select
  using (true);

-- Purchase history
create policy "Users view own purchases"
  on public.purchase_history for select
  using (auth.uid() = user_id);

create policy "Users insert own purchases"
  on public.purchase_history for insert
  with check (auth.uid() = user_id);

-- Device tokens
create policy "Users manage own device tokens"
  on public.device_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
