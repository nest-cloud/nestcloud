import { ServiceOptions } from './service-options.interface';
import { Rule } from './rule.interface';

export interface LoadbalanceOptions {
    inject?: string[];
    rule?: string;
    services?: ServiceOptions[];
    rules?: (Rule | Function)[];
}
