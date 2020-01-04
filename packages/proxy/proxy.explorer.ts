import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { ProxyMetadataAccessor } from './proxy-metadata.accessor';
import { Scanner } from '@nestcloud/common';
import { ProxyFilterRegistry } from './proxy-filter.registry';
import { Filter } from './interfaces/filter.interface';

@Injectable()
export class ProxyExplorer implements OnModuleInit {
    constructor(
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

    explore() {
        const providers: InstanceWrapper[] = this.discoveryService.getProviders();
        providers.forEach((wrapper: InstanceWrapper) => {
            const { instance } = wrapper;
            if (!instance) {
                return;
            }
            this.metadataScanner.scanFromPrototype(
                instance,
                Object.getPrototypeOf(instance),
                (key: string) => this.lookupFilters(instance, key),
            );
        });
    }

    lookupFilters(instance: Record<string, Function>, key: string) {
        const methodRef = instance[key];
        const Filters = this.metadataAccessor.getFilters(methodRef);
        if (Filters) {
            Filters.forEach(ref => {
                const filter = this.scanner.findInjectable<Filter>(ref as Function);
                if (filter) {
                    this.filterRegistry.addFilter(filter.getName(), filter);
                }
            });
        }
    }
}
