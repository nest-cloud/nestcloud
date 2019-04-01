
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

This is a [Nest](https://github.com/nestjs/nest) module for using decorator schedule a job.

## Installation

```bash
$ npm i --save @nestcloud/schedule@next
```

## Quick Start

```typescript
import { Injectable, LoggerService } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule, defaults } from '@nestcloud/schedule';

defaults.enable = true;
defaults.logger = new NestLogger();
defaults.maxRetry = -1;
defaults.retryInterval = 5000;

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

@Injectable()
export class ScheduleService extends NestSchedule {  
  constructor(
    
  ) {
    super();
  }
  
  @Cron('0 0 2 * *', {
    startTime: new Date(), 
    endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    tz: 'Asia/Shanghai',
  })
  async syncData() {
    console.log('syncing data ...');
  }
  
  @Cron('0 0 4 * *')
  async clear() {
    console.log('clear data ...');
    await doClear();
  }
  
  @Timeout(5000)
  onceJob() {
    console.log('once job');
  }
  
  @Interval(2000)
  intervalJob() {
    console.log('interval job');
    
    // if you want to cancel the job, you should return true;
    return true;
  }
}
```

### Distributed Support

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
  async clear() {
    console.log('clear data ...');
  }
}
```

## API

### Common options or defaults

| field | type | required | description |
| --- | --- | --- | --- |
| enable | boolean | false | default is true, when false, the job will not execute |
| maxRetry | number | false |  the max retry count, default is -1 not retry |
| retryInterval | number | false | the retry interval, default is 5000 |
| logger | LoggerService | false | default is false, only available at defaults |

### Cron(expression: string, options: CronOptions)

| field | type | required | description |
| --- | --- | --- | --- |
| expression | string | true | the cron expression |
| options.startTime | Date | false | the job's start time |
| options.endTime | Date | false | the job's end time |
| options.tz | string | false | the time zone |

### Interval(time: number, options: BaseOptions)

| field | type | required | description |
| --- | --- | --- | --- |
| time | number | true | millisecond |
| options | object | false | same as common options |

### Timeout(time: number, options: BaseOptions)

| field | type | required | description |
| --- | --- | --- | --- |
| time | number | true | millisecond |
| options | object | false | same as common options |

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
