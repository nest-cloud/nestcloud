import * as Consul from 'consul';
import { get } from 'lodash';
import * as YAML from 'yamljs';
import { IConsulConfig, IKVResponse } from '@nestcloud/common';
import { Store } from './store';
import { ConsulConfigInitException } from './exceptions/consul-config-init.exception';
import { ConsulConfigSyncException } from './exceptions/consul-config-sync.exception';

export class ConsulConfig implements IConsulConfig {
    private readonly store = Store;
    private readonly consul: Consul;
    private readonly key: string;

    constructor(consul: Consul, key: string) {
        this.consul = consul;
        this.key = key;
    }

    async init() {
        try {
            const result = await this.consul.kv.get<IKVResponse>(this.key);
            this.store.data = result ? YAML.parse(result.Value) : {};
            this.createWatcher();
        } catch (e) {
            throw new ConsulConfigInitException(e.message, e.stack);
        }
    }

    watch<T extends any>(path: string, callback: (data: T) => void = () => void 0) {
        this.store.watch(path, callback);
    }

    getKey(): string {
        return this.key;
    }

    get<T extends any>(path?: string, defaults?): T {
        if (!path) {
            return Store.data;
        }
        return get(Store.data, path, defaults);
    }

    async set(path: string, value: any) {
        this.store.update(path, value);
        const yamlString = YAML.stringify(this.store.data);
        try {
            await this.consul.kv.set(this.key, yamlString);
        } catch (e) {
            throw new ConsulConfigSyncException(e.message, e.stack);
        }
    }

    private createWatcher() {
        const watcher = this.consul.watch({
            method: this.consul.kv.get,
            options: { key: this.key, wait: '5m' },
        });
        watcher.on('change', (data, res) => {
            try {
                this.store.data = data ? YAML.parse(data.Value) : {};
            } catch (e) {
                this.store.data = { parseErr: e };
            }
        });
        watcher.on('error', () => void 0);
    }
}
