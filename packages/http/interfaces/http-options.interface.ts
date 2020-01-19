import { AxiosBasicCredentials, AxiosProxyConfig } from 'axios';

export interface HttpOptions {
    baseURL?: string;
    headers?: { [key: string]: any };
    timeout?: number;
    withCredentials?: boolean;
    auth?: AxiosBasicCredentials;
    responseType?: string;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    maxContentLength?: number;
    maxRedirects?: number;
    proxy?: AxiosProxyConfig | false;
    service?: string;
}

export interface AsyncHttpOptions {
    inject?: string[];
}
