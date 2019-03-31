import { Server } from '../server';
import { IRule } from './rule.interface';

export interface ILoadbalanerOptions {
    id: string;
    name?: string;
    servers?: Server[];
    ruleCls?: IRule | Function | string;
    customRulePath?: string;
}
