import { Route } from './route.interface';
import { ExtraOptions } from './extra-options.interface';

export interface ProxyOptions {
    inject?: string[];
    routes?: Route[];
    extras?: ExtraOptions;
}
