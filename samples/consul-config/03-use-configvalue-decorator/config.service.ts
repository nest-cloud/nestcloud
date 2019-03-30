import { Injectable } from "@nestjs/common";
import { ConfigValue } from '@nestcloud/consul-config';

@Injectable()
export class ConfigService {
    // constructor(
    //     @InjectConfig() private readonly config: ConsulConfig,
    // ) {
    // }
    //
    // getYourCustomConfig() {
    //     this.config.get<string>('custom.config', 'default data');
    //     this.config.watch<string>('custom.config', custom => {
    //         console.log('custom config updated: ', custom);
    //     });
    // }
    @ConfigValue('custom.config', 'default data')
    private readonly customConfig: string;
}
