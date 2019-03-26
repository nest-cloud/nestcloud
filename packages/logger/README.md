<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

A component of [nestcloud](http://github.com/nest-cloud/nestcloud). NestCloud is a nest framework micro-service solution.
  
[中文文档](https://nestcloud.org/solutions/ri-zhi)

A logger module for nestcloud.

## Installation

```bash
$ npm i --save @nestcloud/logger
$ npm i --save-dev @types/winston
```

## Quick Start

```typescript
import { NestFactory } from '@nestjs/core'
import { Injectable } from '@nestjs/core';
import { NestLogger, Logger } from '@nestcloud/logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
      logger: new NestLogger({path: __dirname, filename: 'logger.yml'})
  });
}
```

### Config logger.yml

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
import { LoggerModule, Logger } from '@nestcloud/logger';

@Module({
  imports: [
      LoggerModule.register()
  ],
})
export class ApplicationModule {}
```

```typescript
import { Injectable } from '@nestjs/common';
import { InjectLogger, Logger } from '@nestcloud/logger';
import { LoggerInstance } from 'winston';

@Injectable()
export class TestService {
  constructor(@InjectLogger() private readonly logger: LoggerInstance) {}

  log() {
      this.logger.info('The first log');
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
export class ApplicationModule {}
```

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
