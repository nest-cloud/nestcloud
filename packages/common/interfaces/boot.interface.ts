import { IComponent } from './component.interface';

export interface IBoot extends IComponent{
    getEnv(): string;

    getFilename(): string;

    getConfigPath(): string;

    getFullConfigPath(): string;

    get<T extends any>(path: string, defaults?: T): T;
}
