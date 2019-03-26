import * as Consul from 'consul';
import { get, set } from 'lodash';
import { Module, DynamicModule, Global } from '@nestjs/common';
import { Options } from './consul.options';
import { NEST_BOOT_PROVIDER, NEST_CONSUL_PROVIDER, NEST_BOOT, Cache, NEST_CONSUL } from "@nestcloud/common";
import { Boot } from '@nestcloud/boot';

@Global()
@Module({})
export class ConsulModule {
    static register(options: Options = {}): DynamicModule {
        const inject = [];
        if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
            inject.push(NEST_BOOT_PROVIDER);
        }
        const consulProvider = {
            provide: NEST_CONSUL_PROVIDER,
            useFactory: async (boot: Boot): Promise<Consul> => {
                if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
                    options = boot.get('consul', {});
                }
                if (!get(options, 'defaults.timeout')) {
                    set(options, 'defaults.timeout', 5000);
                }
                const consul = await new Consul({ ...options, promisify: true });
                Cache.getInstance(NEST_CONSUL).set('consul', consul);
                return consul;
            },
            inject,
        };

        return {
            module: ConsulModule,
            providers: [consulProvider],
            exports: [consulProvider],
        };
    }
}
