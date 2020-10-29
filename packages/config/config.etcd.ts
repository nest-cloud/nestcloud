import { get } from 'lodash';
import { IConfig, IEtcd, sleep } from '@nestcloud/common';
import * as YAML from 'yamljs';
import { Logger, OnModuleInit } from '@nestjs/common';
import { ConfigStore } from './config.store';
import { ConfigSyncException } from './exceptions/config-sync.exception';
import * as RPC from 'etcd3/lib/rpc';
import { NO_NAME_PROVIDE } from './config.messages';

export class EtcdConfig implements IConfig, OnModuleInit {
    private readonly retryInterval = 5000;
    private readonly logger = new Logger('ConfigModule');
    private readonly namespace = 'nestcloud-config/';

    constructor(
        private readonly store: ConfigStore,
        private readonly client: IEtcd,
        private readonly name: string,
    ) {
    }

    async onModuleInit() {
        if (!this.name) {
            throw new Error(NO_NAME_PROVIDE);
        }
        while (true) {
            try {
                const data = await this.client.namespace(this.namespace).get(this.name).string();
                if (data) {
                    try {
                        this.store.data = YAML.parse(data);
                    } catch (e) {
                        this.logger.error('parse config data error', e);
                        this.store.data = {};
                    }
                }

                this.createWatcher();
                this.logger.log('ConfigModule initialized');
                break;
            } catch (e) {
                this.logger.error('Unable to initial ConfigModule, retrying...', e);
                await sleep(this.retryInterval);
            }
        }
    }

    public get<T extends any>(path?: string, defaults?): T {
        if (!path) {
            return this.store.data;
        }
        return get(this.store.data, path, defaults);
    }

    public async set(path: string, value: any): Promise<void> {
        this.store.update(path, value);
        const yamlString = YAML.stringify(this.store.data);
        try {
            await this.client.namespace(this.namespace).put(this.name).value(yamlString);
        } catch (e) {
            throw new ConfigSyncException(e.message, e.stack);
        }
    }

    public watch<T extends any>(path: string, callback: (data: T) => void = () => void 0) {
        this.store.watch(path, callback);
    }

    private async createWatcher() {
        const watcher = await this.client.namespace(this.namespace).watch().key(this.name).create();
        watcher.on('data', (res: RPC.IWatchResponse) => {
            const event = res.events.filter(evt => !evt.prev_kv)[0];
            if (event) {
                if (event.type === 'Delete') {
                    this.store.data = {};
                } else if (event.type === 'Put') {
                    if (event.kv.value && event.kv.value.toString()) {
                        try {
                            this.store.data = YAML.parse(event.kv.value.toString());
                        } catch (e) {
                            this.logger.error('parse config data error', e);
                            this.store.data = {};
                        }
                    } else {
                        this.store.data = {};
                    }
                }
            }
        });
    }
}
