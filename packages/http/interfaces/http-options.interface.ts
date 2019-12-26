import { IGlobalAxiosConfig } from './global-axios-config.interface';

export interface IHttpOptions {
    dependencies?: string[];
    axiosConfig?: IGlobalAxiosConfig;
}
