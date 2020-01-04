import { HealthCheck } from '../interfaces/health-check.interface';
import { BRAKES_HEALTH_CHECK_METADATA, GUARDS_METADATA } from '../http.constants';
import { applyDecorators, ExtendArrayMetadata } from '@nestcloud/common';

export function UseHeathChecks(...HealthChecks: (HealthCheck | Function)[]) {
    return applyDecorators(
        ExtendArrayMetadata(BRAKES_HEALTH_CHECK_METADATA, HealthChecks),
        ExtendArrayMetadata(GUARDS_METADATA, HealthChecks),
    );
}
