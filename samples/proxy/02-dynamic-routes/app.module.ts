import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulConfigModule } from '@nestcloud/consul-config';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { NEST_BOOT, NEST_CONSUL_CONFIG } from '@nestcloud/common';
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
        ConsulModule.register({ dependencies: [NEST_BOOT] }),
        ConsulConfigModule.register({ dependencies: [NEST_BOOT] }),
        ConsulServiceModule.register({ dependencies: [NEST_BOOT] }),
        GatewayModule.register({ dependencies: [NEST_CONSUL_CONFIG] }),
        TerminusModule.forRootAsync({
            useFactory: () => ({ endpoints: [{ url: '/health', healthIndicators: [] }] }),
        }),
    ],
    controllers: [ApiController],
    providers: [GatewayService]
})
export class AppModule {
}
