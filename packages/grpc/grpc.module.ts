import { Module, DynamicModule, Global } from '@nestjs/common';
import {
    NEST_GRPC_PROVIDER,
    NEST_LOADBALANCE_PROVIDER,
} from '@nestcloud/common';

@Global()
@Module({})
export class GrpcModule {
    static register(): DynamicModule {
        const inject = [NEST_LOADBALANCE_PROVIDER];


        const grpcProvider = {
            provide: NEST_GRPC_PROVIDER,
            useFactory: async (): Promise<any> => {
            },
            inject,
        };

        return {
            module: GrpcModule,
            providers: [grpcProvider],
            exports: [grpcProvider],
        };
    }
}
