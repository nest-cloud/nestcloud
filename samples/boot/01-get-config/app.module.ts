import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConfigService } from "./config.service";
import { resolve } from 'path'

@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        })
    ],
    providers: [ConfigService],
})
export class AppModule {
}
