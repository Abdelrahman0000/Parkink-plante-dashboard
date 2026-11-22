-- Comfy Parking v2. Run once in a NEW dedicated project, not the legacy database.
-- No existing tables/data are dropped. No public/anonymous data access is granted.
begin;
create table public.parking_sites (
 id uuid primary key default gen_random_uuid(), name text not null,
 currency text not null default 'EGP', timezone text not null default 'Africa/Cairo',
 created_at timestamptz not null default now()
);
create table public.parking_members (
 site_id uuid not null references public.parking_sites(id), user_id uuid not null references auth.users(id) on delete cascade,
 role text not null check (role in ('owner','staff','viewer')), primary key(site_id,user_id)
);
create table public.parking_spaces (
 id uuid primary key default gen_random_uuid(), site_id uuid not null references public.parking_sites(id),
 label text not null, floor text not null, status text not null default 'available' check (status in ('available','occupied','reserved')),
 type text not null default 'standard' check (type in ('standard','accessible','ev')), updated_at timestamptz not null default now(),
 unique(site_id,label), unique(site_id,id)
);
create table public.parking_drivers (
 id uuid primary key default gen_random_uuid(), site_id uuid not null references public.parking_sites(id),
 user_id uuid references auth.users(id), name text not null, email text not null, plate text not null, vehicle text not null,
 blocked boolean not null default false, created_at timestamptz not null default now(), unique(site_id,id)
);
create table public.parking_bookings (
 id uuid primary key default gen_random_uuid(), site_id uuid not null references public.parking_sites(id),
 driver_id uuid not null, space_id uuid not null, start_at timestamptz not null default now(), end_at timestamptz,
 status text not null default 'active' check (status in ('active','completed','cancelled')),
 amount numeric(12,2) not null default 0 check(amount >= 0),
 foreign key(site_id,driver_id) references public.parking_drivers(site_id,id),
 foreign key(site_id,space_id) references public.parking_spaces(site_id,id),
 check(end_at is null or end_at >= start_at)
);
create unique index parking_one_active_booking on public.parking_bookings(space_id) where status='active';
create table public.parking_events (
 id uuid primary key default gen_random_uuid(), site_id uuid not null references public.parking_sites(id),
 message text not null, kind text not null default 'info', created_at timestamptz not null default now()
);
create index on public.parking_members(user_id);
create index on public.parking_spaces(site_id);
create index on public.parking_drivers(site_id);
create index on public.parking_bookings(site_id);
create index on public.parking_events(site_id,created_at desc);

-- Definer functions prevent recursive membership RLS and always use auth.uid().
create function public.parking_is_member(s uuid) returns boolean language sql stable security definer
 set search_path = '' as $$ select exists(select 1 from public.parking_members where site_id=s and user_id=(select auth.uid())); $$;
create function public.parking_can_edit(s uuid) returns boolean language sql stable security definer
 set search_path = '' as $$ select exists(select 1 from public.parking_members where site_id=s and user_id=(select auth.uid()) and role in ('owner','staff')); $$;
revoke all on function public.parking_is_member(uuid), public.parking_can_edit(uuid) from public;
grant execute on function public.parking_is_member(uuid), public.parking_can_edit(uuid) to authenticated;

alter table public.parking_sites enable row level security;
alter table public.parking_members enable row level security;
alter table public.parking_spaces enable row level security;
alter table public.parking_drivers enable row level security;
alter table public.parking_bookings enable row level security;
alter table public.parking_events enable row level security;
create policy site_read on public.parking_sites for select to authenticated using(public.parking_is_member(id));
create policy membership_self on public.parking_members for select to authenticated using(user_id=(select auth.uid()));
create policy spaces_read on public.parking_spaces for select to authenticated using(public.parking_is_member(site_id));
create policy drivers_read on public.parking_drivers for select to authenticated using(public.parking_is_member(site_id));
create policy drivers_update on public.parking_drivers for update to authenticated using(public.parking_can_edit(site_id)) with check(public.parking_can_edit(site_id));
create policy bookings_read on public.parking_bookings for select to authenticated using(public.parking_is_member(site_id));
create policy events_read on public.parking_events for select to authenticated using(public.parking_is_member(site_id));
revoke all on public.parking_sites,public.parking_members,public.parking_spaces,public.parking_drivers,public.parking_bookings,public.parking_events from anon,authenticated;
grant select on public.parking_sites,public.parking_members,public.parking_spaces,public.parking_drivers,public.parking_bookings,public.parking_events to authenticated;
grant update(blocked) on public.parking_drivers to authenticated;

-- Atomic compare-and-set status change. No direct space write grant.
create function public.parking_change_space(target_id uuid, next_status text, expected_status text) returns void
 language plpgsql security definer set search_path = '' as $$
declare s public.parking_spaces; begin
 select * into s from public.parking_spaces where id=target_id for update;
 if not found or not public.parking_can_edit(s.site_id) then raise exception 'Not authorized for this parking space'; end if;
 if next_status not in ('available','occupied','reserved') then raise exception 'Invalid space status'; end if;
 if s.status <> expected_status then raise exception 'This space changed. Refresh and try again.'; end if;
 update public.parking_spaces set status=next_status,updated_at=now() where id=target_id;
 insert into public.parking_events(site_id,message,kind) values(s.site_id,s.label||' changed from '||s.status||' to '||next_status||'.','space');
end $$;
revoke all on function public.parking_change_space(uuid,text,text) from public;
grant execute on function public.parking_change_space(uuid,text,text) to authenticated;

create function public.parking_driver_event() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.blocked is distinct from old.blocked then
 insert into public.parking_events(site_id,message,kind) values(new.site_id,'Driver access '||case when new.blocked then 'blocked.' else 'restored.' end,'info');
 end if; return new;
end $$;
revoke all on function public.parking_driver_event() from public;
create trigger parking_driver_audit after update of blocked on public.parking_drivers for each row execute function public.parking_driver_event();

alter publication supabase_realtime add table public.parking_spaces,public.parking_drivers,public.parking_bookings,public.parking_events;
commit;
