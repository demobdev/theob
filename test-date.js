function getETDateString(utcString) {
  const date = new Date(utcString);
  const parts = new Intl.DateTimeFormat('en-US', { 
    timeZone: 'America/New_York', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value;
  const m = parts.find(p => p.type === 'month')?.value;
  const d = parts.find(p => p.type === 'day')?.value;
  return `${y}-${m}-${d}`;
}

console.log(getETDateString(new Date().toISOString()));
