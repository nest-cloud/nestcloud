import { IRoute } from './route.interface';

export interface IProxyOptions {
    dependencies?: string[];
    routes?: IRoute[];
}
