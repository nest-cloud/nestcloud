import { Module, DynamicModule, Global } from '@nestjs/common';
import { BootConfig } from './boot.config';
import { BootOptions } from './interfaces/boot-options.interface';
import { BootLoader } from './boot.loader';
import { Boot } from './boot.class';

@Global()
@Module({})
export class BootModule {
    static forRoot(options: BootOptions): DynamicModule {
        const bootConfigProvider = {
            provide: BootConfig,
            useFactory: (): BootConfig => new BootConfig(options),
        };
        return {
            module: BootModule,
            providers: [bootConfigProvider, BootLoader, Boot],
            exports: [Boot],
        };
    }
}
