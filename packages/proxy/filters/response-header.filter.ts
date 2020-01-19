import { Filter } from '../interfaces/filter.interface';
import { Response } from '../interfaces/response.interface';
import { Request } from '../interfaces/request.interface';
import { IncomingMessage } from 'http';
import { get } from 'lodash';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseHeaderFilter implements Filter {
    response(proxyRes: IncomingMessage, request: Request, response: Response) {
        const parameters = get(request.proxy, 'parameters', {});
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                response.setHeader(key, parameters[key]);
            }
        }
    }
}
