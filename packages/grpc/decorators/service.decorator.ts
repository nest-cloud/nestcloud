import { IClientConfig } from '../interfaces/grpc-configuration.interface';
import { ClientFactory } from '../client-factory';

export const Service = (name: string, metadata?: IClientConfig) => {
    return (target: object, propertyKey: string | symbol): void => {
        const client = ClientFactory.create(metadata);
        target[propertyKey] = client.getService(name);
    };
};
