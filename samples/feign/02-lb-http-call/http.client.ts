import { Injectable } from "@nestjs/common";
import { Get, Query, Loadbalanced } from '@nestcloud/feign';

@Injectable()
@Loadbalanced('your-service-name')
export class HttpClient {
    @Get('/api/data')
    getRemoteData(@Query() query?: any): any {
    }
}
