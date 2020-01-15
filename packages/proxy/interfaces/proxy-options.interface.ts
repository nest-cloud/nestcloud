import { Route } from './route.interface';
import { ExtraOptions } from './extra-options.interface';

export interface ProxyOptions {
    routes?: Route[];
    extras?: ExtraOptions;
}

export interface AsyncProxyOptions {
    inject?: string[];
}
