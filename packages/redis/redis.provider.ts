import * as Redis from 'ioredis';
import { ClusterNode, ClusterOptions, RedisOptions } from 'ioredis';
import { IBoot, IConfig } from '@nestcloud/common';

import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './constants';
import { RedisModuleOptions } from './interfaces/redis-options.interface';

export const create = (name: string = 'default', inject?: string[]) => ({
    provide: REDIS_CLIENT + name,
    useFactory: (options: RedisModuleOptions, config: IBoot | IConfig): Redis.Redis | Redis.Cluster => {
        if (config) {
            options = (config as IBoot).get<RedisModuleOptions>(`redis.${name}`, options);
        }
        if (options.cluster) {
            const nodes: ClusterNode[] = options.cluster.nodes;
            const clusterOptions: ClusterOptions = options.cluster.options;
            return createCluster(nodes, clusterOptions);
        } else {
            const redisOptions = options.redisOptions;
            return createClient(redisOptions);
        }
    },
    inject: [REDIS_MODULE_OPTIONS + name, ...inject],
});

export const createOptions = (name: string = 'default', inject?: string[], options?: RedisModuleOptions) => ({
    provide: REDIS_MODULE_OPTIONS + name,
    useValue: options,
    inject,
});

const createClient = (options: RedisOptions): Redis.Redis => {
    return new Redis(options);
};

const createCluster = (nodes: ClusterNode[], options: ClusterOptions): Redis.Cluster => {
    return new Redis.Cluster(nodes, options);
};
