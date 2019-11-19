import { NEST_ETCD } from '@nestcloud/common';
import * as YAML from 'yamljs';
import * as CoreModule from '@nestcloud/core';
import { IEtcd } from '../../common';
import * as RPC from 'etcd3/lib/src/rpc';

export const Etcd = (key?: string, type?: 'json' | 'yaml' | 'text', defaults?: any) => createEtcdDecorator(key, type, defaults);

const createEtcdDecorator = (key?: string, type?: 'json' | 'yaml' | 'text', defaults?: any): PropertyDecorator => {
    return async (target: any, propertyName: string | Symbol) => {
        const Core: typeof CoreModule = require('@nestcloud/core');

        // @ts-ignore
        target.constructor.prototype[propertyName] = defaults;
        if (Core.NestCloud.global.etcd) {
            await handlePropertyValue(Core.NestCloud.global.etcd, key, target, propertyName, type, defaults);
        } else {
            Core.NestCloud.global.watch<any>(NEST_ETCD, async etcd => {
                await handlePropertyValue(etcd, key, target, propertyName, type, defaults);
            });
        }
    };
};

async function handlePropertyValue(etcd: IEtcd, key, target, propertyName, type, defaults) {
    try {
        const value = await etcd.get(key).string();
        updatePropertyValue(value, target, propertyName, type, defaults);

        const watcher = await etcd.watch().key(key).create();
        watcher.on('data', (res: RPC.IWatchResponse) => {
            res.events.forEach(evt => {
                if (evt.type === 'Put') {
                    updatePropertyValue(evt.kv.value.toString(), target, propertyName, type, defaults);
                } else if (evt.type === 'Delete') {
                    updatePropertyValue('', target, propertyName, type, defaults);
                }
            });
        });
    } catch (e) {
    }
}

function updatePropertyValue(value, target, propertyName, type, defaults) {
    if (value) {
        try {
            target.constructor.prototype[propertyName] = (
                type === 'json' ? JSON.parse(value) :
                    type === 'yaml' ? YAML.parse(value) : value
            ) || defaults;
        } catch (e) {
            target.constructor.prototype[propertyName] = defaults;
        }
    } else {
        target.constructor.prototype[propertyName] = defaults;
    }
}
