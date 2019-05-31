import * as Redis from 'ioredis';
import { IBoot, IConsulConfig } from '@nestcloud/common';

import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from "./constants";
import { RedisModuleOptions } from "./interfaces/redis-options.interface";

export const createClient = (name: string = 'default', inject?: string[]) => ({
    provide: REDIS_CLIENT + name,
    useFactory: (options: RedisModuleOptions, config: IBoot | IConsulConfig): Redis.Redis => {
        if (config) {
            options = (config as IBoot).get<RedisModuleOptions>(`redis.${ name }`, options);
        }
        return new Redis(options);
    },
    inject: [REDIS_MODULE_OPTIONS + name, ...inject],
});

export const createOptions = (name: string = 'default', inject?: string[], options?: RedisModuleOptions) => ({
    provide: REDIS_MODULE_OPTIONS + name,
    useValue: options,
    inject
});
