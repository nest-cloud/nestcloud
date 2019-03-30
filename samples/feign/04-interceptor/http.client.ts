import { Injectable } from "@nestjs/common";
import { Get, Query, Loadbalanced } from '@nestcloud/feign';
import { UseInterceptor } from "@nestcloud/feign";
import { CustomInterceptor } from "./custom.interceptor";

@Injectable()
@Loadbalanced('your-service-name')
@UseInterceptor(CustomInterceptor)
export class HttpClient {
    @Get('/api/data')
    getRemoteData(@Query() query?: any): any {
    }
}
