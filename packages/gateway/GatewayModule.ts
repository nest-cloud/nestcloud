import { Module, DynamicModule, Global } from '@nestjs/common';
import { Loadbalance } from '@nestcloud/consul-loadbalance';
import {
    NEST_BOOT,
    NEST_BOOT_PROVIDER,
    NEST_CONSUL_LOADBALANCE_PROVIDER,
    NEST_GATEWAY_PROVIDER
} from "@nestcloud/common";
import { ProxyOptions } from "./ProxyOptions";
import { Options } from "./Options";
import { Gateway } from "./Gateway";
import { Boot } from '@nestcloud/boot';

@Global()
@Module({})
export class GatewayModule {
    static register(options?: Options, proxy?: ProxyOptions): DynamicModule {
        const inject = [NEST_CONSUL_LOADBALANCE_PROVIDER];
        if (options && options.dependencies && options.dependencies.includes(NEST_BOOT)) {
            inject.push(NEST_BOOT_PROVIDER);
        }

        const gatewayProvider = {
            provide: NEST_GATEWAY_PROVIDER,
            useFactory: (lb: Loadbalance, boot: Boot): Gateway => {
                if (options && options.dependencies && options.dependencies.includes(NEST_BOOT)) {
                    options = boot.get('gateway');
                }
                return new Gateway(proxy, lb, options.routes);
            },
            inject
        };
        return {
            module: GatewayModule,
            providers: [gatewayProvider],
            exports: [gatewayProvider],
        };
    }
}
