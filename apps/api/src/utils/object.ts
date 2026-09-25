// Takes an object and flattens it into a single level object with dot notation keys
export function flattenObject(
  obj: Record<string, any>,
  prefix = '',
): Record<string, any> {
  let out: Record<string, any> = {};

  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'object' && v !== null && !Array.isArray(v))
      out = { ...out, ...flattenObject(v, prefix + k + '.') };
    else if (Array.isArray(v)) out[prefix + k] = v.join(',');
    else out[prefix + k] = v;
  }

  return out;
}
