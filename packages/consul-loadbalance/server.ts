import { ServerState } from "./stats/server.state";

export class Server {
    id: string;
    name: string;
    address: string;
    port: string;
    zone?: string;
    state: ServerState;

    constructor(address: string, port: string) {
        this.address = address;
        this.port = port;
        this.id = `${address}:${port}`;
        this.zone = 'default';
        this.name = this.id;
    }
}