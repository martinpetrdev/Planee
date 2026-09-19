// --- Created by Claude Code (Claude Opus 5) ---

const pad = (n: number) => String(n).padStart(2, "0");

/** Date -> "2026-09-19", from LOCAL calendar fields. `toISOString()` would shift the day for any non-UTC offset. */
export function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Date -> "14:30", local wall clock. */
export function toISOTime(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "2026-09-19" + "14:30" -> local Date. Never `new Date(iso)`: a date-only string parses as UTC midnight. */
export function fromISO(date?: string, time?: string) {
  const [y, m, d] = (date || toISODate(new Date())).split("-").map(Number);
  const [hh, mm] = (time || "00:00").split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

/** "2026-09-19" -> localized date, e.g. "19. 9. 2026" / "9/19/2026". */
export function formatISODate(date: string) {
  return date ? fromISO(date).toLocaleDateString() : "";
}

/** "14:30" -> localized time, e.g. "14:30" / "2:30 PM". */
export function formatISOTime(time: string) {
  return time
    ? fromISO(undefined, time).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
}

/**
 * "2026-09-19" -> the UTC-midnight instant Material3's DatePicker expects.
 * `DatePickerState` reads `selectedDateMillis` as UTC, so handing it a local
 * midnight lands on the previous day for any positive offset.
 */
export function toPickerDate(date: string) {
  const [y, m, d] = (date || toISODate(new Date())).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toISOString();
}

/** The picker's UTC-midnight Date -> "2026-09-19". Local getters shift the day for negative offsets. */
export function fromPickerDate(d: Date) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** The two parts -> a real UTC instant for the API. The one place `toISOString()` is correct. */
export function toInstant(date: string, time: string) {
  return fromISO(date, time).toISOString();
}

/** "01:01" -> 3660. For duration fields, where the picker's value is a length, not a time of day. */
export function toSeconds(time: string) {
  const [hh, mm] = (time || "00:00").split(":").map(Number);
  return hh * 3600 + mm * 60;
}

/** 3660 -> "01:01", back into the picker's state. */
export function fromSeconds(seconds: number) {
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}`;
}

/** 3660 -> "1h 1min". A duration is not a clock time, so never run it through `formatISOTime`. */
export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds / 60) % 60;
  return [h && `${h}h`, m && `${m}min`].filter(Boolean).join(" ") || "0min";
}
