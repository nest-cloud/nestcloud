import {
    NEST_BOOT,
    NEST_BOOT_PROVIDER,
    NEST_CONFIG,
    NEST_CONFIG_PROVIDER,
    NEST_LOADBALANCE_PROVIDER,
    NEST_SERVICE_PROVIDER,
    IBoot,
    IConfig,
    IService,
} from '@nestcloud/common';
import { DynamicModule, Global, Module } from '@nestjs/common';

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
        const inject = [NEST_SERVICE_PROVIDER];
        if (options.dependencies) {
            if (options.dependencies.includes(NEST_BOOT)) {
                inject.push(NEST_BOOT_PROVIDER);
            } else if (options.dependencies.includes(NEST_CONFIG)) {
                inject.push(NEST_CONFIG_PROVIDER);
            }
        }

        const loadbalanceProvider = {
            provide: NEST_LOADBALANCE_PROVIDER,
            useFactory: async (service: IService, config: IBoot | IConfig): Promise<Loadbalance> => {
                const loadbalance = new Loadbalance(service, options.customRulePath);
                let rules: IRuleOptions[] = options.rules || [];
                let ruleCls: string = options.ruleCls || 'RandomRule';
                if (inject.includes(NEST_BOOT_PROVIDER)) {
                    rules = (config as IBoot).get<IRuleOptions[]>(this.rulePath, []);
                    ruleCls = (config as IBoot).get<string>(this.ruleClsPath, 'RandomRule');
                } else if (inject.includes(NEST_CONFIG_PROVIDER)) {
                    rules = (config as IConfig).get<IRuleOptions[]>(this.rulePath, []);
                    ruleCls = (config as IConfig).get<string>(this.ruleClsPath, 'RandomRule');
                    (config as IConfig).watch<{
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
