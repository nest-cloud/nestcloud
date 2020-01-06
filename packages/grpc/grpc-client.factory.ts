import { GrpcClient } from './grpc-client';
import { ClientOptions } from './interfaces/client-options.interface';
import { ILoadbalance } from '../common';

export class GrpcClientFactory {
    private static cache = new Map<string, GrpcClient>();

    public static create(lb: ILoadbalance, config: ClientOptions, force?: boolean): GrpcClient {
        const key = this.generateKey(config);
        if (!this.cache.has(key) || force) {
            const client = new GrpcClient(lb, config);
            this.cache.set(key, client);
            return client;
        }

        return this.cache.get(key);
    }

    private static generateKey(config: ClientOptions) {
        const service = config.service || config.url;
        return `${service}/${config.package}/${config.protoPath}`;
    }
}
