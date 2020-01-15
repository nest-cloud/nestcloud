import { ServiceOptions } from './service-options.interface';
import { Rule } from './rule.interface';

export interface LoadbalanceOptions {
    rule?: string;
    services?: ServiceOptions[];
    rules?: (Rule | Function)[];
}

export interface AsyncLoadbalanceOptions {
    inject?: string[];
}
