import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';
import { NEST_BOOT } from '@nestcloud/common';
import { ConfigService } from "./config.service";
import { resolve } from 'path'


@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        }),
        ConsulModule.register({ dependencies: [NEST_BOOT] }),
        ConsulConfigModule.register({ dependencies: [NEST_BOOT] })
    ],
    providers: [ConfigService],
})
export class AppModule {
}
