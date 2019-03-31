import 'reflect-metadata';
import { NEST_SCHEDULE_JOB_KEY } from '../constants';
import { IScheduleOptions } from '../interfaces/schedule-options.interface';
import { ICronOptions } from '../interfaces/cron-options.interface';
import { IBaseOptions } from '../interfaces/base-options.interface';

export const ScheduleDecorator = (options: IScheduleOptions) => createSchedule(options);
export const Interval = (milliseconds: number, options: IBaseOptions = {}) => createSchedule({ interval: milliseconds, ...options });
export const Timeout = (milliseconds: number, options: IBaseOptions = {}) => createSchedule({ timeout: milliseconds, ...options });
export const Cron = (cron: string, options: ICronOptions = {}) => createSchedule({ cron, ...options });

const createSchedule = (options: IScheduleOptions) => (target, key, descriptor) => {
    let jobs = Reflect.getMetadata(NEST_SCHEDULE_JOB_KEY, target);
    if (!jobs) {
        jobs = [];
    }

    jobs.push({ ...options, key });
    Reflect.defineMetadata(NEST_SCHEDULE_JOB_KEY, jobs, target);
};
