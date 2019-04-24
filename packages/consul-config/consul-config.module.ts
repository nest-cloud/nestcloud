import { NEST_BOOT, NEST_BOOT_PROVIDER, NEST_CONSUL_CONFIG_PROVIDER, NEST_CONSUL_PROVIDER } from '@nestcloud/common';
import { DynamicModule, Global, Module } from '@nestjs/common';
import * as Consul from 'consul';

import { Boot } from '@nestcloud/boot';
import { ConsulConfig } from './consul-config.class';
import { IConsulConfigOptions } from './interfaces/consul-config-options.interface';

@Global()
@Module({})
export class ConsulConfigModule {
    static register(options: IConsulConfigOptions = {}): DynamicModule {
        const inject = [NEST_CONSUL_PROVIDER];
        if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
            inject.push(NEST_BOOT_PROVIDER);
        }
        const consulConfigProvider = {
            provide: NEST_CONSUL_CONFIG_PROVIDER,
            useFactory: async (consul: Consul, boot: Boot): Promise<ConsulConfig> => {
                let key = options.key;
                if (inject.includes(NEST_BOOT_PROVIDER)) {
                    key = boot.get('consul.config.key');
                    if (!key) {
                        throw new Error('Please set consul.config.key in Boot module config file');
                    }
                }
                const client = new ConsulConfig(consul, key);
                await client.init();
                return client;
            },
            inject,
        };

        return {
            module: ConsulConfigModule,
            providers: [consulConfigProvider],
            exports: [consulConfigProvider],
        };
    }
}
