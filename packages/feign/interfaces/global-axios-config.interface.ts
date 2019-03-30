import { AxiosBasicCredentials, AxiosProxyConfig } from "axios";

export interface IGlobalAxiosConfig {
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
}
