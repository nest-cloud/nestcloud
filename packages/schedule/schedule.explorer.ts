import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { SchedulerType } from './enums/scheduler-type.enum';
import { SchedulerMetadataAccessor } from './schedule-metadata.accessor';
import { SchedulerOrchestrator } from './scheduler.orchestrator';
import { Locker } from './interfaces/locker.interface';
import { Scanner } from '@nestcloud/common';

@Injectable()
export class ScheduleExplorer implements OnModuleInit {
    constructor(
        private readonly schedulerOrchestrator: SchedulerOrchestrator,
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: SchedulerMetadataAccessor,
        private readonly metadataScanner: MetadataScanner,
        private readonly scanner: Scanner,
    ) {
    }

    onModuleInit() {
        this.explore();
    }

    explore() {
        const providers: InstanceWrapper[] = this.discoveryService.getProviders();
        providers.forEach((wrapper: InstanceWrapper) => {
            const { instance } = wrapper;
            if (!instance || typeof instance === 'string') {
                return;
            }
            this.metadataScanner.scanFromPrototype(
                instance,
                Object.getPrototypeOf(instance),
                (key: string) => this.lookupSchedulers(instance, key),
            );
        });
    }

    lookupSchedulers(instance: Record<string, Function>, key: string) {
        const methodRef = instance[key];
        const metadata = this.metadataAccessor.getSchedulerType(methodRef);
        const options = this.metadataAccessor.getJobOptions(methodRef);
        const LockerClass = this.metadataAccessor.getLocker(methodRef);
        const lockerInstance: Locker = this.scanner.findInjectable<Locker>(LockerClass);

        switch (metadata) {
            case SchedulerType.CRON: {
                const cronMetadata = this.metadataAccessor.getCronMetadata(methodRef);
                return this.schedulerOrchestrator.addCron(
                    methodRef.bind(instance),
                    cronMetadata!,
                    lockerInstance,
                    { ...options! },
                );
            }
            case SchedulerType.TIMEOUT: {
                const timeoutMetadata = this.metadataAccessor.getTimeoutMetadata(
                    methodRef,
                );
                const name = this.metadataAccessor.getSchedulerName(methodRef);
                return this.schedulerOrchestrator.addTimeout(
                    methodRef.bind(instance),
                    timeoutMetadata!.timeout,
                    name,
                    lockerInstance,
                    options!,
                );
            }
            case SchedulerType.INTERVAL: {
                const intervalMetadata = this.metadataAccessor.getIntervalMetadata(
                    methodRef,
                );
                const name = this.metadataAccessor.getSchedulerName(methodRef);
                return this.schedulerOrchestrator.addInterval(
                    methodRef.bind(instance),
                    intervalMetadata!.timeout,
                    name,
                    lockerInstance,
                    options!,
                );
            }
        }
    }
}
