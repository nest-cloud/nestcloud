import { ILoadbalancer } from "../loadbalancer.interface";
import { Server } from "../server";

export interface IRule {
    init(loadbalancer: ILoadbalancer);

    choose(): Server;
}