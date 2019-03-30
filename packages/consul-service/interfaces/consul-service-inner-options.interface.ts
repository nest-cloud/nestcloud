import { LoggerService } from "@nestjs/common";
import { IConsulServiceCheck } from "./consul-service-check.interface";

export interface IConsulServiceInnerOptions {
    web: {
        serviceId?: string;
        serviceName: string;
        port: number;
    };
    consul: {
        discoveryHost?: string;
        healthCheck?: IConsulServiceCheck;
        maxRetry?: number;
        retryInterval?: number;
        service: { includes: string[] }
    };
    logger: boolean | LoggerService;
}
