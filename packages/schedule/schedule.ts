import { Injectable } from '@nestjs/common';
import { TimeoutOptions } from './interfaces/timeout-options.interface';
import { CronJobOptions, IntervalJobOptions, SchedulerRegistry, TimeoutJobOptions } from './scheduler.registry';
import { v4 } from 'uuid';
import { SchedulerOrchestrator } from './scheduler.orchestrator';
import { IntervalOptions } from './interfaces/interval-options.interface';
import { CronObject, CronObjLiteral, CronOptions } from './interfaces/cron-options.interface';

@Injectable()
export class Schedule {
    constructor(
        private registry: SchedulerRegistry,
        private schedulerOrchestrator: SchedulerOrchestrator,
    ) {
    }

    public createTimeoutJob(methodRef: Function, timeout: number, options: TimeoutOptions = {}) {
        const name = options.name || v4();
        this.registry.addTimeoutJob(name, { target: methodRef, timeout, options });
        this.schedulerOrchestrator.mountTimeouts();
    }

    public createIntervalJob(methodRef: Function, timeout: number, options: IntervalOptions = {}) {
        const name = options.name || v4();
        this.registry.addIntervalJob(name, { target: methodRef, timeout, options });
        this.schedulerOrchestrator.mountIntervals();
    }

    public createCronJob(
        rule: string | number | Date | CronObject | CronObjLiteral,
        methodRef,
        options: CronOptions = {}) {
        const name = options.name || v4();
        this.registry.addCronJob(name, { target: methodRef, rule, options });
        this.schedulerOrchestrator.mountCron();
    }

    public deleteTimeoutJob(name: string) {
        this.registry.deleteTimeoutJob(name);
    }

    public deleteIntervalJob(name: string) {
        this.registry.deleteIntervalJob(name);
    }

    public deleteCronJob(name: string) {
        this.registry.deleteCronJob(name);
    }

    public getTimeoutJobs(): TimeoutJobOptions[] {
        return [...this.registry.getTimeoutJobs().values()];
    }

    public getIntervalJobs(): IntervalJobOptions[] {
        return [...this.registry.getIntervalJobs().values()];
    }

    public getCronJobs(): CronJobOptions[] {
        return [...this.registry.getCronJobs().values()];
    }
}
