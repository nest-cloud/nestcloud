import { IFilter } from "../interfaces/filter.interface";
import { IResponse } from "../interfaces/response.interface";
import { IRequest } from "../interfaces/request.interface";
import { ClientRequest, IncomingMessage } from "http";
import { get } from 'lodash';

export class AddResponseHeaderFilter implements IFilter {
    getName(): string {
        return 'AddResponseHeaderFilter';
    }

    request(proxyReq: ClientRequest, request: IRequest, response: IResponse) {
        const parameters = get(request.gateway, 'parameters', {});
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                proxyReq.setHeader(key, parameters[key]);
            }
        }
    }

    response(proxyRes: IncomingMessage, request: IRequest, response: IResponse) {
        const parameters = get(request.gateway, 'parameters', {});
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                response.setHeader(key, parameters[key]);
            }
        }
    }
}
