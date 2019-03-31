import { Module, DynamicModule, Global } from '@nestjs/common';
import { Loadbalance } from '@nestcloud/consul-loadbalance';
import {
  NEST_BOOT,
  NEST_BOOT_PROVIDER,
  NEST_CONSUL_LOADBALANCE_PROVIDER,
  NEST_GATEWAY_PROVIDER,
  NEST_CONSUL_CONFIG,
  NEST_CONSUL_CONFIG_PROVIDER,
  IConsulConfig,
  IBoot,
} from '@nestcloud/common';
import { IProxyOptions } from './interfaces/proxy-options.interface';
import { IGatewayOptions } from './interfaces/gateway-options.interface';
import { Gateway } from './gateway';

@Global()
@Module({})
export class GatewayModule {
  static register(
    options: IGatewayOptions = {},
    proxy?: IProxyOptions,
  ): DynamicModule {
    const inject = [NEST_CONSUL_LOADBALANCE_PROVIDER];
    if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
      inject.push(NEST_BOOT_PROVIDER);
    } else if (options.dependencies.includes(NEST_CONSUL_CONFIG)) {
      inject.push(NEST_CONSUL_CONFIG_PROVIDER);
    }

    const gatewayProvider = {
      provide: NEST_GATEWAY_PROVIDER,
      useFactory: (lb: Loadbalance, config: IBoot | IConsulConfig): Gateway => {
        let gateway;
        if (inject.includes(NEST_BOOT_PROVIDER)) {
          options = (config as IBoot).get('gateway');
          gateway = new Gateway(proxy, lb, options.routes);
        } else if (inject.includes(NEST_CONSUL_CONFIG_PROVIDER)) {
          options = (config as IConsulConfig).get('gateway');
          gateway = new Gateway(
            proxy,
            lb,
            options.routes,
            config as IConsulConfig,
          );
          (config as IConsulConfig).watch('gateway.routes', routes => {
            gateway.updateRoutes(routes || [], false);
          });
        } else {
          gateway = new Gateway(proxy, lb, options.routes);
        }
        return gateway;
      },
      inject,
    };
    return {
      module: GatewayModule,
      providers: [gatewayProvider],
      exports: [gatewayProvider],
    };
  }
}
