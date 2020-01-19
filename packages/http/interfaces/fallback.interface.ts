import { AxiosResponse } from 'axios';

export interface Fallback {
    fallback(): Promise<AxiosResponse | void> | AxiosResponse | void;
}
