import { DynamicModule, Global, Module } from '@nestjs/common';
import { AsyncLoadbalanceOptions, LoadbalanceOptions } from './interfaces/loadbalance-options.interface';
import { AXIOS_INSTANCE_PROVIDER, LOADBALANCE_OPTIONS_PROVIDER } from './loadbalance.constants';
import { Scanner, BOOT, CONFIG, IBoot, IConfig } from '@nestcloud/common';
import { DiscoveryModule } from '@nestjs/core';
import { LOADBALANCE } from '../common';
import { Loadbalance } from './loadbalance';
import { LoadbalanceChecker } from './loadbalance.checker';
import axios from 'axios';
import { LoadbalanceMetadataAccessor } from './loadbalance-metadata.accessor';
import { LoadbalanceOrchestrator } from './loadbalance.orchestrator';
import { LoadbalanceExplorer } from './loadbalance.explorer';
import { RandomRule, RoundRobinRule, WeightedResponseTimeRule } from './rules';

@Global()
@Module({
    imports: [DiscoveryModule],
    providers: [Scanner, LoadbalanceMetadataAccessor, LoadbalanceOrchestrator],
})
export class LoadbalanceModule {
    private static CONFIG_PREFIX = 'loadbalance';

    public static forRoot(options: LoadbalanceOptions): DynamicModule {
        return this.register(options);
    }

    public static forRootAsync(options: AsyncLoadbalanceOptions): DynamicModule {
        return this.register(options);
    }

    private static register(options: LoadbalanceOptions & AsyncLoadbalanceOptions = {}): DynamicModule {
        const inject = options.inject || [];
        const loadbalanceOptionsProvider = {
            provide: LOADBALANCE_OPTIONS_PROVIDER,
            useFactory: (...params: any[]) => {
                let registerOptions = options;
                const boot: IBoot = params[inject.indexOf(BOOT)];
                if (boot) {
                    options = boot.get<LoadbalanceOptions>(this.CONFIG_PREFIX);
                }
                registerOptions = Object.assign(registerOptions, options);

                const config: IConfig = params[inject.indexOf(CONFIG)];
                if (config) {
                    options = config.get<LoadbalanceOptions>(this.CONFIG_PREFIX);
                }
                return Object.assign(registerOptions, options);
            },
            inject,
        };

        const customRules = options.rules || [];

        const loadbalanceProvider = {
            provide: LOADBALANCE,
            useFactory: (lb: Loadbalance) => lb,
            inject: [Loadbalance],
        };

        const axiosProvider = {
            provide: AXIOS_INSTANCE_PROVIDER,
            useFactory: () => axios,
        };

        return {
            module: LoadbalanceModule,
            providers: [loadbalanceOptionsProvider,
                ...customRules as any,
                Loadbalance,
                LoadbalanceChecker,
                loadbalanceProvider,
                axiosProvider,
                LoadbalanceExplorer,
                RandomRule,
                RoundRobinRule,
                WeightedResponseTimeRule,
            ],
            exports: [loadbalanceProvider],
        };
    }
}
