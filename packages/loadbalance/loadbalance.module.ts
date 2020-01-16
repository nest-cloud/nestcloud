import { DynamicModule, Global, Module } from '@nestjs/common';
import { AsyncLoadbalanceOptions, LoadbalanceOptions } from './interfaces/loadbalance-options.interface';
import { AXIOS_INSTANCE_PROVIDER } from './loadbalance.constants';
import { Scanner, BOOT, CONFIG, IBoot, IConfig, LOADBALANCE } from '@nestcloud/common';
import { DiscoveryModule } from '@nestjs/core';
import { Loadbalance } from './loadbalance';
import { LoadbalanceChecker } from './loadbalance.checker';
import axios from 'axios';
import { LoadbalanceMetadataAccessor } from './loadbalance-metadata.accessor';
import { LoadbalanceOrchestrator } from './loadbalance.orchestrator';
import { LoadbalanceExplorer } from './loadbalance.explorer';
import { LoadbalanceRuleRegistry } from './loadbalance-rule.registry';
import { LoadbalanceRuleRegister } from './loadbalance-rule.register';
import { LoadbalanceConfig } from './loadbalance.config';

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
            provide: LoadbalanceConfig,
            useFactory: (...params: any[]) => {
                const boot: IBoot = params[inject.indexOf(BOOT)];
                const config: IConfig = params[inject.indexOf(CONFIG)];

                return new LoadbalanceConfig(options, boot, config);
            },
            inject,
        };

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
                Loadbalance,
                LoadbalanceChecker,
                loadbalanceProvider,
                axiosProvider,
                LoadbalanceExplorer,
                LoadbalanceRuleRegistry,
                LoadbalanceRuleRegister,
            ],
            exports: [loadbalanceProvider],
        };
    }
}
