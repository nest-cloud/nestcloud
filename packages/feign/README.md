<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

A component of [nestcloud](http://github.com/nest-cloud/nestcloud). NestCloud is a nest framework micro-service solution.
  
[中文文档](https://nestcloud.org/solutions/http-ke-hu-duan)

This is a [Nest](https://github.com/nestjs/nest) module for writing nestjs http clients easier.

## Installation

```bash
$ npm i --save @nestcloud/feign @nestcloud/consul-loadbalance @nestcloud/consul consul
```

## Quick Start

#### Import Module

```typescript
import { Module } from '@nestjs/common';
import { FeignModule } from '@nestcloud/feign';
import { NEST_CONSUL_LOADBALANCE } from '@nestcloud/common';

@Module({
  imports: [FeignModule.register({
    dependencies: [], // If use @nestcloud/consul-loadbalance module, please set NEST_CONSUL_LOADBALANCE
    axiosConfig: {},
  })],
})
export class ApplicationModule {}
```

#### Injection

UserClient:

```typescript
import { Injectable } from "@nestjs/common";
import { Loadbalanced, Get, Query, Post, Body, Param, Put, Delete } from "@nestcloud/feign";
​
@Injectable()
@Loadbalanced('user-service') // open lb support
export class UserClient {
    @Get('/users')
    getUsers(@Query('role') role: string) {
    }
    
    @Get('http://test.com/users')
    @Loadbalanced(false) // close lb support
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

UserService:

```typescript
export class UserService {
    constructor(private readonly userClient: UserClient) {}
    
    doCreateUser() {
        this.userClient.createUser({name: 'test'});
    }
}
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

### Interceptor&lt;T extends IInterceptor&gt;\(interceptor: { new\(\): T }\)

add interceptor，such as：

AddHeaderInterceptor.ts:
```typescript
import { IInterceptor } from "@nestcloud/feign";
import { AxiosResponse, AxiosRequestConfig } from 'axios';

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

ArticleClient.ts:
```typescript
import { Injectable } from "@nestjs/common";
import { Get, Interceptor } from "@nestcloud/feign";
import { AddHeaderInterceptor } from './AddHeaderInterceptor';

@Injectable()
@Interceptor(AddHeaderInterceptor)
export class ArticleClient {
    @Get('https://api.apiopen.top/recommendPoetry')
    getArticles() {
    }
}
```

interceptor processing：

```typescript
@Interceptor(Interceptor1)
@Interceptor(Interceptor2)
export class Client {

    @Interceptor(Interceptor3)
    @Interceptor(Interceptor4)
    getArticles() {
    }
}
```

console:
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

### Brakes(config?: BrakesConfig | boolean): ClassDecorator \| MethodDecorator

Open circuit supports.

### Fallback<T extends IFallback>(Fall: { new(): T })

Add Custom fallback, use together with Brakes decorator.

### HealthChecker<T extends IHealthChecker>(Checker: { new(): T })

Add Health Checker for Brakes, use together with Brakes decorator, please set heathCheck: true, such as

```typescript
@Brakes({healthCheck: true})
```


## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
