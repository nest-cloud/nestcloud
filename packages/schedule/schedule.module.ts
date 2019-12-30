import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { SchedulerMetadataAccessor } from './schedule-metadata.accessor';
import { ScheduleExplorer } from './schedule.explorer';
import { SchedulerOrchestrator } from './scheduler.orchestrator';
import { SchedulerRegistry } from './scheduler.registry';
import { ScheduleScanner } from './schedule.scanner';
import { ScheduleWrapper } from './schedule.wrapper';

@Module({
    imports: [DiscoveryModule],
    providers: [SchedulerMetadataAccessor, SchedulerOrchestrator],
})
export class ScheduleModule {
    static register(): DynamicModule {
        return {
            global: true,
            module: ScheduleModule,
            providers: [ScheduleExplorer, SchedulerRegistry, ScheduleScanner, ScheduleWrapper],
            exports: [SchedulerRegistry],
        };
    }
}
