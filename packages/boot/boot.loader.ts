import { BootConfig } from './boot.config';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import { objectToMap, mapToObject } from '@nestcloud/common';

@Injectable()
export class BootLoader implements OnModuleDestroy {
    private readonly files: string[];
    private readonly watchers: fs.FSWatcher[] = [];

    constructor(
        private readonly bootConfig: BootConfig,
    ) {
        this.files = this.getFilesPath();
    }

    public load(): any {
        const configs = [];
        this.files.forEach(file => {
            configs.push(objectToMap(this.loadFile(file)));
        });
        return mapToObject(Object.assign.call(this, configs));
    }

    public loadFile(path: string): any {
        let config = {};
        if (!fs.existsSync(path)) {
            throw new Error(`file ${path} was not found`);
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
            this.watchers.push(fs.watch(file, { encoding: 'buffer' }, (eventType, filename) => {
                if (filename) {
                    ref(this.load());
                }
            }));
        });
    }

    public onModuleDestroy(): any {
        this.watchers.forEach(watcher => watcher.close());
    }

    private getFilesPath(): string[] {
        const filenames: string[] = [];
        const env = process.env.NODE_ENV || 'development';
        const dirname = path.dirname(this.bootConfig.getFilePath());
        const filename = path.basename(this.bootConfig.getFilePath());
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
