import { IFilter } from "../interfaces/filter.interface";
import { ProxyErrorException } from "../exceptions/proxy-error.exception";
import { IResponse } from '../interfaces/response.interface';
import { IRequest } from '../interfaces/request.interface';

export class ErrorResponseFilter implements IFilter {
    getName(): string {
        return "ErrorResponseFilter";
    }

    error(error: ProxyErrorException, request: IRequest, response: IResponse) {
        try {
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = 500;
        } catch (ignore) {
        }

        response.end(JSON.stringify({ message: error.message, status: 500 }));
    }
}
