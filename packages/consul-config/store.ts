import { get, set } from 'lodash';
import { objectToMap } from '@nestcloud/common';

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

    private static updateConfigMap() {
        const configMap = objectToMap(this._data);
        for (const key in configMap) {
            if (this._map[key] !== configMap[key]) {
                this._map[key] = configMap[key];
            }
        }
    }
}
