// Takes an object and flattens it into a single level object with dot notation keys
export function flattenObject<T>(
  obj: Record<string, T>,
  prefix = '',
): Record<string, T | string> {
  let out: Record<string, T | string> = {};

  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'object' && v !== null && !Array.isArray(v))
      out = {
        ...out,
        ...flattenObject<T | string>(
          v as Record<string, string | T>,
          `${prefix}${k}.`,
        ),
      };
    else if (Array.isArray(v)) out[prefix + k] = v.join(',');
    else out[prefix + k] = v;
  }

  return out;
}
