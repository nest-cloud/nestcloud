import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { GrpcMetadataAccessor } from './grpc-metadata.accessor';
import { GrpcOrchestrator } from './grpc.orchestrator';

@Injectable()
export class GrpcExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: GrpcMetadataAccessor,
        private readonly grpcOrchestrator: GrpcOrchestrator,
    ) {
    }

    onModuleInit() {
        this.explore();
    }

    explore() {
        const providers: InstanceWrapper[] = this.discoveryService.getProviders();
        providers.forEach((wrapper: InstanceWrapper) => {
            const { instance } = wrapper;
            if (!instance || typeof instance === 'string') {
                return;
            }
            this.lookupKeyValues(instance);
        });
    }

    lookupKeyValues(instance: Function) {
        const clients = this.metadataAccessor.getGrpcClients(instance);
        const services = this.metadataAccessor.getGrpcServices(instance);
        if (clients) {
            this.grpcOrchestrator.addClients(instance, clients);
        }
        if (services) {
            this.grpcOrchestrator.addServices(instance, services);
        }
    }
}
