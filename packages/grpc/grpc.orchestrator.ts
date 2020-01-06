import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Scanner, ILoadbalance, LOADBALANCE } from '@nestcloud/common';
import { GrpcClientMetadata } from './interfaces/grpc-client-metadata.interface';
import { ClientOptions } from './interfaces/client-options.interface';
import { GrpcServiceMetadata } from './interfaces/grpc-service-metadata.interface';
import { GrpcClientFactory } from './grpc-client.factory';

interface Client {
    property: string;
    target: Function;
    options: ClientOptions;
}

interface Service extends Client {
    name: string;
}

@Injectable()
export class GrpcOrchestrator implements OnApplicationBootstrap {
    private readonly clients = new Map<string, Client>();
    private readonly services = new Map<string, Service>();

    constructor(
        private readonly scanner: Scanner,
        @Inject(LOADBALANCE) private readonly lb: ILoadbalance,
    ) {
    }

    public addClients(target: Function, clients: GrpcClientMetadata[]) {
        clients.forEach(({ property, options }) => {
            const key = `${property}__${target.constructor.name}`;
            this.clients.set(key, { property, target, options });
        });
    }

    public addServices(target: Function, services: GrpcServiceMetadata[]) {
        services.forEach(service => {
            const key = `${service.name}__${service.property}__${target.constructor.name}`;
            this.services.set(key, {
                name: service.name,
                property: service.property,
                target,
                options: service.options,
            });
        });
    }

    async onApplicationBootstrap(): Promise<void> {
        await this.mountClients();
        await this.mountServices();
    }

    private async mountClients() {
        for (const item of this.clients.values()) {
            const { property, target, options } = item;
            target.constructor[property] = GrpcClientFactory.create(this.lb, options);
        }
    }

    private async mountServices() {
        for (const item of this.services.values()) {
            const { name, property, target, options } = item;
            const client = GrpcClientFactory.create(this.lb, options);
            target.constructor[property] = client.getService(name);
        }
    }
}
