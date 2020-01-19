import { Interceptor } from '../../../../packages/http';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestInterceptor implements Interceptor {
    onRequest(request: AxiosRequestConfig): AxiosRequestConfig {
        request.headers['test-request-header'] = 'test-request-header';
        return request;
    }

    onResponse(response: AxiosResponse<any>): AxiosResponse<any> {
        response.headers['test-response-header'] = 'test-response-header';
        return response;
    }
}
