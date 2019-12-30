import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SchedulerType } from './enums/scheduler-type.enum';
import { IntervalMetadata } from './interfaces/interval-metadata.interface';
import { TimeoutMetadata } from './interfaces/timeout-metadata.interface';
import { CronObject, CronObjLiteral, CronOptions } from './interfaces/cron-options.interface';
import {
    SCHEDULER_NAME,
    SCHEDULER_TYPE,
    SCHEDULE_CRON_OPTIONS,
    SCHEDULE_INTERVAL_OPTIONS,
    SCHEDULE_TIMEOUT_OPTIONS,
    SCHEDULE_LOCKER, SCHEDULER_OPTIONS,
} from './schedule.constants';
import { TimeoutOptions } from './interfaces/timeout-options.interface';
import { IntervalOptions } from './interfaces/interval-options.interface';

@Injectable()
export class SchedulerMetadataAccessor {
    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    getSchedulerType(target: Function): SchedulerType | undefined {
        return this.reflector.get(SCHEDULER_TYPE, target);
    }

    getSchedulerName(target: Function): string | undefined {
        return this.reflector.get(SCHEDULER_NAME, target);
    }

    getLocker(target: Function): Function | undefined {
        return this.reflector.get(SCHEDULE_LOCKER, target);
    }

    getJobOptions(target: Function): CronOptions | TimeoutOptions | IntervalOptions | undefined {
        return this.reflector.get(SCHEDULER_OPTIONS, target);
    }

    getTimeoutMetadata(target: Function): TimeoutMetadata | undefined {
        return this.reflector.get(SCHEDULE_TIMEOUT_OPTIONS, target);
    }

    getIntervalMetadata(target: Function): IntervalMetadata | undefined {
        return this.reflector.get(SCHEDULE_INTERVAL_OPTIONS, target);
    }

    getCronMetadata(target: Function): string | number | Date | CronObject | CronObjLiteral | undefined {
        return this.reflector.get(SCHEDULE_CRON_OPTIONS, target);
    }
}
