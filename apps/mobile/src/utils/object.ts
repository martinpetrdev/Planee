export function removeNullishValues<T>(
  obj: Record<string, T | null | undefined>,
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null),
  ) as Record<string, T>;
}
