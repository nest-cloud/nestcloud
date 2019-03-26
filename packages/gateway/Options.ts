export interface Options {
    dependencies?: string[];
    routes?: Route[];
}

export interface Route {
    id: string;
    uri: string;
}
