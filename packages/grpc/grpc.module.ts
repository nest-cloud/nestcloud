import { Module, DynamicModule, Global } from '@nestjs/common';
import { Scanner, GRPC, LOADBALANCE } from '@nestcloud/common';
import { DiscoveryModule } from '@nestjs/core';
import { GrpcMetadataAccessor } from './grpc-metadata.accessor';
import { GrpcOrchestrator } from './grpc.orchestrator';
import { GrpcExplorer } from './grpc.explorer';

@Global()
@Module({
    imports: [DiscoveryModule],
    providers: [Scanner, GrpcMetadataAccessor, GrpcOrchestrator],
})
export class GrpcModule {
    static forRoot(): DynamicModule {
        const inject = [LOADBALANCE];

        const grpcProvider = {
            provide: GRPC,
            useFactory: async (): Promise<any> => {},
            inject,
        };

        return {
            module: GrpcModule,
            providers: [grpcProvider, GrpcExplorer],
            exports: [grpcProvider],
        };
    }
}
