import { Module, DynamicModule, Global } from '@nestjs/common';
import { BootOptions } from './interfaces/boot-options.interface';
import { Boot } from './boot.class';
import { BootFileLoader } from './boot-file.loader';
import { BOOT } from '../common';
import { BootStore } from './boot.store';
import { BOOT_OPTIONS_PROVIDER } from './boot.constants';
import { DiscoveryModule } from '@nestjs/core';
import { BootMetadataAccessor } from './boot-metadata.accessor';
import { BootOrchestrator } from './boot.orchestrator';
import { BootExplorer } from './boot.explorer';

@Global()
@Module({
    imports: [DiscoveryModule],
    providers: [BootMetadataAccessor, BootOrchestrator],
})
export class BootModule {
    static register(options: BootOptions): DynamicModule {
        const bootOptionsProvider = {
            provide: BOOT_OPTIONS_PROVIDER,
            useValue: options,
        };
        const bootProvider = {
            provide: BOOT,
            useClass: Boot,
        };
        return {
            global: true,
            module: BootModule,
            providers: [bootOptionsProvider, bootProvider, BootFileLoader, BootStore, BootExplorer],
            exports: [bootProvider],
        };
    }
}
