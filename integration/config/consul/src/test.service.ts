import { Injectable } from '@nestjs/common';
import { IConsul } from '../../../../packages/common';
import { InjectConsul } from '../../../../packages/consul';
import { CONFIG_NAME } from './constants';

@Injectable()
export class TestService {
    constructor(
        @InjectConsul() private readonly consul: IConsul,
    ) {
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
