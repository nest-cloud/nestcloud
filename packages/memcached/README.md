<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

This is a [Memcached](http://memcached.org/) module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm i --save @nestcloud/memcached memcached
```

## Quick Start

#### Import Module

```typescript
import { Module } from '@nestjs/common';
import { MemcachedModule } from '@nestcloud/memcached';

@Module({
  imports: [
      MemcachedModule.register({
        uri: [
           '192.168.0.102:11211',
           '192.168.0.103:11211',
           '192.168.0.104:11211'
        ],
        retries: 3
      })
  ],
})
export class ApplicationModule {}
```

If you use [@nestcloud/boot](https://github.com/nest-cloud/boot) module.

```typescript
import { Module } from '@nestjs/common';
import { MemcachedModule } from '@nestcloud/memcached';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT } from '@nestcloud/common';

@Module({
  imports: [
      BootModule.register(__dirname, 'bootstrap.yml'),
      MemcachedModule.register({dependencies: [NEST_BOOT]})
  ],
})
export class ApplicationModule {}
```

##### bootstrap.yml

```yaml
memcached:
  uri: ['192.168.0.102:11211', '192.168.0.103:11211', '192.168.0.104:11211'],
  retries: 3
```

If you use [@nestcloud/consul-config](https://github.com/nest-cloud/consul-config) module.

```typescript
import { Module } from '@nestjs/common';
import { MemcachedModule } from '@nestcloud/memcached';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';
import { NEST_CONSUL_CONFIG } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({/* ignore */}),
      ConsulConfigModule.register({/* ignore */}),
      MemcachedModule.register({dependencies: [NEST_CONSUL_CONFIG]})
  ],
})
export class ApplicationModule {}
```

##### config in consul kv

```yaml
memcached:
  uri: ['192.168.0.102:11211', '192.168.0.103:11211', '192.168.0.104:11211'],
  retries: 3
```

#### Memcached Client Injection

```typescript
import { Component } from '@nestjs/common';
import { InjectMemcachedClient, Memcached } from '@nestcloud/memcached';

@Component()
export class TestService {
  constructor(@InjectMemcachedClient() private readonly memClient: Memcached) {}

  async addValue(key: string, value: string): void {
      await this.memClient.add(key, value);
  }
  
  async deleteValue(key: string): void {
      await this.memClient.del(key);
  }
}
```

## Support

  NestCloud is an MIT-licensed open source project.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
