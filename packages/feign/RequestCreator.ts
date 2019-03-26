import { AxiosRequestConfig, AxiosInstance } from 'axios';
import { HttpClient } from "./HttpClient";
import * as uriParams from 'uri-params';
import { FEIGN_CLIENT, FEIGN_LOADBALANCE_CLIENT } from "./constants";
import { Loadbalance } from "@nestcloud/consul-loadbalance";
import { Cache } from '@nestcloud/common';

export class RequestCreator {
    static async create(url, method, parameters, options, serviceName, circuit, interceptors, responseType) {
        const http = Cache.getInstance('feign').get(FEIGN_CLIENT) as AxiosInstance;
        const loadbalance = Cache.getInstance('feign').get(FEIGN_LOADBALANCE_CLIENT) as Loadbalance;
        const axiosRequestConfig = {
            ...options,
            params: parameters.params,
            data: parameters.data,
            headers: parameters.headers,
            method: method,
            url: uriParams(url, parameters.uriParams),
        } as AxiosRequestConfig;

        const client = new HttpClient(serviceName);
        client.setLoadbalance(loadbalance);
        client.setAxiosInstance(http);
        client.setCircuit(circuit);
        client.setMiddleware(interceptors);

        return await client.request(axiosRequestConfig, { responseType });
    }
}
