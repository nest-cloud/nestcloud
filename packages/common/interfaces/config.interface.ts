import { IComponent } from './component.interface';
import { ConfigOptions } from './config-options.interface';

export interface IConfig extends IComponent {
    watch<T extends any>(path: string, callback: (data: T) => void): void;

    getOptions?(): ConfigOptions;

    get<T extends any>(path?: string, defaults?): T;

    set(path: string, value: any): Promise<void>;
}
