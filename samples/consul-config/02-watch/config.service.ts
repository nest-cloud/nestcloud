import { Injectable } from "@nestjs/common";
import { InjectConfig, ConsulConfig } from '@nestcloud/consul-config';

@Injectable()
export class ConfigService {
    constructor(
        @InjectConfig() private readonly config: ConsulConfig,
    ) {
    }

    getYourCustomConfig() {
        this.config.get<string>('custom.config', 'default data');
    }
}
