import { Filter } from '../interfaces/filter.interface';
import { ProxyErrorException } from '../exceptions/proxy-error.exception';
import { Response } from '../interfaces/response.interface';
import { Request } from '../interfaces/request.interface';
import { Injectable } from '@nestjs/common';
import { ERROR_RESPONSE_FILTER } from '../proxy.constants';

@Injectable()
export class ErrorResponseFilter implements Filter {
    getName(): string {
        return ERROR_RESPONSE_FILTER;
    }

    error(error: ProxyErrorException, request: Request, response: Response) {
        try {
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = 500;
        } catch (ignore) {
        }

        response.end(JSON.stringify({ message: error.message, status: 500 }));
    }
}
