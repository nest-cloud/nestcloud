import { GrpcClient } from './grpc-client';
import { IClientConfig } from './interfaces/grpc-configuration.interface';

export class ClientFactory {
    private static cache = new Map<string, GrpcClient>();

    public static create(config: IClientConfig, force?: boolean): GrpcClient {
        const key = this.generateKey(config);
        if (!this.cache.has(key) || force) {
            const client = new GrpcClient(config);
            this.cache.set(key, client);
            return client;
        }

        return this.cache.get(key);
    }

    private static generateKey(config: IClientConfig) {
        const service = config.service || config.url;
        return `${service}/${config.package}/${config.protoPath}`;
    }
}
