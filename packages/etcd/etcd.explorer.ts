import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { EtcdMetadataAccessor } from './etcd-metadata.accessor';
import { EtcdOrchestrator } from './etcd.orchestrator';

@Injectable()
export class EtcdExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: EtcdMetadataAccessor,
        private readonly etcdOrchestrator: EtcdOrchestrator,
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
        const keyValues = this.metadataAccessor.getKeyValues(instance);
        if (keyValues) {
            this.etcdOrchestrator.addKeyValue(instance, keyValues);
        }
    }
}
