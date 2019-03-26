<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

A component of [nestcloud](http://github.com/nest-cloud/nestcloud). NestCloud is a nest framework micro-service solution.
  
[中文文档](https://nestcloud.org/solutions/api-wang-guan)

A gateway for nestcloud.

## Notification

You should not use body parser middleware when use this module or the post request will hang.

## Quick Start

### Register Module

```typescript
import { Module } from '@nestjs/common';
import { GatewayModule } from "@nestcloud/gateway";

@Module({
    imports: [
        GatewayModule.register({ 
            routes: [
                {
                    id: 'user',
                    uri: 'lb://nestcloud-user-service'
                },
                {
                    id: 'pay',
                    uri: 'https://example.com/pay'
                }
            ] 
        }),
    ]
})
export class AppModule {
}
```

Or dependency @nestcloud/boot module.

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

bootstrap.yaml

```yaml
gateway:
  routes:
    - id: user
      uri: lb://nestcloud-user-service
    - id: pay
      uri: https://example.com/pay
```

### Controller

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
}
```

## TODO

filter support


## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
