import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { ParamsMetadata } from './interfaces/params-metadata.interface';
import { getRequestParams } from './utils/params.util';
import { HTTP_OPTIONS_PROVIDER, RESPONSE, RESPONSE_BODY, RESPONSE_HEADER } from './http.constants';
import { HttpOptions } from './interfaces/http-options.interface';
import * as uriParams from 'uri-params';
import { Scanner } from '@nestcloud/common';
import { HttpClient } from './http.client';
import { ILoadbalance, LOADBALANCE } from '../common';
import { Interceptor } from './interfaces/interceptor.interface';

interface DecoratorRequest {
    instance: Function;
    key: string;
    method: string;
    options: AxiosRequestConfig;
    responseConfig: string;
    paramsMetadata: ParamsMetadata;
    serviceName: string;
    brakesName: string;
    interceptorTargets: Function[];
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
        brakesName: string,
        interceptorTargets: Function[],
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
            brakesName,
            interceptorTargets,
        });
    }

    async onApplicationBootstrap(): Promise<void> {
        await this.mountDecoratorRequests();
    }

    private async mountDecoratorRequests() {
        const lb: ILoadbalance = this.scanner.findProviderByName(LOADBALANCE);
        for (const item of this.decoratorRequests.values()) {
            const {
                instance,
                method,
                options,
                responseConfig,
                paramsMetadata,
                serviceName,
                brakesName,
                interceptorTargets,
            } = item;
            const interceptors: Interceptor[] = [];
            interceptorTargets.forEach(target => {
                const interceptor: Interceptor = this.scanner.findInjectable(target);
                if (interceptor) {
                    interceptors.push(interceptor);
                }
            });

            const http = this.http.create();
            http.useLb(lb);
            http.useInterceptors(...interceptors);

            instance[method] = async (...params: any[]) => {
                const requestParams = getRequestParams(paramsMetadata, params);
                const requestOptions = {
                    ...this.options,
                    ...options,
                    service: serviceName,
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
