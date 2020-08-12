import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { ConsulMetadataAccessor } from './consul-metadata.accessor';
import { ConsulOrchestrator } from './consul.orchestrator';

@Injectable()
export class ConsulExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: ConsulMetadataAccessor,
        private readonly consulOrchestrator: ConsulOrchestrator,
    ) {
    }

    async onModuleInit() {
        this.explore();
        await this.consulOrchestrator.mountKeyValues();
    }

    explore() {
        const providers: InstanceWrapper[] = [
            ...this.discoveryService.getProviders(),
            ...this.discoveryService.getControllers(),
        ];
        providers.forEach((wrapper: InstanceWrapper) => {
            const { instance } = wrapper;
            if (!instance || typeof instance === 'string') {
                return;
            }
            this.lookupWatchers(instance);
        });
    }

    lookupWatchers(instance: Function) {
        const keyValues = this.metadataAccessor.getKeyValues(instance);
        if (keyValues) {
            this.consulOrchestrator.addKeyValues(instance, keyValues);
        }
    }
}
