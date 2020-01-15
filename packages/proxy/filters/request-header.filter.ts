import { Filter } from '../interfaces/filter.interface';
import { Response } from '../interfaces/response.interface';
import { Request } from '../interfaces/request.interface';
import { ClientRequest } from 'http';
import { get } from 'lodash';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestHeaderFilter implements Filter {
    request(proxyReq: ClientRequest, request: Request, response: Response) {
        const parameters = get(request.proxy, 'parameters', {});
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                proxyReq.setHeader(key, parameters[key]);
            }
        }
    }
}
