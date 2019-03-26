import * as path from 'path';
import * as YAML from 'yamljs';
import { get } from 'lodash';
import { Cache, NEST_BOOT, transformObjectToMap } from '@nestcloud/common';

export class Boot {
    private readonly ENV_DEFAULT_RE = /\${(.*)\|\|(.*)}/;
    private readonly ENV_RE = /\${(.*)}/;
    private readonly ENV = process.env;
    private readonly configs: object;
    private readonly env: string;
    private readonly filename: string;
    private readonly configPath: string;
    private readonly fullConfigPath: string;

    constructor(configPath: string, name?: string | ((env: string) => string)) {
        this.configPath = configPath;
        this.env = process.env.NODE_ENV || 'development';
        this.filename = `bootstrap-${ this.env }.yml`;
        if (typeof name === 'function') {
            this.filename = name(this.env);
        } else if (name) {
            this.filename = name;
        }

        this.fullConfigPath = path.resolve(configPath, this.filename);
        this.configs = YAML.load(this.fullConfigPath);
        this.compileWithEnv(this.configs);
        this.updateConfigMap();
    }

    getEnv(): string {
        return this.env;
    }

    getFilename(): string {
        return this.filename;
    }

    getConfigPath(): string {
        return this.configPath;
    }

    getFullConfigPath(): string {
        return this.fullConfigPath;
    }

    get<T extends any>(path: string, defaults?: T): T {
        return get(this.configs, path, defaults);
    }

    private compileWithEnv(configs: object) {
        for (const key in configs) {
            if (!configs.hasOwnProperty(key)) {
                continue;
            }
            const config = configs[key];
            if (typeof config === 'string' && this.ENV_DEFAULT_RE.test(config)) {
                const result = this.ENV_DEFAULT_RE.exec(config);
                const path = get(result, [1], '').trim();
                const def = get(result, [2], '').trim();
                configs[key] = get(this.ENV, path, def);
            } else if (typeof config === 'string' && this.ENV_RE.test(config)) {
                const result = this.ENV_DEFAULT_RE.exec(config);
                const path = get(result, [1], '').trim();
                configs[key] = get(this.ENV, path);
            } else if (typeof config === 'object') {
                this.compileWithEnv(config);
            }
        }
    }

    private updateConfigMap() {
        const oldConfigMap = Cache.getInstance(NEST_BOOT).get();
        const configMap = transformObjectToMap(this.configs);
        for (const key in configMap) {
            if (oldConfigMap[key] !== configMap[key]) {
                Cache.getInstance(NEST_BOOT).set(key, configMap[key]);
            }
        }
    }
}
