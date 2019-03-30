import { Injectable } from "@nestjs/common";
import { InjectConsulService, ConsulService } from '@nestcloud/consul-service';
import { IServiceNode } from '@nestcloud/common';

@Injectable()
export class DiscoveryService {
    constructor(
        @InjectConsulService() private readonly consulService: ConsulService,
    ) {
    }

    getYourServiceList() {
        const serviceList: string[] = this.consulService.getServiceNames();
    }

    watchYourServiceList() {
        this.consulService.watchServiceList((services: string[]) => {
            console.log('your service list: ', services);
        })
    }

    getYourServiceNodes() {
        const serviceNodes: IServiceNode[] = this.consulService.getServiceNodes('your-service-name');
    }

    watchYourServiceNodes() {
        this.consulService.watch('your-service-name', (nodes: IServiceNode[]) => {
            console.log('your service nodes: ', nodes);
        })
    }
}
