import { get } from 'lodash';
import { Filter } from '../interfaces/filter.interface';
import { Response } from '../interfaces/response.interface';
import { Request } from '../interfaces/request.interface';
import { ProxyErrorException } from '../exceptions/proxy-error.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoadbalanceFilter implements Filter {
    error(error: ProxyErrorException, request: Request, response: Response) {
        try {
            const server = get(request.proxy, 'server');
            if (server && error && error.code === 'ECONNREFUSED') {
                server.state.noteConnectionFailedTime();
            }
        } catch (ignore) {
        }
    }
}
