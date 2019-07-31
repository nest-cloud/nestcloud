import { HttpException, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { RESPONSE, RESPONSE_HEADER } from './constants';
import * as LbModule from '@nestcloud/loadbalance';
import { IInterceptor } from './interfaces/interceptor.interface';
import { ILoadbalance } from '@nestcloud/common';
import * as BrakesModule from '@nestcloud/brakes';

export class HttpClient {
    private loadbalance: ILoadbalance;
    private http: AxiosInstance;
    private brakesName: string | boolean;
    private interceptors: IInterceptor[];

    constructor(private readonly service?: string) {
    }

    setLoadbalance(lb: ILoadbalance) {
        this.loadbalance = lb;
    }

    setAxiosInstance(instance: AxiosInstance) {
        this.http = instance;
    }

    setBrakes(brakesName: boolean) {
        this.brakesName = brakesName;
    }

    setMiddleware(interceptors: IInterceptor[]) {
        this.interceptors = interceptors;
    }

    private async doRequest(config: AxiosRequestConfig): Promise<AxiosResponse | Headers | any> {
        const enableLb = !!this.service && this.service !== 'none';
        let response: AxiosResponse;
        if (enableLb && this.loadbalance) {
            const module: typeof LbModule = require('@nestcloud/loadbalance');
            const server = this.loadbalance.choose(this.service);
            if (!server) {
                throw new InternalServerErrorException(`No available server can handle this request`);
            }
            response = await new module.HttpDelegate(server).send(this.http as any, config as any);
        } else if (enableLb) {
            if (config.url && config.url.charAt(0) !== '/') {
                config.url = '/' + config.url;
            }
            config.url = `http://${this.service}${config.url}`;
            response = await this.send(config);
        } else {
            response = await this.send(config);
        }

        return response;
    }

    async request(
        config: AxiosRequestConfig,
        options: { responseType: string },
    ): Promise<AxiosResponse | Headers | any> {
        const requestInterceptors = [];
        const responseInterceptors = [];
        if (this.interceptors) {
            this.interceptors.forEach(interceptor => {
                if (interceptor) {
                    requestInterceptors.push(
                        this.http.interceptors.request.use(
                            interceptor.onRequest.bind(interceptor),
                            interceptor.onRequestError.bind(interceptor),
                        ),
                    );
                    responseInterceptors.push(
                        this.http.interceptors.response.use(
                            interceptor.onResponse.bind(interceptor),
                            interceptor.onResponseError.bind(interceptor),
                        ),
                    );
                }
            });
        }

        let response;
        if (this.brakesName) {
            try {
                const brakesModule: typeof BrakesModule = require('@nestcloud/brakes');
                response = await brakesModule.BrakesFactory.exec(
                    this.brakesName as string,
                    async (config: AxiosRequestConfig) => this.doRequest(config),
                    config,
                );
            } catch (e) {
                if (e instanceof HttpException) {
                    throw e;
                } else {
                    throw new ServiceUnavailableException(e.message);
                }
            }
        } else {
            response = await this.doRequest(config);
        }

        requestInterceptors.forEach(interceptor => this.http.interceptors.request.eject(interceptor));
        responseInterceptors.forEach(interceptor => this.http.interceptors.response.eject(interceptor));

        return options.responseType === RESPONSE
            ? response
            : options.responseType === RESPONSE_HEADER
                ? response.headers
                : response.data;
    }

    async send(config: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await this.http.request(config);
        } catch (e) {
            if (e.response) {
                throw new HttpException(e.response.data, e.response.status);
            } else if (e.request) {
                throw new HttpException(e.message, 400);
            }
        }
    }
}
