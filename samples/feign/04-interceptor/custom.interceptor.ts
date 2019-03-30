import { IInterceptor } from "@nestcloud/feign";
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig, AxiosResponse } from "axios";

@Injectable()
export class CustomInterceptor implements IInterceptor {
    onRequest(request: AxiosRequestConfig): AxiosRequestConfig {
        return request;
    }

    onRequestError(error: any): any {
        return Promise.reject(error);
    }

    onResponse(response: AxiosResponse): AxiosResponse {
        return response;
    }

    onResponseError(error: any): any {
        return Promise.reject(error);
    }

}
