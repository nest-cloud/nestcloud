import { ClusterNode, ClusterOptions, RedisOptions } from 'ioredis';

export interface RedisModuleOptions {
    name?: string;
    dependencies?: string[];
    cluster: {
        nodes: ClusterNode[];
        options?: ClusterOptions;
    };
    redisOptions: RedisOptions;
}
