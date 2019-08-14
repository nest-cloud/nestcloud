import { Module, DynamicModule, Global } from '@nestjs/common';
import * as Consul from 'consul';
import { Service } from './service';
import { NEST_BOOT_PROVIDER, NEST_CONSUL_PROVIDER, NEST_SERVICE_PROVIDER, NEST_BOOT } from '@nestcloud/common';
import { Boot } from '@nestcloud/boot';
import { IServiceOptions } from './interfaces/service-options.interface';

@Global()
@Module({})
export class ServiceModule {
    static register(options: IServiceOptions = {}): DynamicModule {
        const inject = [NEST_CONSUL_PROVIDER];

        if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
            inject.push(NEST_BOOT_PROVIDER);
        }
        const consulServiceProvider = {
            provide: NEST_SERVICE_PROVIDER,
            useFactory: async (consul: Consul, boot: Boot): Promise<Service> => {
                if (inject.includes(NEST_BOOT_PROVIDER)) {
                    options = boot.get<IServiceOptions>('consul', {});
                }
                const service = new Service(consul, options);
                await service.init();
                return service;
            },
            inject,
        };

        return {
            module: ServiceModule,
            providers: [consulServiceProvider],
            exports: [consulServiceProvider],
        };
    }
}
