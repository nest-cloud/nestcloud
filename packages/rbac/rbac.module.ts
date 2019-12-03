import { Module, DynamicModule, Global } from '@nestjs/common';
import {
    NEST_RBAC_PROVIDER,
    NEST_CONSUL,
    NEST_CONSUL_PROVIDER,
    NEST_SERVICE,
    NEST_SERVICE_PROVIDER,
    NEST_LOADBALANCE,
    NEST_LOADBALANCE_PROVIDER,
    NEST_BOOT,
    NEST_BOOT_PROVIDER,
    NEST_CONFIG,
    NEST_CONFIG_PROVIDER,
    NEST_ETCD,
    NEST_ETCD_PROVIDER,
    NEST_KUBERNETES,
    NEST_KUBERNETES_PROVIDER,
    ILoadbalance,
    IBoot,
    IConfig,
    IEtcd,
    IKubernetes,
} from '@nestcloud/common';
import { Rbac } from './rbac';
import { IRbacConfig } from './interfaces/rbac-config.interface';
import { Backend, NEST_RBAC_VALIDATOR_PROVIDER } from './constants';
import { IRbacValidator } from './interfaces/rbac-validator.interface';

@Global()
@Module({})
export class RbacModule {
    static register(config: IRbacConfig): DynamicModule {
        const inject = this.getInjects(config.dependencies);

        const validatorProvider = {
            provide: NEST_RBAC_VALIDATOR_PROVIDER,
            useClass: config.validator as any,
        };

        const rbacProvider = {
            provide: NEST_RBAC_PROVIDER,
            useFactory: async (...args: any[]): Promise<Rbac> => {
                const validator: IRbacValidator = args[inject.indexOf(NEST_RBAC_VALIDATOR_PROVIDER)];
                const consul = args[inject.indexOf(NEST_CONSUL_PROVIDER)];
                const loadbalance: ILoadbalance = args[inject.indexOf(NEST_LOADBALANCE_PROVIDER)];
                const boot: IBoot = args[inject.indexOf(NEST_BOOT_PROVIDER)];
                const consulConfig: IConfig = args[inject.indexOf(NEST_CONFIG_PROVIDER)];
                const etcd: IEtcd = args[inject.indexOf(NEST_ETCD_PROVIDER)];
                const kubernetes: IKubernetes = args[inject.indexOf(NEST_KUBERNETES_PROVIDER)];
                if (boot) {
                    config.parameters = boot.get<{ [key: string]: string }>('rbac.parameters', config.parameters);
                }
                if (consulConfig) {
                    config.parameters = consulConfig.get<{ [key: string]: string }>('rbac.parameters', config.parameters);
                }
                config.parameters = config.parameters || {};

                const rbac = new Rbac(config, validator);
                if (consul && config.backend === Backend.CONSUL) {
                    await rbac.init(consul);
                } else if (loadbalance && config.backend === Backend.LOADBALANCE) {
                    await rbac.init(loadbalance);
                } else if (etcd && config.backend === Backend.ETCD) {
                    await rbac.init(etcd);
                } else if (kubernetes && config.backend === Backend.KUBERNETES) {
                    await rbac.init(kubernetes);
                } else {
                    await rbac.init();
                }

                return rbac;
            },
            inject,
        };

        return {
            module: RbacModule,
            providers: [validatorProvider, rbacProvider],
            exports: [validatorProvider, rbacProvider],
        };
    }

    private static getInjects(dependencies: string[]): string[] {
        const injects = [NEST_RBAC_VALIDATOR_PROVIDER];
        if (!dependencies) {
            return injects;
        }
        if (dependencies.includes(NEST_CONSUL)) {
            injects.push(NEST_CONSUL_PROVIDER);
        }
        if (dependencies.includes(NEST_LOADBALANCE)) {
            injects.push(NEST_LOADBALANCE_PROVIDER);
        }
        if (dependencies.includes(NEST_SERVICE)) {
            injects.push(NEST_SERVICE_PROVIDER);
        }
        if (dependencies.includes(NEST_BOOT)) {
            injects.push(NEST_BOOT_PROVIDER);
        }
        if (dependencies.includes(NEST_CONFIG)) {
            injects.push(NEST_CONFIG_PROVIDER);
        }
        if (dependencies.includes(NEST_ETCD)) {
            injects.push(NEST_ETCD_PROVIDER);
        }
        if (dependencies.includes(NEST_KUBERNETES)) {
            injects.push(NEST_KUBERNETES_PROVIDER);
        }
        return injects;
    }
}
