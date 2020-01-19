import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { SchedulerMetadataAccessor } from './schedule-metadata.accessor';
import { ScheduleExplorer } from './schedule.explorer';
import { SchedulerOrchestrator } from './scheduler.orchestrator';
import { SchedulerRegistry } from './scheduler.registry';
import { ScheduleWrapper } from './schedule.wrapper';
import { Scanner, SCHEDULE } from '@nestcloud/common';
import { Schedule } from './schedule';

@Module({
    imports: [DiscoveryModule],
    providers: [SchedulerMetadataAccessor, SchedulerOrchestrator, Scanner],
})
export class ScheduleModule {
    static forRoot(): DynamicModule {
        const scheduleProvider = {
            provide: SCHEDULE,
            useFactory: (schedule: Schedule) => schedule,
            inject: [Schedule],
        };
        return {
            global: true,
            module: ScheduleModule,
            providers: [ScheduleExplorer, SchedulerRegistry, ScheduleWrapper, Schedule, scheduleProvider],
            exports: [Schedule, scheduleProvider],
        };
    }
}
