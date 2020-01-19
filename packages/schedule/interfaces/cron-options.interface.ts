import { RecurrenceSegment, Timezone } from 'node-schedule';

export interface CronObject {
    /**
     * Timezone
     */
    tz?: Timezone;
    /**
     * Starting date in date range.
     */
    start: Date | string | number;
    /**
     * Ending date in date range.
     */
    end: Date | string | number;

    rule: string;
}

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
    /**
     * Timezone
     */
    tz?: Timezone;
}

export interface CronOptions {
    retries?: number;
    retry?: number;
    name?: string;
}
