import { IServiceCheck } from './service-check.interface';

export interface IServiceOptions {
    dependencies?: string[];
    discoveryHost?: string;
    healthCheck?: IServiceCheck;
    maxRetry?: number;
    retryInterval?: number;
    id?: string;
    name?: string;
    port?: number;
    includes?: string[];
    tags?: string[];
}
