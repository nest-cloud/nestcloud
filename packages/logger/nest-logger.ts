import { LoggerService } from '@nestjs/common';
import { Logger } from "./Logger";
import { ILoggerOptions } from "./interfaces/logger-options.interface";
import { Cache, NEST_LOGGER } from "@nestcloud/common";

export class NestLogger implements LoggerService {
    private readonly logger;

    constructor(options: ILoggerOptions) {
        this.logger = new Logger(options).getLogger();
        Cache.getInstance(NEST_LOGGER).set('logger', this.logger);
    }

    error(message: any, trace?: string, context?: string): any {
        this.logger.error(message, trace);
    }

    log(message: any, context?: string): any {
        this.logger.info(message);
    }

    warn(message: any, context?: string): any {
        this.logger.warn(message);
    }

    debug(message: any, context?: string): any {
        this.logger.debug(message);
    }

    verbose(message: any, context?: string): any {
        this.logger.verbose(message);
    }
}
