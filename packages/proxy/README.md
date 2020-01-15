
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Proxy

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

The proxy module for nestcloud.

## Installation

```bash
$ npm install --save @nestcloud/proxy
```

## Notification

You should not use body parser middleware when use this module or the post request will hang.

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ProxyModule } from "@nestcloud/proxy";
import { BOOT } from '@nestcloud/common';

@Module({
    imports: [
        ProxyModule.forRootAsync({ inject: [BOOT] }),
    ]
})
export class AppModule {
}
```

### Configurations

```yaml
proxy:
  routes:
    - id: user
      uri: lb://nestcloud-user-service
      filters:
       - name: RequestHeaderFilter
         paramters: 
           request-id: 123
       - name: ResponseHeaderFilter
         parameters:
           request-id: 456
    - id: pay
      uri: https://example.com/pay
```

## Usage

```typescript
import { All, Controller, Param, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';
import { Proxy, InjectProxy } from "@nestcloud/proxy";

@Controller('/proxy/:service')
export class ProxyController {
    constructor(
        @InjectProxy() private readonly proxy: Proxy,
    ) {
    }

    @All()
    do(@Req() req: Request, @Res() res: Response, @Param('service') id) {
        this.proxy.forward(req, res, id);
    }
}
```

### Filters

There are `RequestHeaderFilter` and `ResponseHeaderFilter` internal filters.
If you want to use your custom filter, please implement `Filter` interface.

```typescript
import { ClientRequest, IncomingMessage } from 'http';
import { Filter, Request, Response, ProxyErrorException } from '@nestcloud/proxy';

class CustomFilter implements Filter {
    before(request: Request, response: Response): boolean | Promise<boolean> {
        return undefined;
    }

    error(error: ProxyErrorException, request: Request, response: Response) {
    }

    request(proxyReq: ClientRequest, request: Request, response: Response) {
    }

    response(proxyRes: IncomingMessage, request: Request, response: Response) {
    }
}
```

```typescript
import { Module } from '@nestjs/common';
import { ProxyModule } from "@nestcloud/proxy";
import { BOOT } from '@nestcloud/common';
import { CustomFilter } from './proxy-filters/CustomFilter';

@Module({
    imports: [
        ProxyModule.forRootAsync({ 
          inject: [BOOT],
          filters: [CustomFilter],
        }),
    ],
})
export class AppModule {
}
```

## API

### class ProxyModule

#### static forRoot\(options: ProxyOptions = {}\): DynamicModule

Register proxy module.

| field           | type         | description                          |
| :-------------- | :----------- | :----------------------------------- |
| options.inject  | string[]     | BOOT CONFIG LOADBALANCE              |
| options.routes  | Route[]      | routes of proxy                      |
| options.filters | Function[]   | your custom filters                  |
| proxy           | ExtraOptions | please see http-proxy doc for detail |

### class Proxy

#### forward\(req: Request, res: Response, id: string\)

forward the http request.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

NestCloud is [MIT licensed](LICENSE).
