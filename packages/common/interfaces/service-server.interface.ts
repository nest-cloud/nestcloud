export interface IServiceServer {
    id: string;
    service: string;
    name: string;
    address: string;
    port: string;
    tags?: string[];
    zone?: string;
    status: string;
}
