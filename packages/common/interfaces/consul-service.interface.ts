import { IServiceNode } from "./service-node.interface";

export interface IConsulService {
    watch(service: string, callback: (services: IServiceNode[]) => void): void;

    watchServiceList(callback: (service: string[]) => void): void;

    getServices(): { [service: string]: IServiceNode[] };

    getServiceNames(): string[];

    getServiceNodes(service: string, passing?: boolean): IServiceNode[];
}
