# Http 客户端

Feign 是支持负载均衡和装饰器的 http 客户端，使用更加简单，快捷。

## 安装

```bash
npm install @nestcloud/feign@next --save
```

## 注册模块

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { LoadbalanceModule } from '@nestcloud/consul-loadbalance';
import { BootModule } from '@nestcloud/boot';
import { FeignModule } from '@nestcloud/feign';
import { NEST_BOOT, NEST_CONSUL_LOADBALANCE } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConsulServiceModule.register({ dependencies: [NEST_BOOT] }),
      LoadbalanceModule.register({ dependencies: [NEST_BOOT] }),
      FeignModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL_LOADBALANCE] }), // or NEST_CONSUL_CONFIG
  ],
})
export class ApplicationModule {}
```

## 配置

```yaml
feign:
  axios:
    timeout: 1000
```

## 如何使用

```typescript
import { Injectable } from "@nestjs/common";
import { Get, Query, Post, Body, Param, Put, Delete } from "@nestcloud/feign";

@Injectable()
export class UserClient {
    @Get('/users')
    getUsers(@Query('role') role: string) {
    }
    
    @Get('http://test.com/users')
    getRemoteUsers() {
    }
    
    @Post('/users')
    createUser(@Body('user') user: any) {
    }
    
    @Put('/users/:userId')
    updateUser(@Param('userId') userId: string, @Body('user') user: any) {
    }
    
    @Delete('/users/:userId')
    deleteUser(@Param('userId') userId: string) {
       
    }
}
```

### 负载均衡

```typescript
import { Injectable } from "@nestjs/common";
import { Loadbalanced, Get, Query } from "@nestcloud/feign";

@Injectable()
@Loadbalanced('user-service') // 开启负载均衡支持，需要依赖 @nestcloud/consul-loadbalance 模块
export class UserClient {
    @Get('/users')
    getUsers(@Query('role') role: string) {
    }
    
    @Get('http://test.com/users')
    @Loadbalanced(false) // 关闭负载均衡支持
    getRemoteUsers() {
    }
}
```

### 熔断器

```typescript
import { IFallback } from "@nestcloud/feign";
import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { AxiosResponse } from "axios";

@Injectable()
export class CustomFallback implements IFallback {
    fallback(): Promise<AxiosResponse | void> | AxiosResponse | void {
        throw new ServiceUnavailableException('The service is unavailable, please retry soon.');
    }
}
```

```typescript
import { IHealthCheck } from "@nestcloud/feign";
import { Injectable } from "@nestjs/common";
import { HealthClient } from "./health.client";

@Injectable()
export class CustomCheck implements IHealthCheck {
    constructor(
        private readonly client: HealthClient
    ) {
    }

    async check(): Promise<void> {
        await this.client.checkHealth();
    }
}

```

```typescript
import { Injectable } from "@nestjs/common";
import { UseBrakes, UseFallback, UseHealthCheck, Get, Query } from "@nestcloud/feign";
import { CustomFallback } from "./custom.fallback";
import { CustomCheck } from "./custom.check";

@Injectable()
@UseBrakes({
    statInterval: 2500,
    threshold: 0.5,
    circuitDuration: 15000,
    timeout: 250,
    healthCheck: true,
})
@UseFallback(CustomFallback)
@UseHealthCheck(CustomCheck)
export class UserClient {
}
```

### 拦截器

AddHeaderInterceptor.ts

```typescript
import { Injectable } from '@nestjs/common';
import { IInterceptor } from "@nestcloud/feign";
import { AxiosResponse, AxiosRequestConfig } from 'axios';

@Injectable()
export class AddHeaderInterceptor implements IInterceptor {
    onRequest(request: AxiosRequestConfig): AxiosRequestConfig {
        request.headers['x-service'] = 'service-name';
        return request;
    }
    
    onResponse(response: AxiosResponse): AxiosResponse {
        return response;
    }
    
    onRequestError(error: any): any {
        return Promise.reject(error);
    }
    
    onResponseError(error: any): any {
        return Promise.reject(error);
    }
}
```

ArticleClient.ts

```typescript
import { Injectable } from "@nestjs/common";
import { Get, UseInterceptor } from "@nestcloud/feign";
import { AddHeaderInterceptor } from "./middlewares/AddHeaderInterceptor";

@Injectable()
@UseInterceptor(AddHeaderInterceptor)
export class ArticleClient {
    @Get('https://api.apiopen.top/recommendPoetry')
    getArticles() {
    }
}
```

中间件执行过程：

```typescript
@UseInterceptor(Interceptor1)
@UseInterceptor(Interceptor2)
export class Client {

    @UseInterceptor(Interceptor3)
    @UseInterceptor(Interceptor4)
    getArticles() {
    }
}
```

执行结果：

```text
interceptor1 request
interceptor2 request
interceptor3 request
interceptor4 request
interceptor4 response
interceptor3 response
interceptor2 response
interceptor1 response
```

## API 文档

### class FeignModule

#### static register\(options: IFeignOptions\): DynamicModule

注册 feign 模块

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string\[\] | 如果 dependencies 设置为 \[NEST\_BOOT\]，则通过 @nestcloud/boot 模块加载配置，如果设置为 \[NEST_CONSUL_CONFIG\] 则通过 @nestcloud/consul-config 加载配置，并支持动态更新 |
| options.axiosConfig | IGlobalAxiosConfig | axios 全局配置 |

### Get\|Post\|Put\|Delete\|Options\|Head\|Patch\|Trace\(uri: string, options?: AxiosRequestConfig\): MethodDecorator

装饰 Http Method

| field | type | description |
| :--- | :--- | :--- |
| uri | string | 请求的URL |
| options | object | axios 配置，详情请查看 axios 文档 |

### Param\|Body\|Query\|Header\(field?: string\): ParameterDecorator

装饰请求参数

| field | type | description |
| :--- | :--- | :--- |
| field | string | 字段名称 |

### SetHeader\|SetQuery\|SetParam\|SetBody\(field: string, value: any\): MethodDecorator

装饰常量请求参数

| field | type | description |
| :--- | :--- | :--- |
| field | string | 字段名称 |
| value | string \| number \| object | 字段对应的值 |

### Response\(\): MethodDecorator

返回完整的 http response 对象

### ResponseHeader\(\): MethodDecorator

返回 http header 对象

### ResponseBody\(\): MethodDecorator

返回 http body，默认，可以不加

### ResponseType\(type: string\): MethodDecorator

设置返回值类型，例如：arraybuffer，blob，document，json，text，stream，作用在函数上，默认是 json

### ResponseEncode\(type: string\): MethodDecorator

设置返回值编码，默认是 utf8

### Loadbalanced\(service: string \| boolean\): ClassDecorator \| MethodDecorator

开启或者关闭负载均衡支持，使用负载均衡需要依赖 @nestcloud/consul-loadbalance 模块。

### UseInterceptor\(interceptor: IInterceptor | Function\)

使用拦截器，Interceptor 与 NestJS Interceptor 相同，支持动态引入以及依赖注入。

### UseBrakes\(config?: boolean | IBrakesConfig\): ClassDecorator | MethodDecorator

开启熔断器，如果设置为 false，则禁用熔断器

### UseFallback\(Fallback: Function \| IFallback\): ClassDecorator | MethodDecorator

为熔断器设置 Fallback，与 UseBrakes 装饰器一起使用，Fallback 与 NestJS Interceptor 相同，支持动态引入以及依赖注入。

### UseHealthCheck\(Fallback: Function \| IHealthCheck\): ClassDecorator | MethodDecorator

为熔断器设置 HealthCheck，与 HealthCheck 装饰器一起使用，Fallback 与 NestJS Interceptor 相同，支持动态引入以及依赖注入。
