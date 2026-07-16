-- =========================================================
-- Y.W.C.関東case データベース構築スクリプト
-- Supabaseダッシュボード > SQL Editor に貼り付けて実行してください
-- =========================================================

create type case_status as enum ('未着手', '進行中', '確認待ち', '完了', '遅延', '保留');
create type user_role as enum ('admin', 'client');

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- auth.usersと連携するプロフィールテーブル（ロール管理）
create table users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role user_role not null default 'client',
  client_id uuid references clients(id),
  created_at timestamptz default now()
);

create table cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_id uuid not null references clients(id),
  assignee text,
  status case_status not null default '未着手',
  start_date date,
  due_date date,
  note text,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_cases_client on cases(client_id);
create index idx_cases_status on cases(status);
create index idx_cases_due_date on cases(due_date);

-- =========================================================
-- Row Level Security（権限制御）
-- =========================================================
alter table clients enable row level security;
alter table users_profile enable row level security;
alter table cases enable row level security;

-- clients: ログイン済みなら誰でも参照可（案件フォームの取引先選択用）
create policy "clients_read_authenticated" on clients
  for select
  using (auth.uid() is not null);

-- users_profile: 本人のプロフィールのみ参照可
create policy "profile_read_own" on users_profile
  for select
  using (id = auth.uid());

-- cases: 管理者は全件参照・更新・削除・追加が可能
create policy "admin_full_access" on cases
  for all
  using (exists (select 1 from users_profile p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from users_profile p where p.id = auth.uid() and p.role = 'admin'));

-- cases: 取引先は自社案件のみ参照可（更新・削除・追加は不可）
create policy "client_read_own" on cases
  for select
  using (
    exists (
      select 1 from users_profile p
      where p.id = auth.uid() and p.role = 'client' and p.client_id = cases.client_id
    )
  );

-- =========================================================
-- 動作確認用のサンプルデータ（不要であれば削除してOK）
-- =========================================================
insert into clients (name) values
  ('株式会社アルファ商事'),
  ('有限会社ベータ物流');
