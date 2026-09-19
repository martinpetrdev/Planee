export function getTodayStartISO(): string {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0); // Set to midnight

  return midnight.toISOString();
}
