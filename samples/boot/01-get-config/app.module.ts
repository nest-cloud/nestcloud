import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConfigService } from "./config.service";

@Module({
    imports: [
        BootModule.register(__dirname, `config.yaml`),
    ],
    providers: [ConfigService],
})
export class AppModule {
}
