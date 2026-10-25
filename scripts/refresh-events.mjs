import { readFile, writeFile } from 'node:fs/promises';

const sources = JSON.parse(await readFile(new URL('../data/sources.json', import.meta.url))).sources;
const existing = JSON.parse(await readFile(new URL('../data/events.json', import.meta.url)));

function flatten(value) {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) return value.flatMap(flatten);
  return [value, ...Object.values(value).flatMap(flatten)];
}

function eventFromJsonLd(item, source) {
  if (item['@type'] !== 'Event' || !item.name || !item.startDate) return null;
  const location = item.location?.name || item.location?.address?.addressLocality || 'Venue to be confirmed';
  return {
    id: `${source.id}-${item.url || item.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: item.name.replace(/^Rd\.\s*\d+:\s*/i, ''),
    round: source.series,
    series: source.series,
    date: item.startDate,
    firstGate: item.startDate,
    liveStart: item.startDate,
    liveEnd: item.endDate || item.startDate,
    where: location,
    status: 'live',
    provider: source.id === 'endurocross' ? 'EnduroCross TV' : 'Official coverage',
    watchUrl: source.watchUrl,
    highlightsUrl: source.highlightsUrl,
    imageUrl: typeof item.image === 'string' ? item.image : undefined,
    priority: source.priority,
    sourceUrl: item.url || source.calendarUrl
  };
}

async function loadJsonLd(source) {
  const response = await fetch(source.calendarUrl, { headers: { 'user-agent': 'GateDrop schedule updater (contact: schedule@gatedrop.app)' } });
  if (!response.ok) throw new Error(`${source.id}: ${response.status}`);
  const page = await response.text();
  const blocks = [...page.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const records = blocks.flatMap(match => { try { return flatten(JSON.parse(match[1])); } catch { return []; } });
  return records.map(item => eventFromJsonLd(item, source)).filter(Boolean);
}

const automatic = [];
for (const source of sources.filter(source => source.mode === 'json-ld')) {
  try { automatic.push(...await loadJsonLd(source)); }
  catch (error) { console.warn(`Keeping last known ${source.series} events: ${error.message}`); }
}

const manual = existing.events.filter(event => !sources.some(source => source.mode === 'json-ld' && event.series === source.series));
const events = [...manual, ...automatic].filter(event => new Date(event.firstGate) > new Date(Date.now() - 86400000));
events.sort((a, b) => a.priority - b.priority || new Date(a.firstGate) - new Date(b.firstGate));
await writeFile(new URL('../data/events.json', import.meta.url), JSON.stringify({ schemaVersion: 1, updatedAt: new Date().toISOString(), events }, null, 2) + '\n');
console.log(`Wrote ${events.length} upcoming events.`);
