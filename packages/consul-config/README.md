<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

A component of [nestcloud](http://github.com/nest-cloud/nestcloud). NestCloud is a nest framework micro-service solution.
  
[中文文档](https://nestcloud.org/solutions/pei-zhi-zhong-xin)

This is a [Nest](https://github.com/nestjs/nest) module to get configurations from consul kv.

## Installation

```bash
$ npm i --save @nestcloud/consul consul @nestcloud/consul-config
```

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';

const env = process.env.NODE_ENV;

@Module({
  imports: [
      ConsulModule.register({
        host: '127.0.0.1',
        port: 8500
      }),
      ConsulConfigModule.register({key: `config__user-service__${env}`})
  ],
})
export class ApplicationModule {}
```

If you dependency [@nestcloud/boot](https://github.com/nest-cloud/boot) module.

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

#### Boot config file

```yaml
web:
  serviceId:
  serviceName: user-service
consul:
  host: localhost
  port: 8500
  config:
    # available expressions: {serviceName} {serviceId} {env}
    key: config__{serviceName}__{env}
    retry: 5
```

### How to get configurations

In consul kv, the key is "config__user-service__development".

```yaml
user:
  info:
    name: 'test'
```

#### Inject Config Client

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

#### Inject value

```typescript
import { Injectable } from '@nestjs/common';
import { Configuration, ConfigValue } from '@nestcloud/consul-config';

@Injectable()
@Configuration()
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

Import nest consul config module.

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string[] | if you are using @nestcloud/boot module, please set [NEST_BOOT] |
| options.key | string | the key of consul kv |
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

#### onChange\(callback: \(configs\) =&gt; void\): void

watch the configurations.

| field | type | description |
| :--- | :--- | :--- |
| callback | \(configs\) =&gt; void | callback function |

#### async set\(path: string, value: any\): void

update configuration.

| field | type | description |
| :--- | :--- | :--- |
| path | string | the path of the configuration |
| value | any | the configuration |


### Decorators

#### Configuration\(\): ClassDecorator

#### ConfigValue\(path?: string, defaultValue?: any\): PropertyDecorator

Inject configuration to attribute. It will change realtime when the value changed in consul kv.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
