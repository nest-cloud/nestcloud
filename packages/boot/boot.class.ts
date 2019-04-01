import * as path from 'path';
import * as YAML from 'yamljs';
import { IBoot } from '@nestcloud/common';
import { Store } from './store';

export class Boot implements IBoot {
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
        Store.data = YAML.load(this.fullConfigPath);
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
        return Store.get<T>(path, defaults);
    }
}
