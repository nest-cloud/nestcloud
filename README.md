
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

A NodeJS micro-service solution based on Consul, writing by Typescript language and NestJS framework.

## Install

```bash
npm install --save @nestcloud/core @nestcloud/common @nestcloud/boot @nestcloud/consul @nestcloud/consul-service @nestcloud/consul-config @nestcloud/consul-loadbalance @nestcloud/feign @nestcloud/logger @nestcloud/schedule 
```

## Docs

[中文文档](docs)


## Components

### [Boot](packages/boot)

Get local configurations and environment values when the app bootstrap.


### [Consul](packages/consul)

Consul module.


### [Consul-Config](packages/consul-config)

Get & watch configurations from Consul KV.


### [Consul-Service](packages/consul-service)

Register & cancel register service, discovery other service.


### [Consul-Loadbalance](packages/consul-loadbalance)

Software load balancers primary for rest calls.


### [Feign](packages/feign)

A http client that supports decorator and loadbalance.


### [Memcached](packages/memcached)

Memcached module.


### [Schedule](packages/schedule)

A job scheduler that supports distributed and decorator.

### [Logger](packages/logger)

Logger module based on winston@2.x


## Quick Start

main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestLogger } from '@nestcloud/logger';
import { NestCloud } from '@nestcloud/core';

async function bootstrap() {
    const app = NestCloud.create(await NestFactory.create(AppModule, {
        logger: new NestLogger({
            path: __dirname,
            filename: `config.yaml`
        }),
    }));

    await app.listen(NestCloud.global.boot.get('consul.service.port', 3000));
}

bootstrap();
```

app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { 
    NEST_BOOT, 
    NEST_CONSUL_LOADBALANCE, 
    NEST_CONSUL_CONFIG
} from '@nestcloud/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { LoadbalanceModule } from '@nestcloud/consul-loadbalance';
import { FeignModule } from '@nestcloud/feign';
import { LoggerModule } from '@nestcloud/logger';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [
        LoggerModule.register(),
        BootModule.register(__dirname, `config.yaml`),
        ConsulModule.register({ dependencies: [NEST_BOOT] }),
        ConsulConfigModule.register({ dependencies: [NEST_BOOT] }),
        ConsulServiceModule.register({ dependencies: [NEST_BOOT] }),
        LoadbalanceModule.register({ dependencies: [NEST_BOOT] }),
        FeignModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL_LOADBALANCE] }),
        TerminusModule.forRootAsync({
            useFactory: () => ({ endpoints: [{ url: '/health', healthIndicators: [] }] }),
        }),
    ]
})
export class AppModule {
}
```


## Starter

You can use the [NestCloud-Starter](https://github.com/nest-cloud/nestcloud-starter) start your project quickly.


## Samples

[Samples](samples)

## Who used

![焱融云](https://nestcloud.org/_media/who-used/yanrong.svg)


## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
