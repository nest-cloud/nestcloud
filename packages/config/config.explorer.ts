import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { ConfigOrchestrator } from './config.orchestrator';
import { ConfigMetadataAccessor } from './config-metadata.accessor';

@Injectable()
export class ConfigExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: ConfigMetadataAccessor,
        private readonly configOrchestrator: ConfigOrchestrator,
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
        const name = this.metadataAccessor.getConfigValueName(instance);
        const defaults = this.metadataAccessor.getConfigValueDefaults(instance);
        const property = this.metadataAccessor.getConfigValueProperty(instance);
        if (name) {
            this.configOrchestrator.addConfigValue(name, property, instance, defaults);
        }
    }
}
