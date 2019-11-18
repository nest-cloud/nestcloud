# 配置中心

Config 以 Consul KV 作为微服务的配置中心，从 Consul KV 读取所需的配置并支持对配置内容改动的监听。

## 安装

```bash
# consul backend
$ npm i --save @nestcloud/consul consul @nestcloud/config
# etcd backend
$ npm i --save @nestcloud/etcd etcd3 @nestcloud/config
# kubernetes backend
$ npm i --save @nestcloud/config
```

## 注册模块

### 使用 Consul 作为存储后端

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ConfigModule } from '@nestcloud/config';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConfigModule.register({dependencies: [NEST_BOOT, NEST_CONSUL]}),
  ],
})
export class ApplicationModule {}
```

### 使用 Etcd 作为存储后端

```yaml
config:
    key: config__${{ consul.service.name }}__${{ consul.service.id }}
```

```typescript
import { Module } from '@nestjs/common';
import { EtcdModule } from '@nestcloud/etcd';
import { ConfigModule } from '@nestcloud/config';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT, NEST_ETCD } from '@nestcloud/common';

@Module({
  imports: [
      EtcdModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConfigModule.register({dependencies: [NEST_BOOT, NEST_ETCD]}),
  ],
})
export class ApplicationModule {}
```

### 使用 Kubernetes ConfigMap 作为存储后端

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestcloud/config';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT, NEST_KUBERNETES } from '@nestcloud/common';

@Module({
  imports: [
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConfigModule.register({dependencies: [NEST_BOOT, NEST_KUBERNETES]})
  ],
})
export class ApplicationModule {}
```

### 配置

`config.key` 对 Consul 和 Etcd 作为存储后端的时候有效
`config.key`, `config.namespace`, `config.path` 只对 Kubernetes 作为存储后端的时候有效

```yaml
config:
  key: nestcloud-conf
  namespace: default
  path: config.yaml
```

## 从配置中心获取配置

有两种方式可以从配置中心获取配置，一种是通过 get 函数获取，另一种是通过装饰器获取，代码如下：

### Get 方式获取配置

```typescript
import { Injectable } from '@nestjs/common';
import { IConfig } from '@nestcloud/common';
import { InjectConfig } from '@nestcloud/config';

@Injectable()
export class TestService {
    constructor(
        @InjectConfig() private readonly config: IConfig,
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
import { ConfigValue } from '@nestcloud/config';

@Injectable()
export class TestService {
    @ConfigValue('info', 'default')
    private readonly info: string;
}
```

## API 文档

### class ConfigModule

#### static register\(options\): DynamicModule

注册 config 模块

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string\[\] | 如果 dependencies 设置为 \[NEST\_BOOT\]，则通过 @nestcloud/boot 模块加载配置。 |
| options.key | string | consul kv 的 key |
| options.namespace | string | kubernetes 命名空间 |
| options.path | string | kubernetes configMap 路径 |

### class IConfig

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

注入 IConfig 对象。

#### ConfigValue\(path: string, defaultValue?: any\): PropertyDecorator

自动为类的属性赋值，并支持动态更新。



