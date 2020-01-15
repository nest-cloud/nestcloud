import { Module, DynamicModule, Global, Logger } from '@nestjs/common';
import { LOGGER } from '@nestcloud/common';
import { TypeormLogger } from './typeorm-logger';
import { TYPEORM_LOGGER } from './logger.constants';

@Global()
@Module({})
export class LoggerModule {
    private static logger: Logger;

    static forRoot(): DynamicModule {
        const loggerProvider = {
            provide: LOGGER,
            useFactory: (): Logger => {
                if (!this.logger) {
                    this.logger = new Logger();
                }

                return this.logger;
            },
        };

        const typeormLoggerProvider = {
            provide: TYPEORM_LOGGER,
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
