import { Module, DynamicModule, Global } from '@nestjs/common';
import { Loadbalance } from '@nestcloud/loadbalance';
import {
    NEST_BOOT,
    NEST_BOOT_PROVIDER,
    NEST_LOADBALANCE_PROVIDER,
    NEST_PROXY_PROVIDER,
    NEST_CONSUL_CONFIG,
    NEST_CONSUL_CONFIG_PROVIDER,
    IConsulConfig,
    IBoot,
} from '@nestcloud/common';
import { IExtraOptions } from './interfaces/extra-options.interface';
import { IProxyOptions } from './interfaces/proxy-options.interface';
import { Proxy } from './proxy';

@Global()
@Module({
    providers: [],
})
export class ProxyModule {
    static register(options: IProxyOptions = {}, extra?: IExtraOptions): DynamicModule {
        const inject = [NEST_LOADBALANCE_PROVIDER];
        if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
            inject.push(NEST_BOOT_PROVIDER);
        } else if (options.dependencies.includes(NEST_CONSUL_CONFIG)) {
            inject.push(NEST_CONSUL_CONFIG_PROVIDER);
        }

        const proxyProvider = {
            provide: NEST_PROXY_PROVIDER,
            useFactory: (lb: Loadbalance, config: IBoot | IConsulConfig): Proxy => {
                let proxy;
                if (inject.includes(NEST_BOOT_PROVIDER)) {
                    options = (config as IBoot).get('proxy');
                    proxy = new Proxy(extra, lb, options.routes);
                } else if (inject.includes(NEST_CONSUL_CONFIG_PROVIDER)) {
                    options = (config as IConsulConfig).get('proxy');
                    proxy = new Proxy(extra, lb, options.routes, config as IConsulConfig);
                    (config as IConsulConfig).watch('proxy.routes', routes => {
                        proxy.updateRoutes(routes || [], false);
                    });
                } else {
                    proxy = new Proxy(extra, lb, options.routes);
                }
                return proxy;
            },
            inject,
        };
        return {
            module: ProxyModule,
            providers: [proxyProvider],
            exports: [proxyProvider],
        };
    }
}
