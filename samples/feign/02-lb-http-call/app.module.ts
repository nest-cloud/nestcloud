import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { ConsulServiceModule } from '@nestcloud/consul-service';
import { FeignModule } from '@nestcloud/feign';
import { BOOT, LOADBALANCE } from '@nestcloud/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpClient } from "./http.client";
import { TestService } from "./test.service";
import { resolve } from 'path'


@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, `config.yaml`)
        }),
        ConsulModule.forRootAsync({ inject: [BOOT] }),
        ConsulServiceModule.forRootAsync({ inject: [BOOT] }),
        FeignModule.forRootAsync({ inject: [BOOT, LOADBALANCE] }),
        TerminusModule.forRootAsync({
            useFactory: () => ({ endpoints: [{ url: '/health', healthIndicators: [] }] }),
        }),
    ],
    providers: [HttpClient, TestService]
})
export class AppModule {
}
