import { NestDistributedSchedule } from './nest-distributed.schedule';

export class NestSchedule extends NestDistributedSchedule {
  async tryLock(method: string): Promise<any> {
    return false;
  }
}
