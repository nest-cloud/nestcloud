import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { BOOT } from '@nestcloud/common';
import { TerminusModule } from '@nestjs/terminus';
import { DiscoveryService } from "./discovery.service";
import { resolve } from 'path'


@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        }),
        ConsulModule.forRootAsync({ inject: [BOOT] }),
        ConsulServiceModule.forRootAsync({ inject: [BOOT] }),
        TerminusModule.forRootAsync({
            useFactory: () => ({ endpoints: [{ url: '/health', healthIndicators: [] }] }),
        }),
    ],
    providers: [DiscoveryService]
})
export class AppModule {
}
