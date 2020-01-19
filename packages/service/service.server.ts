import { IServiceServer } from '@nestcloud/common';

export class ServiceServer implements IServiceServer {
    id: string;
    service: string;
    name: string;
    address: string;
    port: string;
    zone?: string;
    status: string;
    tags?: string[];

    constructor(address: string, port: string) {
        this.address = address;
        this.port = port;
        this.id = `${address}:${port}`;
        this.zone = 'default';
        this.name = this.id;
    }
}
