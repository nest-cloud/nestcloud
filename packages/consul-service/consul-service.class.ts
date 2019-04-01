import { Inject, LoggerService, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as md5encode from 'blueimp-md5';
import * as Consul from 'consul';
import { get } from 'lodash';

import { IConsulService } from '@nestcloud/common';
import { IConsulServiceOptions } from './interfaces/consul-service-options.interface';
import { IConsulServiceCheck } from './interfaces/consul-service-check.interface';
import { getIPAddress } from './utils/os.util';
import { IServiceNode } from '../common';
import { Store } from './store';

export class ConsulService implements OnModuleInit, OnModuleDestroy, IConsulService {
    private store: Store;

    private readonly discoveryHost: string;
    private readonly serviceId: string;
    private readonly serviceName: string;
    private readonly servicePort: number;
    private readonly timeout: string;
    private readonly deregisterCriticalServiceAfter: string;
    private readonly interval: string;
    private readonly maxRetry: number;
    private readonly retryInterval: number;
    private readonly logger: boolean | LoggerService;
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

    constructor(@Inject('ConsulClient') private readonly consul: Consul, options: IConsulServiceOptions) {
        this.discoveryHost = get(options, 'discoveryHost', getIPAddress());
        this.serviceId = get(options, 'service.id');
        this.serviceName = get(options, 'service.name');
        this.servicePort = get(options, 'service.port');
        this.timeout = get(options, 'healthCheck.timeout', '1s');
        this.interval = get(options, 'healthCheck.interval', '10s');
        this.deregisterCriticalServiceAfter = get(options, 'healthCheck.deregisterCriticalServiceAfter');
        this.maxRetry = get(options, 'maxRetry', 5);
        this.retryInterval = get(options, 'retryInterval', 3000);
        this.logger = get(options, 'logger', false);
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
    }

    async init() {
        this.store = new Store(this.consul, this.includes);
        await this.store.init();
    }

    watch(service: string, callback: (services: IServiceNode[]) => void) {
        this.store.watch(service, callback);
    }

    watchServiceList(callback: (service: string[]) => void) {
        this.store.watchServiceList(callback);
    }

    getServices(): { [service: string]: IServiceNode[] } {
        return this.store.getServices();
    }

    getServiceNames(): string[] {
        return this.store.getServiceNames();
    }

    getServiceNodes(service: string, passing?: boolean): IServiceNode[] {
        return this.store.getServiceNodes(service, passing);
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
        } as IConsulServiceCheck;

        if (this.tcp) {
            check.tcp = this.tcp;
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
            check,
        };
    }

    private async registerService() {
        const service = this.generateService();

        let current = 0;
        while (true) {
            try {
                await this.consul.agent.service.register(service);
                this.logger && (this.logger as LoggerService).log('Register the service success.');
                break;
            } catch (e) {
                if (this.maxRetry !== -1 && ++current > this.maxRetry) {
                    this.logger && (this.logger as LoggerService).error('Register the service fail.', e);
                    break;
                }

                this.logger &&
                    (this.logger as LoggerService).warn(
                        `Register the service fail, will retry after ${this.retryInterval}`,
                    );
                await this.sleep(this.retryInterval);
            }
        }
    }

    private async cancelService() {
        const service = this.generateService();

        let current = 0;
        while (true) {
            try {
                await this.consul.agent.service.deregister(service);
                this.logger && (this.logger as LoggerService).log('Deregister the service success.');
                break;
            } catch (e) {
                if (this.maxRetry !== -1 && ++current > this.maxRetry) {
                    this.logger && (this.logger as LoggerService).error('Deregister the service fail.', e);
                    break;
                }

                this.logger &&
                    (this.logger as LoggerService).warn(
                        `Deregister the service fail, will retry after ${this.retryInterval}`,
                    );
                await this.sleep(this.retryInterval);
            }
        }
    }

    private sleep(time: number = 2000) {
        return new Promise(resolve => {
            setTimeout(() => resolve(), time);
        });
    }
}
