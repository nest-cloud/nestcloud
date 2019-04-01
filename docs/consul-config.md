# 配置中心

Consul-Config 以 Consul KV 作为微服务的配置中心，从 Consul KV 读取所需的配置并支持对配置内容改动的监听。

## 安装

```bash
npm install consul @nestcloud/consul@next @nestcloud/consul-config@next --save
```

## 注册模块

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConsulConfigModule.register({dependencies: [NEST_BOOT]}),
  ],
})
export class ApplicationModule {}
```

## 配置

```yaml
consul:
  host: localhost
  port: 8500
  service: 
    id: null
    name: example-service
  config:
    key: config__${{ consul.service.name }}__${{ consul.service.id }}
```

## 从配置中心获取配置

有两种方式可以从配置中心获取配置，一种是通过 get 函数获取，另一种是通过装饰器获取，代码如下：

### Get 方式获取配置

```typescript
import { Injectable } from '@nestjs/common';
import { InjectConfig, ConsulConfig } from '@nestcloud/consul-config';

@Injectable()
export class TestService {
    constructor(
        @InjectConfig() private readonly config: ConsulConfig,
    ) {
    }
    
    test() {
        this.config.get('info', 'default');
    }
}
```

### 装饰器方式获取配置

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigValue } from '@nestcloud/consul-config';

@Injectable()
export class TestService {
    @ConfigValue('info', 'default')
    private readonly info: string;
}
```

## API 文档

### class ConsulConfigModule

#### static register\(options\): DynamicModule

注册 config 模块

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string\[\] | 如果 dependencies 设置为 \[NEST\_BOOT\]，则通过 @nestcloud/boot 模块加载配置。 |
| options.key | string | consul kv 的 key |

### class ConsulConfig

#### get\(path?: string, defaults?: any\): any

获取存储在 consul kv 中的配置

| field | type | description |
| :--- | :--- | :--- |
| path | string | 获取指定路径的配置，如果不指定则获取所有 |
| defaults | any | 如果指定路径的配置不存在则返回默认值 |

#### getKey\(\): string

获取当前使用的 key

#### watch\(path: string, callback&lt;T extends any&gt;: \(configs: T\) =&gt; void\): void

监听配置内容变化

| field | type | description |
| :--- | :--- | :--- |
| path | string | 获取指定配置的路径 |
| callback | \(configs\) =&gt; void | 配置数据发生变化的回调函数 |

#### async set\(path: string, value: any\): void

修改配置中心对应的配置数据

| field | type | description |
| :--- | :--- | :--- |
| path | string | 待修改配置的路径 |
| value | any | 待修改配置的内容 |

### 装饰器

#### InjectConfig\(\): PropertyDecorator

注入 ConsulConfig 对象。

#### ConfigValue\(path: string, defaultValue?: any\): PropertyDecorator

自动为类的属性赋值，并支持动态更新。



