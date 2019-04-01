# Migrations

## Boot

### 1. Inject Boot Value

Remove Bootstrap decorator.

old:

```typescript
import { Injectable } from '@nestjs/common';
import { Bootstrap, BootValue } from '@nestcloud/boot';

@Injectable()
@Bootstrap()
export class TestService {
  @BootValue('service.port', 3000)
  private readonly port: number;

  getPort() {
      return this.port;
  }
}
```

new:

```typescript
import { Injectable } from '@nestjs/common';
import { BootValue } from '@nestcloud/boot';

@Injectable()
export class TestService {
  @BootValue('service.port', 3000)
  private readonly port: number;

  getPort() {
      return this.port;
  }
}
```

### 2. Change Template Engine

Use handlebars.js instead original engine.

old:

```typescript
process.env.SERVICE_ID = 'your-service-id';
process.env.SERVICE_NAME = 'your-service-name';
```

```yaml
service:
  id: ${ SERVICE_ID }
  name: ${ SERVICE_NAME }
  port: 3000
  # not support
  address: http://${{ service.name }}:${{ service.port }}
```

result:

```yaml
service:
  id: your-service-id
  name: your-service-name
  port: 3000
```

new:

template:

```typescript
process.env.SERVICE_ID = 'your-service-id';
process.env.SERVICE_NAME = 'your-service-name';
```

```yaml
service:
  id: ${{ SERVICE_ID }}
  name: ${{ SERVICE_NAME }}
  port: 3000
  address: http://${{ service.name }}:${{ service.port }}
```

result:

```yaml
service:
  id: your-service-id
  name: your-service-name
  port: 3000
  address: http://your-service-name:3000
```

## Consul Config

### 1. Inject Config Value

Remove Configuration decorator.

old: 

```typescript
import { Injectable } from '@nestjs/common';
import { Configuration, ConfigValue } from '@nestcloud/consul-config';

@Injectable()
@Configuration()
export class TestService {
  @ConfigValue('user.info', {name: 'judi'})
  private readonly userInfo;

  getUserInfo() {
      return this.userInfo;
  }
}
```

new:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigValue } from '@nestcloud/consul-config';

@Injectable()
export class TestService {
  @ConfigValue('user.info', {name: 'judi'})
  private readonly userInfo;

  getUserInfo() {
      return this.userInfo;
  }
}
```

### 2. Configurations

Remove retry param and remove key internal expression, use boot expression(${{ TEST }}) instead.

old:

```yaml
consul:
  host: localhost
  port: 8500
  service: 
    id: null
    name: example-service
  config:
    key: config__{serviceName}__${env}
    retry: 5
```

new:

```yaml
consul:
  host: localhost
  port: 8500
  service: 
    id: null
    name: example-service
  config:
    key: config__${{ consul.service.name }}__${{ NODE_ENV }}
```

### 3. onChange(callback: Function) method

the new method is watch(path: string, callback: Function).

old:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectConfig, ConsulConfig } from '@nestcloud/consul-config';

@Injectable()
export class TestService {
  constructor(
      @InjectConfig() private readonly config: ConsulConfig
  ) {}

  getUserInfo() {
      this.config.onChange(configs => {
          console.log(configs.service.name);
      });
  }
}
```

new:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectConfig, ConsulConfig } from '@nestcloud/consul-config';

@Injectable()
export class TestService {
  constructor(
      @InjectConfig() private readonly config: ConsulConfig
  ) {}

  getUserInfo() {
      this.config.watch('service.name', name => {
          console.log(name);
      });
  }
}
```

## Consul

### 1. Inject Consul KV

Remove ConsulKV decorator, use WatchKV instead.

old:

```typescript
import { Injectable } from '@nestjs/common';
import { ConsulKV } from '@nestcloud/consul';

@Injectable()
export class TestService {
  @ConsulKV('test_key', 'yaml', {})
  private readonly config: any;
}
```

new:


```typescript
import { Injectable } from '@nestjs/common';
import { WatchKV } from '@nestcloud/consul';

@Injectable()
export class TestService {
  @WatchKV('test_key', 'yaml', {})
  private readonly config: any;
}
```

## Consul Loadbalance

### 1. Configurations

Add options.customRulePath param, if you use custom lb rule, you should config this param.

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

### 2. New Choose decorator

Add a new Choose decorator, same as lb.choose method.

```typescript
import { Injectable } from '@nestjs/common';
import { IServer } from '@nestcloud/common';
import { Choose } from '@nestcloud/consul-loadbalance';

@Injectable()
export class TestService {
  @Choose('your-service-name')
  private readonly yourServiceServer: Iserver;
}
```

## Consul Service

### 1. Configuration

old:

```yaml
web:
  serviceId: your-service-id
  serviceName: your-service-name
  port: 3000
consul:
  host: localhost
  port: 8500
  discoveryHost: localhost
  
  healthCheck:
    timeout: 1s
    interval: 10s
    route: /health
  maxRetry: 5
  retryInterval: 5000
```

new:

```yaml
consul:
  host: localhost
  port: 8500
  discoveryHost: localhost
  service:
    id: your-service-id
    name: your-service-name
    port: 3000
    includes: 
      - your-service-1
      - your-service-2
  healthCheck:
    timeout: 1s
    interval: 10s
    route: /health
  maxRetry: 5
  retryInterval: 5000
```

### 2. Method change

getAllServices -> getServiceNames

getServices -> getServiceNodes

onServiceChange -> watch

onServiceListChange -> watchServiceList

## Feign

### 1. Configurations

Now, the feign configurations support get from boot or consul config module.

old:

```typescript
import { Module } from '@nestjs/common';
import { FeignModule } from '@nestcloud/feign';

@Module({
  imports: [
      FeignModule.register({ dependencies: [NEST_BOOT] }),
  ],
})
export class ApplicationModule {}
```

configurations:

```yaml
feign:
  axios:
    timeout: 1000
```

Use Boot module:

```typescript
import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { FeignModule } from '@nestcloud/feign';
import { NEST_BOOT } from '@nestcloud/common';

@Module({
  imports: [
      BootModule.register(__dirname, 'bootstrap.yml'),
      FeignModule.register({ dependencies: [NEST_BOOT] }),
  ],
})
export class ApplicationModule {}
```

Use ConsulConfig module:

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';
import { FeignModule } from '@nestcloud/feign';
import { NEST_CONSUL_CONFIG } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({host: '127.0.0.1', port: 8500}),
      ConsulConfigModule.register({key: 'example-service-configs'}),
      FeignModule.register({ dependencies: [NEST_CONSUL_CONFIG] }),
  ],
})
export class ApplicationModule {}
```

### 2. Interceptor decorator

Interceptor decorator changed to UseInterceptor, the new Interceptor supports dynamic import and inject features.
