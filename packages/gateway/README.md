
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Gateway

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

The gateway module for nestcloud.

[中文文档](https://github.com/nest-cloud/nestcloud/blob/master/docs/gateway.md)

## Installation

```bash
$ npm install --save @nestcloud/gateway@next
```

## Notification

You should not use body parser middleware when use this module or the post request will hang.

## Quick Start

### Register Module

```typescript
import { Module } from '@nestjs/common';
import { NEST_BOOT } from '@nestcloud/common';
import { GatewayModule } from "@nestcloud/gateway";

@Module({
    imports: [
        GatewayModule.register({dependencies: [NEST_BOOT]}),
    ]
})
export class AppModule {
}
```

### Configurations

```yaml
gateway:
  routes:
    - id: user
      uri: lb://nestcloud-user-service
    - id: pay
      uri: https://example.com/pay
```

## Usage

```typescript
import { All, Controller, Param, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';
import { Gateway, InjectGateway } from "@nestcloud/gateway";

@Controller('/gateway/:service')
export class GatewayController {
    constructor(
        @InjectGateway() private readonly gateway: Gateway,
    ) {
    }

    @All()
    do(@Req() req: Request, @Res() res: Response, @Param('service') id) {
        this.gateway.forward(req, res, id);
    }
    
    private updatRoutes() {
        const routes = [{id: 'example', uri: 'lb://example-service'}];
        this.gateway.updateRoutes(routes);
    }
}
```

## API

### class GatewayModule

#### static register\(options: IGatewayOptions = {}, proxy?: IProxyOptions\): DynamicModule

Register gateway module.

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string[] | NEST_BOOT or NEST_CONSUL_CONFIG |
| options.routes | IRoute[] | routes of gateway |
| proxy | IProxyOptions | please see http-proxy doc for detail |

### class Gateway

#### updateRoutes(routes: IRoute[], sync: boolean = true): void

Update gateway routes.

## TODO

filter support


## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
