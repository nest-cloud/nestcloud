
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Schedule

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

This schedule module is forked from [@nestjs/schedule](https://github.com/nestjs/schedule).

And add some new features:

* Distributed supports that by using `UseLocker()` decorator.

* Retryable Job.

* Executing job immediately for `Interval` and `Timeout` job.


## Installation

```bash
$ npm i --save @nestcloud/schedule
```

## Usage

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
import { Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout, Interval } from '@nestcloud/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
  
  @Interval(5000)
  handleInterval() {
    this.logger.debug('Called every 5 seconds');
  }

  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called after 5 seconds');
  }
}
```

## Schedule Cron Job By Object Literal Syntax

@See [node-schedule#object-literal-syntax](https://github.com/node-schedule/node-schedule#object-literal-syntax)

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestcloud/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron({ 
    rule: '45 * * * * *',
    start: new Date(Date.now() + 5000),
    end: new Date(Date.now() + 10000),
    tz: 'Asia/Shanghai'
  })
  handleCron() {
    this.logger.debug('Called when the time is Sunday 14:30');
  }
}
```

## Schedule Cron Job With StartTime And EndTime

@See [node-schedule#set-startTime-and-endTime](https://github.com/node-schedule/node-schedule#set-starttime-and-endtime)

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestcloud/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron({ hour: 14, minute: 30, dayOfWeek: 0, tz: 'Asia/Shanghai' })
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
```

### Dynamic Schedule Job

```typescript

```

### Distributed Support

1. Implements `Locker` interface

```typescript
import { Locker } from '@nestcloud/schedule';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskLocker implements Locker {
  private name: string;

  init(name: string): void {
    this.name = name;
  }

  release(): any {
  }

  async tryLock(): Promise<boolean> {
    return true;
  }
}
```

2. Use your locker

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, UseLocker } from '@nestcloud/schedule';
import { TaskLocker } from './TaskLocker';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('45 * * * * *')
  @UseLocker(TaskLocker)
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
```


## API

### class ScheduleModule

#### static register\(\): DynamicModule

Register schedule module.


## Decorators

### Cron(rule: string | number | Date | CronObject | CronObjLiteral, options?: CronOptions): MethodDecorator

Schedule a cron job.

| field | type | required | description |
| --- | --- | --- | --- |
| rule | Date string number [CronObject CronObjLiteral](https://github.com/nest-cloud/nestcloud/tree/master/packages/schedule/interfaces/cron-options.interface)] | true | The cron rule |
| rule.dayOfWeek | number | true | Timezone |
| options.name | string | false | The unique job key |
| options.retries | number | false |  the max retry count, default is -1 not retry |
| options.retry | number | false | the retry interval, default is 5000 |

### Interval(timeout: number): MethodDecorator
### Interval(name: string, timeout: number): MethodDecorator
### Interval(name: string, timeout: number, options?: IntervalOptions): MethodDecorator

Schedule a interval job.

| field | type | required | description |
| --- | --- | --- | --- |
| timeout | number | true | milliseconds |
| options.retries | number | false |  the max retry count, default is -1 not retry |
| options.retry | number | false | the retry interval, default is 5000 |
| options.immediate | boolean | false | executing job immediately |

### Timeout(timeout: number): MethodDecorator
### Timeout(name: string, timeout: number): MethodDecorator
### Timeout(name: string, timeout: number, options?: TimeoutOptions): MethodDecorator

Schedule a timeout job.

| field | type | required | description |
| --- | --- | --- | --- |
| timeout | number | true | milliseconds |
| options.retries | number | false |  the max retry count, default is -1 not retry |
| options.retry | number | false | the retry interval, default is 5000 |
| options.immediate | boolean | false | executing job immediately |

### InjectSchedule(): PropertyDecorator

Inject Schedule instance

### UseLocker(locker: Locker | Function): MethodDecorator

Set a locker for this job.


## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
