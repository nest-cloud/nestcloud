import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Boot } from '@nestcloud/boot';
import { NestCloud } from '@nestcloud/core';

async function bootstrap() {
    const boot = new Boot(__dirname);
    const app = NestCloud.create(await NestFactory.create(AppModule));
    await app.listen(boot.get('web.port', 3000));
}

bootstrap();
