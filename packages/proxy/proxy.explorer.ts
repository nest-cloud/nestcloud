import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { ProxyMetadataAccessor } from './proxy-metadata.accessor';
import { Scanner } from '@nestcloud/common';
import { ProxyFilterRegistry } from './proxy-filter.registry';
import { PROXY_OPTIONS_PROVIDER } from './proxy.constants';
import { ProxyOptions } from './interfaces/proxy-options.interface';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';

@Injectable()
export class ProxyExplorer implements OnModuleInit {
    private readonly filters: string[] = [];

    constructor(
        @Inject(PROXY_OPTIONS_PROVIDER) private readonly options: ProxyOptions,
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: ProxyMetadataAccessor,
        private readonly metadataScanner: MetadataScanner,
        private readonly scanner: Scanner,
        private readonly filterRegistry: ProxyFilterRegistry,
    ) {
    }

    onModuleInit() {
        this.explore();
    }

    private explore() {
        const routes = this.options.routes || [];
        routes.forEach(route => {
            const routeFilters = route.filters || [];
            routeFilters.forEach(routeFilter => this.filters.push(routeFilter.name));
        });
        this.lookupFilters();
    }

    lookupFilters() {
        const contextName = this.scanner.findContextModuleName(ProxyExplorer.constructor);
        if (!contextName) {
            return;
        }
        this.filters.forEach(filter => {
            const instanceWrapper = this.scanner.findInstance(contextName, filter);
            if (instanceWrapper) {
                const instanceHost = instanceWrapper.getInstanceByContextId(STATIC_CONTEXT);
                const instance = instanceHost && instanceHost.instance;
                if (instance) {
                    this.filterRegistry.addFilter(filter, instance);
                }
            }
        });
    }
}
