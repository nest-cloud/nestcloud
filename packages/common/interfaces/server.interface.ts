import { IServerState } from './server-state.interface';

export interface IServer {
    id: string;
    name: string;
    address: string;
    port: string;
    zone?: string;
    state: IServerState;
}
