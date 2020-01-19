
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Boot

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

NestCloud component for getting local configurations and environment values when the app bootstrap.

## Installation

```bash
$ npm i --save @nestcloud/boot
```

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import * as path from 'path';

@Module({
  imports: [
    BootModule.forRoot({ 
      filePath: path.resolve(__dirname, 'config.yaml'),
    }),
  ],
})
export class AppModule {}
```

### Configurations

Boot module will load `config.yaml`, `config.${env}.yaml` two files.

```yaml
web:
  name: example-service
  port: 3000
```

## Usage

There are two ways to get your config data,
 
 1. Inject Boot instance:

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBoot, Boot } from '@nestcloud/boot';

@Injectable()
export class ConfigService implements OnModuleInit {
  constructor(
    @InjectBoot() private readonly boot: Boot
  ) {}

  onModuleInit() {
      const port = this.boot.get<number>('service.port', 3000);
  }
}
```

2. Inject value:

```typescript
import { Injectable } from '@nestjs/common';
import { BootValue } from '@nestcloud/boot';

@Injectable()
export class ConfigService {
  @BootValue('service.port', 3000)
  private readonly port: number;
}
```

## Template Compile.

Dependency [handlebars.js](https://github.com/wycats/handlebars.js).

template:

```typescript
process.env.SERVICE_ID = 'your-service-id';
process.env.SERVICE_NAME = 'your-service-name';
```

```yaml
service:
  id: ${{ SERVICE_ID }}
  name: ${{ SERVICE_NAME }}
  port: 3000
  address: http://${{ service.name }}:${{ service.port }}
```

result:

```yaml
service:
  id: your-service-id
  name: your-service-name
  port: 3000
  address: http://your-service-name:3000
```

## API

### class BootModule

#### static forRoot\(options: BootOptions\): DynamicModule

Register boot module.

| field            | type    | description              |
| :--------------- | :------ | :----------------------- |
| options.filePath | string  | the config file path     |

### class Boot

#### get&lt;T&gt;\(path?: string, defaults?: T\): T

Get configurations

| field    | type   | description                                              |
| :------- | :----- | :------------------------------------------------------- |
| path     | string | path of configurations                                   |
| defaults | any    | default value if the specific configuration is not exist |

## Decorators

### InjectBoot\(\): PropertyDecorator

Inject Boot instance.

### BootValue\(path?: string, defaultValue?: any\): PropertyDecorator

Inject configuration to class attribute.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
