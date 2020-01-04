import { defaultsDeep } from 'lodash';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import { BOOT_OPTIONS_PROVIDER } from './boot.constants';
import { BootOptions } from './interfaces/boot-options.interface';

@Injectable()
export class BootFileLoader implements OnModuleDestroy {
    private readonly files: string[];
    private readonly watchers: fs.FSWatcher[] = [];

    constructor(
        @Inject(BOOT_OPTIONS_PROVIDER) private readonly options: BootOptions,
    ) {
        this.files = this.getFilesPath();
    }

    public load(): any {
        const configs = [];
        this.files.forEach((file, index) => {
            configs.push(this.loadFile(file, index === 0));
        });
        return defaultsDeep({}, ...configs);
    }

    public loadFile(path: string, throwable: boolean): any {
        let config = {};
        if (!fs.existsSync(path)) {
            if (throwable) {
                throw new Error(`file ${path} was not found`);
            }
            return config;
        }
        const configStr = fs.readFileSync(path).toString();
        try {
            config = YAML.parse(configStr);
        } catch (e) {
            try {
                config = JSON.parse(configStr);
            } catch (e) {
                throw new Error(`file ${path} parse error`);
            }
        }
        return config;
    }

    public watch(ref: Function) {
        this.files.forEach(file => {
            const watcher = fs.watch(file, { encoding: 'buffer' }, (eventType, filename) => {
                if (filename) {
                    ref(this.load());
                }
            });
            this.watchers.push(watcher);
        });
    }

    public onModuleDestroy(): any {
        this.watchers.forEach(watcher => watcher.close());
    }

    private getFilesPath(): string[] {
        const filenames: string[] = [];
        const env = process.env.NODE_ENV || 'development';
        const dirname = path.dirname(this.options.filePath);
        const filename = path.basename(this.options.filePath);
        const tokens = /(.+)\.(.+)/.exec(filename);
        if (tokens) {
            tokens.reverse().pop();
            filenames.push(
                path.resolve(dirname, `${tokens[1]}.${tokens[0]}`),
                path.resolve(dirname, `${tokens[1]}.${env}.${tokens[0]}`),
            );
        } else {
            filenames.push(
                path.resolve(dirname, filename),
                path.resolve(dirname, `${filename}.${env}`),
            );
        }

        return filenames;
    }
}
