import { IClientConfig } from "../interfaces/grpc-configuration.interface";
import { GrpcClient } from "../grpc-client";

export const LbClient = (metadata?: IClientConfig) => {
    return (target: object, propertyKey: string | symbol): void => {
        target[propertyKey] = new GrpcClient(metadata);
    };
};
