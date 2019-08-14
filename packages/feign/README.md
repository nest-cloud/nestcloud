
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Feign

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

A component of [nestcloud](http://github.com/nest-cloud/nestcloud). NestCloud is a nest framework micro-service solution.
  
[中文文档](https://nestcloud.org/solutions/http-ke-hu-duan)

This is a [Nest](https://github.com/nestjs/nest) module for writing nestjs http clients easier.

## Installation

```bash
$ npm i --save @nestcloud/feign @nestcloud/loadbalance @nestcloud/consul consul
```

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { LoadbalanceModule } from '@nestcloud/loadbalance';
import { BootModule } from '@nestcloud/boot';
import { FeignModule } from '@nestcloud/feign';
import { NEST_BOOT, NEST_LOADBALANCE } from '@nestcloud/common';

@Module({
  imports: [
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      ServiceModule.register({ dependencies: [NEST_BOOT] }),
      LoadbalanceModule.register({ dependencies: [NEST_BOOT] }),
      FeignModule.register({ dependencies: [NEST_BOOT, NEST_LOADBALANCE] }), // or NEST_CONSUL_CONFIG
  ],
})
export class ApplicationModule {}
```

### Configurations

```yaml
feign:
  axios:
    timeout: 1000
```

## Usage

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

### Loadbalance

```yaml
import { Injectable } from "@nestjs/common";
import { Loadbalanced, Get, Query } from "@nestcloud/feign";

@Injectable()
@Loadbalanced('user-service') // open loadbalance supports, need @nestcloud/loadbalance module.
export class UserClient {
    @Get('/users')
    getUsers(@Query('role') role: string) {
    }
    
    @Get('http://test.com/users')
    @Loadbalanced(false) // close loadbalance supports.
    getRemoteUsers() {
    }
}
```

### Brakes

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

### Interceptor

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

examples:

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

result:

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


## API

### Get\|Post\|Put\|Delete\|Options\|Head\|Patch\|Trace\(uri: string, options?: AxiosRequestConfig\): MethodDecorator

Route decorator.

| field | type | description |
| :--- | :--- | :--- |
| uri | string | the url |
| options | object | axios config，see [axios](https://github.com/axios/axios) |

### Param\|Body\|Query\|Header\(field?: string\): ParameterDecorator

Parameter decorator.

| field | type | description |
| :--- | :--- | :--- |
| field | string | the field name |

### SetHeader\|SetQuery\|SetParam\|SetBody\(field: string, value: any\): MethodDecorator

constant parameter decorator

| field | type | description |
| :--- | :--- | :--- |
| field | string | the field name  |
| value | string \| number \| object | the field value |

### Response\(\): MethodDecorator

If set this decorator, it will return full http response.

### ResponseHeader\(\): MethodDecorator

If set this decorator, it will return response.headers.

### ResponseBody\(\): MethodDecorator

It's a default decorator, it will return response.data.

### ResponseType\(type: string\): MethodDecorator

set response data type, eg: 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream', default 'json'

### ResponseEncode\(type: string\): MethodDecorator

Set response data encode, default 'utf8'

### Loadbalanced\(service: string \| boolean\): ClassDecorator \| MethodDecorator

Open or close lb support.

### UseInterceptor&lt;T extends IInterceptor&gt;\(interceptor: { new\(\): T }\)

Use interceptor, supports dynamic import and inject.

### UseBrakes(config?: BrakesConfig | boolean): ClassDecorator \| MethodDecorator

Open circuit supports.

### UseFallback<T extends IFallback>(Fall: { new(): T })

Add Custom fallback, use together with Brakes decorator, supports dynamic import and inject.

### UseHealthChecker<T extends IHealthChecker>(Checker: { new(): T })

Add Health Checker for Brakes, use together with Brakes decorator, supports dynamic import and inject.
 
If you use health check, please set heathCheck: true, such as

```typescript
@Brakes({healthCheck: true})
```

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
