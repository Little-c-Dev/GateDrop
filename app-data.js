window.GateDrop = (() => {
  // The packaged file remains available when the device is offline.
  const remoteFeedUrl = window.GATE_DROP_FEED_URL || 'https://little-c-dev.github.io/GateDrop/events.json';
  const schedules = {
    'Hard Enduro':'https://fim-hardenduro.com/calendar',
    'EnduroCross':'https://endurocross.com/2026-schedule/',
    'GNCC Racing':'https://gnccracing.com/events',
    'SuperEnduro':'https://superenduro.org/',
    'AMA Supercross':'https://www.supermotocross.com/schedule/',
    'Pro Motocross':'https://www.supermotocross.com/schedule/',
    'SMX Playoffs':'https://www.supermotocross.com/schedule/'
  };
  const seriesTitles = {
    'Hard Enduro':'FIM Hard Enduro World Championship',
    'EnduroCross':'AMA EnduroCross Championship',
    'GNCC Racing':'Progressive Grand National Cross Country Series',
    'SuperEnduro':'FIM SuperEnduro World Championship',
    'AMA Supercross':'Monster Energy AMA Supercross Championship',
    'Pro Motocross':'Pro Motocross Championship',
    'SMX Playoffs':'SuperMotocross World Championship Playoffs'
  };
  const fallback = [
    {id:'hewc-hixpania-2026',name:'24MX Hixpania Hard Enduro',round:'FIM Hard Enduro World Championship · Final round',series:'Hard Enduro',date:'2026-10-25T12:00:00+02:00',firstGate:'2026-10-23T17:00:00+02:00',liveStart:'2026-10-23T17:00:00+02:00',liveEnd:'2026-10-25T14:30:00+02:00',where:'Aguilar de Campoo, Spain',status:'live',provider:'FIM Hard Enduro YouTube',watchUrl:'https://fim-hardenduro.com/',highlightsUrl:'https://www.youtube.com/@FIMHardEnduro',imageUrl:'https://hixpania.es/wp-content/uploads/2025/04/54097720953_e14ff6ccb0_k-1024x683.webp',priority:0},
    {id:'endurocross-everett-2026',name:'EnduroCross — Everett',round:'AMA EnduroCross · Round 3',series:'EnduroCross',date:'2026-10-25T02:00:00-05:00',firstGate:'2026-10-25T02:00:00-05:00',liveStart:'2026-10-25T02:00:00-05:00',liveEnd:'2026-10-25T06:50:00-05:00',where:'Angel of the Winds Arena · Everett, WA',status:'live',provider:'EnduroCross TV',watchUrl:'https://endurocross.com/tv/',highlightsUrl:'https://www.youtube.com/@EnduroCross',imageUrl:'https://endurocross.com/wp-content/uploads/2024/06/EX-FB-RD-3EVENT-2026.png',priority:0}
  ];
  const date = value => new Date(value);
  const upcoming = events => events.filter(event => date(event.firstGate) > Date.now()).sort((a,b) => date(a.firstGate) - date(b.firstGate) || a.priority - b.priority);
  const time = value => new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(date(value));
  const day = value => new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric'}).format(date(value));
  const monthDay = value => new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(date(value));
  const countdown = value => { const diff=Math.max(0,date(value)-Date.now()); return {days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000)} };
  async function getFeed(url) {
    const response=await fetch(url,{cache:'no-store'});
    if(!response.ok) throw new Error();
    const feed=await response.json();
    if(!Array.isArray(feed.events)) throw new Error();
    return feed;
  }
  async function load() {
    if(remoteFeedUrl) {
      try { const feed=await getFeed(remoteFeedUrl); return {events:upcoming(feed.events),updatedAt:feed.updatedAt,remote:true}; }
      catch { /* Keep the installed schedule available offline. */ }
    }
    try { const feed=await getFeed('data/events.json'); return {events:upcoming(feed.events),updatedAt:feed.updatedAt,remote:false}; }
    catch { return {events:upcoming(fallback),updatedAt:null,remote:false}; }
  }
  const isLive = event => event.liveStart && event.liveEnd && date(event.liveStart) <= Date.now() && Date.now() <= date(event.liveEnd);
  const liveNow = events => events.some(isLive);
  const scheduleUrl = series => schedules[series] || 'https://www.supermotocross.com/schedule/';
  const seriesTitle = series => seriesTitles[series] || series;
  return {load,time,day,monthDay,countdown,liveNow,isLive,scheduleUrl,seriesTitle};
})();
