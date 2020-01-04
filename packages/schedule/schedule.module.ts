import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { SchedulerMetadataAccessor } from './schedule-metadata.accessor';
import { ScheduleExplorer } from './schedule.explorer';
import { SchedulerOrchestrator } from './scheduler.orchestrator';
import { SchedulerRegistry } from './scheduler.registry';
import { ScheduleWrapper } from './schedule.wrapper';
import { Scanner } from '@nestcloud/common';

@Module({
    imports: [DiscoveryModule],
    providers: [SchedulerMetadataAccessor, SchedulerOrchestrator, Scanner],
})
export class ScheduleModule {
    static register(): DynamicModule {
        return {
            global: true,
            module: ScheduleModule,
            providers: [ScheduleExplorer, SchedulerRegistry, ScheduleWrapper],
            exports: [SchedulerRegistry],
        };
    }
}
