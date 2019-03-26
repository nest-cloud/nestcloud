export class Server {
    id: string;
    service: string;
    name: string;
    address: string;
    port: string;
    zone?: string;
    status: string;

    constructor(address: string, port: string) {
        this.address = address;
        this.port = port;
        this.id = `${ address }:${ port }`;
        this.zone = 'default';
        this.name = this.id;
    }
}
