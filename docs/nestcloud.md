# 如何使用 NestCloud

## 安装组件

需要根据不同的服务注册中心选择安装不同的包，目前 NestCloud 支持 Consul，Etcd 和 Kubernetes。

### Consul Backend

```bash
$ npm install --save @nestcloud/core
$ npm install --save @nestcloud/common
$ npm install --save @nestcloud/boot 
$ npm install --save @nestcloud/consul 
$ npm install --save @nestcloud/service 
$ npm install --save @nestcloud/config 
$ npm install --save @nestcloud/loadbalance 
$ npm install --save @nestcloud/feign 
$ npm install --save @nestcloud/logger 
```

### Etcd Backend

```bash
$ npm install --save @nestcloud/core
$ npm install --save @nestcloud/common
$ npm install --save @nestcloud/boot 
$ npm install --save @nestcloud/etcd 
$ npm install --save @nestcloud/service 
$ npm install --save @nestcloud/config 
$ npm install --save @nestcloud/loadbalance 
$ npm install --save @nestcloud/feign 
$ npm install --save @nestcloud/logger 
```

### Kubernetes Backend

```bash
$ npm install --save @nestcloud/core
$ npm install --save @nestcloud/common
$ npm install --save @nestcloud/boot 
$ npm install --save @nestcloud/config 
$ npm install --save @nestcloud/loadbalance 
$ npm install --save @nestcloud/feign 
$ npm install --save @nestcloud/logger 
$ npm install --save @nestcloud/kubernetes 
```

### main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestCloud } from '@nestcloud/core';
import { NestLogger } from '@nestcloud/logger';

async function bootstrap() {
    const app = NestCloud.create(await NestFactory.create(AppModule, { 
        logger: new NestLogger({
            path: __dirname,
            filename: `config.yaml`,
        }),
    }));
    await app.listen(NestCloud.global.boot.get('consul.service.port', 3000));
}

bootstrap();
```

### app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { NEST_BOOT, NEST_LOADBALANCE, NEST_CONSUL } from '@nestcloud/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConfigModule } from '@nestcloud/config';
import { ServiceModule } from '@nestcloud/service';
import { LoadbalanceModule } from '@nestcloud/loadbalance';
import { FeignModule } from '@nestcloud/feign';
import { LoggerModule } from '@nestcloud/logger';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [
        LoggerModule.register(),
        BootModule.register(__dirname, `config.yaml`),
        ConsulModule.register({ dependencies: [NEST_BOOT] }),
        ConfigModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
        ServiceModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
        LoadbalanceModule.register({ dependencies: [NEST_BOOT] }),
        FeignModule.register({ dependencies: [NEST_BOOT, NEST_LOADBALANCE] }),
        TerminusModule.forRootAsync({
            useFactory: () => ({ endpoints: [{ url: '/health', healthIndicators: [] }] }),
        }),
    ]
})
export class AppModule {
}
```

### bootstrap.yaml

请查看 [Boot完整配置](config.md)
