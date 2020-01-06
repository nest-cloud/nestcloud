import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { LoadbalanceMetadataAccessor } from './loadbalance-metadata.accessor';
import { LoadbalanceOrchestrator } from './loadbalance.orchestrator';

@Injectable()
export class LoadbalanceExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: LoadbalanceMetadataAccessor,
        private readonly loadbalanceOrchestrator: LoadbalanceOrchestrator,
    ) {
    }

    onModuleInit() {
        this.explore();
    }

    explore() {
        const providers: InstanceWrapper[] = this.discoveryService.getProviders();
        providers.forEach((wrapper: InstanceWrapper) => {
            const { instance } = wrapper;
            if (!instance) {
                return;
            }
            this.lookupKeyValues(instance);
        });
    }

    lookupKeyValues(instance: Function) {
        const chooses = this.metadataAccessor.getChooses(instance);
        if (chooses) {
            this.loadbalanceOrchestrator.addChooses(instance, chooses);
        }
    }
}
