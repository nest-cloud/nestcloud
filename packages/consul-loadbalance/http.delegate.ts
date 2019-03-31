import { HttpException } from '@nestjs/common';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { ServerCriticalException } from './exceptions/server-critical.exception';
import { Server } from './server';

export class HttpDelegate {
    constructor(private readonly server: Server) {
    }

    async send(http: AxiosInstance, config: AxiosRequestConfig): Promise<AxiosResponse> {
        if (config.url && config.url.charAt(0) !== '/') {
            config.url = '/' + config.url;
        }
        config.url = `http://${ this.server.address }:${ this.server.port }${ config.url }`;
        this.server.state.incrementServerActiveRequests();
        this.server.state.incrementTotalRequests();

        if (!this.server.state.firstConnectionTimestamp) {
            this.server.state.noteFirstConnectionTime();
        }

        const startTime = new Date().getTime();

        try {
            const response = await http.request(config);
            const endTime = new Date().getTime();
            this.server.state.noteResponseTime(endTime - startTime);
            this.server.state.decrementServerActiveRequests();
            return response;
        } catch (e) {
            this.server.state.decrementServerActiveRequests();
            if (e.response) {
                throw new HttpException(e.response.data, e.response.status);
            } else if (e.request) {
                throw new HttpException(e.message, 400);
            } else {
                this.server.state.incrementServerFailureCounts();
                this.server.state.noteConnectionFailedTime();
                throw new ServerCriticalException(e.message);
            }
        }
    }
}
