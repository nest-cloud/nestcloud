import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { NEST_BOOT } from '@nestcloud/common';
import { TerminusModule } from '@nestjs/terminus';
import { GatewayModule } from '@nestcloud/gateway';
import { ApiController } from "./api.controller";
import { resolve } from 'path'


@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        }),
        ConsulModule.register({ dependencies: [NEST_BOOT] }),
        ConsulServiceModule.register({ dependencies: [NEST_BOOT] }),
        GatewayModule.register({ dependencies: [NEST_BOOT] }),
        TerminusModule.forRootAsync({
            useFactory: () => ({ endpoints: [{ url: '/health', healthIndicators: [] }] }),
        }),
    ],
    controllers: [ApiController]
})
export class AppModule {
}
