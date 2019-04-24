import { IClientConfig } from "./interfaces/grpc-configuration.interface";
import { ClientGrpcProxy } from '@nestjs/microservices/client';
import { Observable } from "rxjs";
import { NestCloud } from "@nestcloud/core";
import { ILoadbalance, IServer } from "@nestcloud/common";

export class GrpcClient {
    private readonly config: IClientConfig;
    private readonly proxy: ClientGrpcProxy;
    private readonly proxyCache = new Map<string, ClientGrpcProxy>();
    private readonly serviceCache = new Map<string, any>();

    constructor(config: IClientConfig) {
        this.config = config;
        this.proxy = new ClientGrpcProxy(config);
    }

    public getService<T extends {}>(name: string): T {
        const noClusterService = this.proxy.getService<T>(name);

        const grpcService = {} as T;
        const protoMethods = Object.keys(noClusterService);
        protoMethods.forEach(key => {
            grpcService[key] = (...args: any[]) => {
                let { service, node } = this.getProxyService<T>(name, key);
                if (!service) {
                    service = noClusterService;
                }

                if (node) {
                    node.state.incrementServerActiveRequests();
                    node.state.incrementTotalRequests();
                    if (!node.state.firstConnectionTimestamp) {
                        node.state.noteFirstConnectionTime();
                    }
                }

                const startTime = new Date().getTime();
                return new Observable(observer => {
                    const observable: Observable<any> = service[key](...args);
                    observable.subscribe({
                        error(err) {
                            if (node) {
                                node.state.decrementServerActiveRequests();
                                node.state.incrementServerFailureCounts();
                                node.state.noteConnectionFailedTime();
                            }
                            observer.error(err);
                        },
                        complete() {
                            if (node) {
                                const endTime = new Date().getTime();
                                node.state.noteResponseTime(endTime - startTime);
                                node.state.decrementServerActiveRequests();
                            }
                            observer.complete();
                        },
                        next(data) {
                            observer.next(data);
                        }
                    });
                });
            };
        });
        return grpcService;
    }

    private getProxyService<T extends {}>(name: string, method: string): { service: T, node: IServer } {
        const lb: ILoadbalance = NestCloud.global.loadbalance;
        if (!lb) {
            return { service: null, node: null };
        }
        const node = lb.choose(this.config.service);
        const methodKey = `${ node.id }/${ method }`;
        if (!this.serviceCache.get(methodKey)) {
            if (!this.proxyCache.has(node.id)) {
                const proxy = new ClientGrpcProxy({
                    url: `${ node.address }:${ node.port }`,
                    package: this.config.package,
                    protoPath: this.config.protoPath,
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
