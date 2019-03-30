export class ConsulConfigInitException implements Error {
    message: string;
    name: string = 'ConsulConfigInitException';
    stack: string;

    constructor(message: string, stack?: string) {
        this.message = message;
        this.stack = stack;
    }
}
