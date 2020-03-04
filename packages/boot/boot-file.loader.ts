import { defaultsDeep } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as YAML from 'yamljs';
import { BOOT_OPTIONS_PROVIDER } from './boot.constants';
import { BootOptions } from './interfaces/boot-options.interface';

@Injectable()
export class BootFileLoader {
    private readonly files: string[];

    constructor(
        @Inject(BOOT_OPTIONS_PROVIDER) private readonly options: BootOptions,
    ) {
        this.files = this.getFilesPath();
    }

    public load(): any {
        const configs = [];
        this.checkFileExists();
        this.files.forEach((file, index) => {
            configs.push(this.loadFile(file));
        });
        return defaultsDeep({}, ...configs);
    }

    private checkFileExists() {
        if (this.files.length === 0) {
            throw new Error(`file ${path} was not found`);
        }

        let existFiles: number = 0;
        for (let i = 0; i < this.files.length; i++) {
            if (fs.existsSync(this.files[i])) {
                existFiles++;
            }
        }
        if (existFiles === 0) {
            throw new Error(`file ${path} was not found`);
        }
    }

    public loadFile(path: string): any {
        let config = {};
        if (!fs.existsSync(path)) {
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
