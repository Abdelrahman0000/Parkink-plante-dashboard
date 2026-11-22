// Analytics describe the records loaded by this workspace, never invented history.
const DAY = 86400000;
const cairo = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit' });
export function cairoDay(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const parts = Object.fromEntries(cairo.formatToParts(date).map(p => [p.type, p.value]));
  return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
}
export function periodAnalytics(bookings, period = '7', now = Date.now()) {
  const today = cairoDay(now);
  const days = period === 'all' ? null : Number(period);
  const start = days ? today - (days - 1) * DAY : -Infinity;
  const end = days ? today + DAY : Infinity;
  const valid = bookings.filter(b => cairoDay(b.start_at) !== null);
  const selected = valid.filter(b => cairoDay(b.start_at) >= start && cairoDay(b.start_at) < end);
  const completed = selected.filter(b => b.status === 'completed');
  const durations = completed.map(b => (new Date(b.end_at) - new Date(b.start_at)) / 60000).filter(n => Number.isFinite(n) && n >= 0);
  const revenue = completed.reduce((sum, b) => sum + (Number.isFinite(Number(b.amount)) ? Number(b.amount) : 0), 0);
  const prior = days ? valid.filter(b => cairoDay(b.start_at) >= start - days * DAY && cairoDay(b.start_at) < start) : [];
  const first = days ? start : selected.length ? Math.min(...selected.map(b => cairoDay(b.start_at))) : today;
  const last = days ? today : selected.length ? Math.max(...selected.map(b => cairoDay(b.start_at))) : today;
  const span = Math.max(1, Math.round((last - first) / DAY) + 1);
  const step = Math.ceil(span / 7);
  const buckets = Array.from({ length: Math.ceil(span / step) }, (_, i) => {
    const from = first + i * step * DAY, to = Math.min(last + DAY, from + step * DAY);
    const rows = selected.filter(b => cairoDay(b.start_at) >= from && cairoDay(b.start_at) < to);
    return { from, to, count: rows.length, revenue: rows.filter(b => b.status === 'completed').reduce((sum, b) => sum + (Number(b.amount) || 0), 0) };
  });
  return { selected, completed, revenue, averageMinutes: durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : null, durationCount: durations.length, prior, buckets, invalidDates: bookings.length - valid.length };
}
