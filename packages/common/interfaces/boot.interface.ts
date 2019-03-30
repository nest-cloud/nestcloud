export interface IBoot {
    getEnv(): string;

    getFilename(): string;

    getConfigPath(): string;

    getFullConfigPath(): string;

    get<T extends any>(path: string, defaults?: T): T;
}
