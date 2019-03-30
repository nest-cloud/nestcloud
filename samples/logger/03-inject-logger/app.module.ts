import { Module } from '@nestjs/common';
import { LoggerModule } from '@nestcloud/logger';
import { LoggerService } from "./logger.service";

@Module({
    imports: [
        LoggerModule.register(),
    ],
    providers: [LoggerService]
})
export class AppModule {
}
