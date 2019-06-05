import { LoggerService } from '@nestjs/common';

export interface IGlobalConfig {
    logger?: LoggerService | boolean | string,
    maxRetry?: number;
    retryInterval?: number;
    enable?: boolean;
    waiting?: boolean;
}
