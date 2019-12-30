import { Locker } from './interfaces/locker.interface';
import { Logger } from '@nestjs/common';
import { JOB_EXECUTE_ERROR, RELEASE_LOCK_ERROR, TRY_LOCK_FAILED } from './schedule.messages';

const logger = new Logger('Schedule');

export class ScheduleWrapper {
    public async immediately(name: string, target: Promise<Function>) {
        (await target).call(null).catch(e => logger.error(JOB_EXECUTE_ERROR(name), e));
        return target;
    }

    public async retryable(retries: number = -1, retry: number = 5000, target: Promise<Function>): Promise<Function> {
        let count = 0;
        let timer: NodeJS.Timeout;

        const targetRef = () => {
            return new Promise(async (resolve, reject) => {
                const wrapperRef = async () => {
                    try {
                        await (await target).call(null);

                        count = 0;
                        resolve();
                    } catch (e) {
                        if (count < retries) {
                            if (timer) {
                                clearTimeout(timer);
                            }
                            count++;
                            timer = setTimeout(() => wrapperRef(), retry);
                            return;
                        }

                        count = 0;
                        reject(e);
                    }
                };
                await wrapperRef();
            });
        };
        return targetRef;
    }

    public async lockable(name: string, locker: Locker, target: Promise<Function>): Promise<Function> {
        if (locker) {
            locker.init(name);
            try {
                const locked = await locker.tryLock();
                if (!locked) {
                    logger.error(TRY_LOCK_FAILED(name));
                    return;
                }
            } catch (e) {
                logger.error(TRY_LOCK_FAILED(name));
                return;
            }
        }

        return async () => {
            if (locker) {
                try {
                    locker.release();
                } catch (e) {
                    logger.error(RELEASE_LOCK_ERROR(name));
                }
            }
            await (await target).call(null);
        };
    }
}
