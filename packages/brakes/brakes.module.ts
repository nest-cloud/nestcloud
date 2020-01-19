import { Module, DynamicModule, Global } from '@nestjs/common';
import { AsyncBrakesOptions, BrakesOptions } from './interfaces/brakes-options.interface';
import { IBoot, BOOT, BRAKES } from '@nestcloud/common';
import { BRAKES_OPTIONS_PROVIDER } from './brakes.constants';
import { Brakes } from './brakes.class';
import { BrakesFactory } from './brakes.factory';
import { BrakesRegistry } from './brakes.registry';

@Global()
@Module({})
export class BrakesModule {
    private static CONFIG_PREFIX = 'brakes';

    public static forRoot(options?: BrakesOptions): DynamicModule {
        return this.register(options);
    }

    public static forRootAsync(options: AsyncBrakesOptions): DynamicModule {
        return this.register(options);
    }

    private static register(options: BrakesOptions & AsyncBrakesOptions = {}): DynamicModule {
        const inject = options.inject || [];
        const optionsProvider = {
            provide: BRAKES_OPTIONS_PROVIDER,
            useFactory: (...params: any[]) => {
                const registerOptions = options;
                const boot: IBoot = params[inject.indexOf(BOOT)];
                if (boot) {
                    options = boot.get(this.CONFIG_PREFIX);
                }
                return Object.assign(registerOptions, options);
            },
            inject,
        };

        const brakesProvider = {
            provide: BRAKES,
            useFactory: (brakes) => brakes,
            inject: [Brakes],
        };

        return {
            module: BrakesModule,
            providers: [optionsProvider, brakesProvider, Brakes, BrakesFactory, BrakesRegistry],
            exports: [brakesProvider],
        };
    }
}
