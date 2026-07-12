-- plans is a public pricing/lookup table (no sensitive data) — allow anyone to read it.
alter table plans enable row level security;

create policy "Anyone can view plans"
  on plans for select
  using (true);
