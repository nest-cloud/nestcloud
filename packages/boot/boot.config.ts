import { BootOptions } from './interfaces/boot-options.interface';

export class BootConfig {
    private options: BootOptions;

    constructor(options: BootOptions) {
        this.options = options;
    }

    public getFilePath() {
        return this.options.filePath;
    }

    public isWatch() {
        return !!this.options.watch;
    }
}
