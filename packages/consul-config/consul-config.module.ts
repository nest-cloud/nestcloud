import { NEST_BOOT, NEST_BOOT_PROVIDER, NEST_CONSUL_CONFIG_PROVIDER, NEST_CONSUL_PROVIDER } from '@nestcloud/common';
import { DynamicModule, Global, Module } from '@nestjs/common';
import * as Consul from 'consul';

import { Boot } from '@nestcloud/boot';
import { ConsulConfig } from './consul-config.class';
import { Options } from './consul-config.options';

@Global()
@Module({})
export class ConsulConfigModule {
    static register(options: Options = {}): DynamicModule {
        const inject = [NEST_CONSUL_PROVIDER];
        if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
            inject.push(NEST_BOOT_PROVIDER);
        }
        const consulConfigProvider = {
            provide: NEST_CONSUL_CONFIG_PROVIDER,
            useFactory: async (consul: Consul, boot: Boot): Promise<ConsulConfig> => {
                const env = process.env.NODE_ENV || 'development';
                let key = options.key;
                let retry = options.retry;
                if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
                    key = boot.get('consul.config.key');
                    retry = boot.get('consul.config.retry', 5);
                    const serviceName = boot.get('web.serviceName', 'localhost');
                    const serviceId = boot.get('web.serviceId', '');

                    if (!key) {
                        throw new Error('Please set consul.config.key in bootstrap.yml');
                    }
                    key = key
                        .replace(/ /g, '')
                        .replace('{env}', env)
                        .replace('{serviceName}', serviceName)
                        .replace('{serviceId}', serviceId);
                }
                const client = new ConsulConfig(consul, key, { retry });
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
