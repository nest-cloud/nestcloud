import { Injectable } from "@nestjs/common";
import { Get, Loadbalanced } from '@nestcloud/feign';

@Injectable()
@Loadbalanced('your-service-name')
export class HealthClient {
    @Get('/health')
    checkHealth() {
    }
}
