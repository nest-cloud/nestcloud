import { ExtraOptions } from './extra-options.interface';

export interface Route {
    id: string;
    uri: string;
    extras?: ExtraOptions;
    filters?: RouteFilter[];
}

export interface RouteFilter {
    name: string;
    parameters?: { [key: string]: any };
}
