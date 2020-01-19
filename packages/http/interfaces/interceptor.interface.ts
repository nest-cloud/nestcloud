import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface Interceptor {
    onRequest?(request: AxiosRequestConfig): AxiosRequestConfig;

    onResponse?(response: AxiosResponse): AxiosResponse;

    onRequestError?(error: any): any;

    onResponseError?(error: any): any;
}
