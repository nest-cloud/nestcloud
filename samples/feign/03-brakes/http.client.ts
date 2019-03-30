import { Injectable } from "@nestjs/common";
import { Get, Query, Loadbalanced } from '@nestcloud/feign';
import { UseBrakes, UseFallback, UseHeathCheck } from "@nestcloud/feign";
import { CustomFallback } from "./custom.fallback";
import { CustomCheck } from "./custom.check";

@Injectable()
@Loadbalanced('your-service-name')
@UseBrakes({
    statInterval: 2500,
    threshold: 0.5,
    circuitDuration: 15000,
    timeout: 250,
    healthCheck: true,
})
@UseFallback(CustomFallback)
@UseHeathCheck(CustomCheck)
export class HttpClient {
    @Get('/api/data')
    getRemoteData(@Query() query?: any): any {
    }
}
