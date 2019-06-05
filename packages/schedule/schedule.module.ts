import { Module, DynamicModule, Global } from '@nestjs/common';
import { NEST_LOGGER, NEST_LOGGER_PROVIDER } from '@nestcloud/common';
import { NEST_SCHEDULE_PROVIDER } from './constants';
import { Schedule } from './schedule';
import { IGlobalConfig } from './interfaces/global-config.interface';

@Global()
@Module({})
export class ScheduleModule {
    static register(globalConfig?: IGlobalConfig): DynamicModule {
        const inject = [];
        if (globalConfig && globalConfig.logger === NEST_LOGGER) {
            inject.push(NEST_LOGGER_PROVIDER);
        }
        const scheduleProvider = {
            provide: NEST_SCHEDULE_PROVIDER,
            useFactory: (logger): Schedule => {
                if (logger) {
                    globalConfig.logger = logger;
                }
                return new Schedule(globalConfig);
            },
            inject,
        };
        return {
            module: ScheduleModule,
            providers: [scheduleProvider],
            exports: [scheduleProvider],
        };
    }
}
