import { IClientConfig } from '../interfaces/grpc-configuration.interface';
import { ClientFactory } from '../client-factory';

export const RpcClient = (metadata?: IClientConfig) => {
    return (target: object, propertyKey: string | symbol): void => {
        target[propertyKey] = ClientFactory.create(metadata);
    };
};
