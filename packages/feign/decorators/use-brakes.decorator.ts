import { IBrakesConfig } from '@nestcloud/common';
import * as BrakesModule from '@nestcloud/brakes';
import { ServiceUnavailableException } from '@nestjs/common';
import { BRAKES, BRAKES_FALLBACK_METADATA, BRAKES_HEALTH_CHECK_METADATA } from '../constants';
import { getMetadata } from '../utils/metadata.util';
import { chooseModule, getInstance } from '../utils/module.util';
import { IFallback } from '../interfaces/fallback.interface';
import { IHealthCheck } from '../interfaces/health-check.interface';
import { v1 } from 'uuid';

const events = ['exec', 'failure', 'success', 'timeout', 'circuitClosed', 'circuitOpen', 'snapshot', 'healthCheckFailed'];

const fallbackMap = new Map<Function, IFallback>();
const healthCheckMap = new Map<Function, IHealthCheck>();

export const UseBrakes = (config?: IBrakesConfig | boolean) => (target, key?, descriptor?) => {
    if (config || config === void 0) {
        const cfg = config as IBrakesConfig;
        cfg.name = cfg.name || v1();
        const { BrakesFactory }: typeof BrakesModule = require('@nestcloud/brakes');
        const brakes = BrakesFactory.initBrakes(cfg.name, cfg);

        let descriptorValue = false;
        if (key) {
            descriptorValue = descriptor.value;
        }

        // default fallback
        brakes.fallback(async () => {
            const Fallback = getMetadata<Function>(BRAKES_FALLBACK_METADATA, descriptorValue, target, target.constructor);
            if (Fallback) {
                let instance: IFallback = fallbackMap.get(Fallback);
                if (!instance) {
                    const module = chooseModule(Fallback);
                    instance = getInstance(module, Fallback);
                    if (instance) {
                        fallbackMap.set(Fallback, instance);
                    }
                }

                return instance.fallback();
            }

            throw new ServiceUnavailableException('The upstream service is unavailable, please try again soon.');
        });

        if (cfg.healthCheck) {
            // default health check
            brakes.healthCheck(async () => {
                const HealthCheck = getMetadata<any>(BRAKES_HEALTH_CHECK_METADATA, descriptorValue, target, target.constructor);
                if (HealthCheck) {
                    let instance: IHealthCheck = healthCheckMap.get(HealthCheck);
                    if (!instance) {
                        const module = chooseModule(HealthCheck);
                        if (module) {
                            const instance: IHealthCheck = getInstance(module, HealthCheck);
                            if (instance) {
                                healthCheckMap.set(HealthCheck, instance);
                            }
                        }
                    }
                    return instance.check();
                }
                return void 0;
            });
        }

        if (cfg.event) {
            events.forEach(name => brakes.on(name, (...params) => cfg.event(name, ...params)));
        }
        Reflect.defineMetadata(BRAKES, brakes.name, key ? descriptor.value : target);
    } else {
        Reflect.defineMetadata(BRAKES, false, key ? descriptor.value : target);
    }
};
