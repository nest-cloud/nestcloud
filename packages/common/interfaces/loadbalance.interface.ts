import { IServer } from './server.interface';
import { IComponent } from './component.interface';

export interface ILoadbalance extends IComponent {
    chooseLoadbalancer(serviceName: string);

    choose(serviceName: string): IServer;
}
