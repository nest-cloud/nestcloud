import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { LoadbalanceModule } from '@nestcloud/consul-loadbalance';
import { NEST_BOOT } from '@nestcloud/common';
import { LoadbalanceService } from "./loadbalance.service";
import { resolve } from 'path'


@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        }),
        ConsulModule.register({ dependencies: [NEST_BOOT] }),
        ConsulServiceModule.register({ dependencies: [NEST_BOOT] }),
        LoadbalanceModule.register({ dependencies: [NEST_BOOT] })
    ],
    providers: [LoadbalanceService],
})
export class AppModule {
}
