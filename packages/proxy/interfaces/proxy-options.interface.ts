import { IRoute } from './route.interface';

export interface IProxyOptions {
    dependencies?: string[];
    enableLb?: boolean;
    routes?: IRoute[];
}
