
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Consul

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

A NestCloud component for providing consul api based on [node-consul](https://github.com/silas/node-consul).

[中文文档](https://github.com/nest-cloud/nestcloud/blob/master/docs/consul.md)

## Installation

```bash
$ npm i --save @nestcloud/consul consul
```

## Quick Start

### Import Module

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

### Configurations

```yaml
consul:
  host: localhost
  port: 8500
```

## Usage

```typescript
import { Injectable } from '@nestjs/common';
import * as Consul from 'consul';
import { InjectConsul } from '@nestcloud/consul';

@Injectable()
export class TestService {
  constructor(
    @InjectConsul() private readonly consul: Consul
  ) {
  }
}
```

### Simple Get Consul KV

```typescript
import { Injectable } from '@nestjs/common';
import { WatchKV } from '@nestcloud/consul';

@Injectable()
export class TestService {
  @WatchKV('test_key', 'yaml', {})
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

#### WatchKV(key: string, type?: 'json' | 'yaml' | 'text', defaults?: any): PropertyDecorator

Inject consul kv to the class attribute, it will update immediately when consul kv update.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
