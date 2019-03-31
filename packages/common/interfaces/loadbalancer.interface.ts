import { IServer } from './server.interface';

export interface ILoadbalancer {
    servers: IServer[];

    chooseService(): IServer;
}
