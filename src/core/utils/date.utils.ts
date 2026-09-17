export function toLocalISOString(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getMaxBookingDate(): string {
  const today = new Date();
  const currentDay = today.getDay(); 
  
  const daysToSubtract = (currentDay + 1) % 7;
  
  const mostRecentSaturday = new Date(today);
  mostRecentSaturday.setDate(today.getDate() - daysToSubtract);
  
  const maxDate = new Date(mostRecentSaturday);
  maxDate.setDate(mostRecentSaturday.getDate() + 13);
  
  return toLocalISOString(maxDate);
}
