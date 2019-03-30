import { IBaseOptions } from "./base-options.interface";

export interface ICronOptions extends IBaseOptions {
    startTime?: Date;
    endTime?: Date;
    tz?: string;
}
