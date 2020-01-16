import { Injectable } from '@nestjs/common';
import { Job } from 'node-schedule';
import { DUPLICATE_SCHEDULER, NO_SCHEDULER_FOUND } from './schedule.messages';
import { Locker } from './interfaces/locker.interface';
import { TimeoutOptions } from './interfaces/timeout-options.interface';
import { CronObject, CronObjLiteral, CronOptions } from './interfaces/cron-options.interface';

interface TargetHost {
    target: Function;
}

interface TimeoutHost {
    timeout: number;
    locker?: Locker;
    options: TimeoutOptions;
}

interface RefHost<T> {
    ref?: T;
}

interface CronHost {
    rule: string | number | Date | CronObject | CronObjLiteral;
    locker?: Locker;
    options: CronOptions;
    job?: Job;
}

export type IntervalJobOptions = TargetHost & TimeoutHost & RefHost<NodeJS.Timeout>;
export type TimeoutJobOptions = TargetHost & TimeoutHost & RefHost<NodeJS.Timeout>;
export type CronJobOptions = TargetHost & CronHost & RefHost<Job>;

@Injectable()
export class SchedulerRegistry {
    private readonly cronJobs = new Map<string, CronJobOptions>();
    private readonly timeouts = new Map<string, TimeoutJobOptions>();
    private readonly intervals = new Map<string, IntervalJobOptions>();

    getCronJob(name: string): CronJobOptions {
        const job = this.cronJobs.get(name);
        if (!job) {
            throw new Error(NO_SCHEDULER_FOUND('Cron Job', name));
        }
        return job;
    }

    getIntervalJob(name: string): IntervalJobOptions {
        const job = this.intervals.get(name);
        if (typeof job === 'undefined') {
            throw new Error(NO_SCHEDULER_FOUND('Interval', name));
        }
        return job;
    }

    getTimeoutJob(name: string): TimeoutJobOptions {
        const job = this.timeouts.get(name);
        if (typeof job === 'undefined') {
            throw new Error(NO_SCHEDULER_FOUND('Timeout', name));
        }
        return job;
    }

    addCronJob(name: string, cronJob: CronJobOptions) {
        const job = this.cronJobs.get(name);
        if (job) {
            throw new Error(DUPLICATE_SCHEDULER('Cron Job', name));
        }
        this.cronJobs.set(name, cronJob);
    }

    addIntervalJob(name: string, intervalJob: IntervalJobOptions) {
        const job = this.intervals.get(name);
        if (job) {
            throw new Error(DUPLICATE_SCHEDULER('Interval', name));
        }
        this.intervals.set(name, intervalJob);
    }

    addTimeoutJob(name: string, timeoutJob: TimeoutJobOptions) {
        const job = this.timeouts.get(name);
        if (job) {
            throw new Error(DUPLICATE_SCHEDULER('Timeout', name));
        }
        this.timeouts.set(name, timeoutJob);
    }

    getCronJobs(): Map<string, CronJobOptions> {
        return this.cronJobs;
    }

    deleteCronJob(name: string) {
        const cronJob = this.getCronJob(name);
        cronJob.job.cancel();
        this.cronJobs.delete(name);
    }

    getIntervalJobs(): Map<string, IntervalJobOptions> {
        return this.intervals;
    }

    deleteIntervalJob(name: string) {
        const job = this.getIntervalJob(name);
        clearInterval(job.ref);
        this.intervals.delete(name);
    }

    getTimeoutJobs(): Map<string, TimeoutJobOptions> {
        return this.timeouts;
    }

    deleteTimeoutJob(name: string) {
        const job = this.getTimeoutJob(name);
        clearTimeout(job.ref);
        this.timeouts.delete(name);
    }
}
