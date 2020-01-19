
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

## Installation

```bash
$ npm i --save @nestcloud/consul consul
```

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { BOOT } from '@nestcloud/common';

@Module({
  imports: [
    ConsulModule.forRootAsync({ inject: [BOOT] })
  ],
})
export class AppModule {}
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

#### static forRoot\(options: Options\): DynamicModule

Import consul module.

| field            | type     | description           |
| :--------------- | :------- | :-------------------- |
| options.host     | string   | consul host           |
| options.port     | string   | consul port           |
| options.secure   | boolean  | security or not       |
| options.ca       | string[] | certs                 |
| options.defaults | any      | default consul config |

#### static forRootAsync\(options: Options\): DynamicModule

Import consul module.

| field          | type     | description |
| :------------- | :------- | :---------- |
| options.inject | string[] | BOOT        |

### class Consul

see [node-consul](https://github.com/silas/node-consul)

### Decorators

#### KeyValue(name: string, options?: KeyValueOptions): PropertyDecorator

Inject consul kv to the class attribute, it will update immediately when consul kv update.

| field            | type           | description           |
| :--------------- | :------------- | :-------------------- |
| name             | string         | consul key            |
| options.type     | text json yaml | value type            |
| options.defaults | any            | default value         |

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
