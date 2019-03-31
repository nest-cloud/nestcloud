import { IHealthCheck } from '../interfaces/health-check.interface';
import { BRAKES_HEALTH_CHECK_METADATA, GUARDS_METADATA } from '../constants';
import { extendMetadata } from '../utils/metadata.util';

export const UseHeathCheck = <T extends IHealthCheck>(Check: IHealthCheck | Function) => (target, key?, descriptor?) => {
    extendMetadata(BRAKES_HEALTH_CHECK_METADATA, Check, key ? descriptor.value : target);

    // hack
    extendMetadata(GUARDS_METADATA, Check, key ? descriptor.value : target);
};
