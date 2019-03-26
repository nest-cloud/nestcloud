<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

A component of [nestcloud](http://github.com/nest-cloud/nestcloud). NestCloud is a nest framework micro-service solution.
  
[中文文档](https://nestcloud.org/solutions/fu-wu-zhu-ce-yu-fa-xian)

This is a [Nest](https://github.com/nestjs/nest) module provide service registration and service discovery.

## Installation

```bash
$ npm i --save @nestcloud/consul-service @nestcloud/consul consul
```

## Quick Start

#### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulServiceModule } from '@nestcloud/consul-service';

@Module({
  imports: [
      ConsulModule.register({
          host: '127.0.0.1',
          port: 8500
      }),
      ConsulServiceModule.register({
           serviceId: 'node1',
           serviceName: 'user-service',
           port: 3001,
           consul: {
               discoveryHost: 'localhost',
               healthCheck: {
                   timeout: '1s',
                   interval: '10s',
                   route: '/health',
               },
               maxRetry: 5,
               retryInterval: 3000,
           }
      }),
  ],
})
export class ApplicationModule {}
```

If you use [@nestcloud/boot](https://github.com/nest-cloud/boot) module.

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConsulServiceModule.register({dependencies: [NEST_BOOT]}),
  ],
})
export class ApplicationModule {}
```

#### Simple Boot Config

```yaml
web: 
  serviceId: node1
  serviceName: user-service
  port: 3001
consul:
  host: localhost
  port: 8500
  discoveryHost: localhost
  healthCheck:
    timeout: 1s
    interval: 10s
    route: /health
  # when register / deregister the service to consul fail, it will retry five times.
  maxRetry: 5
  retryInterval: 5000
```

#### Usage

```typescript
import { Component } from '@nestjs/common';
import { InjectConsulService, ConsulService } from '@nestcloud/consul-service';

@Component()
export class TestService {
  constructor(@InjectConsulService() private readonly service: ConsulService) {}

  getServices() {
      const services = this.service.getServices('user-service', {passing: true});
      this.service.onUpdate('user-service', services => {
          console.log(services);
      });
      console.log(services);
  }
}
```

## Checks

### Script + Interval

```yaml
consul:
  healthCheck:
    timeout: 1s
    interval: 10s
    script: /root/script/check.sh
```

### Http + Interval

```yaml
consul:
  healthCheck:
    timeout: 1s
    interval: 10s
    protocol: http
    route: /health
```

### Tcp + Interval

```yaml
consul:
  healthCheck:
    timeout: 1s
    interval: 10s
    tcp: localhost:3000
```

### Time To Live

```yaml
consul:
  healthCheck:
    ttl: 60s
```

### Docker + Interval

```yaml
consul:
  healthCheck:
    dockerContainerId: 2ddd99fd268c
```

## API

### class ConsulServiceModule

#### static register\(options: RegisterOptions\): DynamicModule

Import nest consul service module.

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string[] | if you are using @nestcloud/boot module, please set [NEST_BOOT] |
| options.serviceId | string | the service id |
| options.serviceName | string | the service name |
| options.port | number | the service port |
| options.consul.discoveryHost | string | the discovery ip |
| options.consul.healthCheck.timeout | number | the health check timeout, default 1s |
| options.consul.healthCheck.interval | number | the health check interval，default 10s |
| options.consul.healthCheck.deregisterCriticalServiceAfter | string | timeout after which to automatically deregister service if check remains in critical state | 
| options.consul.healthCheck.protocol | string | https or http, default is http. | 
| options.consul.healthCheck.tcp | string | host:port to test, passes if connection is established, fails otherwise. | 
| options.consul.healthCheck.script | string | path to check script, requires interval. | 
| options.consul.healthCheck.dockerContainerId | string | Docker container ID to run script. | 
| options.consul.healthCheck.shell | string | shell in which to run script (currently only supported with Docker). | 
| options.consul.healthCheck.ttl | string | time to live before check must be updated, instead of http/tcp/script and interval (ex: 60s). | 
| options.consul.healthCheck.notes | string | human readable description of check. | 
| options.consul.healthCheck.status | string | initial service status. | 
| options.consul.healthCheck.route | string | the health check url, default is /health. | 
| options.consul.maxRetry | number | the max retry count when register service fail |
| options.consul.retryInterval | number | the retry interval when register service fail |

### class ConsulService

#### getServices\(serviceName: string, options?: object\): Server[]

Get available services.

#### getAllServices()

Get all services

#### onServiceChange(service: string, callback: (servers: Server[]) => void): void

watch service change

#### onServiceListChange(callback: (newServices: string[]) => void): void

watch service list change

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
