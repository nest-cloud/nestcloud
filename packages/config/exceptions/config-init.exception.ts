export class ConfigInitException implements Error {
    message: string;
    name: string = 'ConfigInitException';
    stack: string;

    constructor(message: string, stack?: string) {
        this.message = message;
        this.stack = stack;
    }
}
