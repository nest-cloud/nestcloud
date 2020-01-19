import { ClientRequest, IncomingMessage } from 'http';
import { ProxyErrorException } from '../exceptions/proxy-error.exception';
import { Request } from './request.interface';
import { Response } from './response.interface';

export interface Filter {
    before?(request: Request, response: Response): boolean | Promise<boolean>;

    request?(proxyReq: ClientRequest, request: Request, response: Response);

    response?(proxyRes: IncomingMessage, request: Request, response: Response);

    error?(error: ProxyErrorException, request: Request, response: Response);
}
