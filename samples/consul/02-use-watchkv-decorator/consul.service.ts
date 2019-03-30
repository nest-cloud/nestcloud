import { Injectable } from "@nestjs/common";
import { WatchKV } from '@nestcloud/consul';

@Injectable()
export class ConsulService {
    // constructor(
    //     @InjectConsul() private readonly consul: Consul,
    // ) {
    // }
    //
    // async getConsulKV(key: string): Promise<any> {
    //     return await this.consul.kv.get(key);
    // }

    @WatchKV('consul-data-key', 'text', 'default data')
    private readonly data: any;
}
