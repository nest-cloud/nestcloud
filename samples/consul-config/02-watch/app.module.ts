import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';
import { BOOT } from '@nestcloud/common';
import { ConfigService } from "./config.service";
import { resolve } from 'path'


@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        }),
        ConsulModule.register({ inject: [BOOT] }),
        ConsulConfigModule.register({ inject: [BOOT] })
    ],
    providers: [ConfigService],
})
export class AppModule {
}
