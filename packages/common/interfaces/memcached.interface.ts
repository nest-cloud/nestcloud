import { IComponent } from './component.interface';

export interface IMemcached extends IComponent {
    touch(key: string, lifetime?: number): Promise<any>;

    get(key: string): Promise<any>;

    gets(key: string): Promise<any>;

    getMulti(keys: string[]): Promise<any>;

    set(key: string, value: any, lifetime?: number): Promise<any>;

    replace(key: string, value: any, lifetime?: number): Promise<void>;

    cas(key: string, value: any, lifetime: number, cas: string): Promise<void>;

    append(key: string, value: any): Promise<void>;

    prepend(key: string, value: any): Promise<void>;

    incr(key: string, amount: number): Promise<void>;

    decr(key: string, amount: number): Promise<void>;

    del(key: string): Promise<void>;

    on(event: string, callback): void;
}
