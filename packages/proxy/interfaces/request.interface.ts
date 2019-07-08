import { IncomingMessage } from 'http';
import { IServer } from '@nestcloud/common';

export interface IRequest extends IncomingMessage {
    proxy?: {
        id: string;
        server?: IServer;
        uri: string;
        service?: string;
        parameters?: { [key: string]: string | number },
        filters?: string[];
    };
}
