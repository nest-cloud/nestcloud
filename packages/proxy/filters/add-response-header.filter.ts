import { IFilter } from '../interfaces/filter.interface';
import { IResponse } from '../interfaces/response.interface';
import { IRequest } from '../interfaces/request.interface';
import { IncomingMessage } from 'http';
import { get } from 'lodash';

export class AddResponseHeaderFilter implements IFilter {
    getName(): string {
        return 'AddResponseHeaderFilter';
    }

    response(proxyRes: IncomingMessage, request: IRequest, response: IResponse) {
        const parameters = get(request.proxy, 'parameters', {});
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                response.setHeader(key, parameters[key]);
            }
        }
    }
}
