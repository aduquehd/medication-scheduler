import { en } from '@/translations/en';

type Translations = typeof en;

export function getIntervalText(interval: number, t: Translations): string {
  if (interval === 24) {
    return t.onceDaily;
  } else if (interval === 12) {
    return t.everyTwelveHours;
  } else if (interval === 8) {
    return t.everyEightHours;
  } else if (interval === 6) {
    return t.everySixHours;
  } else if (interval === 4) {
    return t.everyFourHours;
  } else {
    return `${t.every} ${interval} ${interval === 1 ? t.hour : t.hours}`;
  }
}