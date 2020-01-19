
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

Don't use the body parser middleware when use this module.

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ProxyModule } from "@nestcloud/proxy";

@Module({
  imports: [
    ProxyModule.forRoot({
      routes: [{
        id: 'github',
        uri: 'https://api.github.com',
      }],
    }),
  ]
})
export class AppModule {
}
```

#### Import With Config Module

Except `@nestcloud/boot` module you can also use `@nestcloud/config` module too.

app.module.ts:

```typescript
import { Module } from '@nestjs/common';
import { BOOT } from "@nestcloud/common";
import { BootModule } from "@nestcloud/boot";
import { ProxyModule } from "@nestcloud/proxy";
import { resolve } from 'path';

@Module({
  imports: [
    BootModule.forRoot({
      filePath: resolve(__dirname, 'config.yaml'),
    }),
    ProxyModule.forRootAsync({ inject: [BOOT] }),
  ]
})
export class AppModule {
}
```

config.yaml:

```yaml
proxy:
  routes:
    - id: github
      uri: https://api.github.com
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

Then visit http://localhost:{port}/proxy/github

### Filters

Proxy module have `RequestHeaderFilter` and `ResponseHeaderFilter` internal filters.

If you want to use a custom filter, please implement `Filter` interface
 
and then use `UseFilters` decorator import your custom filter.

#### How To Use Filter

```typescript
import { Module } from '@nestjs/common';
import { ProxyModule } from "@nestcloud/proxy";

@Module({
  imports: [
    ProxyModule.forRoot({
      routes: [{
        id: 'github',
        uri: 'https://api.github.com',
        filters: [{
          name: 'RequestHeaderFilter',
          parameters: {
            Authorization: 'Basic dGVzdDp0ZXN0',
          },
        }],
      }],
    }),
  ]
})
export class AppModule {
}
```

#### Custom Filter

If you need custom a proxy filter, you need implement `Filter` interface:

```typescript
import { ClientRequest, IncomingMessage } from 'http';
import { Filter, Request, Response, ProxyErrorException } from '@nestcloud/proxy';

class CustomFilter implements Filter {
    before(request: Request, response: Response): boolean | Promise<boolean> {
        return true;
    }

    error(error: ProxyErrorException, request: Request, response: Response) {
    }

    request(proxyReq: ClientRequest, request: Request, response: Response) {
    }

    response(proxyRes: IncomingMessage, request: Request, response: Response) {
    }
}
```

And then, create a register class, use `UseFilters` to import your custom filter.

```typescript
import { Injectable } from '@nestjs/common';
import { UseFilters } from "@nestcloud/proxy";
import { CustomFilter } from './filters/CustomFilter'

@Injectable()
@UseFilters(CustomFilter)
export class ProxyFilterRegister {
}
```

Now you can specific your custom filter by filter classname.

## API

### class ProxyModule

#### static forRoot\(options: ProxyOptions = {}\): DynamicModule

Register proxy module.

| field           | type         | description                          |
| :-------------- | :----------- | :----------------------------------- |
| options.inject  | string[]     | BOOT CONFIG LOADBALANCE              |
| options.routes  | Route[]      | routes of proxy                      |
| options.extras  | ExtraOptions | please see http-proxy doc for detail |

### class Proxy

#### forward\(req: Request, res: Response, id: string\)

forward the http request.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

NestCloud is [MIT licensed](LICENSE).
