import * as Consul from 'consul';
import { get, set } from 'lodash';
import { Module, DynamicModule, Global } from '@nestjs/common';
import { NEST_BOOT_PROVIDER, NEST_CONSUL_PROVIDER, NEST_BOOT } from '@nestcloud/common';
import { Boot } from '@nestcloud/boot';
import { IConsulOptions } from './interfaces/consul-options.interface';

@Global()
@Module({})
export class ConsulModule {
    static register(options: IConsulOptions = {}): DynamicModule {
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
                return new Consul({ ...options, promisify: true });
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
