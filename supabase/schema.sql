
-- Create the products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  image text,
  images text[],
  rating numeric default 5,
  stock integer default 0
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Create policies
-- Allow public read access
create policy "Public products are viewable by everyone"
  on products for select
  using ( true );

-- Allow authenticated users to insert/update/delete (assuming admin is authenticated)
-- For simplicity in this demo, we might allow anon to edit if there's no auth setup yet, 
-- but ideally this should be restricted.
-- For now, allowing all for anon to make the demo work easily without auth setup.
create policy "Enable all access for all users"
  on products for all
  using ( true )
  with check ( true );

-- Create a storage bucket for product images
insert into storage.buckets (id, name, public) 
values ('products', 'products', true);

-- Storage policies
create policy "Give public access to product images"
  on storage.objects for select
  using ( bucket_id = 'products' );

create policy "Allow uploads to product images"
  on storage.objects for insert
  with check ( bucket_id = 'products' );

-- Create sales table
create table public.sales (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_name text,
  customer_email text,
  total_amount numeric not null,
  status text default 'pending'
);

-- Create sale_items table (Snapshots of products at time of sale)
create table public.sale_items (
  id uuid default gen_random_uuid() primary key,
  sale_id uuid references public.sales(id) on delete cascade not null,
  product_id text, -- Reference to original product (optional, for analytics)
  name text not null, -- Snapshot
  price numeric not null, -- Snapshot
  quantity integer not null,
  image text, -- Snapshot
  category text -- Snapshot
);

-- Enable RLS for sales tables
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

-- Policies for sales
create policy "Enable all access for all users" on sales for all using (true) with check (true);
create policy "Enable all access for all users" on sale_items for all using (true) with check (true);
