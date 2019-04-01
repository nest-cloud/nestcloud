import {
    NEST_BOOT,
    NEST_BOOT_PROVIDER,
    NEST_CONSUL_CONFIG,
    NEST_CONSUL_CONFIG_PROVIDER,
    NEST_CONSUL_LOADBALANCE_PROVIDER,
    NEST_CONSUL_SERVICE_PROVIDER,
} from '@nestcloud/common';
import { ConsulService } from '@nestcloud/consul-service';
import { DynamicModule, Global, Module } from '@nestjs/common';

import { Boot } from '@nestcloud/boot';
import { ConsulConfig } from '@nestcloud/consul-config';
import { Loadbalance } from './loadbalance';
import { ILoadbalanceOptions } from './interfaces/loadbalance-options.interface';
import { IRuleOptions } from './interfaces/rule-options.interface';

@Global()
@Module({})
export class LoadbalanceModule {
    protected static readonly loadbalancePath = 'loadbalance';
    private static readonly rulePath = 'loadbalance.rules';
    private static readonly ruleClsPath = 'loadbalance.ruleCls';

    static register(options: ILoadbalanceOptions = {}): DynamicModule {
        const inject = [NEST_CONSUL_SERVICE_PROVIDER];
        if (options.dependencies.includes(NEST_BOOT)) {
            inject.push(NEST_BOOT_PROVIDER);
        } else if (options.dependencies.includes(NEST_CONSUL_CONFIG)) {
            inject.push(NEST_CONSUL_CONFIG_PROVIDER);
        }

        const loadbalanceProvider = {
            provide: NEST_CONSUL_LOADBALANCE_PROVIDER,
            useFactory: async (service: ConsulService, config: Boot | ConsulConfig): Promise<Loadbalance> => {
                const loadbalance = new Loadbalance(service, options.customRulePath);
                let rules: IRuleOptions[] = options.rules || [];
                let ruleCls: string = options.ruleCls || 'RandomRule';
                if (inject.includes(NEST_BOOT_PROVIDER)) {
                    rules = (config as Boot).get<IRuleOptions[]>(this.rulePath, []);
                    ruleCls = (config as Boot).get<string>(this.ruleClsPath, 'RandomRule');
                } else if (inject.includes(NEST_CONSUL_CONFIG_PROVIDER)) {
                    rules = (config as ConsulConfig).get<IRuleOptions[]>(this.rulePath, []);
                    ruleCls = (config as ConsulConfig).get<string>(this.ruleClsPath, 'RandomRule');
                    (config as ConsulConfig).watch<{
                        routes: IRuleOptions[];
                        ruleCls: string;
                    }>(this.loadbalancePath, async ({ routes, ruleCls }) => {
                        await loadbalance.init(rules, ruleCls);
                    });
                }

                await loadbalance.init(rules, ruleCls);
                return loadbalance;
            },
            inject,
        };

        return {
            module: LoadbalanceModule,
            providers: [loadbalanceProvider],
            exports: [loadbalanceProvider],
        };
    }
}
