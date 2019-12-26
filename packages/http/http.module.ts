import { Module, DynamicModule, Global } from '@nestjs/common';
import {
    NEST_LOADBALANCE,
    NEST_HTTP_PROVIDER,
    NEST_LOADBALANCE_PROVIDER,
    NEST_BOOT,
    NEST_BOOT_PROVIDER,
    NEST_CONFIG,
    NEST_CONFIG_PROVIDER,
    IBoot,
    IConfig,
} from '@nestcloud/common';
import { IHttpOptions } from './interfaces/http-options.interface';
import { NestCloud } from '@nestcloud/core';

@Global()
@Module({})
export class HttpModule {
    private static readonly configPath = 'http.axios';

    static register(options: IHttpOptions = {}): DynamicModule {
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

        const httpProvider = {
            provide: NEST_HTTP_PROVIDER,
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
            module: HttpModule,
            providers: [httpProvider],
            exports: [httpProvider],
        };
    }
}
