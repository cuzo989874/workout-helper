export function filterObject<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      switch (typeof value) {
        case 'number':
          return !isNaN(value);
        case 'string':
          return value !== '';
        case 'object':
          return value !== null && Object.keys(value).length > 0;
        default:
          return value !== undefined;
      }
    })
  ) as Partial<T>;
}

/**
 * Recursively filters an object, removing properties with empty string, NaN, undefined, null,
 * or empty object/array values at any depth.
 */
export function filterObjectDeep<T extends object>(obj: T): Partial<T> {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => filterObjectDeep(item)) as T;
  }

  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            const filteredArr = value
              .map(item =>
                typeof item === 'object' && item !== null
                  ? filterObjectDeep(item)
                  : item
              )
              .filter(
                item =>
                  item !== undefined &&
                  item !== null &&
                  (typeof item !== 'string' || item !== '') &&
                  (typeof item !== 'number' || !isNaN(item)) &&
                  (typeof item !== 'object' ||
                    (item && Object.keys(item).length > 0))
              );
            return [key, filteredArr.length > 0 ? filteredArr : undefined];
          } else {
            const filteredObj = filterObjectDeep(value);
            return [
              key,
              filteredObj && Object.keys(filteredObj).length > 0
                ? filteredObj
                : undefined,
            ];
          }
        }
        if (typeof value === 'string') {
          return value !== '' ? [key, value] : [key, undefined];
        }
        if (typeof value === 'number') {
          return !isNaN(value) ? [key, value] : [key, undefined];
        }
        if (value !== undefined && value !== null) {
          return [key, value];
        }
        return [key, undefined];
      })
      .filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}
