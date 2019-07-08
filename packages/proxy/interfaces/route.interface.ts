export interface IRoute {
    id: string;
    uri: string;
    filters?: IRouteFilter[];
}

export interface IRouteFilter {
    name: string;
    parameters?: { [key: string]: any };
}
