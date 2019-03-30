import { Injectable } from "@nestjs/common";
import { Cron, Interval, Timeout, NestSchedule } from '@nestcloud/schedule';

@Injectable()
export class ScheduleService extends NestSchedule {
    @Cron('0 0 2 * *')
    doCronJob() {

    }

    @Interval(5000)
    doIntervalJob() {

    }

    @Timeout(5000)
    doOnceJob() {

    }
}
