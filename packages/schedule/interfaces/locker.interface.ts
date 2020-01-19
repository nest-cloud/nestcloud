export interface Locker {
    init(name: string): void;

    tryLock(): Promise<boolean> | boolean;

    release(): any;
}
