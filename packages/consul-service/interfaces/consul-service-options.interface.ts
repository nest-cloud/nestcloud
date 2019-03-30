import { LoggerService } from "@nestjs/common";
import { IConsulServiceCheck } from "./consul-service-check.interface";

export interface IConsulServiceOptions {
    dependencies?: string[];
    serviceId?: string;
    serviceName?: string;
    port?: number;
    consul?: {
        discoveryHost?: string;
        healthCheck?: IConsulServiceCheck;
        maxRetry?: number;
        retryInterval?: number;
        service: { includes: string[] }
    };
    logger?: boolean | LoggerService;
}
