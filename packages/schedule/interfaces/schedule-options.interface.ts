import { ICronOptions } from './cron-options.interface';

export interface IScheduleOptions extends ICronOptions {
    cron?: string;
    interval?: number;
    timeout?: number;
}
