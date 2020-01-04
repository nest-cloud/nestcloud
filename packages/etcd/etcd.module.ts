import { Module, DynamicModule, Global } from '@nestjs/common';
import { IEtcdOptions, Scanner, IBoot, BOOT } from '@nestcloud/common';
import { ETCD_OPTIONS_PROVIDER } from './etcd.constants';
import { Etcd } from './etcd';
import { EtcdOptions } from './interfaces/etcd-options.interface';
import { Etcd3 } from 'etcd3';

@Global()
@Module({})
export class EtcdModule {
    private static CONFIG_PREFIX = 'etcd';

    public static register(options: EtcdOptions = { hosts: '127.0.0.1:2379' }): DynamicModule {
        const inject = options.inject || [];
        const etcdOptionsProvider = {
            provide: ETCD_OPTIONS_PROVIDER,
            useFactory: (...params: any[]) => {
                const registerOptions = options;
                const boot: IBoot = params[inject.indexOf(BOOT)];
                if (boot) {
                    options = boot.get(this.CONFIG_PREFIX);
                }
                return Object.assign(registerOptions, options);
            },
            inject,
        };

        const etcdProvider = {
            provide: Etcd,
            useFactory: (options: EtcdOptions): Etcd => {
                this.parseCertificate(options);
                return new Etcd3(options);
            },
            inject: [ETCD_OPTIONS_PROVIDER],
        };

        return {
            module: EtcdModule,
            providers: [etcdOptionsProvider, etcdProvider, Scanner],
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
