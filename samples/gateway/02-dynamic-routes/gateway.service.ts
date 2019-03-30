import { Injectable } from "@nestjs/common";
import { InjectGateway, Gateway } from '@nestcloud/gateway';

@Injectable()
export class GatewayService {
    constructor(
        @InjectGateway() private readonly gateway: Gateway,
    ) {
    }

    updateRoutes() {
        this.gateway.updateRoutes([{
            id: 'test',
            uri: 'lb://your-service-name',
        }]);
    }
}
