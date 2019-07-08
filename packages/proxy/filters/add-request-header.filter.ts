import { IFilter } from '../interfaces/filter.interface';
import { IResponse } from '../interfaces/response.interface';
import { IRequest } from '../interfaces/request.interface';
import { ClientRequest } from 'http';
import { get } from 'lodash';

export class AddRequestHeaderFilter implements IFilter {
    getName(): string {
        return 'AddRequestHeaderFilter';
    }

    request(proxyReq: ClientRequest, request: IRequest, response: IResponse) {
        const parameters = get(request.proxy, 'parameters', {});
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                proxyReq.setHeader(key, parameters[key]);
            }
        }
    }
}
