import { ConsulConfig } from './config.consul';
import { EtcdConfig } from './config.etcd';
import { KubernetesConfig } from './config.kubernetes';
import { NO_DEPS_MODULE_FOUND } from './config.messages';
import { CONSUL, ETCD, KUBERNETES } from '@nestcloud/common';
import { ConfigOptions } from './interfaces/config-options.interface';
import { ConfigStore } from './config.store';

export class ConfigFactory {
    constructor(
        private readonly store: ConfigStore,
        private readonly options: ConfigOptions,
    ) {
    }

    async create(backend: string, ref: any) {
        let client;
        switch (backend) {
            case CONSUL:
                client = new ConsulConfig(this.store, ref, this.options.name);
                break;
            case ETCD:
                client = new EtcdConfig(this.store, ref, this.options.name);
                break;
            case KUBERNETES:
                client = new KubernetesConfig(
                    this.store,
                    ref,
                    this.options.name,
                    this.options.namespace,
                    this.options.path,
                );
                break;
            default:
                throw new Error(NO_DEPS_MODULE_FOUND);
        }

        try {
            await client.onModuleInit();
        } catch (e) {
        }
        return client;
    }
}
