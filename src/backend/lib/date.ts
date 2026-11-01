export function startOfToday() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}
