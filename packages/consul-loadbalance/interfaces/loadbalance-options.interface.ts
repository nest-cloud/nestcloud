import { IRuleOptions } from "./rule-options.interface";

export interface ILoadbalanceOptions {
    dependencies?: string[];
    ruleCls?: any;
    rules?: IRuleOptions[];
}
