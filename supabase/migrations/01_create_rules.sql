-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Drop existing table and recreate with updated schema
drop table if exists rules;

-- Create a new rules table with RLS policies
create table rules (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('allergy', 'ethics', 'health')),
  value text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table rules enable row level security;

-- Create policy to allow users to read their own rules
create policy "Users can read their own rules"
  on rules for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own rules
create policy "Users can create their own rules"
  on rules for insert
  with check (auth.uid() = user_id);

-- Create policy to allow users to delete their own rules
create policy "Users can delete their own rules"
  on rules for delete
  using (auth.uid() = user_id);

-- Create an index on user_id for faster lookups
create index rules_user_id_idx on rules(user_id);

-- Create a trigger to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_rules_updated_at
  before update on rules
  for each row
  execute function update_updated_at_column();