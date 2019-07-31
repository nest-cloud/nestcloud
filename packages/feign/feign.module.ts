import { Module, DynamicModule, Global } from '@nestjs/common';
import {
    NEST_LOADBALANCE,
    NEST_FEIGN_PROVIDER,
    NEST_LOADBALANCE_PROVIDER,
    NEST_BOOT,
    NEST_BOOT_PROVIDER,
    NEST_CONFIG,
    NEST_CONFIG_PROVIDER,
    IBoot,
    IConfig,
} from '@nestcloud/common';
import { IFeignOptions } from './interfaces/feign-options.interface';
import { NestCloud } from '@nestcloud/core';

@Global()
@Module({})
export class FeignModule {
    private static readonly configPath = 'feign.axios';

    static register(options: IFeignOptions = {}): DynamicModule {
        const inject = [];
        if (options.dependencies) {
            if (options.dependencies.includes(NEST_BOOT)) {
                inject.push(NEST_BOOT_PROVIDER);
            } else if (options.dependencies.includes(NEST_CONFIG)) {
                inject.push(NEST_CONFIG_PROVIDER);
            }

            if (options.dependencies.includes(NEST_LOADBALANCE)) {
                inject.push(NEST_LOADBALANCE_PROVIDER);
            }
        }

        const feignProvider = {
            provide: NEST_FEIGN_PROVIDER,
            useFactory: async (...args: any[]): Promise<any> => {
                const boot: IBoot = args[inject.indexOf(NEST_BOOT_PROVIDER)];
                const config: IConfig = args[inject.indexOf(NEST_CONFIG_PROVIDER)];
                NestCloud.global.axiosConfig = options.axiosConfig;
                if (boot) {
                    NestCloud.global.axiosConfig = boot.get(this.configPath, {});
                } else if (config) {
                    NestCloud.global.axiosConfig = config.get(this.configPath, {});
                    (config as IConfig).watch(this.configPath, config => {
                        NestCloud.global.axiosConfig = config;
                    });
                }
            },
            inject,
        };

        return {
            module: FeignModule,
            providers: [feignProvider],
            exports: [feignProvider],
        };
    }
}
