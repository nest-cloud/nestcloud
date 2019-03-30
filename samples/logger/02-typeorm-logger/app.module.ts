import { Module } from '@nestjs/common';
import { NEST_TYPEORM_LOGGER_PROVIDER } from '@nestcloud/common';
import { LoggerModule, TypeormLogger } from '@nestcloud/logger';
import { LoggerService } from "./logger.service";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        LoggerModule.register(),
        TypeOrmModule.forRootAsync({
            useFactory: (logger: TypeormLogger) => ({ logger }),
            inject: [NEST_TYPEORM_LOGGER_PROVIDER],
        })
    ],
    providers: [LoggerService]
})
export class AppModule {
}
