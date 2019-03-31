import { Injectable } from "@nestjs/common";
import { Choose } from '@nestcloud/consul-loadbalance';
import { IServer } from '@nestcloud/common';

@Injectable()
export class LoadbalanceService {
    // Every you get server, it will call lb.choose method.
    @Choose('your-service-name')
    private readonly server: IServer;

    // constructor(
    //     @InjectLoadbalance() private readonly lb: Loadbalance,
    // ) {
    // }

    // chooseYourServiceNode() {
    //     try {
    //         const node: IServer = this.lb.choose('your-service-name');
    //         if (!node) {
    //             console.log('No available node');
    //         }
    //     } catch (e) {
    //         if (e instanceof ServiceNotExistException) {
    //             console.log('this service is not exist');
    //         }
    //     }
    //
    // }
}
