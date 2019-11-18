import { Etcd3, IOptions } from 'etcd3';
import { Module, DynamicModule, Global } from '@nestjs/common';
import { NEST_BOOT_PROVIDER, NEST_BOOT, IEtcdOptions, IEtcd, NEST_ETCD_PROVIDER } from '@nestcloud/common';
import { Boot } from '@nestcloud/boot';

@Global()
@Module({})
export class EtcdModule {
    public static register(options: IEtcdOptions = { hosts: '127.0.0.1:2379' }): DynamicModule {
        const inject = [];
        if (options.dependencies) {
            if (options.dependencies.includes(NEST_BOOT)) {
                inject.push(NEST_BOOT_PROVIDER);
            }
        }
        const etcdProvider = {
            provide: NEST_ETCD_PROVIDER,
            useFactory: async (boot: Boot): Promise<IEtcd> => {
                if (options.dependencies && options.dependencies.includes(NEST_BOOT)) {
                    const configs = boot.get<IEtcdOptions>('etcd');
                    if (!configs) {
                        throw new Error('No etcd config was found in config file');
                    }
                    options = this.parseCertificate(configs);
                }
                return new Etcd3(options as IOptions);
            },
            inject,
        };

        return {
            module: EtcdModule,
            providers: [etcdProvider],
            exports: [etcdProvider],
        };
    }

    private static parseCertificate(options: IEtcdOptions): IEtcdOptions {
        if (options.credentials) {
            if (options.credentials.rootCertificate) {
                options.credentials.rootCertificate = new Buffer(options.credentials.rootCertificate);
            }
            if (options.credentials.privateKey) {
                options.credentials.privateKey = new Buffer(options.credentials.privateKey);
            }
            if (options.credentials.certChain) {
                options.credentials.certChain = new Buffer(options.credentials.certChain);
            }
        }
        return options;
    }
}
