import { INestApplicationContext } from '@nestjs/common';
import { Global } from './global';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import {
    BOOT,
    CONFIG,
    CONSUL,
    ETCD,
    HTTP,
    KUBERNETES,
    LOADBALANCE,
    LOGGER,
    MEMCACHED,
    PROXY, REDIS,
    SERVICE,
} from '@nestcloud/common';

export class NestCloud {
    public static global: Global = new Global();
    private static readonly providerKeys = {
        [BOOT]: 'boot',
        [CONSUL]: 'consul',
        [CONFIG]: 'config',
        [SERVICE]: 'service',
        [LOADBALANCE]: 'loadbalance',
        [HTTP]: 'http',
        [PROXY]: 'proxy',
        [LOGGER]: 'logger',
        [MEMCACHED]: 'memcached',
        [ETCD]: 'etcd',
        [KUBERNETES]: 'kubernetes',
        [REDIS]: 'redis',
    };

    static create<T extends INestApplicationContext = INestApplicationContext>(application: T): T {
        this.initialize(application);
        return application;
    }

    private static initialize(app) {
        this.global.app = app;
        const modules = this.global.getContainer().getModules();
        for (const module of modules.values()) {
            for (const providerKey in this.providerKeys) {
                if (module.providers.has(providerKey)) {
                    const instanceWrapper = module.providers.get(providerKey);
                    if (!instanceWrapper) {
                        continue;
                    }
                    const instanceHost = instanceWrapper.getInstanceByContextId(STATIC_CONTEXT);
                    if (instanceHost.isResolved && instanceHost.instance) {
                        this.global[this.providerKeys[providerKey]] = instanceHost.instance;
                    }
                }
            }
        }
    }
}
