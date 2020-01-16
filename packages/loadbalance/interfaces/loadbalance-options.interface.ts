import { ServiceOptions } from './service-options.interface';

export interface LoadbalanceOptions {
    rule?: string;
    services?: ServiceOptions[];
}

export interface AsyncLoadbalanceOptions {
    inject?: string[];
}
