import 'reflect-metadata';
import { Consul } from 'consul';
import * as YAML from 'yamljs';
import { Inject } from '@nestjs/common';
import { NEST_CONSUL_PROVIDER, Cache, NEST_CONSUL } from "@nestcloud/common";
import { KVResponse } from "./consul.options";

const NEST_CONSUL_CALLBACKS = 'NEST_CONSUL_CALLBACKS';

let hasDefined = false;

export const InjectConsul = () => Inject(NEST_CONSUL_PROVIDER);

export const ConsulKV = (key?: string, type?: 'json' | 'yaml' | 'text', defaults?: any) => createKVDecorator(key, type, defaults);
export const WatchKV = (key?: string, type?: 'json' | 'yaml' | 'text', defaults?: any) => createKVDecorator(key, type, defaults);


const createKVDecorator = (key?: string, type?: 'json' | 'yaml' | 'text', defaults?: any): PropertyDecorator => {
    return function (target: any, propertyName: string | Symbol) {
        const cache = Cache.getInstance(NEST_CONSUL).get();

        const callbacks = Cache.getInstance(NEST_CONSUL_CALLBACKS).get('callbacks', []);
        callbacks.push(((key, type, defaults, target, propertyName) => {
            return async (consul: Consul) => {
                try {
                    const result = await consul.kv.get(key) as KVResponse;
                    updatePropertyValue(result, target, propertyName, type, defaults);

                    const watcher = consul.watch({
                        method: consul.kv.get,
                        options: { key, wait: '5m', timeout: 3000000 }
                    });
                    watcher.on('change', result => updatePropertyValue(result, target, propertyName, type, defaults));
                    watcher.on('error', () => void 0);
                } catch (e) {
                }
            }
        })(key, type, defaults, target, propertyName));
        Cache.getInstance(NEST_CONSUL_CALLBACKS).set('callbacks', callbacks);

        if (!hasDefined) {
            Object.defineProperty(cache, 'consul', {
                set: async (consul: Consul) => {
                    callbacks.forEach(callback => callback(consul));
                },
            });
            hasDefined = true;
        }
    }
};

function updatePropertyValue(result, target, propertyName, type, defaults) {
    if (result) {
        try {
            target.constructor.prototype[propertyName] = (
                type === 'json' ? JSON.parse(result.Value) :
                    type === 'yaml' ? YAML.parse(result.Value) : result.Value
            ) || defaults;
        } catch (e) {
            target.constructor.prototype[propertyName] = defaults;
        }
    } else {
        target.constructor.prototype[propertyName] = defaults;
    }
}
