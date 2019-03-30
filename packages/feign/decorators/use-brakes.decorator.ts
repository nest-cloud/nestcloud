import { IBrakesConfig } from "../interfaces/brake-options.interface";
import * as Brake from "brakes";
import { ServiceUnavailableException } from '@nestjs/common';
import { BRAKES, BRAKES_FALLBACK_METADATA, BRAKES_HEALTH_CHECK_METADATA } from "../constants";
import { getMetadata } from "../utils/metadata.util";
import { executeUtil } from "../utils/execute.util";
import { chooseModule, getInstance } from "../utils/module.util";
import { IFallback } from "../interfaces/fallback.interface";
import { IHealthCheck } from "../interfaces/health-check.interface";

const events = ['exec', 'failure', 'success', 'timeout', 'circuitClosed', 'circuitOpen', 'snapshot', 'healthCheckFailed'];

export const UseBrakes = (config?: IBrakesConfig | boolean) => (target, key?, descriptor?) => {
    if (config || config === void 0) {
        const cfg = config as IBrakesConfig;
        const brakes = new Brake(cfg);

        let descriptorValue = false;
        if (key) {
            descriptorValue = descriptor.value;
        }

        // default fallback
        brakes.fallback(() => {
            const Fallback = getMetadata<Function>(BRAKES_FALLBACK_METADATA, descriptorValue, target, target.constructor);
            if (Fallback) {
                const module = chooseModule(Fallback);
                if (module) {
                    const instance: IFallback = getInstance(module, Fallback);
                    if (instance) {
                        return executeUtil(instance.fallback());
                    }
                }
            }

            throw new ServiceUnavailableException('The upstream service is unavailable, please try again soon.');
        });

        if (cfg.healthCheck) {
            // default health check
            brakes.healthCheck(async () => {
                const HealthCheck = getMetadata<any>(BRAKES_HEALTH_CHECK_METADATA, descriptorValue, target, target.constructor);
                const module = chooseModule(HealthCheck);
                if (module) {
                    const instance: IHealthCheck = getInstance(module, HealthCheck);
                    if (instance) {
                        return executeUtil(instance.check());
                    }
                }
                return void 0;
            });
        }

        if (cfg.event) {
            events.forEach(name => brakes.on(name, (...params) => cfg.event(name, ...params)));
        }
        Reflect.defineMetadata(BRAKES, brakes, key ? descriptor.value : target);
    } else {
        Reflect.defineMetadata(BRAKES, 'none', key ? descriptor.value : target);
    }
};
