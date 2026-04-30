
function getLocalDateStringBackend(utcString: string, timeZone: string = 'America/New_York') {
  const date = new Date(utcString);
  try {
    const parts = new Intl.DateTimeFormat('en-US', { 
      timeZone, 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).formatToParts(date);
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    return `${y}-${m}-${d}`;
  } catch (e) {
    return "error";
  }
}

function getLocalDateStringFrontend(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
}

const testDate = new Date("2026-04-30T12:00:00Z");
const tz = "America/New_York";

console.log("Backend result:", getLocalDateStringBackend(testDate.toISOString(), tz));
console.log("Frontend result:", getLocalDateStringFrontend(testDate, tz));
