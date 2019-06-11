import { DynamicModule, Global, Module } from '@nestjs/common';
import { create, createOptions } from './redis.provider';
import { RedisModuleOptions } from './interfaces/redis-options.interface';
import { NEST_BOOT_PROVIDER, NEST_BOOT, NEST_CONSUL_CONFIG_PROVIDER, NEST_CONSUL_CONFIG } from '@nestcloud/common';

@Global()
@Module({})
export class RedisModule {
    static register(
        options: RedisModuleOptions,
    ): DynamicModule {
        const inject = [];
        if (options.dependencies) {
            if (options.dependencies.includes(NEST_BOOT)) {
                inject.push(NEST_BOOT_PROVIDER);
            }
            if (options.dependencies.includes(NEST_CONSUL_CONFIG)) {
                inject.push(NEST_CONSUL_CONFIG_PROVIDER);
            }
        }

        const redisProvider = create(options.name, inject);
        const optionsProvider = createOptions(options.name, inject, options);

        return {
            module: RedisModule,
            providers: [redisProvider, optionsProvider],
            exports: [redisProvider, optionsProvider],
        };
    }
}
