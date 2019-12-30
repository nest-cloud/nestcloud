import { applyDecorators, SetMetadata } from '@nestjs/common';
import { SchedulerType } from '../enums/scheduler-type.enum';
import {
    SCHEDULER_NAME,
    SCHEDULER_TYPE,
    SCHEDULE_CRON_OPTIONS, SCHEDULER_OPTIONS,
} from '../schedule.constants';
import {
    CronObject,
    CronObjLiteral,
    CronOptions,
} from '../interfaces/cron-options.interface';

/**
 * Creates a scheduled job.
 * @param rule The time to fire off your job. This can be in the form of cron syntax or a JS ```Date``` object.
 * @param options Job execution options.
 */
export function Cron(
    rule: string | number | Date | CronObject | CronObjLiteral,
    options?: CronOptions,
): MethodDecorator {
    const name = options && options.name;
    return applyDecorators(
        SetMetadata(SCHEDULE_CRON_OPTIONS, rule),
        SetMetadata(SCHEDULER_NAME, name),
        SetMetadata(SCHEDULER_OPTIONS, options),
        SetMetadata(SCHEDULER_TYPE, SchedulerType.CRON),
    );
}
