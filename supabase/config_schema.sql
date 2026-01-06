
-- Create config table for global settings
create table public.config (
  id integer primary key default 1,
  ai_enabled boolean default true,
  ai_chat_enabled boolean default true,
  ai_simulation_enabled boolean default true,
  use_test_images boolean default true,
  maintenance_mode boolean default false,
  constraint single_row check (id = 1)
);

-- Enable RLS
alter table public.config enable row level security;

-- Policies
create policy "Config viewable by everyone" 
  on config for select 
  using ( true );

create policy "Config editable by everyone" 
  on config for update 
  using ( true )
  with check ( true );

create policy "Config insertable by everyone" 
  on config for insert 
  with check ( true );

-- Insert default config
insert into public.config (id, ai_enabled, ai_chat_enabled, ai_simulation_enabled, use_test_images, maintenance_mode)
values (1, true, true, true, true, false)
on conflict (id) do nothing;
