import { INestApplication } from '@nestjs/common';
import { Cache } from './Cache';
import { NEST_COMMON } from "./constants";

export class NestCloud {
    static create<T extends INestApplication = INestApplication>(application: T): T {
        Cache.getInstance(NEST_COMMON).set('application', application);
        return application;
    }
}
