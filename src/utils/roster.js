//returns an object with items grouped into arrays.
//keyFn requires a callback to corelate the key and the item.

export function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}