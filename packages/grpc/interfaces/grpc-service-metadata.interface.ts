import { GrpcClientMetadata } from './grpc-client-metadata.interface';

export interface GrpcServiceMetadata extends GrpcClientMetadata {
    name: string;
}
