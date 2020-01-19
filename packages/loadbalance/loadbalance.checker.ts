import { Inject, Injectable } from '@nestjs/common';
import { ServiceOptions } from './interfaces/service-options.interface';
import { PASSING } from './server-state';
import { get } from 'lodash';
import { Loadbalancer } from './loadbalancer';
import { AxiosInstance } from 'axios';
import { AXIOS_INSTANCE_PROVIDER } from './loadbalance.constants';

const defaultServiceOptions = {
    name: '',
    rule: '',
    check: {
        protocol: 'http',
        url: '/health',
    },
};

@Injectable()
export class LoadbalanceChecker {
    constructor(
        @Inject(AXIOS_INSTANCE_PROVIDER) private readonly axios: AxiosInstance,
    ) {
    }

    public pingServer(loadbalancer: Loadbalancer, options: ServiceOptions = defaultServiceOptions) {
        loadbalancer.servers.filter(server => server.state.status !== PASSING).map(async server => {
            const protocol = get(options, 'check.protocol', 'http');
            const url = get(options, 'check.url', '/health');
            try {
                await this.axios.get(
                    `${protocol}://${server.address}:${server.port}${url}`,
                );
                server.state.status = PASSING;
            } catch (e) {

            }
        });
    }
}
