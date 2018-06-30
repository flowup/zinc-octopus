export interface IdMap<T> {
  [id: string]: T;
}

export function toIdMap<T>(array: T[], idKey: keyof T): IdMap<T> {
  return array.reduce((acc, item) => ({...acc, [String(item[idKey])]: item}), {});
}

export function removeByIds<T>(map: IdMap<T>, ids: string[]): IdMap<T> {
  return ids.reduce((acc, key) => {
    const {[key]: _, ...rest} = acc;
    return rest;
  }, map);
}
