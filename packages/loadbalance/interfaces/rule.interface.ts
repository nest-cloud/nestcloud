import { ILoadbalancer, IServer } from '@nestcloud/common';

export interface Rule {
    init(loadbalancer: ILoadbalancer);

    choose(): IServer;
}
