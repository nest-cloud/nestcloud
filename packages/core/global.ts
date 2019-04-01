import { NestContainer } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import {
    IBoot,
    IConsulConfig,
    IConsulService,
    ILoadbalance,
    ILogger,
    IGateway,
    IMemcached,
    IComponent,
    NEST_BOOT,
    NEST_CONSUL,
    NEST_CONSUL_CONFIG,
    NEST_CONSUL_LOADBALANCE,
    NEST_CONSUL_SERVICE,
    NEST_GATEWAY,
    NEST_LOGGER,
} from '@nestcloud/common';
import * as Consul from 'consul';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import Axios from 'axios';

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
    private _consulConfig: IConsulConfig;
    private _consulService: IConsulService;
    private _loadbalance: ILoadbalance;
    private _logger: ILogger;
    private _gateway: IGateway;
    private _memcached: IMemcached;

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
        this.trigger(NEST_BOOT, boot);
    }

    public get consul(): Consul {
        return this._consul;
    }

    public set consul(consul: Consul) {
        this._consul = consul;
        this.trigger(NEST_CONSUL, consul);
    }

    public get consulConfig(): IConsulConfig {
        return this._consulConfig;
    }

    public set consulConfig(consulConfig: IConsulConfig) {
        this._consulConfig = consulConfig;
        this.trigger(NEST_CONSUL_CONFIG, consulConfig);
    }

    public get consulService(): IConsulService {
        return this._consulService;
    }

    public set consulService(consulService: IConsulService) {
        this._consulService = consulService;
        this.trigger(NEST_CONSUL_SERVICE, consulService);
    }

    public get loadbalance(): ILoadbalance {
        return this._loadbalance;
    }

    public set loadbalance(loadbalance: ILoadbalance) {
        this._loadbalance = loadbalance;
        this.trigger(NEST_CONSUL_LOADBALANCE, loadbalance);
    }

    public get logger(): ILogger {
        return this._logger;
    }

    public set logger(logger: ILogger) {
        this._logger = logger;
        this.trigger(NEST_LOGGER, logger);
    }

    public get gateway(): IGateway {
        return this._gateway;
    }

    public set gateway(gateway: IGateway) {
        this._gateway = gateway;
        this.trigger(NEST_GATEWAY, gateway);
    }

    public get memcached(): IMemcached {
        return this._memcached;
    }

    public set memcached(memcached: IMemcached) {
        this._memcached = memcached;
    }

    public get axios(): AxiosInstance {
        return this._axios;
    }

    public set axiosConfig(axiosConfig: AxiosRequestConfig) {
        this._axios = Axios.create(axiosConfig);
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
