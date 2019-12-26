
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

NestCloud is a NodeJS micro-service solution, writing by Typescript language and NestJS framework.
Consul, Etcd or Kubernetes all can be the service discovery center for NestCloud.


## Install

You need install the packages by the service discovery that which you select.

### Consul Backend

```bash
$ npm install --save @nestcloud/core
$ npm install --save @nestcloud/common
$ npm install --save @nestcloud/boot 
$ npm install --save @nestcloud/consul 
$ npm install --save @nestcloud/service 
$ npm install --save @nestcloud/config 
$ npm install --save @nestcloud/loadbalance 
$ npm install --save @nestcloud/http 
$ npm install --save @nestcloud/logger 
```

### Etcd Backend

```bash
$ npm install --save @nestcloud/core
$ npm install --save @nestcloud/common
$ npm install --save @nestcloud/boot 
$ npm install --save @nestcloud/etcd 
$ npm install --save @nestcloud/service 
$ npm install --save @nestcloud/config 
$ npm install --save @nestcloud/loadbalance 
$ npm install --save @nestcloud/http 
$ npm install --save @nestcloud/logger 
```

### Kubernetes Backend

```bash
$ npm install --save @nestcloud/core
$ npm install --save @nestcloud/common
$ npm install --save @nestcloud/boot 
$ npm install --save @nestcloud/config 
$ npm install --save @nestcloud/loadbalance 
$ npm install --save @nestcloud/http 
$ npm install --save @nestcloud/logger 
$ npm install --save @nestcloud/kubernetes 
```

## Docs

[中文文档](docs)

## Examples

[nestcloud-typeorm-example](https://github.com/nest-cloud/nestcloud-typeorm-example)

[nestcloud-grpc-example](https://github.com/nest-cloud/nestcloud-grpc-example)

[nestcloud-kubernetes-example](https://github.com/nest-cloud/nestcloud-kubernetes-example)


## Starter

[nestcloud-consul-starter](https://github.com/nest-cloud/nestcloud-consul-starter) 

[nestcloud-etcd-starter](https://github.com/nest-cloud/nestcloud-etcd-starter) 


## Components

#### [Consul](packages/consul)

Consul module.


#### [Etcd](packages/etcd)

Etcd module.


#### [Memcached](packages/memcached)

Memcached module.


#### [Kubernetes](packages/kubernetes)

Kubernetes client module.


#### [Boot](packages/boot)

Get local configurations.


#### [Config](packages/config)

Get & watch remote configurations from Consul KV, Etcd or Kubernetes ConfigMap.


#### [Service](packages/service)

Service registration and service discovery


#### [Loadbalance](packages/loadbalance)

Software load balancers primary for rest calls.


#### [Http](packages/http)

A decorator and loadbalance http client.


#### [Grpc](packages/grpc)

A loadbalance grpc client.


#### [Proxy](packages/proxy)

A API proxy module.


#### [Schedule](packages/schedule)

A job scheduler that supports distributed and decorator.


#### [Logger](packages/logger)

Logger module based on winston@2.x


#### [Validations](packages/validations)

Validate request params.


#### [Rbac](packages/rbac)

Role based access control.


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
import { NEST_BOOT, NEST_LOADBALANCE, NEST_CONSUL } from '@nestcloud/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConfigModule } from '@nestcloud/config';
import { ServiceModule } from '@nestcloud/service';
import { LoadbalanceModule } from '@nestcloud/loadbalance';
import { HttpModule } from '@nestcloud/http';
import { LoggerModule } from '@nestcloud/logger';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [
        LoggerModule.register(),
        BootModule.register(__dirname, `config.yaml`),
        ConsulModule.register({ dependencies: [NEST_BOOT] }),
        ConfigModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
        ServiceModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
        LoadbalanceModule.register({ dependencies: [NEST_BOOT] }),
        HttpModule.register({ dependencies: [NEST_BOOT, NEST_LOADBALANCE] }),
        TerminusModule.forRootAsync({
            useFactory: () => ({ endpoints: [{ url: '/health', healthIndicators: [] }] }),
        }),
    ]
})
export class AppModule {
}
```

## Samples

[Samples](samples)

## Who used

![焱融云](https://nestcloud.org/_media/who-used/yanrong.svg)


## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
