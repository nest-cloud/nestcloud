export interface IServiceNode {
    id: string;
    service: string;
    name: string;
    address: string;
    port: string;
    zone?: string;
    status: string;
}
