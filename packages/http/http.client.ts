import {
    HttpException,
    Inject,
    Injectable,
    InternalServerErrorException,
    ServiceUnavailableException,
} from '@nestjs/common';
import { ILoadbalance } from '../common';
import { Interceptor } from './interfaces/interceptor.interface';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { RequestOptions } from './interfaces/request-options.interface';
import * as LbModule from '@nestcloud/loadbalance';
import { AxiosOptions } from './interfaces/axios-options.interface';
import { HttpOptions } from './interfaces/http-options.interface';
import { AXIOS_INSTANCE_PROVIDER, HTTP_OPTIONS_PROVIDER } from './http.constants';

@Injectable()
export class HttpClient {
    private lb: ILoadbalance;
    private interceptors: Interceptor[];

    constructor(
        @Inject(AXIOS_INSTANCE_PROVIDER) private readonly http: AxiosInstance,
        @Inject(HTTP_OPTIONS_PROVIDER) private readonly options: HttpOptions,
    ) {
    }

    create(options: AxiosOptions = {}) {
        const globalAxiosOptions = this.options.axios || {};
        return new HttpClient(
            axios.create(Object.assign(globalAxiosOptions, options)),
            this.options,
        );
    }

    useLb(lb: ILoadbalance) {
        this.lb = lb;
        return this;
    }

    useInterceptors(...interceptors: Interceptor[]) {
        this.interceptors = interceptors;
        this.registerInterceptors();
        return this;
    }

    public async request(options: RequestOptions): Promise<AxiosResponse | any> {
        let response: AxiosResponse;
        if (options.service && this.lb) {
            const module: typeof LbModule = require('@nestcloud/loadbalance');
            const server = this.lb.choose(options.service);
            if (!server) {
                throw new InternalServerErrorException(`No available server can handle this request`);
            }
            response = await new module.HttpDelegate(server).send(this.http, options);
        } else if (options.service) {
            if (options.url && options.url.charAt(0) !== '/') {
                options.url = '/' + options.url;
            }
            options.url = `http://${options.service}${options.url}`;
            response = await this.send(options);
        } else {
            response = await this.send(options);
        }

        return response;
    }

    private registerInterceptors() {
        if (this.interceptors) {
            this.interceptors.forEach(interceptor => {
                this.http.interceptors.request.use(
                    interceptor.onRequest ? interceptor.onRequest.bind(interceptor) : undefined,
                    interceptor.onRequestError ? interceptor.onRequestError.bind(interceptor) : undefined,
                );
                this.http.interceptors.response.use(
                    interceptor.onResponse ? interceptor.onResponse.bind(interceptor) : undefined,
                    interceptor.onResponseError ? interceptor.onResponseError.bind(interceptor) : undefined,
                );
            });
        }
    }

    private async send(config: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await this.http.request(config);
        } catch (e) {
            if (e.response) {
                throw new HttpException(e.response.data, e.response.status);
            }
            if (e.request) {
                throw new HttpException(e.message, 400);
            }
            throw new ServiceUnavailableException(e.message);
        }
    }
}
