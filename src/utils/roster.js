export function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}