import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { BOOT } from '@nestcloud/common';
import { TerminusModule } from '@nestjs/terminus';
import { GatewayModule } from '@nestcloud/gateway';
import { ApiController } from "./api.controller";
import { resolve } from 'path'


@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        }),
        ConsulModule.forRootAsync({ inject: [BOOT] }),
        ConsulServiceModule.forRootAsync({ inject: [BOOT] }),
        GatewayModule.forRootAsync({ inject: [BOOT] }),
        TerminusModule.forRootAsync({
            useFactory: () => ({ endpoints: [{ url: '/health', healthIndicators: [] }] }),
        }),
    ],
    controllers: [ApiController]
})
export class AppModule {
}
