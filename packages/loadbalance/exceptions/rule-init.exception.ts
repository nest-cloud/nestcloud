export class RuleInitException implements Error {
    message: string;
    name: string = 'InitCustomRuleException';
    stack: string;

    constructor(message?: string, stack?: string) {
        this.message = message;
        this.stack = stack;
    }
}
