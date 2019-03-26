import { AxiosRequestConfig } from 'axios';
import { BrakesConfig } from "./BrakeOptions";

export interface FeignOptions {
    dependencies?: string[];
    axiosConfig?: AxiosRequestConfig;
    brakesConfig?: BrakesConfig;
}
