import { Injectable } from "@nestjs/common";
import { InjectLogger } from '@nestcloud/logger';
import { ILogger } from '@nestcloud/common';

@Injectable()
export class LoggerService {
    constructor(
        @InjectLogger() private readonly logger: ILogger,
    ) {
    }

    log() {
        this.logger.info('hello logger');
    }
}
