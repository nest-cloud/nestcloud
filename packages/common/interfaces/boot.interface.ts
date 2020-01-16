import { IComponent } from './component.interface';

export interface IBoot extends IComponent {
    get<T extends any>(path?: string, defaults?: T): T;

    watch<T extends any>(path: string, callback: (data: T) => void): void;
}
