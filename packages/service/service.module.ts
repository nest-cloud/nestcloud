import { Module, DynamicModule, Global } from '@nestjs/common';
import { ServiceOptions } from './interfaces/service-options.interface';
import { SERVICE_OPTIONS_PROVIDER } from './service.constants';
import { ServiceFactory } from './service.factory';
import { BOOT, CONFIG, IBoot, IConfig, CONSUL, ETCD, IConsul, IEtcd, SERVICE } from '@nestcloud/common';
import { NO_DEPS_MODULE_FOUND } from './service.messages';
import { ServiceStore } from './service.store';

@Global()
@Module({
    imports: [],
})
export class ServiceModule {
    private static CONFIG_PREFIX = 'service';

    public static forRootAsync(options: ServiceOptions = {}): DynamicModule {
        const inject = options.inject || [];
        const serviceOptionsProvider = {
            provide: SERVICE_OPTIONS_PROVIDER,
            useFactory: (...params: any[]) => {
                let registerOptions = options;
                const boot: IBoot = params[inject.indexOf(BOOT)];
                if (boot) {
                    options = boot.get<ServiceOptions>(this.CONFIG_PREFIX);
                    registerOptions = Object.assign(registerOptions, options);
                }

                const config: IConfig = params[inject.indexOf(CONFIG)];
                if (config) {
                    options = config.get<ServiceOptions>(this.CONFIG_PREFIX);
                }
                return Object.assign(registerOptions, options);
            },
            inject,
        };

        const serviceProvider = {
            provide: SERVICE,
            useFactory: (options: ServiceOptions, ...params: any[]) => {
                const factory = new ServiceFactory(options);
                const consul: IConsul = params[inject.indexOf(CONSUL)];
                if (consul) {
                    return factory.create(CONSUL, consul).init();
                }
                const etcd: IEtcd = params[inject.indexOf(ETCD)];
                if (etcd) {
                    return factory.create(ETCD, etcd).init();
                }

                throw new Error(NO_DEPS_MODULE_FOUND);
            },
            inject: [SERVICE_OPTIONS_PROVIDER, ...inject],
        };

        return {
            module: ServiceModule,
            providers: [serviceOptionsProvider, serviceProvider, ServiceStore],
            exports: [serviceProvider],
        };
    }
}
