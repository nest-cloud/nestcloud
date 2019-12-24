
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
    <a href="https://opencollective.com/nest-cloud" target="_blank"><img src="https://opencollective.com/nest-cloud/all/badge.svg?label=financial+contributors" alt="Financial Contributors on Open Collective"/></a>
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
$ npm install --save @nestcloud/feign 
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
$ npm install --save @nestcloud/feign 
$ npm install --save @nestcloud/logger 
```

### Kubernetes Backend

```bash
$ npm install --save @nestcloud/core
$ npm install --save @nestcloud/common
$ npm install --save @nestcloud/boot 
$ npm install --save @nestcloud/config 
$ npm install --save @nestcloud/loadbalance 
$ npm install --save @nestcloud/feign 
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

Get & watch remote configurations from Consul KV or Kubernetes ConfigMap.


#### [Service](packages/service)

Service registration and service discovery


#### [Loadbalance](packages/loadbalance)

Software load balancers primary for rest calls.


#### [Feign](packages/feign)

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
import { FeignModule } from '@nestcloud/feign';
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
        FeignModule.register({ dependencies: [NEST_BOOT, NEST_LOADBALANCE] }),
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

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/nest-cloud/nestcloud/graphs/contributors"><img src="https://opencollective.com/nest-cloud/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/nest-cloud/contribute)]

#### Individuals

<a href="https://opencollective.com/nest-cloud"><img src="https://opencollective.com/nest-cloud/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/nest-cloud/contribute)]

<a href="https://opencollective.com/nest-cloud/organization/0/website"><img src="https://opencollective.com/nest-cloud/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/1/website"><img src="https://opencollective.com/nest-cloud/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/2/website"><img src="https://opencollective.com/nest-cloud/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/3/website"><img src="https://opencollective.com/nest-cloud/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/4/website"><img src="https://opencollective.com/nest-cloud/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/5/website"><img src="https://opencollective.com/nest-cloud/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/6/website"><img src="https://opencollective.com/nest-cloud/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/7/website"><img src="https://opencollective.com/nest-cloud/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/8/website"><img src="https://opencollective.com/nest-cloud/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/nest-cloud/organization/9/website"><img src="https://opencollective.com/nest-cloud/organization/9/avatar.svg"></a>

## License

  NestCloud is [MIT licensed](LICENSE).
