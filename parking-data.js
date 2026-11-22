import { createClient } from '@supabase/supabase-js';

// These are PUBLIC presentation fixtures, not an account or an authentication secret.
export const DEMO = { email: 'visitor@comfy.demo', password: 'TryParking2026' };
const STORE = 'comfy-parking-demo-v2';
const stamp = () => new Date().toISOString();
const names = ['Adam Hassan', 'Nour Ali', 'Omar Salem', 'Maya Farid', 'Youssef Adel', 'Sara Nabil', 'Ziad Mostafa', 'Lina Samir'];
export function seed() {
  const now = Date.now();
  const drivers = names.map((name, i) => ({ id: `driver-${i}`, name, email: `driver${i + 1}@example.com`, plate: `DEMO ${120 + i}`, vehicle: ['Tesla Model 3', 'BMW 320i', 'Toyota Corolla', 'Hyundai Tucson'][i % 4], blocked: i === 6 }));
  const spaces = Array.from({ length: 48 }, (_, i) => ({ id: `space-${i}`, label: `${i < 24 ? 'A' : 'B'}-${String(i % 24 + 1).padStart(2, '0')}`, floor: i < 24 ? 'Ground floor' : 'First floor', status: i % 7 === 0 ? 'reserved' : i % 3 === 0 ? 'available' : 'occupied', type: i % 11 === 0 ? 'accessible' : i % 8 === 0 ? 'ev' : 'standard' }));
  const bookings = drivers.slice(0, 6).map((d, i) => ({ id: `BK-${1041 + i}`, driver_id: d.id, space_id: `space-${i + 1}`, start_at: new Date(now - (i + 1) * 1800000).toISOString(), end_at: i > 3 ? new Date(now - i * 300000).toISOString() : null, amount: i > 3 ? 40 + i * 10 : 0, status: i > 3 ? 'completed' : 'active' }));
  return { version: 2, spaces, drivers, bookings, events: [{ id: 'welcome', message: 'Demo workspace is ready. Explore without affecting real parking data.', created_at: stamp(), kind: 'info' }], updated_at: stamp() };
}
export function readDemo() {
  try { const value = JSON.parse(localStorage.getItem(STORE)); if (value?.version === 2 && Array.isArray(value.spaces) && Array.isArray(value.bookings) && Array.isArray(value.drivers) && Array.isArray(value.events)) return value; } catch { /* Storage is optional. */ }
  return seed();
}
let bus;
export function subscribeDemo(callback) {
  const storage = e => { if (e.key === STORE) callback(readDemo()); };
  window.addEventListener('storage', storage);
  if ('BroadcastChannel' in window) { bus = new BroadcastChannel(STORE); bus.onmessage = e => callback(e.data); }
  return () => { window.removeEventListener('storage', storage); bus?.close(); bus = undefined; };
}
export function saveDemo(value) { const next = { ...value, updated_at: stamp() }; try { localStorage.setItem(STORE, JSON.stringify(next)); } catch { /* App remains usable without persistence. */ } bus?.postMessage(next); return next; }
export function withEvent(state, message, kind = 'info') { return { ...state, events: [{ id: crypto.randomUUID(), message, kind, created_at: stamp() }, ...state.events].slice(0, 50) }; }
export function changeSpace(state, id, status) {
  const space = state.spaces.find(s => s.id === id);
  if (!space || !['available', 'occupied', 'reserved'].includes(status)) return state;
  return withEvent({ ...state, spaces: state.spaces.map(s => s.id === id ? { ...s, status } : s) }, `${space.label} changed from ${space.status} to ${status}.`, 'space');
}
export function simulate(state) { const target = state.spaces[Math.floor(Math.random() * state.spaces.length)]; return changeSpace(state, target.id, target.status === 'occupied' ? 'available' : 'occupied'); }

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const backendConfigured = Boolean(url && key);
// Only a publishable/anon key belongs in Vite. Never put a service-role key here.
export const supabase = backendConfigured ? createClient(url, key) : null;
export async function loadWorkspace() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Please sign in again.');
  const { data: members, error: memberError } = await supabase.from('parking_members').select('site_id').limit(2);
  if (memberError) throw memberError;
  if (members.length !== 1) throw new Error('This account needs exactly one assigned parking workspace.');
  const site_id = members[0].site_id;
  const results = await Promise.all(['spaces', 'drivers', 'bookings', 'events'].map(async table => {
    const query = supabase.from(`parking_${table}`).select('*').eq('site_id', site_id);
    const { data, error } = table === 'events' ? await query.order('created_at', { ascending: false }).limit(50) : await query;
    if (error) throw error; return data;
  }));
  return { site_id, spaces: results[0], drivers: results[1], bookings: results[2], events: results[3], updated_at: stamp() };
}
export function watchWorkspace(site_id, onChange, onStatus) {
  const channel = supabase.channel(`parking:${site_id}`);
  for (const table of ['spaces', 'drivers', 'bookings', 'events']) channel.on('postgres_changes', { event: '*', schema: 'public', table: `parking_${table}`, filter: `site_id=eq.${site_id}` }, onChange);
  channel.subscribe(status => onStatus(status === 'SUBSCRIBED' ? 'connected' : status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' ? 'disconnected' : 'connecting'));
  return () => { supabase.removeChannel(channel); };
}
export async function updateLiveSpace(id, status, expectedStatus) {
  const { error } = await supabase.rpc('parking_change_space', { target_id: id, next_status: status, expected_status: expectedStatus });
  if (error) throw error;
}
export async function updateLiveDriver(id, blocked) {
  const { error } = await supabase.from('parking_drivers').update({ blocked }).eq('id', id);
  if (error) throw error;
                                                                              }
