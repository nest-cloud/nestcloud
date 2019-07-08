# API 代理

Proxy 是基于 http-proxy 实现的一个简单 API 网关

## 安装

```bash
npm install @nestcloud/proxy --save
```

## 注册模块

```typescript
import { Module } from '@nestjs/common';
import { ProxyModule } from "@nestcloud/proxy";
import { NEST_BOOT } from '@nestcloud/common';

@Module({
    imports: [
        ProxyModule.register({dependencies: [NEST_BOOT]}), // or NEST_CONSUL_CONFIG
    ]
})
export class AppModule {
}
```

## 配置

```yaml
proxy:
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

## 注意

使用该模块需要禁用 body parser 中间件，否则 put post 请求会 pending。

```typescript
const app = await NestFactory.create(AppModule, { bodyParser: false });
```

### 过滤器

Proxy 内置了两个过滤器，分别是 `AddRequestHeaderFilter` 和 `AddResponseHeaderFilter`，
如果你想要使用自己的过滤器，可以通过实现 `IFilter` 接口来实现，然后调用 `registerFilter(filter: IFilter)`
注册到 Proxy 中。

```typescript
class CustomFilter implements IFilter {
    before(request: IRequest, response: IResponse): boolean | Promise<boolean> {
        return undefined;
    }

    error(error: ProxyErrorException, request: IRequest, response: IResponse) {
    }

    getName(): string {
        return "CustomFilter";
    }

    request(proxyReq: ClientRequest, request: IRequest, response: IResponse) {
    }

    response(proxyRes: IncomingMessage, request: IRequest, response: IResponse) {
    }
}
```

## API 文档

### class ProxyModule

#### static register\(options: IProxyOptions = {}, proxy?: IProxyOptions\): DynamicModule

注册 proxy 模块

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string\[\] | 如果 dependencies 设置为 \[NEST\_BOOT\]，则通过 @nestcloud/boot 模块加载配置，如果设置为 \[NEST_CONSUL_CONFIG\] 则通过 @nestcloud/consul-config 加载配置，并支持动态更新 |
| options.routes | IRoute[] | 路由转发规则 |
| proxy | IProxyOptions | 略，详情请查看 http-proxy 文档 |

### class Proxy

#### updateRoutes(routes: IRoute[], sync: boolean = true): void;

更新路由规则列表，如果 sync 为 false，则不会同步更新到 Consul KV，在某一时刻，更新过的路由列表会被 Consul KV 中的覆盖掉。

#### registerFilter(filter: IFilter)

注册自定义过滤器

