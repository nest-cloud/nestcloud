
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Config

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

A NestCloud component for getting and watching configurations from consul kv or kubernetes configmaps.

## Installation

```bash
# consul backend
$ npm i --save @nestcloud/consul consul @nestcloud/config
# etcd backend
$ npm i --save @nestcloud/etcd etcd3 @nestcloud/config
# kubernetes backend
$ npm i --save @nestcloud/config @nestcloud/kubernetes
```

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConsulModule } from '@nestcloud/consul';
import { EtcdModule } from '@nestcloud/etcd';
import { KubernetesModule } from '@nestcloud/kuberentes';
import { ConfigModule } from '@nestcloud/config';
import { BootModule } from '@nestcloud/boot';
import { BOOT, CONSUL, ETCD, KUBERNETES } from '@nestcloud/common';

@Module({
    imports: [
        BootModule.forRoot({
            filePath: path.resolve(__dirname, '../config.yaml'),
        }),
        // Consul Backend
        ConsulModule.forRootAsync({ inject: [BOOT] }),
        ConfigModule.forRootAsync({ inject: [BOOT, CONSUL] }),
        // Etcd Backend
        EtcdModule.forRootAsync({ inject: [BOOT] }),
        ConfigModule.forRootAsync({ inject: [BOOT, ETCD] }),
        // Kubernetes Backend
        KubernetesModule.forRootAsync({ inject: [BOOT] }),
        ConfigModule.forRootAsync({ inject: [BOOT, KUBERNETES] }),
    ],
})
export class AppModule {
}
```

### Configurations

`config.key` is available for consul backend and etcd backend.
`config.key`, `config.namespace`, `config.path` are only available for kubernetes configMap.

```yaml
config:
  name: nestcloud-conf
  namespace: default
  path: config.yaml
```

#### Configurations In Consul KV Or Etcd

```yaml
user:
  info:
    name: 'test'
```

#### Configurations In Kubernetes ConfigMap

```yaml
apiVersion: v1
data:
  config.yaml: |-
    user:
      info:
        name: 'test'

kind: ConfigMap
metadata:
  name: nestcloud-conf
  namespace: default
```

#### Inject Config Client

```typescript
import { Injectable,OnModuleInit } from '@nestjs/common';
import { InjectConfig, Config } from '@nestcloud/config';

@Injectable()
export class ConfigService implements OnModuleInit {
  constructor(
      @InjectConfig() private readonly config: Config
  ) {}

  onModuleInit() {
      const userInfo = this.config.get('user.info', {name: 'judi'});
      console.log(userInfo);
  }
}
```

#### Inject value

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigValue } from '@nestcloud/config';

@Injectable()
export class ConfigService {
  @ConfigValue('user.info', {name: 'judi'})
  private readonly userInfo;
}
```

## API

### class ConfigModule

#### static forRootAsync\(options\): DynamicModule

Register config module.

| field             | type     | description                                              |
| :---------------- | :------- | :------------------------------------------------------- |
| options.inject    | string[] | BOOT, CONSUL, KUBERNETES                                 |
| options.name      | string   | key of the consul kv or name of the kubernetes configMap |
| options.namespace | string   | the kubernetes namespace                                 |
| options.path      | string   | the path of the kubernetes configMap                     |

### class Config

#### get\(path?: string, defaults?: any\): any

Get configuration from consul kv.

| field    | type   | description                                              |
| :------- | :----- | :------------------------------------------------------- |
| path     | string | the path of the configuration                            |
| defaults | any    | default value if the specific configuration is not exist |

#### getKey\(\): string

Get the current key.

#### watch\(path: string, callback: \(configs: any\) =&gt; void\): void

Watch the configurations.

| field    | type                   | description       |
| :------- | :--------------------- | :---------------- |
| callback | \(configs\) =&gt; void | callback function |

#### async set\(path: string, value: any\): void

Update configuration.

| field | type   | description                   |
| :---- | :----- | :---------------------------- |
| path  | string | the path of the configuration |
| value | any    | the configuration             |


### Decorators

#### ConfigValue\(path?: string, defaultValue?: any\): PropertyDecorator

Inject configuration to attribute. It will change realtime when the value changed in consul kv.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
