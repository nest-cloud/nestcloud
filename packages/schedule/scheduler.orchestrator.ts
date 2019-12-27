import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { scheduleJob, Job } from 'node-schedule';
import { v4 } from 'uuid';
import { SchedulerRegistry } from './scheduler.registry';
import { CronJob, CronObjLiteral } from './interfaces/cron-options.interface';

interface TargetHost {
    target: Function;
}

interface TimeoutHost {
    timeout: number;
}

interface RefHost<T> {
    ref?: T;
}

interface CronOptionsHost {
    options: CronJob & Record<'cronTime', string | Date | any>;
}

type IntervalOptions = TargetHost & TimeoutHost & RefHost<number>;
type TimeoutOptions = TargetHost & TimeoutHost & RefHost<number>;
type CronJobOptions = TargetHost & CronOptionsHost & RefHost<Job>;

@Injectable()
export class SchedulerOrchestrator
    implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly cronJobs: Record<string, CronJobOptions> = {};
    private readonly timeouts: Record<string, TimeoutOptions> = {};
    private readonly intervals: Record<string, IntervalOptions> = {};

    constructor(private readonly schedulerRegistry: SchedulerRegistry) {
    }

    onApplicationBootstrap() {
        this.mountTimeouts();
        this.mountIntervals();
        this.mountCron();
    }

    onApplicationShutdown(signal?: string | undefined) {
        this.clearTimeouts();
        this.clearIntervals();
        this.closeCronJobs();
    }

    mountIntervals() {
        const intervalKeys = Object.keys(this.intervals);
        intervalKeys.forEach(key => {
            const options = this.intervals[key];
            const intervalRef = setInterval(options.target, options.timeout);

            options.ref = intervalRef;
            this.schedulerRegistry.addInterval(key, intervalRef);
        });
    }

    mountTimeouts() {
        const timeoutKeys = Object.keys(this.timeouts);
        timeoutKeys.forEach(key => {
            const options = this.timeouts[key];
            const timeoutRef = setTimeout(options.target, options.timeout);

            options.ref = timeoutRef;
            this.schedulerRegistry.addTimeout(key, timeoutRef);
        });
    }

    mountCron() {
        const cronKeys = Object.keys(this.cronJobs);
        cronKeys.forEach(key => {
            const { options, target } = this.cronJobs[key];
            let cronJob: Job;
            if (options.rule instanceof Date ||
                typeof options.rule === 'number' ||
                typeof options.rule === 'string') {
                cronJob = scheduleJob(key, options.rule as any, target as any);
            } else {
                cronJob = scheduleJob(key, {
                    ...options,
                    ...options.rule as CronObjLiteral,
                }, target as any);
            }

            this.cronJobs[key].ref = cronJob;
            this.schedulerRegistry.addCronJob(key, cronJob);
        });
    }

    clearTimeouts() {
        const keys = Object.keys(this.timeouts);
        keys.forEach(key => clearTimeout(this.timeouts[key].ref));
    }

    clearIntervals() {
        const keys = Object.keys(this.intervals);
        keys.forEach(key => clearInterval(this.intervals[key].ref));
    }

    closeCronJobs() {
        const keys = Object.keys(this.cronJobs);
        keys.forEach(key => this.cronJobs[key].ref!.cancel());
    }

    addTimeout(methodRef: Function, timeout: number, name: string = v4()) {
        this.timeouts[name] = {
            target: methodRef,
            timeout,
        };
    }

    addInterval(methodRef: Function, timeout: number, name: string = v4()) {
        this.intervals[name] = {
            target: methodRef,
            timeout,
        };
    }

    addCron(
        methodRef: Function,
        options: CronJob & Record<'cronTime', string | Date | any>,
    ) {
        const name = options.name || v4();
        this.cronJobs[name] = {
            target: methodRef,
            options,
        };
    }
}
