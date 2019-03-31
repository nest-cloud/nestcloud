import { IServiceNode } from "./service-node.interface";
import { IComponent } from "./component.interface";

export interface IConsulService extends IComponent {
    watch(service: string, callback: (services: IServiceNode[]) => void): void;

    watchServiceList(callback: (service: string[]) => void): void;

    getServices(): { [service: string]: IServiceNode[] };

    getServiceNames(): string[];

    getServiceNodes(service: string, passing?: boolean): IServiceNode[];
}
