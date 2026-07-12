-- Rework plans to use the plan slug as its text primary key (matching Stripe
-- metadata.plan_id values used by stripe-webhook's direct-ID lookup), and add
-- stripe_price_id/price/active for a single source of truth on pricing.
drop table if exists plans cascade;

create table plans (
  id text primary key,
  name text not null,
  stripe_price_id text,
  credits integer not null,
  price integer not null,
  active boolean not null default true
);

alter table plans enable row level security;

create policy "Anyone can view plans"
  on plans for select
  using (true);

insert into plans (id, name, stripe_price_id, credits, price, active) values
  ('individual', 'Individual Plan', 'price_1Tow4uB0NtsPmosRZdKc0ZJV', 20, 299, true),
  ('team', 'Team Plan', 'price_1Tow65B0NtsPmosRU9EPCInn', 50, 599, true);

-- purchases.plan_id must match the new text id type
alter table purchases alter column plan_id type text using plan_id::text;
alter table purchases add constraint purchases_plan_id_fkey
  foreign key (plan_id) references plans(id);
