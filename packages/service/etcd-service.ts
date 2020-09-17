import { get } from 'lodash';
import { IService, IServiceNode, IEtcd, sleep } from '@nestcloud/common';
import { IServiceOptions } from './interfaces/service-options.interface';
import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as YAML from 'yamljs';
import { ServiceNode } from './service-node';
import { getIPAddress } from './utils/os.util';
import { Watcher } from 'etcd3/lib/watch';

interface WatcherWrapper {
    connected: boolean;
    watcher: Watcher;
}

export class EtcdService implements IService, OnModuleInit, OnModuleDestroy {
    // nestcloud-service/service__${serviceName}__${ip}__${port}
    private readonly namespace = 'nestcloud-service/';
    private readonly logger = new Logger(EtcdService.name);

    private services: { [p: string]: IServiceNode[] } = {};

    private readonly self: IServiceNode;
    private readonly serviceCallbackMaps: Map<string, ((nodes: IServiceNode[]) => void)[]> = new Map();
    private readonly servicesCallbacks: ((services: string[]) => void)[] = [];

    private watcher: Watcher;
    private timer: NodeJS.Timeout;

    constructor(
        private readonly client: IEtcd,
        private readonly options: IServiceOptions,
    ) {
        const address = this.options.discoveryHost || getIPAddress();
        const port = this.options.port;
        const serviceNode = new ServiceNode(address, port + '');
        serviceNode.tags = this.options.tags || [];
        if (this.options.name) {
            serviceNode.name = this.options.name;
        }
        this.self = serviceNode;
    }

    public async init() {
        await this.registerService();
        return this;
    }

    public async onModuleInit(): Promise<void> {
        await this.initServices();
        await this.initServicesWatcher();
    }

    public async onModuleDestroy(): Promise<void> {
        await this.cancelService();
    }

    public getServiceNames(): string[] {
        const names = [];
        for (const key in this.services) {
            if (this.services.hasOwnProperty(key)) {
                names.push(key);
            }
        }
        return names;
    }

    public getServiceNodes(service: string, passing?: boolean): IServiceNode[] {
        return this.services[service];
    }

    public getServices(): { [p: string]: IServiceNode[] } {
        return this.services;
    }

    public watch(service: string, callback: (services: IServiceNode[]) => void): void {
        const callbacks = this.serviceCallbackMaps.get(service) || [];
        callbacks.push(callback);
        this.serviceCallbackMaps.set(service, callbacks);
    }

    public watchServiceList(callback: (service: string[]) => void): void {
        this.servicesCallbacks.push(callback);
    }

    private async registerService() {
        const key = `service__${this.self.name}__${this.self.address}__${this.self.port}`;
        const ttl = get(this.options, 'healthCheck.ttl', 20);
        while (true) {
            try {
                const lease = this.client.namespace(this.namespace).lease(ttl);
                await lease.put(key).value(YAML.stringify(this.self));
                lease.on('lost', async () => {
                    lease.removeAllListeners('lost');
                    await sleep(5000);
                    await this.registerService();
                });

                this.logger.log('ServiceModule initialized');
                break;
            } catch (e) {
                this.logger.error(`Unable to initial ServiceModule, retrying...`, e);
                await sleep(this.options.retryInterval || 5000);
            }
        }
    }

    private async cancelService() {
        const key = `service__${this.self.name}__${this.self.address}__${this.self.port}`;
        const maxRetry = this.options.maxRetry || 5;
        const retryInterval = this.options.retryInterval || 5000;
        let current = 0;
        while (true) {
            try {
                await this.client.namespace(this.namespace).delete().key(key);
                this.logger.log(`Deregister service ${this.self.name} success.`);
                break;
            } catch (e) {
                if (maxRetry !== -1 && ++current > maxRetry) {
                    this.logger.error(`Deregister service ${this.self.name} fail`, e);
                    break;
                }

                this.logger.warn(`Deregister service ${this.self.name} fail, retrying...`, e);
                await sleep(retryInterval);
            }
        }
    }

    private async initServices() {
        const services = await this.client.namespace(this.namespace).getAll().buffers();
        for (const key in services) {
            if (services.hasOwnProperty(key)) {
                const chunks = key.split('__');
                if (chunks.length === 4 && chunks[0] === 'service') {
                    const serviceName = chunks[1];
                    const address = chunks[2];
                    const port = chunks[3];
                    this.services[serviceName] = this.services[serviceName] || [];
                    this.services[serviceName] = this.services[serviceName].filter(item => {
                        return item.address !== address || item.port !== port;
                    });

                    try {
                        this.services[serviceName].push(YAML.parse(services[key].toString()));
                    } catch (e) {
                        this.logger.error(`parse service ${key} error.`, e);
                    }

                    this.servicesCallbacks.forEach(cb => cb(this.getServiceNames()));
                    const callbacks = this.serviceCallbackMaps.get(serviceName);
                    if (callbacks && callbacks.length) {
                        callbacks.forEach(cb => cb(this.services[serviceName]));
                    }
                }
            }
        }
    }

    private recreateServiceWatcher(immediate?: boolean) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(async () => {
            if (this.watcher) {
                try {
                    await this.watcher.cancel();
                    this.watcher = null;
                } catch (e) {
                    this.recreateServiceWatcher();
                    this.logger.warn(`Cancel the service watcher fail`);
                }
                try {
                    await this.initServicesWatcher();
                } catch (e) {
                    this.recreateServiceWatcher();
                    this.logger.error('Service watcher created error.', e);
                }

                this.logger.log('Service watcher recreate succeed.');
            }
        }, immediate ? 0 : 60000);
    }

    private async initServicesWatcher() {
        this.watcher = await this.client.namespace(this.namespace).watch().prefix('').create();
        this.watcher.on('connected', () => {
            this.logger.log('Service watcher connected');
        });
        this.watcher.on('disconnected', () => {
            this.logger.log('Service watcher disconnected');
        });
        this.watcher.on('connecting', () => {
            this.logger.log('Service watcher connecting...');
        });
        this.watcher.on('end', async () => {
            this.logger.error('Service watcher unexpected end and will recreate soon');
            this.recreateServiceWatcher(true);
        });
        this.watcher.on('error', async e => {
            this.logger.error('Service watcher occur unexpected error and will recreate soon', e.stack);
            this.recreateServiceWatcher(true);
        });
        this.watcher.on('data', (res) => {
            res.events.forEach(evt => {
                const key = evt.kv.key.toString();
                const chunks = key.split('__');
                if (chunks.length === 4 && chunks[0] === 'service') {
                    const serviceName = chunks[1];
                    const address = chunks[2];
                    const port = chunks[3];
                    this.services[serviceName] = this.services[serviceName] || [];
                    this.services[serviceName] = this.services[serviceName].filter(item => {
                        return item.address !== address || item.port !== port;
                    });

                    try {
                        if (evt.type === 'Put') {
                            this.services[serviceName].push(YAML.parse(evt.kv.value.toString()));
                        } else if (evt.type === 'Delete') {
                            const etcdKey = evt.kv.key.toString();
                            this.services[serviceName] = this.services[serviceName].filter(item => {
                                const key = `service__${item.name}__${item.address}__${item.port}`;
                                return etcdKey !== key;
                            });
                        }
                    } catch (e) {
                        this.logger.error(`parse service ${key} error.`, e);
                    }
                    this.servicesCallbacks.forEach(cb => cb(this.getServiceNames()));
                    const callbacks = this.serviceCallbackMaps.get(serviceName);
                    if (callbacks && callbacks.length) {
                        callbacks.forEach(cb => cb(this.services[serviceName]));
                    }
                }
            });
        });
    }
}
