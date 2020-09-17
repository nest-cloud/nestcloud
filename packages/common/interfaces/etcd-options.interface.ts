import { ChannelOptions } from '@grpc/grpc-js/build/src/channel-options';
import { CallOptions } from '@grpc/grpc-js';
import { IPolicy, IBackoff } from 'cockatiel';

export interface IEtcdOptions {
    dependencies?: string[];
    credentials?: {
        rootCertificate: Buffer;
        privateKey?: Buffer;
        certChain?: Buffer;
    };
    grpcOptions?: ChannelOptions;
    auth?: {
        username: string;
        password: string;
        callOptions?: CallOptions;
    };
    hosts?: string[] | string;
    dialTimeout?: number;
    faultHandling?: Partial<{
        host: (hostname: string) => IPolicy<any>;
        global: IPolicy<any>;
        watchBackoff: IBackoff<unknown>;
    }>;
}
