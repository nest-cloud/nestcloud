import { IComponent } from './component.interface';

export interface IConfig extends IComponent {
    watch<T extends any>(path: string, callback: (data: T) => void): void;

    getOptions?(): any;

    get<T extends any>(path?: string, defaults?): T;

    set(path: string, value: any): Promise<void>;
}
