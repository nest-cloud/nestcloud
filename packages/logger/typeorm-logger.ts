import { Logger } from '@nestjs/common';
import { Logger as ITypeormLogger, QueryRunner } from 'typeorm';

export class TypeormLogger implements ITypeormLogger {
    private readonly logger = new Logger('TypeOrmLogger');

    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        this.logger.log(`[${level}]:${message}`);
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.logger.debug(message);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.debug(`${query} ${JSON.stringify(parameters)}`);
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.error(`${error} ${query} ${JSON.stringify(parameters)}`);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.warn(`[Slow Query Warning] [${time}] ${query} ${JSON.stringify(parameters)}`);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.logger.debug(message);
    }
}
