// @ts-nocheck
import { proxy } from "valtio";

const isObject = (x: unknown): x is object =>
  typeof x === "object" && x !== null;

const canProxy = (x: unknown) =>
  isObject(x) &&
  (Array.isArray(x) || !(Symbol.iterator in x)) &&
  !(x instanceof WeakMap) &&
  !(x instanceof WeakSet) &&
  !(x instanceof Error) &&
  !(x instanceof Number) &&
  !(x instanceof Date) &&
  !(x instanceof String) &&
  !(x instanceof RegExp) &&
  !(x instanceof ArrayBuffer) &&
  !(x instanceof Promise);

type KeyValRecord<K, V> = [key: K, value: V];

type InternalProxyMap<K, V> = Map<K, V> & {
  data: V[];
  toJSON: object;
};

export function proxyMap<K, V>(entries?: Iterable<readonly [K, V]> | null) {
  let seq = 0;
  const keys = new Map<any, number>();

  const map: InternalProxyMap<K, V> = proxy({
    data: [],
    has(key) {
      return !!this.data[keys.get(key)];
    },
    set(key, value) {
      const k = canProxy(key) ? proxy(key) : key;
      keys.set(k, seq);

      this.data[seq] = canProxy(value) ? proxy(value) : value;
      // this.data.length;
      seq++;

      return this;
    },
    get(key) {
      this.data.length;
      return this.data[keys.get(key)];
    },
    delete(key) {
      delete this.data[keys.get(key)];
      return keys.delete(key);
    },
    clear() {
      keys.clear();
      this.data.splice(0);
    },
    get size() {
      this.data.length;

      return keys.size;
    },
    toJSON() {
      return new Map(this.data);
    },
    forEach(cb) {
      keys.forEach((v, k) => {
        cb(this.data[v], k);
      });
      this.data.length;
      // this.data.forEach((p) => {
      //   cb(p[1], p[0], this);
      // });
    },
    keys() {
      return this.data.map((p) => p[0]).values();
    },
    values() {
      const ret = [];

      for (const k of keys.values()) {
        ret.push(this.data[k]);
      }
      this.data.length;
      return ret;
    },
    entries() {
      return new Map(this.data).entries();
    },
    get [Symbol.toStringTag]() {
      return "Map";
    },
    [Symbol.iterator]() {
      return this.entries();
    },
  });

  Object.defineProperties(map, {
    data: {
      enumerable: false,
    },
    size: {
      enumerable: false,
    },
    toJSON: {
      enumerable: false,
    },
  });
  Object.seal(map);

  return map as unknown as Map<K, V> & {
    $$valtioSnapshot: Omit<Map<K, V>, "set" | "delete" | "clear">;
  };
}
