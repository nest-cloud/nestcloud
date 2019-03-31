# 负载均衡

Consul-Loadbalance 提供本地负载均衡功能，目前支持的负载均衡策略有：随机（默认），轮询，加权。

## 安装

```bash
npm install consul @nestcloud/consul@next @nestcloud/consul-service@next @nestcloud/consul-loadbalance@next --save
```

## 注册模块

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { LoadbalanceModule } from '@nestcloud/consul-loadbalance';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConsulServiceModule.register({ dependencies: [NEST_BOOT] }), // or NEST_CONSUL_CONFIG
      LoadbalanceModule.register({ dependencies: [NEST_BOOT], customRulePath: __dirname }),
  ],
})
export class ApplicationModule {}
```

## 配置

```yaml
loadbalance:
  # global rule
  ruleCls: RandomRule
  rules:
    - {service: 'test-service', ruleCls: 'RandomRule'}
    - {service: 'user-service', ruleCls: 'rules/CustomRule'}
```

## 如何使用

```typescript
import { Injectable } from '@nestjs/common';
import { Loadbalance, InjectLoadbalance } from '@nestcloud/consul-loadbalance';

@Injectable()
export class TestService {
  constructor(
      @InjectLoadbalance() private readonly lb: Loadbalance
  ) {}
  
  test() {
      const node = this.lb.choose('test-service');
  }
}
```

### Choose Decorator 使用

```typescript
import { Injectable } from '@nestjs/common';
import { Iserver } from '@nestcloud/common';
import { Choose } from '@nestcloud/consul-loadbalance';

@Injectable()
export class TestService {
  @Choose('your-service-name')
  private readonly server: Iserver;
}
```

## 如何自定义负载均衡策略

```typescript
import { IRule, Loadbalancer } from '@nestcloud/consul-loadbalance';

export class MasterRule implements IRule {
    private loadbalancer: Loadbalancer;
    
    init(loadbalancer: Loadbalancer) {
        this.loadbalancer = loadbalancer;
    }

    choose() {
        const servers = this.loadbalancer.servers;
        if(servers.length) {
            return servers[0];
        }
        return null;
    }
}
```

## API 文档

### class LoadbalanceModule

#### static register\(options\): DynamicModule

注册 loadbalance 模块

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string\[\] | 如果 dependencies 设置为 \[NEST\_BOOT\]，则通过 @nestcloud/boot 加载配置，如果设置为 \[NEST\_CONSUL\_CONFIG\]，则通过 @nestcloud/consul-config 加载配置，支持动态更新 |
| options.ruleCls | string \| class | 负载均衡策略，支持：RandomRule，RoundRobinRule，WeightedResponseTimeRule 或者使用自定义策略，填写策略class文件的相对路径 |
| options.rules | RuleOption | 分别为不同的服务配置不同的负载均衡策略，例如：\[{service: '', ruleCls: ''}\] |
| options.customRulePath | string | 自定义复杂均衡策略文件的位置 |

### class Loadbalance

#### choose\(service: string\): Server

获取运行某服务的某台服务器。

| field | type | description |
| :--- | :--- | :--- |
| service | string | 服务名称 |

#### chooseLoadbalancer\(service: string\): Loadbalancer

获取 loadbalancer, 可以通过该对象操作运行某服务的服务器列表，例如添加修改删除等。

| field | type | description |
| :--- | :--- | :--- |
| service | string | 服务名称 |

### 装饰器

#### InjectLoadbalance\(\): PropertyDecorator

注入 Loadbalance 对象。

#### Choose\(service: string): PropertyDecorator

同调用 loadbalance.choose(service: string) 函数。

