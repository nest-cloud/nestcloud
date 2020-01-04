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
            this.lookupWatchers(instance);
        });
    }

    lookupWatchers(instance: Function) {
        const name = this.metadataAccessor.getWatchKey(instance);
        const options = this.metadataAccessor.getWatchOptions(instance);
        const property = this.metadataAccessor.getWatchProperty(instance);
        if (name) {
            this.consulOrchestrator.addWatcher(name, property, instance, options);
        }
    }
}
