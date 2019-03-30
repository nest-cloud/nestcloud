export class ConsulConfigSyncException implements Error {
    message: string;
    name: string = 'ConsulConfigSyncException';
    stack: string;

    constructor(message: string, stack?: string) {
        this.message = message;
        this.stack = stack;
    }
}
