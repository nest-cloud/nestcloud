import { get } from 'lodash';
import { objectToMap } from '@nestcloud/common';

export class Store {
  private static readonly ENV_DEFAULT_RE = /\${(.*)\|\|(.*)}/;
  private static readonly ENV_RE = /\${(.*)}/;
  private static _data: any;
  private static readonly _map: { [key: string]: any } = {};
  private static _env: any;
  private static readonly watchCallbacks: {
    [key: string]: Array<(value: any) => void>;
  } = {};
  private static readonly hasDefined: { [key: string]: boolean } = {};

  static set env(env: any) {
    this._env = env;
  }

  static get data() {
    return this._data;
  }

  static set data(data: any) {
    this._data = data;
    this.compileWithEnv(this._data);
    this.updateConfigMap();
  }

  public static merge(data: any) {}

  public static get<T extends any>(path: string, defaults?: T): T {
    return get(this._data, path, defaults);
  }

  public static watch(path: string, callback: (value: any) => void) {
    if (!this.watchCallbacks[path]) {
      this.watchCallbacks[path] = [];
    }
    this.watchCallbacks[path].push(callback);

    if (!this.hasDefined[path]) {
      Object.defineProperty(this._map, path, {
        set: newVal => {
          this.watchCallbacks[path].forEach(cb => cb(newVal));
        },
      });
      this.hasDefined[path] = true;
    }
  }

  private static compileWithEnv(configs: object) {
    for (const key in configs) {
      if (!configs.hasOwnProperty(key)) {
        continue;
      }
      const config = configs[key];
      if (typeof config === 'string' && this.ENV_DEFAULT_RE.test(config)) {
        const result = this.ENV_DEFAULT_RE.exec(config);
        const path = get(result, [1], '').trim();
        const def = get(result, [2], '').trim();
        configs[key] = get(this._env, path, def);
      } else if (typeof config === 'string' && this.ENV_RE.test(config)) {
        const result = this.ENV_DEFAULT_RE.exec(config);
        const path = get(result, [1], '').trim();
        configs[key] = get(this._env, path);
      } else if (typeof config === 'object') {
        this.compileWithEnv(config);
      }
    }
  }

  private static updateConfigMap() {
    const configMap = objectToMap(this._data);
    for (const key in configMap) {
      if (this._map[key] !== configMap[key]) {
        this._map[key] = configMap[key];
      }
    }
  }
}
