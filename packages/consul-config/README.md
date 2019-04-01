
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - ConsulConfig

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

A NestCloud component for getting and watching configurations from consul kv.

[中文文档](https://github.com/nest-cloud/nestcloud/blob/master/docs/consul-config.md)

## Installation

```bash
$ npm i --save @nestcloud/consul@next consul @nestcloud/consul-config@next
```

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConsulConfigModule.register({dependencies: [NEST_BOOT]})
  ],
})
export class ApplicationModule {}
```

### Configurations

```yaml
consul:
  host: localhost
  port: 8500
  service: 
    id: null
    name: example-service
  config:
    key: config__${{ consul.service.name }}__${{ NODE_ENV }}
```

## How to get remote configurations

In consul kv, the key is "config__example-service__development".

```yaml
user:
  info:
    name: 'test'
```

### Inject Config Client

```typescript
import { Injectable } from '@nestjs/common';
import { InjectConfig, ConsulConfig } from '@nestcloud/consul-config';

@Injectable()
export class TestService {
  constructor(
      @InjectConfig() private readonly config: ConsulConfig
  ) {}

  getUserInfo() {
      const userInfo = this.config.get('user.info', {name: 'judi'});
      console.log(userInfo);
  }
}
```

### Inject value

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigValue } from '@nestcloud/consul-config';

@Injectable()
export class TestService {
  @ConfigValue('user.info', {name: 'judi'})
  private readonly userInfo;

  getUserInfo() {
      return this.userInfo;
  }
}
```

## API

### class ConsulConfigModule

#### static register\(options\): DynamicModule

Register consul config module.

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string[] | if you are using @nestcloud/boot module, please set [NEST_BOOT] |
| options.retry | number | the max retry count when get configuration fail |

### class ConsulConfig

#### get\(path?: string, defaults?: any\): any

Get configuration from consul kv.

| field | type | description |
| :--- | :--- | :--- |
| path | string | the path of the configuration |
| defaults | any | default value if the specific configuration is not exist |

#### getKey\(\): string

Get the current key.

#### watch\(path: string, callback: \(configs: any\) =&gt; void\): void

Watch the configurations.

| field | type | description |
| :--- | :--- | :--- |
| callback | \(configs\) =&gt; void | callback function |

#### async set\(path: string, value: any\): void

Update configuration.

| field | type | description |
| :--- | :--- | :--- |
| path | string | the path of the configuration |
| value | any | the configuration |


### Decorators

#### ConfigValue\(path?: string, defaultValue?: any\): PropertyDecorator

Inject configuration to attribute. It will change realtime when the value changed in consul kv.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
