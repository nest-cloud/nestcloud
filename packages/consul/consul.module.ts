import { Module, DynamicModule, Global } from '@nestjs/common';
import { AsyncConsulOptions, ConsulOptions } from './interfaces/consul-options.interface';
import { CONSUL_OPTIONS_PROVIDER } from './consul.constants';
import { Scanner, IBoot, BOOT, CONSUL } from '@nestcloud/common';
import { Consul } from './consul.class';
import { ConsulExplorer } from './consul.explorer';
import { ConsulOrchestrator } from './consul.orchestrator';
import { DiscoveryModule } from '@nestjs/core';
import { ConsulMetadataAccessor } from './consul-metadata.accessor';

@Global()
@Module({
    imports: [DiscoveryModule],
    providers: [ConsulMetadataAccessor, ConsulOrchestrator, Scanner],
})
export class ConsulModule {
    private static CONFIG_PREFIX = 'consul';

    public static forRoot(options: ConsulOptions): DynamicModule {
        return this.register(options);
    }

    public static forRootAsync(options: AsyncConsulOptions): DynamicModule {
        return this.register(options);
    }

    private static register(options: ConsulOptions & AsyncConsulOptions = {}): DynamicModule {
        const inject = options.inject || [];

        const consulOptionsProvider = {
            provide: CONSUL_OPTIONS_PROVIDER,
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

        const consulProvider = {
            provide: CONSUL,
            useFactory: (options: ConsulOptions): Consul => {
                const Client = require('consul');
                return new Client({ ...options, promisify: true });
            },
            inject: [CONSUL_OPTIONS_PROVIDER],
        };

        return {
            module: ConsulModule,
            providers: [consulOptionsProvider, consulProvider, ConsulExplorer],
            exports: [consulProvider],
        };
    }
}
