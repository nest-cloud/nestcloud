import { get, set, isArray, isString, isObject } from 'lodash';
import { objectToMap } from '@nestcloud/common';
import { compile } from 'handlebars';

export class Store {
    private static _data: any;
    private static readonly _map: { [key: string]: any } = {};
    private static readonly watchCallbacks: {
        [key: string]: Array<(value: any) => void>;
    } = {};
    private static readonly hasDefined: { [key: string]: boolean } = {};

    static get data() {
        return this._data;
    }

    static set data(data: any) {
        this._data = data;
        if (isObject(this._data)) {
            for (const key in this._data) {
                if (this._data.hasOwnProperty(key)) {
                    this.compileWithEnv(key, this._data, this._data[key]);
                }
            }
        }
        this.updateConfigMap();
    }

    public static update(path: string, value: any) {
        set(this._data, path, value);
        this.updateConfigMap();
    }

    public static merge(data: any) {
    }

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

    private static compileWithEnv(key: string | number, parent: any, config: any) {
        if (isString(config)) {
            const template = compile(config.replace(/\${{/g, '{{'));
            parent[key] = template({ ...this._data });
        } else if (isArray(config)) {
            config.forEach((item, index) => this.compileWithEnv(index, config, item));
        } else if (isObject(config)) {
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    this.compileWithEnv(key, config, config[key]);
                }
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
