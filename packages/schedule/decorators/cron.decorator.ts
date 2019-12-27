import { applyDecorators, SetMetadata } from '@nestjs/common';
import { SchedulerType } from '../enums/scheduler-type.enum';
import {
    SCHEDULER_NAME,
    SCHEDULER_TYPE,
    SCHEDULE_CRON_OPTIONS,
} from '../schedule.constants';
import {
    CronDateOptions,
    CronObjLiteral,
    CronObjLiteralOptions,
    CronOptions,
} from '../interfaces/cron-options.interface';

/**
 * Creates a scheduled job.
 * @param rule The time to fire off your job. This can be in the form of cron syntax or a JS ```Date``` object.
 * @param options Job execution options.
 */
export function Cron(rule: string | number | Date | CronObjLiteral, options: CronOptions | CronObjLiteralOptions | CronDateOptions): MethodDecorator {
    const name = options && options.name;
    return applyDecorators(
        SetMetadata(SCHEDULE_CRON_OPTIONS, {
            ...options,
            rule,
        }),
        SetMetadata(SCHEDULER_NAME, name),
        SetMetadata(SCHEDULER_TYPE, SchedulerType.CRON),
    );
}
