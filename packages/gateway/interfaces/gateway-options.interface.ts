import { IRoute } from './route.interface';

export interface IGatewayOptions {
    dependencies?: string[];
    routes?: IRoute[];
}
