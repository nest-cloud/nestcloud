import * as Consul from 'consul';
import { get, set } from 'lodash';
import * as YAML from 'yamljs';
import { ConsulConfigOptions, KVResponse } from './consul-config.options';
import { Cache, NEST_CONSUL_CONFIG, transformObjectToMap } from "@nestcloud/common";

export class ConsulConfig {
    private configs: any = {};
    private callback: (configs) => void = () => void 0;
    private readonly consul: Consul;
    private readonly key: string;
    private readonly retry: number;

    constructor(consul: Consul, key: string, options: ConsulConfigOptions) {
        this.consul = consul;
        this.key = key;
        this.retry = options.retry;

        this.updateConfigMap();
    }

    async init() {
        const result = await this.consul.kv.get<KVResponse>(this.key);
        try {
            this.configs = YAML.parse(result.Value);
        } catch (e) {
            this.configs = { parseErr: e };
        }
        this.watch();

        this.updateConfigMap();
    }

    private watch() {
        const watcher = this.consul.watch({
            method: this.consul.kv.get,
            options: { key: this.key, wait: '5m' },
        });
        watcher.on('change', (data, res) => {
            try {
                this.configs = YAML.parse(data.Value);
            } catch (e) {
                this.configs = { parseErr: e };
            }

            this.callback(this.configs);

            this.updateConfigMap();
        });
        watcher.on('error', () => void 0);
    }

    onChange(callback: (configs) => void) {
        this.callback = callback;
    }

    getKey(): string {
        return this.key;
    }

    get<T extends any>(path?: string, defaults?): T {
        if (!path) {
            return this.configs;
        }
        return get(this.configs, path, defaults);
    }

    async set(path: string, value: any) {
        set(this.configs, path, value);
        const yamlString = YAML.stringify(this.configs);
        await this.consul.kv.set(this.key, yamlString);
    }

    private updateConfigMap() {
        const oldConfigMap = Cache.getInstance(NEST_CONSUL_CONFIG).get();
        const configMap = transformObjectToMap(this.configs);
        for (const key in configMap) {
            if (oldConfigMap[key] !== configMap[key] && configMap.hasOwnProperty(key)) {
                Cache.getInstance(NEST_CONSUL_CONFIG).set(key, configMap[key]);
            }
        }
    }
}
