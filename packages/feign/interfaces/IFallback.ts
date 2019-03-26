import { AxiosResponse } from 'axios';

export interface IFallback {
    fallback(): Promise<AxiosResponse | void> | AxiosResponse | void;
}
