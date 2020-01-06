import { Injectable } from '@nestjs/common';
import { IEtcd } from '../../../../packages/common';
import { InjectEtcd } from '../../../../packages/etcd';
import { CONFIG_NAME, NAMESPACE } from './constants';

@Injectable()
export class TestService {
    constructor(
        @InjectEtcd() private readonly etcd: IEtcd,
    ) {
    }

    async setConfigToConsul() {
        const config = `web:
  service: test-service
  port: 3000
  address: http://test-service:3000`;
        return this.etcd.namespace(NAMESPACE).put(CONFIG_NAME).value(config).exec();
    }

    async removeConfig() {
        return this.etcd.namespace(NAMESPACE).delete().key(CONFIG_NAME).exec();
    }
}
