import { getLocales } from 'expo-localization';
import { DateTime, Duration } from 'luxon';

export function getGreeting() {
  const hour = new Date().getHours();

  if (hour > 4 && hour < 12) return `Good morning`;
  if (hour >= 12 && hour < 18) return `Good afternoon`;
  if (hour >= 18 && hour < 22) return `Good evening`;

  return `Good night`;
}

export function getDatetime() {
  return DateTime.now().toFormat('DDDD', {
    locale: getLocales()[0]?.languageTag,
  });
}

export function getDuration(minutes: number) {
  return Duration.fromObject({ minutes }).toFormat(
    minutes >= 60 ? "h'h' m'min'" : "m'min'",
  );
}
