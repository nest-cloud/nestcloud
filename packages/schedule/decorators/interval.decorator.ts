import { applyDecorators, SetMetadata } from '@nestjs/common';
import { isString } from 'util';
import { SchedulerType } from '../enums/scheduler-type.enum';
import {
    SCHEDULER_NAME,
    SCHEDULER_TYPE,
    SCHEDULE_INTERVAL_OPTIONS,
} from '../schedule.constants';
import { IntervalOptions } from '../interfaces/interval-options.interface';

/**
 * Schedules an interval (`setInterval`).
 */
export function Interval(timeout: number): MethodDecorator;
/**
 * Schedules an interval (`setInterval`).
 */
export function Interval(name: string, timeout: number): MethodDecorator;
/**
 * Schedules an interval (`setInterval`).
 */
export function Interval(name: string, timeout: number, options?: IntervalOptions): MethodDecorator;
/**
 * Schedules an interval (`setInterval`).
 */
export function Interval(nameOrTimeout: string | number, timeout?: number, options?: IntervalOptions): MethodDecorator {
    const [name, intervalTimeout] = isString(nameOrTimeout)
        ? [nameOrTimeout, timeout, options]
        : [undefined, nameOrTimeout, options];

    return applyDecorators(
        SetMetadata(SCHEDULE_INTERVAL_OPTIONS, { timeout: intervalTimeout }),
        SetMetadata(SCHEDULER_NAME, name),
        SetMetadata(SCHEDULER_TYPE, SchedulerType.INTERVAL),
    );
}
