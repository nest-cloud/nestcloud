import { Module } from '@nestjs/common';
import { ConfigService } from "./config.service";

@Module({
    providers: [ConfigService],
})
export class AppModule {
}
