import { IKVResponse, NEST_CONSUL } from '@nestcloud/common';
import * as YAML from 'yamljs';
import * as CoreModule from '@nestcloud/core';

export const WatchKV = (key?: string, type?: 'json' | 'yaml' | 'text', defaults?: any) => createKVDecorator(key, type, defaults);

const createKVDecorator = (key?: string, type?: 'json' | 'yaml' | 'text', defaults?: any): PropertyDecorator => {
    return (target: any, propertyName: string | Symbol) => {
        const Core: typeof CoreModule = require('@nestcloud/core');

        // @ts-ignore
        target.constructor.prototype[propertyName] = defaults;
        if (Core.NestCloud.global.consul) {
            handlePropertyValue(Core.NestCloud.global.consul, key, target, propertyName, type, defaults);
        } else {
            Core.NestCloud.global.watch<any>(NEST_CONSUL, async consul => {
                await handlePropertyValue(consul, key, target, propertyName, type, defaults);
            });
        }
    };
};

async function handlePropertyValue(consul, key, target, propertyName, type, defaults) {
    try {
        const result = await consul.kv.get(key) as IKVResponse;
        updatePropertyValue(result, target, propertyName, type, defaults);

        const watcher = consul.watch({
            method: consul.kv.get,
            options: { key, wait: '5m', timeout: 3000000 },
        });
        watcher.on('change', result => updatePropertyValue(result, target, propertyName, type, defaults));
        watcher.on('error', () => void 0);
    } catch (e) {
    }
}

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
