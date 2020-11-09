import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { BOOT, NEST_CONSUL } from '@nestcloud/common';
import { TerminusModule } from '@nestjs/terminus';
import { GatewayModule } from '@nestcloud/gateway';
import { ApiController } from "./api.controller";
import { GatewayService } from "./gateway.service";
import { resolve } from 'path'


@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        }),
        ConsulModule.forRootAsync({ inject: [BOOT] }),
        ConsulConfigModule.forRootAsync({ inject: [BOOT] }),
        ConsulServiceModule.forRootAsync({ inject: [BOOT] }),
        GatewayModule.forRootAsync({ dependencies: [NEST_CONSUL] }),
        TerminusModule.forRootAsync({
            useFactory: () => ({ endpoints: [{ url: '/health', healthIndicators: [] }] }),
        }),
    ],
    controllers: [ApiController],
    providers: [GatewayService]
})
export class AppModule {
}
