# Kubernetes

Kubernetes 客户端

## 安装

```bash
$ npm install --save @nestcloud/kubernetes
```

## 如何使用

### 使用外部 Kubernetes 集群

```typescript
import { Module } from '@nestjs/common';
import { KubernetesModule } from '@nestcloud/kubernetes';

@Module({
  imports: [
      KubernetesModule.register({kubeConfig: '/root/.kube/config'})
  ],
})
export class ApplicationModule {}
```

### 运行在 Kubernetes 集群内部

```typescript
import { Module } from '@nestjs/common';
import { KubernetesModule } from '@nestcloud/kubernetes';

@Module({
  imports: [
      KubernetesModule.register()
  ],
})
export class ApplicationModule {}
```

### 如何使用 Kubernetes 客户端

```typescript
import { Injectable, IKubernetes } from '@nestjs/common';
import { InjectKubernetes } from '@nestcloud/kubernetes';

@Injectable()
export class TestService {
  constructor(@InjectKubernetes() private readonly client: IKubernetes) {}

  async getConfigMaps() {
      const result = await this.client.api.v1.namespaces('default').configmaps('test-configmap').get();
      console.log(result);
  }
}
```
