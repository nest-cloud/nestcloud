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

    async onModuleInit() {
        this.explore();
        await this.configOrchestrator.mountConfigValues();
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
        const configValues = this.metadataAccessor.getConfigValues(instance);
        if (configValues) {
            this.configOrchestrator.addConfigValues(instance, configValues);
        }
    }
}
