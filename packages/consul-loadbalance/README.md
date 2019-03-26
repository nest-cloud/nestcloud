<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

A component of [nestcloud](http://github.com/nest-cloud/nestcloud). NestCloud is a nest framework micro-service solution.
  
[中文文档](https://nestcloud.org/solutions/fu-zai-jun-heng)

This is a software load balancers primary for rest calls.

## Installation

```bash
$ npm i --save @nestcloud/consul consul @nestcloud/consul-loadbalance
```

## Quick Start

#### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { LoadbalanceModule } from '@nestcloud/consul-loadbalance';

@Module({
  imports: [
      ConsulModule.register({
        host: '127.0.0.1',
        port: 8500
      }),
      LoadbalanceModule.register({
        rules: [
            {service: 'test-service', ruleCls: 'RandomRule'},
            {service: 'user-service', ruleCls: '../rules/CustomRule'}
        ]
      })
  ],
})
export class ApplicationModule {}
```

If you use [@nestcloud/boot](https://github.com/nest-cloud/boot) module.

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
      LoadbalanceModule.register({dependencies: [NEST_BOOT]})
  ],
})
export class ApplicationModule {}
```

##### Nest-boot config file

```yaml
consul:
  host: localhost
  port: 8500
loadbalance:
  rules:
    - {service: 'test-service', ruleCls: 'RandomRule'}
    - {service: 'user-service', ruleCls: '../rules/CustomRule'}
```

#### Usage

```typescript
import { Component } from '@nestjs/common';
import { InjectLoadbalancee, Loadbalance } from '@nestcloud/consul-loadbalance';

@Component()
export class TestService {
  constructor(@InjectLoadbalancee() private readonly lb: Loadbalance) {}

  async chooseOneNode() {
      const node = this.lb.choose('user-service');
  }
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

#### chooseLoadbalancer\(service: string\): Loadbalancer

Get loadbalancer.

| field | type | description |
| :--- | :--- | :--- |
| service | string | the service name |

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
