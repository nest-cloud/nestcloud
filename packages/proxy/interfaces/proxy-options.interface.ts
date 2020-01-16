import { Route } from './route.interface';
import { ExtraOptions } from './extra-options.interface';

export interface ProxyOptions {
    /**
     * One or many of these: BOOT, CONFIG, LOADBALANCE
     */
    inject?: string[];
    routes?: Route[];
    extras?: ExtraOptions;
}
