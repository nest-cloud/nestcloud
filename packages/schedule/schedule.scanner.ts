import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';

@Injectable()
export class ScheduleScanner {
    constructor(
        private readonly discoveryService: DiscoveryService,
    ) {
    }

    public scan<T extends any>(metaType: Function): T | undefined {
        if (!metaType) {
            return undefined;
        }
        const providers: InstanceWrapper[] = this.discoveryService.getProviders();
        if (providers.length === 0) {
            return;
        }
        const module = providers[0].host as any;
        const container = module.container;
        const modules = container.getModules().values();
        for (const module of modules) {
            const instanceWrapper = module.injectables.get(metaType.name);
            if (instanceWrapper && module.injectables.has(metaType.name) && instanceWrapper.metatype === metaType) {
                const instanceWrapper: InstanceWrapper = module.injectables.get(metaType.name);
                if (instanceWrapper) {
                    const instanceHost = instanceWrapper.getInstanceByContextId(STATIC_CONTEXT);
                    if (instanceHost.isResolved && instanceHost.instance) {
                        return instanceHost.instance;
                    }
                }
            }
        }
    }
}
