import { IRuleOptions } from './rule-options.interface';

export interface ILoadbalanceOptions {
    customRulePath?: string;
    dependencies?: string[];
    ruleCls?: any;
    rules?: IRuleOptions[];
}
