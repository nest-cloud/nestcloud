import { AxiosOptions } from './axios-options.interface';

export interface HttpOptions {
    inject?: string[];
    axios?: AxiosOptions;
}
