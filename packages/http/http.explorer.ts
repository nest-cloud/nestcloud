import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { HttpOrchestrator } from './http.orchestrator';
import { HttpMetadataAccessor } from './http-metadata.accessor';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpExplorer implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: HttpMetadataAccessor,
        private readonly httpOrchestrator: HttpOrchestrator,
        private readonly metadataScanner: MetadataScanner,
    ) {
    }

    async onModuleInit() {
        this.explore();
        await this.httpOrchestrator.mountDecoratorRequests();
    }

    explore() {
        const providers: InstanceWrapper[] = this.discoveryService.getProviders();
        providers.forEach((wrapper: InstanceWrapper) => {
            const { instance } = wrapper;
            if (!instance || typeof instance === 'string') {
                return;
            }
            this.metadataScanner.scanFromPrototype(
                instance,
                Object.getPrototypeOf(instance),
                (key: string) => this.lookupRequests(instance, key),
            );
        });
    }

    lookupRequests(instance: Function, key: string) {
        const target = instance[key];
        const options: AxiosRequestConfig = this.metadataAccessor.getOptions(instance, target) || {};
        options.url = this.metadataAccessor.getUrl(instance, target);
        options.method = this.metadataAccessor.getMethod(instance, target);

        const responseConfig = this.metadataAccessor.getResponseConfig(instance, target);
        const paramsMetadata = this.metadataAccessor.getParams(instance, key);
        const serviceName = this.metadataAccessor.getService(instance, target);
        const InterceptorRefs = this.metadataAccessor.getInterceptorRefs(instance, target) || [];
        const FallbackRef = this.metadataAccessor.getFallbackRef(instance, target);

        if (options.url) {
            this.httpOrchestrator.addDecoratorRequests(
                instance,
                key,
                options,
                responseConfig,
                paramsMetadata,
                serviceName,
                FallbackRef,
                InterceptorRefs,
            );
        }
    }
}
