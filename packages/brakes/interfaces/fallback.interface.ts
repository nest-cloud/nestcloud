import { AxiosResponse } from 'axios';
import { BrakesOptions } from './brakes-options.interface';

export interface Fallback {
    config(): Promise<BrakesOptions> | BrakesOptions;

    fallback(): Promise<AxiosResponse | void> | AxiosResponse | void;

    healthCheck(): Promise<void>;
}
