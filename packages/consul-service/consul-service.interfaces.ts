import { LoggerService } from '@nestjs/common';

export interface Options {
    web: {
        serviceId?: string;
        serviceName: string;
        port: number;
    };
    consul: {
        discoveryHost?: string;
        healthCheck?: Check;
        maxRetry?: number;
        retryInterval?: number;
    };
    logger: boolean | LoggerService;
}

export interface RegisterOptions {
    dependencies?: string[];
    serviceId?: string;
    serviceName?: string;
    port?: number;
    consul?: {
        discoveryHost?: string;
        healthCheck?: Check;
        maxRetry?: number;
        retryInterval?: number;
    };
    logger?: boolean | LoggerService;
}

export interface Check {
    http?: string;
    tcp?: string;
    script?: string;
    dockercontainerid?: string;
    shell?: string;
    interval?: string;
    timeout?: string;
    ttl?: string;
    notes?: string;
    status?: string;
    deregistercriticalserviceafter?: string;
}
