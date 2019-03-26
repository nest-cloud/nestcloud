export class BrakeException implements Error {
    message: string;
    name: string = 'BrakeException';
    stack: string;

    constructor(messge: string, stack?: string) {
        this.message = messge;
        this.stack = stack;
    }
}
