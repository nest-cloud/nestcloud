import { ConsoleTransport, DailyRotateFile, FileTransport } from './transport.interface';

export interface LoggerOptions {
    filePath?: string;
    level?: string;
    transports?: (ConsoleTransport | FileTransport | DailyRotateFile)[];
}
