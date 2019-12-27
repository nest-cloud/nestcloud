import { applyDecorators, SetMetadata } from '@nestjs/common';
import { isString } from 'util';
import { SchedulerType } from '../enums/scheduler-type.enum';
import {
    SCHEDULER_NAME,
    SCHEDULER_TYPE,
    SCHEDULE_TIMEOUT_OPTIONS,
} from '../schedule.constants';
import { TimeoutOptions } from '../interfaces/timeout-options.interface';

/**
 * Schedules an timeout (`setTimeout`).
 */
export function Timeout(timeout: number): MethodDecorator;
/**
 * Schedules an timeout (`setTimeout`).
 */
export function Timeout(name: string, timeout: number): MethodDecorator;
/**
 * Schedules an timeout (`setTimeout`).
 */
export function Timeout(name: string, timeout: number, options?: TimeoutOptions): MethodDecorator;
/**
 * Schedules an timeout (`setTimeout`).
 */
export function Timeout(nameOrTimeout: string | number, timeout?: number, options?: TimeoutOptions): MethodDecorator {
    const [name, timeoutValue] = isString(nameOrTimeout)
        ? [nameOrTimeout, timeout, options]
        : [undefined, nameOrTimeout, options];

    return applyDecorators(
        SetMetadata(SCHEDULE_TIMEOUT_OPTIONS, { timeout: timeoutValue }),
        SetMetadata(SCHEDULER_NAME, name),
        SetMetadata(SCHEDULER_TYPE, SchedulerType.TIMEOUT),
    );
}
