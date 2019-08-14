import { Module, DynamicModule, Global } from '@nestjs/common';
import {
    NEST_BOOT,
    NEST_BOOT_PROVIDER,
    NEST_CONFIG,
    NEST_CONFIG_PROVIDER,
    NEST_KUBERNETES_PROVIDER,
    IBoot,
    IConfig,
    IKubernetes,
} from '@nestcloud/common';
import { IKubernetesConfig } from './interfaces/kubernetes-config.interface';

@Global()
@Module({})
export class KubernetesModule {
    static register(options: IKubernetesConfig = {}): DynamicModule {
        const inject = [];
        if (options.dependencies) {
            if (options.dependencies.includes(NEST_BOOT)) {
                inject.push(NEST_BOOT_PROVIDER);
            } else if (options.dependencies.includes(NEST_CONFIG)) {
                inject.push(NEST_CONFIG_PROVIDER);
            }
        }

        const kubernetesProvider = {
            provide: NEST_KUBERNETES_PROVIDER,
            useFactory: async (config: IBoot | IConfig): Promise<IKubernetes> => {
                if (inject.includes(NEST_BOOT_PROVIDER)) {
                    options = (config as IBoot).get('kubernetes', {});
                } else if (inject.includes(NEST_CONFIG_PROVIDER)) {
                    options = await (config as IConfig).get('kubernetes', {});
                }

                const { KubeConfig, Client } = require('kubernetes-client');
                const kubeconfig = new KubeConfig();

                if (options.kubeConfig) {
                    kubeconfig.loadFromFile(options.kubeConfig);
                    const Request = require('kubernetes-client/backends/request');
                    const backend = new Request({ kubeconfig });
                    return new Client({ backend, version: '1.13' });
                }

                kubeconfig.getInCluster();
                const Request = require('kubernetes-client/backends/request');
                const backend = new Request({ kubeconfig });
                return new Client({ backend, version: '1.13' });
            },
            inject,
        };

        return {
            module: KubernetesModule,
            providers: [kubernetesProvider],
            exports: [kubernetesProvider],
        };
    }
}
