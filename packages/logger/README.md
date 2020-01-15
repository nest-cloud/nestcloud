
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Logger

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

The logger module for nestcloud.

## Installation

```bash
$ npm i --save @nestcloud/logger
```

## Quick Start

```typescript
import { NestFactory } from '@nestjs/core';
import { resolve } from 'path';
import { NestLogger } from '@nestcloud/logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
      logger: new NestLogger({
        filePath: resolve(__dirname, 'config.yaml'),
      }),
  });
}
```

### Configurations

```yaml
logger:
  level: info
  transports:
    - transport: console
      level: debug
      colorize: true
      datePattern: YYYY-MM-DD h:mm:ss
      label: user-service
    - transport: file
      name: info
      filename: info.log
      datePattern: YYYY-MM-DD h:mm:ss
      label: user-service
      # 100M
      maxSize: 104857600
      json: false
      maxFiles: 10
    - transport: dailyRotateFile
      filename: info.log
      datePattern: YYYY-MM-DD-HH
      zippedArchive: true
      maxSize: 20m
      maxFiles: 14d
```

### Usage

#### Inject logger instance

```typescript
import { Module } from '@nestjs/common';
import { LoggerModule } from '@nestcloud/logger';

@Module({
  imports: [
      LoggerModule.forRoot()
  ],
})
export class AppModule {}
```

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectLogger } from '@nestcloud/logger';

@Injectable()
export class TestService {
  constructor(@InjectLogger() private readonly logger: Logger) {}

  log() {
      this.logger.log('The first log');
  }
}
```

#### Custom Typeorm Logger

```typescript
import { Module, NEST_TYPEORM_LOGGER_PROVIDER } from '@nestjs/common';
import { TypeormLogger } from '@nestcloud/logger';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      TypeOrmModule.forRootAsync({
          useFactory: (logger: TypeormLogger) => ({
              /* ... */
              logger,
          }),
          inject: [NEST_TYPEORM_LOGGER_PROVIDER],
      })
  ],
})
export class AppModule {}
```

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
