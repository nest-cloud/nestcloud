import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { LoadbalanceMetadataAccessor } from './loadbalance-metadata.accessor';
import { LoadbalanceOrchestrator } from './loadbalance.orchestrator';
import { Rule } from './interfaces/rule.interface';
import { Scanner } from '@nestcloud/common';
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry';

@Injectable()
export class LoadbalanceExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: LoadbalanceMetadataAccessor,
        private readonly loadbalanceOrchestrator: LoadbalanceOrchestrator,
        private readonly loadbalanceRuleRegistry: LoadbalanceRuleRegistry,
        private readonly scanner: Scanner,
    ) {
    }

    async onModuleInit() {
        this.explore();
        await this.loadbalanceOrchestrator.mountChooses();
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
            this.lookupKeyValues(instance);
            this.lookupRules(instance);
        });
    }

    lookupRules(instance: Function) {
        const Rules = this.metadataAccessor.getRules(instance.constructor);
        if (Rules) {
            Rules.forEach(ref => {
                const rule = this.scanner.findInjectable<Rule>(ref as Function);
                if (rule) {
                    this.loadbalanceRuleRegistry.addRule((ref as Function).name, rule);
                }
            });
        }
    }

    lookupKeyValues(instance: Function) {
        const chooses = this.metadataAccessor.getChooses(instance);
        if (chooses) {
            this.loadbalanceOrchestrator.addChooses(instance, chooses);
        }
    }
}
