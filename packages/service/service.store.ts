import * as Consul from 'consul';
import { intersection } from 'lodash';
import { IServiceServer, PASSING } from '@nestcloud/common';
import { handleConsulNodes } from './utils/service.util';
import { Watcher } from './service-watcher.consul';
import { toList, toValueList } from './utils/array.util';

export class ServiceStore {
    private watcher = null;
    private watchers = {};
    private readonly WATCH_TIMEOUT = 305000;

    private readonly services: { [service: string]: IServiceServer[] } = {};
    private readonly serviceCallbackMaps: Map<string, ((nodes: IServiceServer[]) => void)[]> = new Map();
    private readonly servicesCallbacks: ((services: string[]) => void)[] = [];

    constructor(
        private readonly consul: Consul, private readonly includes?: string[],
    ) {
    }

    public async init() {
        let services = await this.consul.catalog.service.list();
        if (!this.includes || this.includes.length === 0) {
            services = toList<string>(services);
        } else {
            services = intersection(toList<string>(services), this.includes);
        }

        services = services.filter(service => service !== 'consul');
        await this.initServices(services);
        this.createServicesWatcher();
    }

    public watch(service: string, callback: (nodes: IServiceServer[]) => void) {
        const callbacks = this.serviceCallbackMaps.get(service);
        if (!callbacks) {
            this.serviceCallbackMaps.set(service, [callback]);
        } else {
            callbacks.push(callback);
            this.serviceCallbackMaps.set(service, callbacks);
        }
    }

    public watchServiceList(callback: (services: string[]) => void) {
        this.servicesCallbacks.push(callback);
    }

    public getServices(): { [service: string]: IServiceServer[] } {
        return this.services;
    }

    public getServiceNames(): string[] {
        const services: string[] = [];
        for (const key in this.services) {
            if (this.services.hasOwnProperty(key)) {
                services.push(key);
            }
        }
        return services;
    }

    public getServiceServers(service: string, passing?: boolean): IServiceServer[] {
        const nodes = this.services[service] || [];
        if (passing) {
            return nodes.filter(node => node.status === PASSING);
        }
        return nodes;
    }

    private setNodes(service: string, nodes: IServiceServer[]) {
        this.services[service] = nodes;
        if (this.serviceCallbackMaps.has(service)) {
            const callbacks = this.serviceCallbackMaps.get(service);
            callbacks.forEach(cb => cb(nodes));
        }
    }

    private async initServices(services) {
        // init watchers
        toValueList<Watcher>(this.watchers).forEach(watcher => watcher.clear());
        this.watchers = [];

        await Promise.all(
            services.map(async (service: string) => {
                const nodes = await this.consul.health.service(service);
                const serviceNodes = handleConsulNodes(nodes);
                this.setNodes(service, serviceNodes);
                this.createServiceServersWatcher(service);
            }),
        );
    }

    private createServiceServersWatcher(service: string) {
        if (this.watchers[service]) {
            this.watchers[service].clear();
        }
        const watcher = (this.watchers[service] = new Watcher(this.consul, {
            method: this.consul.health.service,
            params: { service, wait: '5m', timeout: this.WATCH_TIMEOUT },
        }));
        watcher.watch((e, nodes) => {
            if (!e) {
                const serviceNodes = handleConsulNodes(nodes);
                this.setNodes(service, serviceNodes);
            }
        });
    }

    private createServicesWatcher() {
        if (this.watcher) {
            this.watcher.clear();
        }
        const watcher = (this.watcher = new Watcher(this.consul, {
            method: this.consul.catalog.service.list,
            params: { wait: '5m', timeout: this.WATCH_TIMEOUT },
        }));
        watcher.watch(async (e, services) => {
            if (!e) {
                if (!this.includes || this.includes.length === 0) {
                    services = toList<string>(services);
                } else {
                    services = intersection(toList<string>(services), this.includes);
                }

                services = services.filter(service => service !== 'consul');
                await this.initServices(services);
                this.servicesCallbacks.forEach(cb => cb(services));
            }
        });
    }
}
