# NestCloud

A NodeJS micro-service solution based on consul, writing by typescript language and NestJS framework.


## Components

### Boot

Get local configurations and environment values when the app bootstrap.


### Consul

Consul module.


### Consul-Config

Get & watch configurations from Consul KV.


### Consul-Service

Register & cancel register service, discovery other service.


### Consul-Loadbalance

Software load balancers primary for rest calls.


#### Feign

A http client that supports decorator and loadbalance.


### Memcached

Memcached module.


### Schedule

A job scheduler that supports distribute and decorator.

## Quick Start

main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestLogger } from '@nestcloud/logger';
import { NestCloud } from '@nestcloud/core';

async function bootstrap() {
    const app = NestCloud.create(await NestFactory.create(AppModule, {
        logger: new NestLogger({
            path: __dirname,
            filename: `config.yaml`
        }),
    }));

    await app.listen(3000);
}

bootstrap();
```

app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { 
    NEST_BOOT, 
    NEST_CONSUL_LOADBALANCE, 
    NEST_CONSUL_CONFIG
} from '@nestcloud/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { LoadbalanceModule } from '@nestcloud/consul-loadbalance';
import { FeignModule } from '@nestcloud/feign';
import { LoggerModule } from '@nestcloud/logger';
import { TerminusModule } from '@nestjs/terminus';

@Module({
    imports: [
        LoggerModule.register(),
        BootModule.register(__dirname, `config.yaml`),
        ConsulModule.register({ dependencies: [NEST_BOOT] }),
        ConsulConfigModule.register({ dependencies: [NEST_BOOT] }),
        ConsulServiceModule.register({ dependencies: [NEST_BOOT] }),
        LoadbalanceModule.register({ dependencies: [NEST_BOOT] }), // or NEST_CONSUL_CONFIG
        FeignModule.register({ dependencies: [NEST_CONSUL_LOADBALANCE] }),
        TerminusModule.forRootAsync({
            useFactory: () => ({ endpoints: [{ url: '/health', healthIndicators: [] }] }),
        }),
    ]
})
export class AppModule {
}
```


## Starter

You can use the [NestCloud-Starter](https://github.com/nest-cloud/nestcloud-starter) start your project quickly.


## Samples

[Samples](samples)

## Who used

![焱融云](https://nestcloud.org/_media/who-used/yanrong.svg)


## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
