import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { BOOT } from '@nestcloud/common';
import { ConsulService } from "./consul.service";
import { resolve } from 'path'


@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        }),
        ConsulModule.forRootAsync({ inject: [BOOT] })
    ],
    providers: [ConsulService],
})
export class AppModule {
}
