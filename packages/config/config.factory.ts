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

    create(backend: string, ref: any) {
        switch (backend) {
            case CONSUL:
                return new ConsulConfig(this.store, ref, this.options.name);
            case ETCD:
                return new EtcdConfig(this.store, ref, this.options.name);
            case KUBERNETES:
                return new KubernetesConfig(
                    this.store,
                    ref,
                    this.options.name,
                    this.options.namespace,
                    this.options.path,
                );
            default:
                throw new Error(NO_DEPS_MODULE_FOUND);
        }
    }
}
