import { DynamicModule, Global, Module } from '@nestjs/common';
import { IEtcdOptions } from './interfaces/etcd-options.interface';
import { NEST_BOOT, NEST_BOOT_PROVIDER, NEST_ETCD_PROVIDER, IBoot } from '@nestcloud/common';
import { Etcd3, IOptions } from 'etcd3';

@Global()
@Module({})
export class EtcdModule {
    static register(options: IEtcdOptions = {}): DynamicModule {
        const inject = [];
        if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
            inject.push(NEST_BOOT_PROVIDER);
        }
        const etcdProvider = {
            provide: NEST_ETCD_PROVIDER,
            useFactory: async (boot: IBoot): Promise<Etcd3> => {
                let etcd = options.etcd;
                if (boot) {
                    etcd = boot.get<IOptions>('etcd');
                }
                return new Etcd3(etcd);
            },
            inject,
        };

        return {
            module: EtcdModule,
            providers: [etcdProvider],
            exports: [etcdProvider],
        };
    }
}
