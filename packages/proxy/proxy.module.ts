import { Module, DynamicModule, Global } from '@nestjs/common';
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
import { ILoadbalance } from '../common';

@Global()
@Module({
    providers: [],
})
export class ProxyModule {
    static register(options: IProxyOptions = {}, extra?: IExtraOptions): DynamicModule {
        const inject = [];
        if (options.routes && options.routes.filter(route => route.uri.includes('lb://'))) {
            inject.push(NEST_LOADBALANCE_PROVIDER);
        }
        if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
            inject.push(NEST_BOOT_PROVIDER);
        } else if (options.dependencies.includes(NEST_CONSUL_CONFIG)) {
            inject.push(NEST_CONSUL_CONFIG_PROVIDER);
        }

        const proxyProvider = {
            provide: NEST_PROXY_PROVIDER,
            useFactory: (...args: any[]): Proxy => {
                const loadblanace: ILoadbalance = args[inject.indexOf(NEST_LOADBALANCE_PROVIDER)];
                const boot: IBoot = args[inject.indexOf(NEST_BOOT_PROVIDER)];
                const config: IConsulConfig = args[inject.indexOf(NEST_CONSUL_CONFIG_PROVIDER)];
                let proxy;
                if (boot) {
                    options = boot.get('proxy');
                    proxy = new Proxy(extra, loadblanace, options.routes);
                } else if (config) {
                    options = (config as IConsulConfig).get('proxy');
                    proxy = new Proxy(extra, loadblanace, options.routes, config as IConsulConfig);
                    (config as IConsulConfig).watch('proxy.routes', routes => {
                        proxy.updateRoutes(routes || [], false);
                    });
                } else {
                    proxy = new Proxy(extra, loadblanace, options.routes);
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
