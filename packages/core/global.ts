import { NestContainer } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import {
    IBoot,
    IConfig,
    IService,
    ILoadbalance,
    IProxy,
    IMemcached,
    IComponent,
    IEtcd,
    IKubernetes,
} from '@nestcloud/common';
import { Consul } from 'consul';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import Axios from 'axios';
import { BOOT, CONFIG, CONSUL, ETCD, KUBERNETES, LOADBALANCE, MEMCACHED, PROXY, SERVICE } from '@nestcloud/common';

export class Global {
    private readonly callbackMap = new Map<string, ((IComponent) => void)[]>();
    /**
     * Nest Application
     */
    private _app: INestApplication;

    /**
     * NestCloud Components
     */
    private _boot: IBoot;
    private _consul: Consul;
    private _config: IConfig;
    private _service: IService;
    private _loadbalance: ILoadbalance;
    private _proxy: IProxy;
    private _memcached: IMemcached;
    private _etcd: IEtcd;
    private _kubernetes: IKubernetes;

    /**
     * Global Http Client
     */
    private _axios: AxiosInstance;

    public get app(): INestApplication {
        return this._app;
    }

    public set app(app: INestApplication) {
        this._app = app;
    }

    public get boot(): IBoot {
        return this._boot;
    }

    public set boot(boot: IBoot) {
        this._boot = boot;
        this.trigger(BOOT, boot);
    }

    public get consul(): Consul {
        return this._consul;
    }

    public set consul(consul: Consul) {
        this._consul = consul;
        this.trigger(CONSUL, consul);
    }

    public get consulConfig(): IConfig {
        return this._config;
    }

    public set consulConfig(config: IConfig) {
        this._config = config;
        this.trigger(CONFIG, config);
    }

    public get consulService(): IService {
        return this._service;
    }

    public set consulService(consulService: IService) {
        this._service = consulService;
        this.trigger(SERVICE, consulService);
    }

    public get loadbalance(): ILoadbalance {
        return this._loadbalance;
    }

    public set loadbalance(loadbalance: ILoadbalance) {
        this._loadbalance = loadbalance;
        this.trigger(LOADBALANCE, loadbalance);
    }

    public get proxy(): IProxy {
        return this._proxy;
    }

    public set proxy(proxy: IProxy) {
        this._proxy = proxy;
        this.trigger(PROXY, proxy);
    }

    public get memcached(): IMemcached {
        return this._memcached;
    }

    public set memcached(memcached: IMemcached) {
        this._memcached = memcached;
        this.trigger(MEMCACHED, memcached);
    }

    public get axios(): AxiosInstance {
        return this._axios;
    }

    public set axiosConfig(axiosConfig: AxiosRequestConfig) {
        this._axios = Axios.create(axiosConfig);
    }

    public get etcd(): IEtcd {
        return this._etcd;
    }

    public set etcd(etcd: IEtcd) {
        this._etcd = etcd;
        this.trigger(ETCD, etcd);
    }

    public get kubernetes(): IKubernetes {
        return this._kubernetes;
    }

    public set kubernetes(kubernetes: IKubernetes) {
        this._kubernetes = kubernetes;
        this.trigger(KUBERNETES, kubernetes);
    }

    public watch<T extends IComponent>(component: string, callback: (component: T) => void) {
        if (this.callbackMap.has(component)) {
            const callbacks = this.callbackMap.get(component);
            callbacks.push(callback);
            this.callbackMap.set(component, callbacks);
        } else {
            this.callbackMap.set(component, [callback]);
        }
    }

    public getContainer(): NestContainer {
        return this._app ? (this._app as any).container : void 0;
    }

    private trigger(component: string, value: IComponent) {
        if (this.callbackMap.has(component)) {
            const callbacks = this.callbackMap.get(component);
            callbacks.forEach(cb => cb(value));
        }
    }
}
