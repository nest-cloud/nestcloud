
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Grpc

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

The loadbalance grpc module for nestcloud.

## Installation

```bash
$ npm install --save @nestcloud/grpc
```

## Quick Start

### Import module

*Before import `GrpcModule`, you need to import [`LoadbalanceModule`][loadbalance] first.*

```typescript
import { Module } from '@nestjs/common';
import { LoadbalanceModule } from '@nestcloud/loadbalance'
import { GrpcModule } from '@nestcloud/grpc';

@Module({
  imports: [
      LoadbalanceModule.forRoot({...}),
      GrpcModule.forRoot()
  ],
})
export class AppModule {}
```

### Usage

```typescript
import { Controller, Get } from '@nestjs/common';
import { RpcClient, GrpcClient, IClientConfig, Service } from '@nestcloud/grpc';
import { HeroService } from './interfaces/hero-service.interface';
import { join } from 'path';

const grpcOptions: IClientConfig = {
    service: 'rpc-server',
    package: 'hero',
    protoPath: join(__dirname, './hero.proto'),
};

@Controller()
export class HeroController {
    @RpcClient(grpcOptions)
    private readonly client: GrpcClient;
    @Service('HeroService', grpcOptions)
    private readonly heroService: HeroService;

    @Get()
    async execute(): Promise<any> {
        return await this.heroService.get({ id: 1 }).toPromise();
    }
}
```

More please visit the example: https://github.com/nest-cloud/nestcloud-grpc-example

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).


[loadbalance]: https://github.com/nest-cloud/nestcloud/tree/master/packages/loadbalance