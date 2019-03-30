import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { ConsulModule } from '@nestcloud/consul';
import { NEST_BOOT } from '@nestcloud/common';
import { ConsulService } from "./consul.service";

@Module({
    imports: [
        BootModule.register(__dirname, `config.yaml`),
        ConsulModule.register({ dependencies: [NEST_BOOT] })
    ],
    providers: [ConsulService],
})
export class AppModule {
}
