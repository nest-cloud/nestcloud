import { Server } from './server';

export interface ILoadbalancer {
    servers: Server[];

    chooseService(): Server;
}