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

### 2. Options

Options remove retry param and remove key internal expression, use boot expression(${{ TEST }}) instead.

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

