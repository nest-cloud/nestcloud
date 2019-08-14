import {
    NEST_BOOT,
    NEST_BOOT_PROVIDER,
    NEST_CONFIG_PROVIDER,
    NEST_CONSUL_PROVIDER,
    NEST_CONSUL,
    NEST_KUBERNETES,
    NEST_KUBERNETES_PROVIDER,
    IConfig,
    IBoot,
    IKubernetes,
} from '@nestcloud/common';
import { DynamicModule, Global, Module } from '@nestjs/common';
import * as Consul from 'consul';
import { IConfigOptions } from './interfaces/config-options.interface';
import { ConsulConfig } from './consul-config';
import { KubernetesConfig } from './kubernetes-config';

@Global()
@Module({})
export class ConfigModule {
    static register(options: IConfigOptions = {}): DynamicModule {
        const inject = [];
        if (options.dependencies) {
            if (options.dependencies.includes(NEST_BOOT)) {
                inject.push(NEST_BOOT_PROVIDER);
            }
            if (options.dependencies.includes(NEST_CONSUL)) {
                inject.push(NEST_CONSUL_PROVIDER);
            } else if (options.dependencies.includes(NEST_KUBERNETES)) {
                inject.push(NEST_KUBERNETES_PROVIDER);
            }
        }

        const consulConfigProvider = {
            provide: NEST_CONFIG_PROVIDER,
            useFactory: async (...args: any[]): Promise<IConfig> => {
                const boot: IBoot = args[inject.indexOf(NEST_BOOT_PROVIDER)];
                const consul: Consul = args[inject.indexOf(NEST_CONSUL_PROVIDER)];
                const kubernetes: IKubernetes = args[inject.indexOf(NEST_KUBERNETES_PROVIDER)];
                if (boot) {
                    options = boot.get('config');
                    if (!options.key) {
                        throw new Error('Please set config.key in boot module config file');
                    }
                }
                if (!options.key) {
                    throw new Error('Please set key when register module');
                }
                if (consul) {
                    const client = new ConsulConfig(consul, options.key);
                    await client.init();
                    return client;
                } else if (kubernetes) {
                    options.namespace = options.namespace || 'default';
                    if (!options.path) {
                        throw new Error('Please set configmap path when use config module in kubernetes');
                    }
                    const client = new KubernetesConfig(kubernetes, options.key, options.namespace, options.path);
                    await client.init();
                    return client;
                } else {
                    throw new Error('Please add NEST_CONSUL or NEST_KUBERNETES to dependencies attribute');
                }
            },
            inject,
        };

        return {
            module: ConfigModule,
            providers: [consulConfigProvider],
            exports: [consulConfigProvider],
        };
    }
}
