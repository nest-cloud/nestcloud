import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { scheduleJob, Job } from 'node-schedule';
import { v4 } from 'uuid';
import { SchedulerRegistry } from './scheduler.registry';
import { CronObject, CronObjLiteral, CronOptions } from './interfaces/cron-options.interface';
import { Locker } from './interfaces/locker.interface';
import { ScheduleWrapper } from './schedule.wrapper';
import { JOB_EXECUTE_ERROR } from './schedule.messages';
import { TimeoutOptions } from './interfaces/timeout-options.interface';

interface TargetHost {
    target: Function;
}

interface TimeoutHost {
    timeout: number;
    locker: Locker;
    options: TimeoutOptions;
}

interface RefHost<T> {
    ref?: T;
}

interface CronOptionsHost {
    rule: string | number | Date | CronObject | CronObjLiteral;
    locker: Locker;
    options: CronOptions;
}

type IntervalJobOptions = TargetHost & TimeoutHost & RefHost<NodeJS.Timeout>;
type TimeoutJobOptions = TargetHost & TimeoutHost & RefHost<NodeJS.Timeout>;
type CronJobOptions = TargetHost & CronOptionsHost & RefHost<Job>;

@Injectable()
export class SchedulerOrchestrator implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly logger = new Logger('Schedule');
    private readonly cronJobs: Record<string, CronJobOptions> = {};
    private readonly timeouts: Record<string, TimeoutJobOptions> = {};
    private readonly intervals: Record<string, IntervalJobOptions> = {};

    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly wrapper: ScheduleWrapper,
    ) {
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

    private mountIntervals() {
        const intervalKeys = Object.keys(this.intervals);
        intervalKeys.forEach(key => {
            const { options = {}, timeout, target, locker } = this.intervals[key];
            let chain = this.wrapper.retryable(options.retries, options.retry, target as any);
            if (options.immediate) {
                chain = this.wrapper.immediately(key, chain);
            }

            const ref = this.wrapper.lockable(key, locker, chain);
            const intervalRef = setInterval(async () => {
                    try {
                        await (await ref).call(null);
                    } catch (e) {
                        this.logger.error(JOB_EXECUTE_ERROR(key), e);
                    }
                },
                timeout,
            );

            this.intervals[key].ref = intervalRef;
            this.schedulerRegistry.addInterval(key, intervalRef);
        });
    }

    private mountTimeouts() {
        const timeoutKeys = Object.keys(this.timeouts);
        timeoutKeys.forEach(key => {
            const { options = {}, timeout, target, locker } = this.timeouts[key];
            const ref = this.wrapper.lockable(key, locker,
                this.wrapper.retryable(options.retries, options.retry, target as any),
            );

            const timeoutRef = setTimeout(async () => {
                    try {
                        await (await ref).call(null);
                    } catch (e) {
                        this.logger.error(JOB_EXECUTE_ERROR(key), e);
                    }
                },
                timeout,
            );

            this.timeouts[key].ref = timeoutRef;
            this.schedulerRegistry.addTimeout(key, timeoutRef);
        });
    }

    private mountCron() {
        const cronKeys = Object.keys(this.cronJobs);
        cronKeys.forEach(key => {
            const { options = {}, target, rule, locker } = this.cronJobs[key];
            const ref = this.wrapper.lockable(key, locker,
                this.wrapper.retryable(options.retries, options.retry, target as any),
            );

            const cronJob: Job = scheduleJob(
                key,
                rule as any,
                async () => {
                    try {
                        await (await ref).call(null);
                    } catch (e) {
                        this.logger.error(JOB_EXECUTE_ERROR(key), e);
                    }
                },
            );

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

    addTimeout(methodRef: Function, timeout: number, name: string = v4(), locker: Locker, options?: CronOptions) {
        this.timeouts[name] = { target: methodRef, timeout, locker, options };
    }

    addInterval(methodRef: Function, timeout: number, name: string = v4(), locker: Locker, options?: CronOptions) {
        this.intervals[name] = { target: methodRef, timeout, locker, options };
    }

    addCron(methodRef: Function, rule: string | number | Date | CronObject | CronObjLiteral, locker: Locker, options?: CronOptions) {
        const name = options ? options.name || v4() : v4();
        this.cronJobs[name] = { target: methodRef, rule, locker, options };
    }
}
