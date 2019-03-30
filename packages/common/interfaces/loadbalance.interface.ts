import { IServer } from "./server.interface";

export interface ILoadbalance {
    chooseLoadbalancer(serviceName: string);

    choose(serviceName: string): IServer;
}
