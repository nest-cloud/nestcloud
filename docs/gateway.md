# API网关

Gateway 是基于 http-proxy 实现的一个简单 API 网关

## 安装

```bash
npm install @nestcloud/gateway@next --save
```

## 注册模块

```typescript
import { Module } from '@nestjs/common';
import { GatewayModule } from "@nestcloud/gateway";
import { NEST_BOOT } from '@nestcloud/common';

@Module({
    imports: [
        GatewayModule.register({dependencies: [NEST_BOOT]}), // or NEST_CONSUL_CONFIG
    ]
})
export class AppModule {
}
```

## 配置

```yaml
gateway:
  routes:
    - id: user
      uri: lb://nestcloud-user-service
    - id: pay
      uri: https://example.com/pay
```

## 如何使用

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

## 注意

使用该模块需要禁用 body parser 中间件，否则 put post 请求会 pending。

```typescript
const app = await NestFactory.create(AppModule, { bodyParser: false });
```

## API 文档

### class GatewayModule

#### static register\(options: IGatewayOptions = {}, proxy?: IProxyOptions\): DynamicModule

注册 gateway 模块

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string\[\] | 如果 dependencies 设置为 \[NEST\_BOOT\]，则通过 @nestcloud/boot 模块加载配置，如果设置为 \[NEST_CONSUL_CONFIG\] 则通过 @nestcloud/consul-config 加载配置，并支持动态更新 |
| options.routes | IRoute[] | 路由转发规则 |
| proxy | IProxyOptions | 略，详情请查看 http-proxy 文档 |

### class Gateway

#### updateRoutes(routes: IRoute[], sync: boolean = true): void;

更新路由规则列表，如果 sync 为 false，则不会同步更新到 Consul KV，在某一时刻，更新过的路由列表会被 Consul KV 中的覆盖掉。

## TODO

支持过滤器 \(filter\)

