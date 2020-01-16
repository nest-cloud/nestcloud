import { IServiceServer } from './service-server.interface';
import { IComponent } from './component.interface';

export interface IService extends IComponent {
    watch(service: string, callback: (services: IServiceServer[]) => void): void;

    watchServiceList(callback: (service: string[]) => void): void;

    getServices(): { [service: string]: IServiceServer[] };

    getServiceNames(): string[];

    getServiceServers(service: string, passing?: boolean): IServiceServer[];
}
