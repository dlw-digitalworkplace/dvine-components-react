export function flatten<T extends { children?: T[] }>(array: T[]): T[] {
  let result: T[] = [];

  array.forEach(item => {
    result.push(item);

    if (Array.isArray(item.children)) {
      result = result.concat(flatten(item.children));
    }
  });

  return result;
}
