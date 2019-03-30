import { ILoadbalancer } from "@nestcloud/common";
import { Server } from "../server";

export interface IRule {
    init(loadbalancer: ILoadbalancer);

    choose(): Server;
}
