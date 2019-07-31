import { Memcached } from './memcached.class';
import { Module, DynamicModule, Global } from '@nestjs/common';
import { IMemcachedOptions } from './interfaces/memcached-options.interface';
import { IConfig, IBoot } from '@nestcloud/common';
import {
    NEST_MEMCACHED_PROVIDER,
    NEST_BOOT,
    NEST_CONFIG,
    NEST_BOOT_PROVIDER,
    NEST_CONFIG_PROVIDER,
} from '@nestcloud/common';

@Global()
@Module({})
export class MemcachedModule {
    static register(options: IMemcachedOptions = {}): DynamicModule {
        const inject = [];
        if (options.dependencies) {
            if (options.dependencies.includes(NEST_BOOT)) {
                inject.push(NEST_BOOT_PROVIDER);
            } else if (options.dependencies.includes(NEST_CONFIG)) {
                inject.push(NEST_CONFIG_PROVIDER);
            }
        }

        const connectionProvider = {
            provide: NEST_MEMCACHED_PROVIDER,
            useFactory: async (config: IBoot | IConfig): Promise<Memcached> => {
                if (inject.includes(NEST_BOOT_PROVIDER)) {
                    options = (config as IBoot).get('memcached', {});
                } else if (inject.includes(NEST_CONFIG_PROVIDER)) {
                    options = await (config as IConfig).get('memcached', {});
                }
                return new Memcached(options.uri, options);
            },
            inject,
        };
        return {
            module: MemcachedModule,
            providers: [connectionProvider],
            exports: [connectionProvider],
        };
    }
}
