# 定时任务

Schedule 采用 decorator 实现，配置定时任务更加简单快捷。

## 安装

```bash
npm install @nestcloud/schedule --save
```

## 如何使用

```typescript
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestcloud/schedule';

@Module({
  imports: [
    ScheduleModule.register(),
  ]
})
export class AppModule {
}
```

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule } from '@nestcloud/schedule';

@Injectable() // Only support SINGLETON scope
export class ScheduleService extends NestSchedule {    
  @Cron('0 0 2 * *', {
    startTime: new Date(), 
    endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  })
  async cronJob() {
    console.log('executing cron job');
  }
  
  @Timeout(5000)
  onceJob() {
    console.log('executing once job');
  }
  
  @Interval(2000)
  intervalJob() {
    console.log('executing interval job');
    
    // 如果返回 true，会立即停止该任务调度
    return true;
  }
}
```

### 动态创建任务

```typescript
import { Injectable } from '@nestjs/common';
import { InjectSchedule, Schedule } from '@nestcloud/schedule';

@Injectable()
export class ScheduleService {    
  constructor(
    @InjectSchedule() private readonly schedule: Schedule,
  ) {
  }
  
  createJob() {
    // Schedule a 2s interval job
    this.schedule.scheduleIntervalJob('my-job', 2000, () => {
      console.log('executing interval job');
    });
  }
  
  cancelJob() {
    this.schedule.cancelJob('my-job');
  }
}
```

### 分布式支持

#### 1. 继承 NestDistributedSchedule 类

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, NestDistributedSchedule } from '@nestcloud/schedule';

@Injectable()
export class ScheduleService extends NestDistributedSchedule {  
  constructor() {
    super();
  }
  
  async tryLock(method: string) {
    if (lockFail) {
      return false;
    }
    
    return () => {
      // Release here.
    }
  }
  
  @Cron('0 0 4 * *')
  async cronJob() {
    console.log('executing cron job');
  }
}
```

#### 2. 使用 UseLocker 装饰器

```typescript
import { ILocker, IScheduleConfig, InjectSchedule, Schedule } from '@nestcloud/schedule';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MyLocker implements ILocker {
  private key: string;
  private config: IScheduleConfig;

  constructor(
    @InjectSchedule() private readonly schedule: Schedule,
  ) {
  }

  init(key: string, config: IScheduleConfig): void {
    this.key = key;
    this.config = config;
    console.log('init my locker: ', key, config);
  }

  release(): any {
    console.log('release my locker');
  }

  tryLock(): Promise<boolean> | boolean {
    console.log('apply my locker');
    return true;
  }
}
```

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, NestSchedule, UseLocker } from '@nestcloud/schedule';
import { MyLocker } from './my.locker';

@Injectable()
export class ScheduleService extends NestSchedule {  
  @Cron('0 0 4 * *')
  @UseLocker(MyLocker)
  async cronJob() {
    console.log('executing cron job');
  }
}
```

### 自定义日志

默认使用 console，如果需要自定义日志，需要实现 NestJS 的 LoggerService 接口

```typescript
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestcloud/schedule';
import { LoggerService } from '@nestjs/common';

export class NestLogger implements LoggerService {
    log(message: string): any {
        console.log(message);
    }

    error(message: string, trace: string): any {
        console.error(message, trace);
    }

    warn(message: string): any {
        console.warn(message);
    }
}

@Module({
  imports: [
    ScheduleModule.register({
      logger: new NestLogger(),
    }),
  ]
})
export class AppModule {
}
```


## API

### class ScheduleModule

#### static register\(config: IGlobalConfig\): DynamicModule

注册定时任务模块

| field | type | required | description |
| --- | --- | --- | --- |
| config.enable | boolean | false | 启用/禁用调度器，默认启用 |
| config.maxRetry | number | false |  重试次数，默认 -1 不重试 |
| config.retryInterval | number | false | 重试间隔，默认 5s |
| config.logger | LoggerService \| boolean | false | 自定义日志，默认为 console |

### class Schedule

#### scheduleCronJob(key: string, cron: string, callback: JobCallback, config?: ICronJobConfig)

创建 CRON 任务

| field | type | required | description |
| --- | --- | --- | --- |
| key | string | true | 全局唯一 key |
| cron | string | true | cron 表达式 |
| callback | () => Promise&lt;boolean&gt; | boolean | 任务回调，回调 return true 会停止该任务调度 |
| config.startTime | Date | false | 任务开始时间 |
| config.endTime | Date | false | 任务结束时间 |
| config.enable | boolean | false | 启用/禁用调度该任务，默认启用 |
| config.maxRetry | number | false |  重试次数，默认 -1 不重试 |
| config.retryInterval | number | false | 重试间隔，默认 5s |

#### scheduleIntervalJob(key: string, interval: number, callback: JobCallback, config?: IJobConfig)

创建循环执行任务

| field | type | required | description |
| --- | --- | --- | --- |
| key | string | true | 全局唯一 key |
| interval | number | true | 任务执行间隔时间，单位毫秒 |
| callback | () => Promise&lt;boolean&gt; | boolean | 任务回调，回调 return true 会停止该任务调度 |
| config.enable | boolean | false | 启用/禁用调度该任务，默认启用 |
| config.maxRetry | number | false |  重试次数，默认 -1 不重试 |
| config.retryInterval | number | false | 重试间隔，默认 5s |

#### scheduleTimeoutJob(key: string, timeout: number, callback: JobCallback, config?: IJobConfig)

创建单次执行任务

| field | type | required | description |
| --- | --- | --- | --- |
| timeout | number | true | 任务执行延迟时间，单位毫秒 |
| callback | () => Promise&lt;boolean&gt; | boolean | 任务回调，回调 return true 会停止该任务调度 |
| config.enable | boolean | false | 启用/禁用调度该任务，默认启用 |
| config.maxRetry | number | false |  重试次数，默认 -1 不重试 |
| config.retryInterval | number | false | 重试间隔，默认 5s |

#### cancelJob(key: string)

取消任务调度.


## 装饰器

### Cron(expression: string, config?: ICronJobConfig): MethodDecorator

创建 CRON 任务

| field | type | required | description |
| --- | --- | --- | --- |
| expression | string | true | cron 表达式 |
| config.startTime | Date | false | 任务开始时间 |
| config.endTime | Date | false | 任务结束时间 |
| config.enable | boolean | false | 启用/禁用调度该任务，默认启用 |
| config.maxRetry | number | false |  重试次数，默认 -1 不重试 |
| config.retryInterval | number | false | 重试间隔，默认 5s |

### Interval(interval: number, config?: IJobConfig): MethodDecorator

创建循环执行任务

| field | type | required | description |
| --- | --- | --- | --- |
| key | string | true | 全局唯一 key |
| interval | number | true | 任务执行间隔时间，单位毫秒 |
| callback | () => Promise&lt;boolean&gt; | boolean | 任务回调，回调 return true 会停止该任务调度 |
| config.enable | boolean | false | 启用/禁用调度该任务，默认启用 |
| config.maxRetry | number | false |  重试次数，默认 -1 不重试 |
| config.retryInterval | number | false | 重试间隔，默认 5s |

### Timeout(timeout: number, config?: IJobConfig): MethodDecorator

创建单次执行任务

| field | type | required | description |
| --- | --- | --- | --- |
| timeout | number | true | 任务执行延迟时间，单位毫秒 |
| callback | () => Promise&lt;boolean&gt; | boolean | 任务回调，回调 return true 会停止该任务调度 |
| config.enable | boolean | false | 启用/禁用调度该任务，默认启用 |
| config.maxRetry | number | false |  重试次数，默认 -1 不重试 |
| config.retryInterval | number | false | 重试间隔，默认 5s |

### InjectSchedule(): PropertyDecorator

注入 Schedule 实例

### UseLocker(locker: ILocker | Function): MethodDecorator

使用分布式锁，使任务支持分布式，如果使用 [NestCloud](https://github.com/nest-cloud/nestcloud)，Locker 支持依赖注入，否则不支持。
