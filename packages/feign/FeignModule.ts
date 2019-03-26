import { Module, DynamicModule, Global } from '@nestjs/common';
import axios from 'axios';
import {
    FEIGN_CLIENT,
    FEIGN_LOADBALANCE_CLIENT,
    GLOBAL_BRAKES_CONFIG,
} from "./constants";
import {
    Cache,
    NEST_CONSUL_LOADBALANCE,
    NEST_FEIGN_PROVIDER,
    NEST_CONSUL_LOADBALANCE_PROVIDER,
    NEST_COMMON_PROVIDER
} from '@nestcloud/common';
import { FeignOptions } from "./options/FeignOptions";

@Global()
@Module({})
export class FeignModule {
    static register(options: FeignOptions = {}): DynamicModule {
        const inject = [NEST_COMMON_PROVIDER];
        if (options.dependencies && options.dependencies.includes(NEST_CONSUL_LOADBALANCE)) {
            inject.push(NEST_CONSUL_LOADBALANCE_PROVIDER);
        }
        const feignProvider = {
            provide: NEST_FEIGN_PROVIDER,
            useFactory: async (lb): Promise<any> => {
                Cache.getInstance('feign').set(FEIGN_CLIENT, axios.create(options.axiosConfig));
                Cache.getInstance('feign').set(FEIGN_LOADBALANCE_CLIENT, lb);
                Cache.getInstance('feign').set(GLOBAL_BRAKES_CONFIG, options.brakesConfig);
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
