import { Injectable } from '@nestjs/common';
import {
    Body,
    Get, Header,
    Param, Post,
    Query,
    Response,
    ResponseHeader,
    SetBody, SetHeader,
    SetParam,
    SetQuery,
} from '../../../../packages/http';

@Injectable()
export class TestClient {
    @Get('https://api.jisuapi.com/ip/location')
    requestForBodyTest(): any {
    }

    @Get('https://api.jisuapi.com/ip/location')
    @Response()
    requestForResponseTest(): any {
    }

    @Get('https://api.jisuapi.com/ip/location')
    @ResponseHeader()
    requestForHeaderTest(): any {
    }

    @Post('https://api.jisuapi.com/ip/:uriParam')
    @Response()
    requestForParamsTest(
        @Param('uriParam') params,
        @Query('appKey') appKey,
        @Body('data') data,
        @Header('test-header') header,
    ): any {
    }

    @Post('https://api.jisuapi.com/ip/:uriParam')
    @Response()
    @SetParam('uriParam', 'location')
    @SetQuery('appKey', 'appKey')
    @SetBody('data', 'data')
    @SetHeader('test-header', 'header')
    requestForConstParamsTest(): any {
    }
}
