import { Module, DynamicModule, Global } from '@nestjs/common';
import {
    GRPC,
    LOADBALANCE,
} from '@nestcloud/common';

@Global()
@Module({})
export class GrpcModule {
    static register(): DynamicModule {
        const inject = [LOADBALANCE];

        const grpcProvider = {
            provide: GRPC,
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
