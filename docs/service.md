# 服务注册于发现

Consul-Service 提供在服务启动的时候向 Consul 注册服务，服务退出的时候取消注册服务，服务健康检查以及发现其他服务等功能。

## 安装

```bash
# consul backend
$ npm install @nestcloud/service @nestcloud/consul consul --save
# etcd backend
$ npm install @nestcloud/service @nestcloud/etcd etcd3 --save
```

## 注册模块

### 使用 Consul 作为服务注册中心

```yaml
service:
  discoveryHost: localhost
  healthCheck:
    timeout: 1s
    interval: 10s
    route: /health
    protocol: http
  maxRetry: 5
  retryInterval: 5000
  id: your-service-id
  name: your-service-name
  port: 3000
```

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ServiceModule.register({dependencies: [NEST_BOOT, NEST_CONSUL]}),
  ],
})
export class ApplicationModule {}
```

### 使用 Etcd 作为服务注册中心

```yaml
service:
  discoveryHost: localhost
  healthCheck:
    ttl: 20
  maxRetry: 5
  retryInterval: 5000
  id: your-service-id
  name: your-service-name
  port: 3000
```

```typescript
import { Module } from '@nestjs/common';
import { EtcdModule } from '@nestcloud/etcd';
import { ServiceModule } from '@nestcloud/service';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';

@Module({
  imports: [
      EtcdModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ServiceModule.register({dependencies: [NEST_BOOT, NEST_CONSUL]}),
  ],
})
export class ApplicationModule {}
```


## 获取可用服务

```typescript
import { Injectable } from '@nestjs/common';
import { InjectService, Service } from '@nestcloud/service';

@Injectable()
export class TestService {
  constructor(
      @InjectService() private readonly service: Service
  ) {}

  getServices() {
      const services = this.service.getServices('example-service', {passing: true});
      console.log(services);
  }
}
```

## 检查策略

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

推荐使用 [@nestjs/terminus](https://github.com/nestjs/terminus) 模块

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
    interval: 10s
    dockerContainerId: 2ddd99fd268c
```

## API 文档

### class ServiceModule

#### static register\(options: RegisterOptions\): DynamicModule

注册 service 模块

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string\[\] | 如果 dependencies 设置为 \[NEST\_BOOT\]，则通过 @nestcloud/boot 模块加载配置 |
| options.id | string | 服务 ID |
| options.name | string | 服务名称 |
| options.port | number | 服务端口号 |
| options.includes | string[] | 设置需要同步到本地的服务名字，默认会从 Consul 同步所有服务 |
| options.discoveryHost | string | 服务对外提供服务的IP，如果服务器有多块网卡则需要手动指定，否则不需要 |
| options.healthCheck.timeout | number | 服务健康检查超时时间，默认1s |
| options.healthCheck.interval | number | 服务健康检查心跳时间，默认10s |
| options.healthCheck.route | string | 健康检查 URL，默认 /health |
| options.healthCheck.protocol | string | 健康检查 URL 协议，默认 http |
| options.healthCheck.deregisterCriticalServiceAfter | string | 在指定时间之后移除不健康服务 |
| options.healthCheck.tcp | string | host:port |
| options.healthCheck.script | string | 执行脚本进行健康检查 |
| options.healthCheck.dockerContainerId | string | 根据 docker container id 进行健健康检查 |
| options.healthCheck.shell | string | 容器中脚本路径 |
| options.healthCheck.ttl | string | time to live |
| options.healthCheck.notes | string | check 描述 |
| options.healthCheck.status | string | 服务初始状态 |
| options.maxRetry | number | 服务注册或者取消注册失败重试次数 |
| options.retryInterval | number | 服务注册或者取消注册额失败重试间隔 |


## API 文档

### class ConsulService

#### getServices\(\): { \[service: string\]: IServiceNode\[\] }

获取所有服务和运行服务的节点列表

#### getServiceNames\(\): string\[\]

获取所有服务名字

#### getServiceNodes(service: string, passing?: boolean): IServiceNode\[\]

获取指定服务的节点列表

#### watch\(service: string, callback: \(nodes: IServiceNode\[\]\) =&gt; void\): void

监听指定服务节点列表变化

#### **watchServiceList\(callback: \(services: string\[\]\) =&gt; void\): void**

监听服务列表变化

