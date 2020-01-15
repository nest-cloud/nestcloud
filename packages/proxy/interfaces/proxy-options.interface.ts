import { Route } from './route.interface';
import { ExtraOptions } from './extra-options.interface';
import { Filter } from './filter.interface';

export interface ProxyOptions {
    inject?: string[];
    routes?: Route[];
    extras?: ExtraOptions;
    filters?: Function | Filter;
}
