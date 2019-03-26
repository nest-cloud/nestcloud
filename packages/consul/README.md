<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

A component of [nestcloud](http://github.com/nest-cloud/nestcloud). NestCloud is a nest framework micro-service solution.
  
[中文文档](https://nestcloud.org/solutions/consul)

This is a [Consul](http://consul.io/) module for [Nest](https://github.com/nestjs/nest), based on [node-consul](https://github.com/silas/node-consul).

## Installation

```bash
$ npm i --save @nestcloud/consul consul
```

## Quick Start

#### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';

@Module({
  imports: [ConsulModule.register({
    host: '127.0.0.1',
    port: 8500
  })],
})
export class ApplicationModule {}
```

If you use [@nestcloud/boot](https://github.com/nest-cloud/boot) module.

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT } from '@nestcloud/common';

@Module({
  imports: [
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConsulModule.register({dependencies: [NEST_BOOT]})
  ],
})
export class ApplicationModule {}
```

##### Nest-boot config file

```yaml
consul:
  host: localhost
  port: 8500
```

#### Usage

```typescript
import { Injectable } from '@nestjs/common';
import * as Consul from 'consul';
import { InjectConsul } from '@nestcloud/consul';

@Injectable()
export class TestService {
  constructor(@InjectConsul() private readonly consul: Consul) {}
}
```

##### Simple Get Consul KV

```typescript
import { Injectable } from '@nestjs/common';
import { ConsulKV } from '@nestcloud/consul';

@Injectable()
export class TestService {
  @ConsulKV('test_key', 'yaml', {})
  private readonly config: any;
}
```

## API

### class ConsulModule

#### static register\(options: Options\): DynamicModule

Import nest consul module.

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string[] | if you are using @nestcloud/boot module, please set [NEST_BOOT] |
| 其他 | any | see [node-consul](https://github.com/silas/node-consul) |

### class Consul

see [node-consul](https://github.com/silas/node-consul)

### Decorators

#### ConsulKV(key: string, type?: 'json' | 'yaml' | 'text', defaults?: any): PropertyDecorator

Inject consul kv to the class attribute, it will update immediately when consul kv update.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
