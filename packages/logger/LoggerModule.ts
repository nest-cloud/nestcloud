import { Module, DynamicModule, Global } from '@nestjs/common';
import {
    Cache,
    NEST_LOGGER_PROVIDER,
    NEST_LOGGER,
    NEST_TYPEORM_LOGGER_PROVIDER
} from "@nestcloud/common";
import { LoggerInstance } from 'winston';
import { TypeormLogger } from "./TypeormLogger";

@Global()
@Module({})
export class LoggerModule {
    static register(): DynamicModule {
        const inject = [];

        const loggerProvider = {
            provide: NEST_LOGGER_PROVIDER,
            useFactory: (): LoggerInstance => {
                return Cache.getInstance(NEST_LOGGER).get('logger');
            },
            inject
        };

        const typeormLoggerProvider = {
            provide: NEST_TYPEORM_LOGGER_PROVIDER,
            useFactory: (logger: LoggerInstance) => {
                return new TypeormLogger(logger);
            },
            inject: [NEST_LOGGER_PROVIDER]
        };

        return {
            module: LoggerModule,
            providers: [loggerProvider, typeormLoggerProvider],
            exports: [loggerProvider, typeormLoggerProvider],
        };
    }
}
