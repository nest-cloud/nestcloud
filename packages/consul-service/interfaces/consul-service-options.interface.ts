import { LoggerService } from '@nestjs/common';
import { IConsulServiceCheck } from './consul-service-check.interface';

export interface IConsulServiceOptions {
    dependencies?: string[];
    discoveryHost?: string;
    healthCheck?: IConsulServiceCheck;
    maxRetry?: number;
    retryInterval?: number;
    service?: {
        id?: string;
        name?: string;
        port?: number;
        includes?: string[];
    };
    logger?: boolean | LoggerService;
}
