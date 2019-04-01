import { Logger as ITypeormLogger, QueryRunner } from 'typeorm';
import { LoggerInstance } from 'winston';

export class TypeormLogger implements ITypeormLogger {
    constructor(private readonly logger: LoggerInstance) {}

    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        this.logger.log(level, message);
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.logger.debug(message);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.debug(query, JSON.stringify(parameters));
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.error(error, query, JSON.stringify(parameters));
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.warn(query, JSON.stringify(parameters), `time used: ${time}`);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.logger.debug(message);
    }
}
