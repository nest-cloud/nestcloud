export interface Route {
    id: string;
    uri: string;
    filters?: RouteFilter[];
}

export interface RouteFilter {
    name: string;
    parameters?: { [key: string]: any };
}
