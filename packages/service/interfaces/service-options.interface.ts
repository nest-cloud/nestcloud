import { ServiceCheck } from './service-check.interface';

export interface ServiceOptions {
    inject?: string[];
    discoveryHost?: string;
    healthCheck?: ServiceCheck;
    maxRetry?: number;
    retryInterval?: number;
    id?: string;
    name?: string;
    port?: number;
    includes?: string[];
    tags?: string[];
}
