import { Module, DynamicModule, Global } from '@nestjs/common';
import {
    NEST_CONSUL_LOADBALANCE,
    NEST_FEIGN_PROVIDER,
    NEST_CONSUL_LOADBALANCE_PROVIDER,
} from '@nestcloud/common';
import { IFeignOptions } from "./interfaces/feign-options.interface";
import { NestCloud } from '@nestcloud/core';

@Global()
@Module({})
export class FeignModule {
    static register(options: IFeignOptions = {}): DynamicModule {
        const inject = [];
        if (options.dependencies && options.dependencies.includes(NEST_CONSUL_LOADBALANCE)) {
            inject.push(NEST_CONSUL_LOADBALANCE_PROVIDER);
        }
        const feignProvider = {
            provide: NEST_FEIGN_PROVIDER,
            useFactory: async (): Promise<any> => {
                NestCloud.global.axiosConfig = options.axiosConfig;
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
