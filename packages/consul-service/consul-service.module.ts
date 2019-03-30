import { Module, DynamicModule, Global } from '@nestjs/common';
import * as Consul from 'consul';
import { ConsulService } from './consul-service.class';
import {
    NEST_BOOT_PROVIDER,
    NEST_CONSUL_PROVIDER,
    NEST_CONSUL_SERVICE_PROVIDER,
    NEST_BOOT
} from "@nestcloud/common";
import { Boot } from "@nestcloud/boot";
import { IConsulServiceOptions } from "./interfaces/consul-service-options.interface";

@Global()
@Module({})
export class ConsulServiceModule {
    static register(options: IConsulServiceOptions = {}): DynamicModule {
        const inject = [NEST_CONSUL_PROVIDER];

        if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
            inject.push(NEST_BOOT_PROVIDER);
        }
        const consulServiceProvider = {
            provide: NEST_CONSUL_SERVICE_PROVIDER,
            useFactory: async (consul: Consul, boot: Boot): Promise<ConsulService> => {
                let configs = {
                    web: {
                        serviceId: options.serviceId,
                        serviceName: options.serviceName,
                        port: options.port,
                    },
                    consul: options.consul,
                    logger: options.logger,
                };
                if (inject.includes(NEST_BOOT_PROVIDER)) {
                    configs = {
                        web: boot.get('web'),
                        consul: boot.get('consul'),
                        logger: options.logger,
                    }
                }
                const service = new ConsulService(consul, configs);
                await service.init();
                return service;
            },
            inject,
        };

        return {
            module: ConsulServiceModule,
            providers: [consulServiceProvider],
            exports: [consulServiceProvider],
        };
    }
}
