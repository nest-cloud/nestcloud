import { RecurrenceSegment, Timezone } from 'node-schedule';

export interface CronObjLiteral {
    /**
     * Day of the month.
     */
    date?: RecurrenceSegment;
    dayOfWeek?: RecurrenceSegment;
    hour?: RecurrenceSegment;
    minute?: RecurrenceSegment;
    month?: RecurrenceSegment;
    second?: RecurrenceSegment;
    year?: RecurrenceSegment;
}

export interface CronDateOptions {
    name?: string;
}

export interface CronObjLiteralOptions extends CronDateOptions {
    /**
     * Timezone
     */
    tz?: Timezone;
}

export interface CronOptions extends CronObjLiteralOptions {
    /**
     * Starting date in date range.
     */
    start?: Date | string | number;
    /**
     * Ending date in date range.
     */
    end?: Date | string | number;
}

export interface CronJob extends CronOptions, CronObjLiteral {
    rule: string | number | Date;
}
