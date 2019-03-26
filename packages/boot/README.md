<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

A component of [nestcloud](http://github.com/nest-cloud/nestcloud). NestCloud is a nest framework micro-service solution.
  
[中文文档](https://nestcloud.org/solutions/ben-di-pei-zhi)

A [Nest](https://github.com/nestjs/nest) module to get configurations when the app bootstrap.

## Installation

```bash
$ npm i --save @nestcloud/boot
```

## Quick Start

#### Import Module

```typescript
import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';

const env = process.env.NODE_ENV;

@Module({
  imports: [BootModule.register(__dirname, `bootstrap-${env}.yml`)],
})
export class ApplicationModule {}
```

#### Yaml Config File

eg: bootstrap-development.yml.

```yaml
web:
  name: example-service
  port: 3000
```

#### Usage

There are two ways to get configurations,
 
 1. Inject Boot instance:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectBoot, Boot } from '@nestcloud/boot';

@Injectable()
export class TestService {
  constructor(@InjectBoot() private readonly boot: Boot) {}

  getPort() {
      return this.boot.get('web.port', 3000);
  }
}
```

2. Inject value:

```typescript
import { Injectable } from '@nestjs/common';
import { Bootstrap, BootValue } from '@nestcloud/boot';

@Injectable()
@Bootstrap()
export class TestService {
  @BootValue('web.port', 3000)
  private readonly port: number;

  getPort() {
      return this.port;
  }
}
```

#### Get configurations with env.

The boot module supports get configurations with env, use ${} expression, example:

```yaml
web:
  serviceId: ${ SERVICE_ID || example-service }
  serviceName: ${ SERVICE_NAME || example-service }
  port: 3000
```

## API

### class BootModule

#### static register\(path: string, filename: string\): DynamicModule

Import nest boot module.

| field | type | description |
| :--- | :--- | :--- |
| path | string | the config file path |
| filename | string | the config filename |

### class Boot

#### get&lt;T&gt;\(path: string, defaults?: T\): T

Get configurations

| field | type | description |
| :--- | :--- | :--- |
| path |  string | path of configurations |
| defaults | any | default value if the specific configuration is not exist |

#### getEnv\(\): string

Get current NODE\_ENV value, if not set, it will return 'development'.

#### getFilename\(\): string

Get the current config filename.

#### getConfigPath\(\): string

Get the current path of the config file.

#### getFullConfigPath\(\): string

Get the current full path of the config file.

### Decorator

#### InjectBoot\(\): PropertyDecorator

Inject Boot instance.

#### Bootstrap\(\): ClassDecorator

#### BootValue\(path?: string, defaultValue?: any\): PropertyDecorator

Inject configuration to class attribute.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
