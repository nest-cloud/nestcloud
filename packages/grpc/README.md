
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

[中文文档](https://github.com/nest-cloud/nestcloud/blob/master/docs/grpc.md)

## Installation

```bash
$ npm install --save @nestcloud/grpc@next
```

## Usage

```typescript
import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { GrpcClient, LbClient } from '@nestcloud/grpc';
import { HeroService } from './interfaces/hero-service.interface';
import { join } from 'path';

@Controller()
export class HeroController implements OnModuleInit {
    @LbClient({
        service: 'rpc-server',
        package: 'hero',
        protoPath: join(__dirname, './hero.proto'),
    })
    private readonly client: GrpcClient;
    private heroService: HeroService;

    onModuleInit() {
        this.heroService = this.client.getService<HeroService>('HeroService');
    }

    @Get()
    async execute(): Promise<any> {
        return await this.heroService.findOne({ id: 1 }).toPromise();
    }
}
```

More: https://github.com/nest-cloud/nestcloud-grpc-example


## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
