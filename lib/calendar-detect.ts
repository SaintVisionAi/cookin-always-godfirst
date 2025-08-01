export function detectCalendarIntent(text: string): boolean {
  return /book|schedule|appointment|meeting/i.test(text)
}
