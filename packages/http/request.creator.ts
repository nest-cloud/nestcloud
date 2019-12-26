import { AxiosRequestConfig } from 'axios';
import { HttpClient } from './http.client';
import * as uriParams from 'uri-params';
import { NestCloud } from '@nestcloud/core';

export class RequestCreator {
    static async create(url, method, parameters, options, serviceName, brakesName, interceptors, responseType) {
        const axiosRequestConfig = {
            ...(NestCloud.global.axiosConfig || {}),
            ...options,
            params: parameters.params,
            data: parameters.data,
            headers: parameters.headers,
            method,
            url: uriParams(url, parameters.uriParams),
        } as AxiosRequestConfig;

        const client = new HttpClient(serviceName);
        client.setLoadbalance(NestCloud.global.loadbalance);
        client.setAxiosInstance(NestCloud.global.axios);
        client.setBrakes(brakesName);
        client.setMiddleware(interceptors);

        return client.request(axiosRequestConfig, { responseType });
    }
}
