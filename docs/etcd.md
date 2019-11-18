# Etcd

## Description

Etcd 模块

## 安装

```bash
$ npm i --save @nestcloud/etcd etcd3
```

## 快速开始

### 注册模块

```typescript
import { Module } from '@nestjs/common';
import { EtcdModule } from '@nestcloud/etcd';

@Module({
  imports: [
      EtcdModule.register(),
  ],
})
export class ApplicationModule {}
```

### 如何使用

```typescript
import { Injectable, IEtcd } from '@nestjs/common';
import { InjectEtcd } from '@nestcloud/etcd';

@Injectable()
export class TestService {
  constructor(
      @InjectEtcd() private readonly etcd: IEtcd,
  ) {
  }
}
```

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
