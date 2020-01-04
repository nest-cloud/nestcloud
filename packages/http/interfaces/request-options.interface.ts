import { AxiosRequestConfig } from 'axios';

export interface RequestOptions extends AxiosRequestConfig {
    service?: string;
}
