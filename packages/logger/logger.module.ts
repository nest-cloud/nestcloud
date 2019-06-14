import { Module, DynamicModule, Global, Logger } from '@nestjs/common';
import { NEST_LOGGER_PROVIDER, NEST_TYPEORM_LOGGER_PROVIDER } from '@nestcloud/common';
import { TypeormLogger } from './typeorm-logger';

@Global()
@Module({})
export class LoggerModule {
    private static logger: Logger;

    static register(): DynamicModule {
        const inject = [];

        const loggerProvider = {
            provide: NEST_LOGGER_PROVIDER,
            useFactory: (): Logger => {
                if (!this.logger) {
                    this.logger = new Logger();
                }

                return this.logger;
            },
            inject,
        };

        const typeormLoggerProvider = {
            provide: NEST_TYPEORM_LOGGER_PROVIDER,
            useFactory: () => {
                return new TypeormLogger();
            },
        };

        return {
            module: LoggerModule,
            providers: [loggerProvider, typeormLoggerProvider],
            exports: [loggerProvider, typeormLoggerProvider],
        };
    }
}
