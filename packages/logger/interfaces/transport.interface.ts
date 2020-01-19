export interface Transport {
    level: string;
    transport: string;
    datePattern: string;
    label: string;
}

export interface ConsoleTransport extends Transport {
    colorize: boolean;
}

export interface FileTransport extends Transport {
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

export interface DailyRotateFile extends Transport {
    filename: string;
    maxSize: number;
    maxFiles: number;
    zippedArchive: boolean;
    options: any;
}
