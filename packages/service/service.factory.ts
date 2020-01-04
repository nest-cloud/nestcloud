import { ServiceOptions } from './interfaces/service-options.interface';
import { EtcdService } from './service.etcd';
import { ConsulService } from './service.consul';
import { NO_DEPS_MODULE_FOUND } from './service.messages';
import { CONSUL, ETCD } from '@nestcloud/common';

export class ServiceFactory {
    constructor(
        private readonly options: ServiceOptions,
    ) {
    }

    create(backend: string, ref: any) {
        switch (backend) {
            case CONSUL:
                return new ConsulService(ref, this.options);
            case ETCD:
                return new EtcdService(ref, this.options);
            default:
                throw new Error(NO_DEPS_MODULE_FOUND);
        }
    }
}
