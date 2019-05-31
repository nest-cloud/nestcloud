
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Redis

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

This is a [Redis](https://redis.io/) module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm i --save @nestcloud/redis ioredis
```

## Quick Start

#### Import Module

```typescript
import { Module } from '@nestjs/common'
import { RedisModule } from '@nestcloud/redis'
import { NEST_BOOT } from '@nestcloud/common';
import { BootModule } from '@nestcloud/boot';

@Module({
    imports: [
        BootModule.register(__dirname, 'config.yml'),
        RedisModule.register({dependencies: [NEST_BOOT]})
    ],
})
export class AppModule {}
```

##### Boot Configurations

```yaml
redis:
  default:
    host: localhost
    port: 6379
```

#### Redis Client Injection

```typescript
import { Component } from '@nestjs/common';
import { InjectRedis } from '@nestcloud/redis';
import { Redis } from 'ioredis';

@Component()
export class TestService {
  constructor(
      @InjectRedis() private readonly redis: Redis
  ) {}
}
```

## Options

```typescript
interface RedisOptions {
    /**
     * Client name. default is default.
     */
    name?: string;
    /**
     * Dependency other module, such as NEST_BOOT, NEST_CONSUL_CONFIG.
     */
    dependencies?: string[];
    port?: number;
    host?: string;
    /**
     * 4 (IPv4) or 6 (IPv6), Defaults to 4.
     */
    family?: number;
    /**
     * Local domain socket path. If set the port, host and family will be ignored.
     */
    path?: string;
    /**
     * TCP KeepAlive on the socket with a X ms delay before start. Set to a non-number value to disable keepAlive.
     */
    keepAlive?: number;
    connectionName?: string;
    /**
     * If set, client will send AUTH command with the value of this option when connected.
     */
    password?: string;
    /**
     * Database index to use.
     */
    db?: number;
    /**
     * When a connection is established to the Redis server, the server might still be loading
     * the database from disk. While loading, the server not respond to any commands.
     * To work around this, when this option is true, ioredis will check the status of the Redis server,
     * and when the Redis server is able to process commands, a ready event will be emitted.
     */
    enableReadyCheck?: boolean;
    keyPrefix?: string;
    /**
     * When the return value isn't a number, ioredis will stop trying to reconnect.
     * Fixed in: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/15858
     */
    retryStrategy?(times: number): number | false;
    /**
     * By default, all pending commands will be flushed with an error every
     * 20 retry attempts. That makes sure commands won't wait forever when
     * the connection is down. You can change this behavior by setting
     * `maxRetriesPerRequest`.
     *
     * Set maxRetriesPerRequest to `null` to disable this behavior, and
     * every command will wait forever until the connection is alive again
     * (which is the default behavior before ioredis v4).
     */
    maxRetriesPerRequest?: number | null;
    /**
     * 1/true means reconnect, 2 means reconnect and resend failed command. Returning false will ignore
     * the error and do nothing.
     */
    reconnectOnError?(error: Error): boolean | 1 | 2;
    /**
     * By default, if there is no active connection to the Redis server, commands are added to a queue
     * and are executed once the connection is "ready" (when enableReadyCheck is true, "ready" means
     * the Redis server has loaded the database from disk, otherwise means the connection to the Redis
     * server has been established). If this option is false, when execute the command when the connection
     * isn't ready, an error will be returned.
     */
    enableOfflineQueue?: boolean;
    /**
     * The milliseconds before a timeout occurs during the initial connection to the Redis server.
     * default: 10000.
     */
    connectTimeout?: number;
    /**
     * After reconnected, if the previous connection was in the subscriber mode, client will auto re-subscribe these channels.
     * default: true.
     */
    autoResubscribe?: boolean;
    /**
     * If true, client will resend unfulfilled commands(e.g. block commands) in the previous connection when reconnected.
     * default: true.
     */
    autoResendUnfulfilledCommands?: boolean;
    lazyConnect?: boolean;
    tls?: tls.ConnectionOptions;
    sentinels?: Array<{ host: string; port: number; }>;
    name?: string;
    /**
     * Enable READONLY mode for the connection. Only available for cluster mode.
     * default: false.
     */
    readOnly?: boolean;
    /**
     * If you are using the hiredis parser, it's highly recommended to enable this option.
     * Create another instance with dropBufferSupport disabled for other commands that you want to return binary instead of string
     */
    dropBufferSupport?: boolean;
    /**
     * Whether to show a friendly error stack. Will decrease the performance significantly.
     */
    showFriendlyErrorStack?: boolean;
}
```

## Support

  NestCloud is an MIT-licensed open source project.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
