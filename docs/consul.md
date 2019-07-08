# Consul

Consul 是对 consul api 的封装，基于 node-consul，是服务发现和负载均衡的基础组件，并且提供了快速获取 Consul KV 功能。

## 安装

```bash
npm install consul @nestcloud/consul --save
```

## 注册模块

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT } from '@nestcloud/common';

@Module({
  imports: [
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConsulModule.register({dependencies: [NEST_BOOT]})
  ],
})
export class ApplicationModule {}
```

## Boot 配置

```yaml
consul:
  host: localhost
  port: 8500
```

## 如何使用

```typescript
import { Injectable } from '@nestjs/common';
import * as Consul from 'consul';
import { InjectConsul } from '@nestcloud/consul';

@Injectable()
export class TestService {
  constructor(
      @InjectConsul() private readonly consul: Consul
  ) {}
}
```

## @WatchKV Decorator

WatchKV 装饰器可以很方便的获取 Consul KV 中的数据，并且支持 Consul watch 功能，无需手动 watch。

```typescript
import { WatchKV } from '@nestcloud/consul';

export class TestService {
    @WatchKV('config_key', 'yaml', { port: 3000 })
    private readonly config: any;
}
```

## API 文档

### class ConsulModule

#### static register\(options: Options\): DynamicModule

注册 nest-consul 模块

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string\[\] | 如果 dependencies 设置为 \[NEST\_BOOT\]，则通过 @nestcloud/boot 模块加载配置。 |
| 其他 | any | 请参看 node-consul 文档 |

### Decorators

#### ConsulKV\(key: string, type?: 'json' \| 'yaml' \| 'text', defaults?: any\): PropertyDecorator

快速获取 consul kv 中的数据，并且支持动态更新。

