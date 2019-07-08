import { ClientRequest, IncomingMessage } from 'http';
import { ProxyErrorException } from "../exceptions/proxy-error.exception";
import { IRequest } from "./request.interface";
import { IResponse } from "./response.interface";

export interface IFilter {
    getName(): string;

    before?(request: IRequest, response: IResponse): boolean | Promise<boolean>;

    request?(proxyReq: ClientRequest, request: IRequest, response: IResponse);

    response?(proxyRes: IncomingMessage, request: IRequest, response: IResponse);

    error?(error: ProxyErrorException, request: IRequest, response: IResponse);
}
