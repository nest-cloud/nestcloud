export class ConfigSyncException implements Error {
    message: string;
    name: string = 'ConfigSyncException';
    stack: string;

    constructor(message: string, stack?: string) {
        this.message = message;
        this.stack = stack;
    }
}
