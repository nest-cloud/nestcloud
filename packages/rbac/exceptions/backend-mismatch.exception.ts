export class BackendMismatchException implements Error {
    message: string;
    name: string;
    stack: string;

    constructor(message?: string, stack?: string) {
        this.message = message;
        this.stack = stack;
    }
}
