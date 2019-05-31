import { RedisOptions } from 'ioredis';

export interface RedisModuleOptions extends RedisOptions {
    name?: string;
    dependencies?: string[];
}
