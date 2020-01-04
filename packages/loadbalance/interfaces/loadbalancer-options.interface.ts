import { Server } from '../server';
import { Rule } from './rule.interface';

export interface LoadbalancerOptions {
    id: string;
    name?: string;
    servers?: Server[];
    rule?: Rule;
}
