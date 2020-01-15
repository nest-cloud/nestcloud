import { Module, DynamicModule, Global } from '@nestjs/common';
import { ProxyOptions } from './interfaces/proxy-options.interface';
import { Proxy } from './proxy';
import { PROXY_OPTIONS_PROVIDER } from './proxy.constants';
import { ProxyExplorer } from './proxy.explorer';
import { ProxyFilterRegistry } from './proxy-filter.registry';
import { ProxyRouteRegistry } from './proxy-route.registry';
import { ProxyMetadataAccessor } from './proxy-metadata.accessor';
import { DiscoveryModule } from '@nestjs/core';
import { Scanner, BOOT, CONFIG, IBoot, IConfig } from '@nestcloud/common';
import { ErrorResponseFilter, LoadbalanceFilter, RequestHeaderFilter, ResponseHeaderFilter } from './filters';
import { ILoadbalance, LOADBALANCE, PROXY } from '../common';

@Global()
@Module({
    imports: [DiscoveryModule],
    providers: [ProxyMetadataAccessor, Scanner],
})
export class ProxyModule {
    private static CONFIG_PREFIX = 'proxy';

    public static forRoot(options: ProxyOptions): DynamicModule {
        return this.forRootAsync(options);
    }

    public static forRootAsync(options: ProxyOptions = {}): DynamicModule {
        const inject = options.inject || [];
        const filters = options.filters || [];

        const proxyOptionsProvider = {
            provide: PROXY_OPTIONS_PROVIDER,
            useFactory: (...params: any[]) => {
                let registerOptions = options;
                const boot: IBoot = params[inject.indexOf(BOOT)];
                if (boot) {
                    options = boot.get<ProxyOptions>(this.CONFIG_PREFIX);
                    registerOptions = Object.assign(registerOptions, options);
                }

                const config: IConfig = params[inject.indexOf(CONFIG)];
                if (config) {
                    options = config.get<ProxyOptions>(this.CONFIG_PREFIX);
                }
                return Object.assign(registerOptions, options);
            },
            inject,
        };
        const proxyProvider = {
            provide: PROXY,
            useFactory: (proxy: Proxy, ...params: any[]) => {
                const lb: ILoadbalance = params[inject.indexOf(LOADBALANCE)];
                proxy.useLb(lb);
            },
            inject: [Proxy, ...inject],
        };
        return {
            module: ProxyModule,
            providers: [
                proxyOptionsProvider,
                Proxy,
                proxyProvider,
                ProxyExplorer,
                ProxyFilterRegistry,
                ProxyRouteRegistry,
                ErrorResponseFilter,
                LoadbalanceFilter,
                RequestHeaderFilter,
                ResponseHeaderFilter,
                ...filters as any,
            ],
            exports: [proxyProvider],
        };
    }
}
