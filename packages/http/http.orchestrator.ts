import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { ParamsMetadata } from './interfaces/params-metadata.interface';
import { getRequestParams } from './utils/params.util';
import { HTTP_OPTIONS_PROVIDER, RESPONSE, RESPONSE_BODY, RESPONSE_HEADER } from './http.constants';
import { HttpOptions } from './interfaces/http-options.interface';
import uriParams = require('uri-params');
import { Scanner, ILoadbalance, LOADBALANCE, BRAKES } from '@nestcloud/common';
import { HttpClient } from './http.client';
import { Interceptor } from './interfaces/interceptor.interface';
import { Brakes } from '@nestcloud/brakes';

interface DecoratorRequest {
    instance: Function;
    key: string;
    method: string;
    options: AxiosRequestConfig;
    responseConfig: string;
    paramsMetadata: ParamsMetadata;
    serviceName: string;
    FallbackRef: Function;
    InterceptorRefs: Function[];
}

@Injectable()
export class HttpOrchestrator implements OnApplicationBootstrap {
    private readonly decoratorRequests = new Map<string, DecoratorRequest>();

    constructor(
        private readonly http: HttpClient,
        private readonly scanner: Scanner,
        @Inject(HTTP_OPTIONS_PROVIDER) private readonly options: HttpOptions,
    ) {
    }

    public addDecoratorRequests(
        instance: Function,
        method: string,
        options: AxiosRequestConfig,
        responseConfig: string,
        paramsMetadata: ParamsMetadata,
        serviceName: string,
        FallbackRef: Function,
        InterceptorRefs: Function[],
    ) {
        const key = `${instance.constructor.name}__${method}`;
        this.decoratorRequests.set(key, {
            key,
            instance,
            method,
            options,
            responseConfig,
            paramsMetadata,
            serviceName,
            FallbackRef,
            InterceptorRefs,
        });
    }

    async onApplicationBootstrap(): Promise<void> {
        await this.mountDecoratorRequests();
    }

    private async mountDecoratorRequests() {
        const lb: ILoadbalance = this.scanner.findProviderByName(LOADBALANCE);
        const brakes: Brakes = this.scanner.findProviderByName(BRAKES);
        for (const item of this.decoratorRequests.values()) {
            const {
                instance,
                method,
                options,
                responseConfig,
                paramsMetadata,
                serviceName,
                FallbackRef,
                InterceptorRefs,
            } = item;
            const interceptors: Interceptor[] = [];
            InterceptorRefs.forEach(ref => {
                const interceptor: Interceptor = this.scanner.findInjectable(ref);
                if (interceptor) {
                    interceptors.push(interceptor);
                }
            });

            const fallback = this.scanner.findInjectable(FallbackRef);
            const http = this.http.create({ service: serviceName });
            http.useLb(lb);
            http.useInterceptors(...interceptors);
            http.useBrakes(brakes, fallback);

            instance[method] = async (...params: any[]) => {
                const requestParams = getRequestParams(paramsMetadata, params);
                const requestOptions = {
                    ...this.options,
                    ...options,
                    params: requestParams.params,
                    data: requestParams.data,
                    headers: requestParams.headers,
                    url: uriParams(options.url, requestParams.uriParams),
                } as AxiosRequestConfig;

                const response = await http.request(requestOptions);
                switch (responseConfig) {
                    case RESPONSE:
                        return response;
                    case RESPONSE_HEADER:
                        return response.headers;
                    case RESPONSE_BODY:
                    default:
                        return response.data;
                }
            };
        }
    }
}
