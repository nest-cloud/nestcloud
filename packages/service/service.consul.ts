import { OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import * as md5encode from 'blueimp-md5';
import { IConsul, IService, IServiceServer, sleep } from '@nestcloud/common';
import { get } from 'lodash';

import { ServiceOptions } from './interfaces/service-options.interface';
import { ServiceCheck } from './interfaces/service-check.interface';
import { getIPAddress } from './utils/os.util';
import { ConnectService } from './interfaces/connect-service.interface';
import { ServiceStore } from './service.store';

export class ConsulService implements OnModuleInit, OnModuleDestroy, IService {
    private store: ServiceStore;
    private readonly logger = new Logger(ConsulService.name);

    private readonly discoveryHost: string;
    private readonly serviceId: string;
    private readonly serviceName: string;
    private readonly servicePort: number;
    private readonly serviceTags: string[];
    private readonly timeout: string;
    private readonly deregisterCriticalServiceAfter: string;
    private readonly interval: string;
    private readonly maxRetry: number;
    private readonly retryInterval: number;
    private readonly protocol: string;
    private readonly route: string;
    private readonly tcp: string;
    private readonly script: string;
    private readonly dockerContainerId: string;
    private readonly shell: string;
    private readonly ttl: string;
    private readonly notes: string;
    private readonly status: string;
    private readonly includes: string[];
    private readonly connect: ConnectService;

    constructor(private readonly consul: IConsul, options: ServiceOptions) {
        this.discoveryHost = get(options, 'discoveryHost', getIPAddress());
        this.serviceId = get(options, 'id');
        this.serviceName = get(options, 'name');
        // tslint:disable-next-line:no-bitwise
        this.servicePort = get(options, 'port', 40000 + ~~(Math.random() * (40000 - 30000)));
        this.serviceTags = get(options, 'tags');
        this.connect = get(options, 'connect', {});
        this.timeout = get(options, 'healthCheck.timeout', '1s');
        this.interval = get(options, 'healthCheck.interval', '10s');
        this.deregisterCriticalServiceAfter = get(options, 'healthCheck.deregisterCriticalServiceAfter');
        this.maxRetry = get(options, 'maxRetry', 5);
        this.retryInterval = get(options, 'retryInterval', 5000);
        this.protocol = get(options, 'healthCheck.protocol', 'http');
        this.route = get(options, 'healthCheck.route', '/health');
        this.tcp = get(options, 'healthCheck.tcp');
        this.script = get(options, 'healthCheck.script');
        this.dockerContainerId = get(options, 'healthCheck.dockerContainerId');
        this.shell = get(options, 'healthCheck.shell');
        this.ttl = get(options, 'healthCheck.ttl');
        this.notes = get(options, 'healthCheck.notes');
        this.status = get(options, 'healthCheck.status');
        this.includes = get(options, 'service.includes', []);
        this.store = new ServiceStore(this.consul, this.includes);
    }

    async init() {
        this.store = new ServiceStore(this.consul, this.includes);
        while (true) {
            try {
                await this.store.init();
                this.logger.log('ServiceModule initialized');
                break;
            } catch (e) {
                this.logger.error(`Unable to initial ServiceModule, retrying...`, e);
                await sleep(this.retryInterval);
            }
        }
        return this;
    }

    watch(service: string, callback: (services: IServiceServer[]) => void) {
        this.store.watch(service, callback);
    }

    watchServiceList(callback: (service: string[]) => void) {
        this.store.watchServiceList(callback);
    }

    getServices(): { [service: string]: IServiceServer[] } {
        return this.store.getServices();
    }

    getServiceNames(): string[] {
        return this.store.getServiceNames();
    }

    getServiceServers(service: string, passing?: boolean): IServiceServer[] {
        return this.store.getServiceServers(service, passing);
    }

    async onModuleInit(): Promise<any> {
        await this.registerService();
    }

    async onModuleDestroy(): Promise<any> {
        await this.cancelService();
    }

    private generateService() {
        const check = {
            interval: this.interval,
            timeout: this.timeout,
            deregistercriticalserviceafter: this.deregisterCriticalServiceAfter,
            notes: this.notes,
            status: this.status,
        } as ServiceCheck;

        if (this.tcp) {
            check.tcp = this.tcp === 'true' ? `${this.discoveryHost}:${this.servicePort}` : this.tcp;
        } else if (this.script) {
            check.script = this.script;
        } else if (this.dockerContainerId) {
            check.dockercontainerid = this.dockerContainerId;
            check.shell = this.shell;
        } else if (this.ttl) {
            check.ttl = this.ttl;
        } else {
            check.http = `${this.protocol}://${this.discoveryHost}:${this.servicePort}${this.route}`;
        }

        return {
            id: this.serviceId || md5encode(`${this.discoveryHost}:${this.servicePort}`),
            name: this.serviceName,
            address: this.discoveryHost,
            port: parseInt(this.servicePort + ''),
            tags: this.serviceTags,
            connect: this.connect,
            check,
        };
    }

    private async registerService() {
        const service = this.generateService();

        while (true) {
            try {
                await this.consul.agent.service.register(service);
                this.logger.log(`Register service ${service.name} success.`);
                break;
            } catch (e) {
                this.logger.warn(`Register service ${service.name} fail, retrying...`, e);
                await sleep(this.retryInterval);
            }
        }
    }

    private async cancelService() {
        const service = this.generateService();

        let current = 0;
        while (true) {
            try {
                await this.consul.agent.service.deregister(service);
                this.logger.log(`Deregister service ${service.name} success.`);
                break;
            } catch (e) {
                if (this.maxRetry !== -1 && ++current > this.maxRetry) {
                    this.logger.error(`Deregister service ${service.name} fail`, e);
                    break;
                }

                this.logger.warn(`Deregister service ${service.name} fail, retrying...`, e);
                await sleep(this.retryInterval);
            }
        }
    }
}
