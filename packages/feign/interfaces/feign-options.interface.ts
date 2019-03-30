import { AxiosRequestConfig } from 'axios';

export interface IFeignOptions {
    dependencies?: string[];
    axiosConfig?: AxiosRequestConfig;
}
