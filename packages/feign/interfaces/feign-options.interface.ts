import { IGlobalAxiosConfig } from './global-axios-config.interface';

export interface IFeignOptions {
    dependencies?: string[];
    axiosConfig?: IGlobalAxiosConfig;
}
