import { get } from 'lodash';
import { IConfig, IKubernetes, sleep } from '@nestcloud/common';
import * as YAML from 'yamljs';
import { Logger, OnModuleInit } from '@nestjs/common';
import { ConfigStore } from './config.store';
import { ConfigSyncException } from './exceptions/config-sync.exception';
import { NO_NAME_PROVIDE } from './config.messages';

export class KubernetesConfig implements IConfig, OnModuleInit {
    private readonly retryInterval = 5000;
    private readonly logger = new Logger('ConfigModule');

    constructor(
        private readonly store: ConfigStore,
        private readonly client: IKubernetes,
        private readonly name: string,
        private readonly namespace: string = 'default',
        private readonly path: string = 'config.yaml',
    ) {
    }

    async onModuleInit() {
        if (!this.name) {
            throw new Error(NO_NAME_PROVIDE);
        }
        while (true) {
            try {
                const result = await this.client.api.v1.namespaces(this.namespace).configmaps(this.name).get();
                const data = get(result, 'body.data', { [this.path]: '' });
                try {
                    this.store.data = data[this.path] ? YAML.parse(data[this.path]) : {};
                } catch (e) {
                    this.logger.error('parse config data error', e);
                    this.store.data = {};
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

    get<T extends any>(path?: string, defaults?): T {
        if (!path) {
            return this.store.data;
        }
        return get(this.store.data, path, defaults);
    }

    async set(path: string, value: any): Promise<void> {
        this.store.update(path, value);
        const yamlString = YAML.stringify(this.store.data);
        try {
            await this.client.api.v1.namespaces(this.namespace).configmaps(this.name).patch({
                body: {
                    data: {
                        [this.path]: yamlString,
                    },
                },
            });
        } catch (e) {
            throw new ConfigSyncException(e.message, e.stack);
        }
    }

    watch<T extends any>(path: string, callback: (data: T) => void = () => void 0) {
        this.store.watch(path, callback);
    }

    private async createWatcher() {
        const events = await (this.client.api.v1.watch.namespaces(this.namespace).configmaps(this.name) as any).getObjectStream();
        events.on('data', event => {
            if (event.type === 'ADDED' || event.type === 'MODIFIED') {
                const data = get(event, 'object.data', { [this.path]: '' });
                try {
                    this.store.data = data[this.path] ? YAML.parse(data[this.path]) : {};
                } catch (e) {
                    this.logger.error('parse config data error', e);
                    this.store.data = {};
                }
            }
        });
    }
}
