import { IncomingMessage } from "http";
import { IServer } from "../../common";

export interface IRequest extends IncomingMessage {
    gateway?: {
        id: string;
        server?: IServer;
        uri: string;
        service?: string;
        parameters?: { [key: string]: string | number },
        filters?: string[];
    }
}
