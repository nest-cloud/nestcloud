export interface ITransport {
    level: string;
    transport: string;
    datePattern: string;
    label: string;
}

export interface IConsoleTransport extends ITransport {
    colorize: boolean;
}

export interface IFileTransport extends ITransport {
    name: string;
    filename: string;
    maxSize: number;
    maxFiles: number;
    json: boolean;
    eol: string;
    zippedArchive: boolean;
    silent: boolean;
    colorize: boolean;
    prettyPrint: boolean;
    logstash: boolean;
    depth: number;
    showLevel: boolean;
    tailable: boolean;
    maxRetries: number;
    options: any;
}

export interface IDailyRotateFile extends ITransport {
    filename: string;
    maxSize: number;
    maxFiles: number;
    zippedArchive: boolean;
    options: any;
}
