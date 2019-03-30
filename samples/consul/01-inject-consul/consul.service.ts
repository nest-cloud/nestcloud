import { Injectable } from "@nestjs/common";
import { InjectConsul } from '@nestcloud/consul';
import * as Consul from 'consul';

@Injectable()
export class ConsulService {
    constructor(
        @InjectConsul() private readonly consul: Consul,
    ) {
    }

    async getConsulKV(key: string): Promise<any> {
        return await this.consul.kv.get(key);
    }
}
