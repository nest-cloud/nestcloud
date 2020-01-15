
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Kubernetes

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

The kubernetes client module for nestcloud.

## Installation

```bash
$ npm install --save @nestcloud/kubernetes
```

## Usage

### Use External Cluster

```typescript
import { Module } from '@nestjs/common';
import { KubernetesModule } from '@nestcloud/kubernetes';

@Module({
  imports: [
      KubernetesModule.forRoot({ kubeConfig: '/root/.kube/config' })
  ],
})
export class AppModule {}
```

### Use Internal Cluster

```typescript
import { Module } from '@nestjs/common';
import { KubernetesModule } from '@nestcloud/kubernetes';

@Module({
  imports: [
      KubernetesModule.forRoot()
  ],
})
export class AppModule {}
```

### Use Client

```typescript
import { Injectable, IKubernetes } from '@nestjs/common';
import { InjectKubernetes } from '@nestcloud/kubernetes';

@Injectable()
export class TestService {
  constructor(
    @InjectKubernetes() private readonly client: IKubernetes,
  ) {
  }

  async getConfigMaps() {
      const namespace = 'default';
      const configMap = 'test-configmap';
      const result = await this.client.api.v1.namespaces(namespace).configmaps(configMap).get();
      console.log(result);
  }
}
```

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
