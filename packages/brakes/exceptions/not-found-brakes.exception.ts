export class NotFoundBrakesException implements Error {
    message: string;
    name: string = 'NotFoundBrakesException';
    stack: string;

    constructor(message?: string, stack?: string) {
        this.message = message;
        this.stack = stack;
    }
}
