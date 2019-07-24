import * as mkdirp from 'mkdirp';
import * as fs from 'fs';
import * as winston from 'winston';
import { LoggerInstance } from 'winston';
import 'winston-daily-rotate-file';
import { ILoggerOptions } from './interfaces/logger-options.interface';
import { IConsoleTransport, IFileTransport, IDailyRotateFile } from './interfaces/transport.interface';
import moment = require('moment');
import { TransportInstance } from 'winston';
import { Boot } from '@nestcloud/boot';
import { resolve } from 'path';

export class Logger {
    private readonly AVAILABLE_TRANSPORTS = ['console', 'file', 'dailyRotateFile'];
    private readonly path: string;
    private readonly options: ILoggerOptions;
    private logger: LoggerInstance;

    constructor(options: ILoggerOptions) {
        if (options.path && options.filename) {
            const filePath = resolve(options.path, options.filename);
            if (fs.existsSync(filePath)) {
                const boot = new Boot(options.path, options.filename);
                this.options = boot.get<ILoggerOptions>('logger', {
                    transports: [],
                    level: 'info',
                    path: __dirname,
                });
            } else {
                this.options = { transports: [], level: 'info', path: __dirname };
            }
        } else {
            this.options = options;
        }

        this.path = options.path;
        this.init();
    }

    getLogger(): LoggerInstance {
        return this.logger;
    }

    private init() {
        this.logger = new winston.Logger({
            level: this.options.level,
            transports: this.generateTransports(),
        });
    }

    private mkdirPath(filename) {
        if (filename.charAt(0) !== '/') {
            filename = resolve(this.path, filename);
        }

        const last = filename.lastIndexOf('/');
        const path = filename.substring(0, last);
        if (!fs.existsSync(path)) {
            mkdirp.sync(path);
        }

        return filename;
    }

    private generateTransports(): TransportInstance[] {
        const transports = this.options.transports
            .filter(item => this.AVAILABLE_TRANSPORTS.includes(item.transport))
            .map(item => {
                if (item.transport === 'console') {
                    const config = item as IConsoleTransport;
                    return new winston.transports.Console({
                        colorize: config.colorize,
                        label: config.label,
                        timestamp: () =>
                            moment(new Date().getTime()).format(config.datePattern || 'YYYY-MM-DD h:mm:ss'),
                    });
                } else if (item.transport === 'file') {
                    const config = item as IFileTransport;

                    return new winston.transports.File({
                        name: config.name,
                        level: config.level,
                        filename: this.mkdirPath(config.filename),
                        maxsize: config.maxSize,
                        label: config.label,
                        maxFiles: config.maxFiles,
                        json: config.json,
                        eol: config.eol,
                        zippedArchive: config.zippedArchive,
                        silent: config.silent,
                        colorize: config.colorize,
                        prettyPrint: config.prettyPrint,
                        logstash: config.logstash,
                        depth: config.depth,
                        tailable: config.tailable,
                        maxRetries: config.maxRetries,
                        options: config.options,
                        timestamp: () =>
                            moment(new Date().getTime()).format(config.datePattern || 'YYYY-MM-DD h:mm:ss'),
                    });
                } else if (item.transport === 'dailyRotateFile') {
                    const config = item as IDailyRotateFile;
                    return new winston.transports.DailyRotateFile({
                        filename: this.mkdirPath(config.filename),
                        datePattern: config.datePattern || 'YYYY-MM-DD h:mm:ss',
                        zippedArchive: config.zippedArchive,
                        maxSize: config.maxSize,
                        maxFiles: config.maxFiles,
                        options: config.options,
                    });
                }
            });

        if (transports.length === 0) {
            transports.push(
                new winston.transports.Console({
                    colorize: true,
                    label: '',
                    timestamp: () => moment(new Date().getTime()).format('YYYY-MM-DD h:mm:ss'),
                }),
            );
        }

        return transports;
    }
}
