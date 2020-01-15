
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Loadbalance

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

This is a software load balancers primary for rest calls.

## Installation

```bash
$ npm i --save @nestcloud/loadbalance
```

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import { resolve } from 'path';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { LoadbalanceModule } from '@nestcloud/loadbalance';
import { BootModule } from '@nestcloud/boot';
import { BOOT, CONSUL, SERVICE } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.forRootAsync({inject: [BOOT]}),
      ServiceModule.forRootAsync({inject: [BOOT, CONSUL]}),
      BootModule.forRoot({
        filePath: resolve(__dirname, 'config.yaml'),
      }),
      LoadbalanceModule.forRootAsync({inject: [BOOT, SERVICE]})
  ],
})
export class AppModule {}
```

### Configurations

```yaml
loadbalance:
  rule: RandomRule
  services:
    - {name: 'your-service-name', rule: 'RoundRobinRule'}
    - {name: 'your-service-name', rule: 'CustomLBRule'}
```

## Usage

```typescript
import { Injectalbe } from '@nestjs/common';
import { InjectLoadbalancee, Loadbalance } from '@nestcloud/loadbalance';

@Injectalbe()
export class TestService {
  constructor(
    @InjectLoadbalancee() private readonly lb: Loadbalance
  ) {
  }

  async chooseOneNode() {
      const node = this.lb.choose('your-service-name');
  }
}
```

### Use Choose decorator

```typescript
import { Injectable } from '@nestjs/common';
import { Choose, Server } from '@nestcloud/loadbalance';

@Injectable()
export class TestService {
  @Choose('your-service-name')
  private readonly yourServiceServer: Server;
}
```

### Custom Loadbalance Rule

```typescript
import { Rule, Loadbalancer } from '@nestcloud/loadbalance';

export class CustomLBRule implements Rule {
    private loadbalancer: Loadbalancer;
    
    init(loadbalancer: Loadbalancer) {
        this.loadbalancer = loadbalancer;
    }

    choose() {
        const servers = this.loadbalancer.servers;
        return servers[0];
    }
}
```

```typescript
import { Module } from '@nestjs/common';
import { LoadbalanceModule } from '@nestcloud/loadbalance';
import { CustomLBRule } from './CustomLBRule';
import { BOOT, SERVICE } from '@nestcloud/common';

@Module({
  imports: [
      /* ignore */
      LoadbalanceModule.forRootAsync({inject: [BOOT, SERVICE], rules: [CustomLBRule]})
  ],
})
export class AppModule {}
```

## API

### class LoadbalanceModule

#### static forRoot\(options\): DynamicModule

Import loadbalance module.

| field            | type            | description         |
| :--------------- | :-------------- | :------------------ |
| options.rule     | string          | global lb rule name |
| options.rules    | Function<Rule>  | your custom rules   |
| options.services | ServiceOptions  | set service rule    |

#### static forRootAsync\(options\): DynamicModule

Import loadbalance module.

| field          | type     | description         |
| :------------- | :------- | :------------------ |
| options.inject | string[] | BOOT CONFIG SERVICE |

### class Loadbalance

#### choose\(service: string\): Server

Choose a node that running the specific service.

| field   | type   | description      |
| :------ | :----- | :--------------- |
| service | string | the service name |

#### state\(\): {[service: string]: IServer[]}

List all servers info for all services.

#### chooseLoadbalancer\(service: string\): Loadbalancer

Get loadbalancer.

| field   | type   | description      |
| :------ | :----- | :--------------- |
| service | string | the service name |

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
