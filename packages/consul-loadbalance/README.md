
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - ConsulLoadbalance

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

[中文文档](https://github.com/nest-cloud/nestcloud/blob/master/docs/consul-loadbalance.md)

## Installation

```bash
$ npm i --save @nestcloud/consul consul @nestcloud/consul-loadbalance
```

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { LoadbalanceModule } from '@nestcloud/consul-loadbalance';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      LoadbalanceModule.register({dependencies: [NEST_BOOT], customRulePath: __dirname})
  ],
})
export class ApplicationModule {}
```

### Configurations

```yaml
consul:
  host: localhost
  port: 8500
loadbalance:
  ruleCls: RandomRule
  rules:
    - {service: 'your-service-name', ruleCls: 'RoundRobinRule'}
    - {service: 'your-service-name', ruleCls: 'rules/CustomRule'}
```

## Usage

```typescript
import { Component } from '@nestjs/common';
import { InjectLoadbalancee, Loadbalance } from '@nestcloud/consul-loadbalance';

@Component()
export class TestService {
  constructor(@InjectLoadbalancee() private readonly lb: Loadbalance) {}

  async chooseOneNode() {
      const node = this.lb.choose('your-service-name');
  }
}
```

### Use Choose decorator

```typescript
import { Injectable } from '@nestjs/common';
import { IServer } from '@nestcloud/common';
import { Choose } from '@nestcloud/consul-loadbalance';

@Injectable()
export class TestService {
  @Choose('your-service-name')
  private readonly yourServiceServer: Iserver;
}
```

### Custom Loadbalance Rule

```typescript
import { Rule, Loadbalancer } from '@nestcloud/consul-loadbalance';

export class CustomRule implements Rule {
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

## API

### class LoadbalanceModule

#### static register\(options\): DynamicModule

Import nest consul loadbalance module.

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string[] | if you are using @nestcloud/boot module, please set [NEST_BOOT] |
| options.ruleCls | string \| class | lb rule，support：RandomRule, RoundRobinRule, WeightedResponseTimeRule or custom lb rule, use relative path |
| options.rules | RuleOption | one service use one rule, eg：\[{service: '', ruleCls: ''}\] |

### class Loadbalance

#### choose\(service: string\): Server

Choose a node that running the specific service.

| field | type | description |
| :--- | :--- | :--- |
| service | string | the service name |

#### state\(\): {[service: string]: IServer[]}

List all servers info for all services.

#### chooseLoadbalancer\(service: string\): Loadbalancer

Get loadbalancer.

| field | type | description |
| :--- | :--- | :--- |
| service | string | the service name |

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
