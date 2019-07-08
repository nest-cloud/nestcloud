import { get } from 'lodash';
import { IFilter } from '../interfaces/filter.interface';
import { IResponse } from '../interfaces/response.interface';
import { IRequest } from '../interfaces/request.interface';
import { ProxyErrorException } from '../exceptions/proxy-error.exception';

export class LoadbalanceFilter implements IFilter {
    getName(): string {
        return 'LoadbalanceFilter';
    }

    error(error: ProxyErrorException, request: IRequest, response: IResponse) {
        try {
            const server = get(request.proxy, 'server');
            if (server && error && error.code === 'ECONNREFUSED') {
                server.state.noteConnectionFailedTime();
            }
        } catch (ignore) {
        }
    }
}
