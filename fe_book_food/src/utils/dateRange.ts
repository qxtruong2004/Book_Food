// src/utils/dateRange.ts
export function getDateRange(days = 7) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));

  const pad = (n: number) => n.toString().padStart(2, "0");
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  return { from: fmt(from), to: fmt(to) };
}
