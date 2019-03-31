export class Cache<T> {
  private static readonly defaultCache = new Cache();
  private static readonly namespaces = {};
  private readonly cache = {};

  private constructor() {}

  static getInstance<T>(namespace?: string): Cache<T> {
    if (!namespace) {
      return Cache.defaultCache;
    }

    if (!Cache.namespaces[namespace]) {
      Cache.namespaces[namespace] = new Cache();
    }

    return Cache.namespaces[namespace];
  }

  set(key: string, value: any) {
    this.cache[key] = value;
  }

  get(key?: string, defaults?: any) {
    if (!key) {
      return this.cache;
    }

    return this.cache[key] || defaults;
  }

  clear(key?: string) {
    if (!key) {
      for (const key in this.cache) {
        if (this.cache.hasOwnProperty(key)) {
          delete this.cache[key];
        }
      }
    } else {
      delete this.cache[key];
    }
  }
}
