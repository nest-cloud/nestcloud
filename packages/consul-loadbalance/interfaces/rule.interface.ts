import { ILoadbalancer, IServer } from "@nestcloud/common";

export interface IRule {
    init(loadbalancer: ILoadbalancer);

    choose(): IServer;
}
