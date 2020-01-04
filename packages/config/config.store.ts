import { get, set, isArray, isString, isObject } from 'lodash';
import { objectToMap } from '@nestcloud/common';
import { compile } from 'handlebars';

export class ConfigStore {
    private _data: any;
    private readonly _map: { [key: string]: any } = {};
    private readonly watchRefs: {
        [key: string]: Array<(value: any) => void>;
    } = {};
    private readonly defined: { [key: string]: boolean } = {};

    public get data() {
        return this._data;
    }

    public set data(data: any) {
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

    public update(path: string, value: any) {
        set(this._data, path, value);
        this.updateConfigMap();
    }

    public merge(data: any) {
    }

    public get<T extends any>(path: string, defaults?: T): T {
        return get(this._data, path, defaults);
    }

    public watch(path: string, ref: (value: any) => void) {
        if (!this.watchRefs[path]) {
            this.watchRefs[path] = [];
        }
        this.watchRefs[path].push(ref);

        if (!this.defined[path]) {
            Object.defineProperty(this._map, path, {
                set: newVal => {
                    this.watchRefs[path].forEach(cb => cb(newVal));
                },
            });
            this.defined[path] = true;
        }
    }

    private compileWithEnv(key: string | number, parent: any, config: any) {
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

    private updateConfigMap() {
        const configMap = objectToMap(this._data);
        for (const key in configMap) {
            if (this._map[key] !== configMap[key]) {
                this._map[key] = configMap[key];
            }
        }
    }
}
