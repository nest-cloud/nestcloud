import { IConsoleTransport, IDailyRotateFile, IFileTransport } from "./transport.interface";

export interface ILoggerOptions {
    path: string;
    filename?: string;
    level?: string;
    transports?: (IConsoleTransport | IFileTransport | IDailyRotateFile)[];
}
