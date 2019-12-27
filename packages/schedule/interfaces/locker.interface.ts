import { Job } from 'node-schedule';

export interface ILocker {
    init(job: Job): void;

    tryLock(): Promise<boolean> | boolean;

    release(): any;
}
