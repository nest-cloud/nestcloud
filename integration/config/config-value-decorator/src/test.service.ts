import { Injectable } from '@nestjs/common';
import { IConsul } from '../../../../packages/common';
import { InjectConsul } from '../../../../packages/consul';
import { ConfigValue } from '../../../../packages/config';
import { CONFIG_NAME } from './constants';

@Injectable()
export class TestService {
    @ConfigValue('web.port', 3333)
    private readonly port: number;

    constructor(
        @InjectConsul() private readonly consul: IConsul,
    ) {
    }

    getPort() {
        return this.port;
    }

    async setConfigToConsul() {
        const config = `web:
  service: test-service
  port: 3000
  address: http://test-service:3000`;
        return this.consul.kv.set(CONFIG_NAME, config);
    }

    async removeConfig() {
        return this.consul.kv.del(CONFIG_NAME);
    }
}
