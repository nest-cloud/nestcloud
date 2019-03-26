export interface Options {
    dependencies?: string[];
    ruleCls?: any;
    rules?: RuleOptions[];
}

export interface RuleOptions {
    service: string;
    ruleCls: any;
}
