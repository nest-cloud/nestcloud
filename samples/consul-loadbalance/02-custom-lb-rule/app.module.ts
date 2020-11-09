import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { LoadbalanceModule } from '@nestcloud/consul-loadbalance';
import { BOOT } from '@nestcloud/common';
import { LoadbalanceService } from "./loadbalance.service";
import { resolve } from 'path'


@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        }),
        ConsulModule.forRootAsync({ inject: [BOOT] }),
        ConsulServiceModule.forRootAsync({ inject: [BOOT] }),
        LoadbalanceModule.forRootAsync({ inject: [BOOT], customRulePath: __dirname })
    ],
    providers: [LoadbalanceService],
})
export class AppModule {
}
