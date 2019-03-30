import { HttpException, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { RESPONSE, RESPONSE_HEADER } from "./constants";
import * as LbModule from '@nestcloud/consul-loadbalance';
import * as Circuit from 'brakes/lib/Circuit';
import { IInterceptor } from "./interfaces/interceptor.interface";
import { BrakeException } from "./exceptions/brake.exception";
import { ILoadbalance } from "../common";

export class HttpClient {
    private loadbalance: ILoadbalance;
    private http: AxiosInstance;
    private circuit: (...params) => Promise<any>;
    private interceptors: IInterceptor[];

    constructor(
        private readonly service?: string,
    ) {
    }

    setLoadbalance(lb: ILoadbalance) {
        this.loadbalance = lb;
    }

    setAxiosInstance(instance: AxiosInstance) {
        this.http = instance;
    }

    setCircuit(circuit: (...params) => Promise<any>) {
        this.circuit = circuit;
    }

    setMiddleware(interceptors: IInterceptor[]) {
        this.interceptors = interceptors;
    }

    private async doRequest(config: AxiosRequestConfig): Promise<AxiosResponse | Headers | any> {
        const enableLb = !!this.service && this.service !== 'none';
        let response: AxiosResponse;
        if (enableLb && this.loadbalance) {
            const module: typeof LbModule = require('@nestcloud/consul-loadbalance');
            const server = this.loadbalance.choose(this.service);
            if (!server) {
                throw new InternalServerErrorException(`No available server can handle this request`);
            }
            response = await new module.HttpDelegate(server).send(this.http as any, config as any);
        } else {
            response = await this.send(config);
        }

        return response;
    }

    async request(config: AxiosRequestConfig,
                  options: { responseType: string }): Promise<AxiosResponse | Headers | any> {
        const requestInterceptors = [];
        const responseInterceptors = [];
        if (this.interceptors) {
            this.interceptors.forEach(interceptor => {
                if (interceptor) {
                    requestInterceptors.push(
                        this.http.interceptors.request.use(
                            interceptor.onRequest.bind(interceptor),
                            interceptor.onRequestError.bind(interceptor)
                        )
                    );
                    responseInterceptors.push(
                        this.http.interceptors.response.use(
                            interceptor.onResponse.bind(interceptor),
                            interceptor.onResponseError.bind(interceptor)
                        )
                    );
                }
            });
        }

        let response;
        if (this.circuit) {
            try {
                let httpError: HttpException = null;
                const executor = this.circuit(async (config: AxiosRequestConfig) => {
                    try {
                        return await this.doRequest(config);
                    } catch (e) {
                        if (e instanceof HttpException) {
                            httpError = e;
                        } else {
                            throw new BrakeException(e.message, e.stack);
                        }
                    }
                }) as Circuit;
                response = await executor.exec(config);
                if (httpError) {
                    throw httpError;
                }
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

        return options.responseType === RESPONSE ? response :
            options.responseType === RESPONSE_HEADER ? response.headers : response.data;
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
