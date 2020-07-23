import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { BootOrchestrator } from './boot.orchestrator';
import { BootMetadataAccessor } from './boot-metadata.accessor';

@Injectable()
export class BootExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: BootMetadataAccessor,
        private readonly bootOrchestrator: BootOrchestrator,
    ) {
    }

    async onModuleInit() {
        this.explore();
        await this.bootOrchestrator.mountBootValues();
    }

    explore() {
        const providers: InstanceWrapper[] = this.discoveryService.getProviders();
        providers.forEach((wrapper: InstanceWrapper) => {
            const { instance } = wrapper;
            if (!instance || typeof instance === 'string') {
                return;
            }
            this.lookupBootValues(instance);
        });
    }

    lookupBootValues(instance: Function) {
        const name = this.metadataAccessor.getBootValueName(instance);
        const defaults = this.metadataAccessor.getBootValueDefaults(instance);
        const property = this.metadataAccessor.getBootValueProperty(instance);
        if (name) {
            this.bootOrchestrator.addBootValue(name, property, instance, defaults);
        }
    }
}
