export function formatGroupDate(dateStr) {
  if (!dateStr) return "";

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfThatDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor(
    (startOfToday - startOfThatDay) / (1000 * 60 * 60 * 24),
  );

  const pad = (n) => String(n).padStart(2, "0");
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const year = d.getFullYear();

  if (diffDays === 0) {
    return `개설시간 | ${hh}:${mm}`;
  }
  if (year === now.getFullYear()) {
    return `개설일 | ${month}/${day}`;
  }
  return `개설일 | ${year}/${month}/${day}`;
}
