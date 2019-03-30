export class Store {
    private static _consul;
    private static callbacks: ((consul: any) => void)[] = [];

    public static set consul(consul: any) {
        this._consul = consul;
        this.callbacks.forEach(cb => cb(this._consul));
    }

    public static get consul() {
        return this._consul;
    }

    public static watch(callback: (consul: any) => void) {
        this.callbacks.push(callback);
    }
}
