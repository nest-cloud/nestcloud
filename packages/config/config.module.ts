import {
    NEST_BOOT,
    NEST_BOOT_PROVIDER,
    NEST_CONFIG_PROVIDER,
    NEST_CONSUL_PROVIDER,
    NEST_CONSUL,
    IConfig,
    IBoot,
    NEST_ETCD,
    NEST_ETCD_PROVIDER,
} from '@nestcloud/common';
import { DynamicModule, Global, Module } from '@nestjs/common';
import * as Consul from 'consul';
import { IConfigOptions } from './interfaces/config-options.interface';
import { ConsulConfig } from './consul-config';
import { EtcdConfig } from './etcd-config';

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
            } else if (options.dependencies.includes(NEST_ETCD)) {
                inject.push(NEST_ETCD_PROVIDER);
            }
        }

        const consulConfigProvider = {
            provide: NEST_CONFIG_PROVIDER,
            useFactory: async (...args: any[]): Promise<IConfig> => {
                const boot: IBoot = args[inject.indexOf(NEST_BOOT_PROVIDER)];
                const consul: Consul = args[inject.indexOf(NEST_CONSUL_PROVIDER)];
                const etcd = args[inject.indexOf(NEST_ETCD_PROVIDER)];
                let key = options.key;
                if (boot) {
                    key = boot.get('consul.config.key');
                    if (!key) {
                        throw new Error('Please set consul.config.key in Boot module config file');
                    }
                }
                if (consul) {
                    const client = new ConsulConfig(consul, key);
                    await client.init();
                    return client;
                } else if (etcd) {
                    return new EtcdConfig(etcd, key);
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
