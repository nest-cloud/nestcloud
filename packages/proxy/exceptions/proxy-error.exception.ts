export class ProxyErrorException implements Error {
    message: string;
    name: string = 'ProxyErrorException';
    stack: string;
    code: string;

    constructor(message?: string, stack?: string) {
        this.message = message;
        this.stack = stack;
    }
}
