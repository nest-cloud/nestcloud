import { ProxyOptions } from './interfaces/proxy-options.interface';
import { IBoot, IConfig } from '@nestcloud/common';
import { OnModuleInit } from '@nestjs/common';

export class ProxyConfig implements OnModuleInit {
    private CONFIG_PREFIX = 'proxy';
    private options: ProxyOptions = {};
    private ref: Function;

    constructor(
        private readonly opts: ProxyOptions = {},
        private readonly boot: IBoot,
        private readonly config: IConfig,
    ) {
    }

    public getRoutes() {
        return this.options.routes || [];
    }

    public getExtras() {
        return this.options.extras || {};
    }

    public on(ref: Function) {
        this.ref = ref;
    }

    onModuleInit(): any {
        if (this.boot) {
            const bootOptions = this.boot.get<ProxyOptions>(this.CONFIG_PREFIX, {});
            this.options = Object.assign(this.opts, this.options, bootOptions);
        }
        if (this.config) {
            const configOptions = this.config.get<ProxyOptions>(this.CONFIG_PREFIX, {});
            this.options = Object.assign(this.opts, this.options, configOptions);

            this.config.watch(this.CONFIG_PREFIX, configOptions => {
                this.options = Object.assign(this.opts, this.options, configOptions);
                this.ref && this.ref(this.options);
            });
        }

    }
}
