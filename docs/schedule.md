# 定时任务

Schedule 采用 decorator 实现，配置定时任务更加简单快捷。

## 安装

```bash
npm install @nestcloud/schedule@next --save
```

## 如何使用

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule } from '@nestcloud/schedule';

@Injectable()
export class ScheduleService extends NestSchedule {  
  constructor() {
    super();
  }
  
  @Cron('0 0 2 * *', {
    startTime: new Date(), 
    endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    tz: 'Asia/Shanghai',
  })
  async test1() {
    console.log('executing job test1');
  }
  
  @Cron('0 0 4 * *')
  async test2() {
    console.log('executing job test2');
  }
  
  @Timeout(5000)
  onceJob() {
    console.log('executing once job');
  }
  
  @Interval(2000)
  intervalJob() {
    console.log('executing interval job');
    
    // if you want to cancel the job, you should return true;
    return true;
  }
}
```

## 分布式任务支持

Schedule 本身并不提供分布式锁实现，需要依赖第三方软件。

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, NestDistributedSchedule } from '@nestcloud/schedule';

@Injectable()
export class ScheduleService extends NestDistributedSchedule {  
  constructor() {
    super();
  }
  
  async tryLock(method: string) {
    // If try lock fail, you should throw an error.
    throw new Error('try lock fail');
    
    return () => {
      // Release here.
    }
  }
  
  @Cron('0 0 4 * *')
  async test() {
    console.log('executing job test');
  }
}
```

## 全局配置

```typescript
import { LoggerService } from '@nestjs/common';
import { defaults } from '@nestcloud/schedule';

class NestLogger implements LoggerService {
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

defaults.enable = true;
defaults.logger = new NestLogger();
defaults.maxRetry = -1;
defaults.retryInterval = 5000;
```

| field | type | description |
| :--- | :--- | :--- |
| defaults.enable | boolean | 启用/禁用 nest-schedule |
| maxRetry | number | 重试次数，默认不重试 |
| retryInterval | number | 重试间隔，默认 5s |
| logger | LoggerService \| boolean | 任务执行日志，默认 false，无日志 |

## API文档

### Cron\(expression: string, options?: CronOptions\): MethodDecorator

| field | type | description |
| :--- | :--- | :--- |
| expression | string | cron 表达式 |
| options.startTime | Date | 任务开始时间 |
| options.endTime | Date | 任务终止时间 |
| options.tz | string | 时区 |
| options | BaseOptions | 其他同全局配置 |

### Interval\(time: number, options: BaseOptions\): MethodDecorator

| field | type | description |
| :--- | :--- | :--- |
| time | number | 间隔时间 |
| options | BaseOptions | 同全局配置 |

### Timeout\(time: number, options: BaseOptions\): MethodDecorator

| field | type | description |
| :--- | :--- | :--- |
| time | number | 延迟时间 |
| options | BaseOptions | 同全局配置 |

