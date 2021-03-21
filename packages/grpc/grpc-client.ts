import { ClientOptions } from './interfaces/client-options.interface';
import { ClientGrpcProxy } from '@nestjs/microservices/client';
import { ILoadbalance, IServer } from '@nestcloud/common';
import { GrpcDelegate } from '@nestcloud/loadbalance';

export class GrpcClient {
    private readonly options: ClientOptions;
    private readonly proxy: ClientGrpcProxy;
    private readonly lb: ILoadbalance;
    private readonly proxyCache = new Map<string, ClientGrpcProxy>();
    private readonly serviceCache = new Map<string, any>();

    constructor(lb: ILoadbalance, options: ClientOptions) {
        this.lb = lb;
        this.options = options;
        this.proxy = new ClientGrpcProxy(options);
    }

    public getService<T extends {}>(name: string): T {
        const noClusterService = this.proxy.getService<T>(name);

        const grpcService = {} as T;
        const protoMethods = Object.keys(noClusterService);
        protoMethods.forEach(key => {
            grpcService[key] = (...args: any[]) => {
                // tslint:disable-next-line:prefer-const
                let { service, node } = this.getProxyService<T>(name, key);
                if (!service) {
                    service = noClusterService;
                    return service[key](...args);
                }

                return new GrpcDelegate(node, service).execute(key, ...args);
            };
        });
        return grpcService;
    }

    private scheduleCleanCache() {

    }

    private getProxyService<T extends {}>(name: string, method: string): { service: T, node: IServer } {
        const node = this.lb.choose(this.options.service);
        const methodKey = `${node.id}/${method}`;
        if (!this.serviceCache.get(methodKey)) {
            if (!this.proxyCache.has(node.id)) {
                const proxy = new ClientGrpcProxy({
                    ...(this.options),
                    url: `${node.address}:${node.port}`
                });
                this.proxyCache.set(node.id, proxy);
            }
            const proxy = this.proxyCache.get(node.id);
            const service = proxy.getService<T>(name);
            this.serviceCache.set(methodKey, service);
        }

        const service = this.serviceCache.get(methodKey) as T;

        return { service, node };
    }
}
