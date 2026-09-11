export const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function validateBookingRange(startISO: string, endISO: string): string | null {
  const s = new Date(startISO).getTime();
  const e = new Date(endISO).getTime();

  if (isNaN(s) || isNaN(e)) return "Datas inválidas";
  if (e <= s) return "O horário final deve ser depois do inicial";
  if (e - s > ONE_WEEK_MS) return "O agendamento não pode ultrapassar 1 semana";

  return null;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
