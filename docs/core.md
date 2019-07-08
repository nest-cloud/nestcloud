# 核心组件

NestCloud 核心基础组件，许多其他组件的装饰器依赖此组件。

## 安装

```bash
npm install @nestcloud/core --save
```

## 如何使用

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestCloud } from '@nestcloud/core';

async function bootstrap() {
    const app = NestCloud.create(await NestFactory.create(AppModule));
    await app.listen(3000);
}

bootstrap();

```
