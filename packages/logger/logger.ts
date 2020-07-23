import * as fs from 'fs';
import * as winston from 'winston';
import { LoggerInstance } from 'winston';
import 'winston-daily-rotate-file';
import { LoggerOptions } from './interfaces/logger-options.interface';
import { Boot } from '@nestcloud/boot';
import { dirname } from 'path';
import { TransportBuilder } from './transport.builder';

export class Logger {
    private readonly basePath: string;
    private readonly options: LoggerOptions;
    private logger: LoggerInstance;

    constructor(options: LoggerOptions) {
        if (options.filePath) {
            if (fs.existsSync(options.filePath)) {
                const boot = new Boot({ filePath: options.filePath });
                this.options = boot.get<LoggerOptions>('logger', {
                    transports: [],
                    level: 'info',
                    filePath: __dirname,
                });
            } else {
                this.options = { transports: [], level: 'info', filePath: __dirname };
            }
        } else {
            this.options = options;
        }

        this.basePath = options.filePath ? dirname(options.filePath) : '';
        this.init();
    }

    getLogger(): LoggerInstance {
        return this.logger;
    }

    private init() {
        const builder = new TransportBuilder(this.basePath);
        this.logger = new winston.Logger({
            level: this.options.level,
            transports: builder.build(this.options.transports),
        });
    }
}
