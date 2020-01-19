import { ClientOptions } from './client-options.interface';

export interface GrpcClientMetadata {
    options: ClientOptions;
    property: string;
}
