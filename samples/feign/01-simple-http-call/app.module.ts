import { Module } from '@nestjs/common';
import { BootModule } from '@nestcloud/boot';
import { FeignModule } from '@nestcloud/feign';
import { HttpClient } from "./http.client";
import { TestService } from "./test.service";
import { NEST_BOOT } from "@nestcloud/common";

@Module({
    imports: [
        BootModule.register(__dirname, 'config.yaml'),
        FeignModule.register({dependencies: [NEST_BOOT]}),
    ],
    providers: [HttpClient, TestService],
})
export class AppModule {
}
