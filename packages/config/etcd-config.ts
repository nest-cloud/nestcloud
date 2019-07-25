import { IConfig, sleep } from '@nestcloud/common';
import { Etcd3 } from 'etcd3';
import { Store } from './store';
import * as YAML from 'yamljs';
import { Logger } from '@nestjs/common';
import { get } from 'lodash';
import { ConfigSyncException } from './exceptions/config-sync.exception';

export class EtcdConfig implements IConfig {
    private readonly store = Store;
    private readonly etcd: Etcd3;
    private readonly key: string;
    private readonly retryInterval: 5000;
    private watcher = null;
    private readonly logger = new Logger('ConfigModule');

    constructor(etcd: Etcd3, key: string) {
        this.etcd = etcd;
        this.key = key;
    }

    async init() {
        while (true) {
            try {
                const result = await this.etcd.get(this.key).string();
                this.store.data = result ? YAML.parse(result) : {};
                this.createWatcher();
                this.logger.log('ConfigModule initialized');
                break;
            } catch (e) {
                this.logger.error('Unable to initial ConfigModule, retrying...', e);
                await sleep(this.retryInterval);
            }
        }
    }

    get<T extends any>(path?: string, defaults?): T {
        if (!path) {
            return Store.data;
        }
        return get(Store.data, path, defaults);
    }

    getKey(): string {
        return this.key;
    }

    async set(path: string, value: any): Promise<void> {
        this.store.update(path, value);
        const yamlString = YAML.stringify(this.store.data);
        try {
            await this.etcd.put(this.key).value(yamlString);
        } catch (e) {
            throw new ConfigSyncException(e.message, e.stack);
        }
    }

    watch<T extends any>(path: string, callback: (data: T) => void = () => void 0) {
        this.store.watch(path, callback);
    }

    private async createWatcher() {
        if (this.watcher) {
            this.watcher.end();
        }
        this.watcher = await this.etcd.watch().create();
        this.watcher.on('data', (data, res) => {
            try {
                this.store.data = data ? YAML.parse(data) : {};
            } catch (e) {
                this.store.data = { parseErr: e };
            }
        });
        this.watcher.on('error', () => void 0);
    }
}
