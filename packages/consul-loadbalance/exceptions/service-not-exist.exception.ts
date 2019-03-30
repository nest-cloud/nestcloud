export class ServiceNotExistException implements Error {
    message: string;
    name: string = 'ServiceNotExistException';
    stack: string;

    constructor(message?: string, stack?: string) {
        this.message = message;
        this.stack = stack;
    }
}
