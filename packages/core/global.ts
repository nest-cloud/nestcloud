import { NestContainer } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";
import { IBoot, IConsulConfig, IConsulService, ILoadbalance, ILogger, IGateway, IMemcached } from "@nestcloud/common";
import * as Consul from 'consul';
import { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from 'axios';

export class Global {
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

    get app(): INestApplication {
        return this._app;
    }

    set app(app: INestApplication) {
        this._app = app;
    }

    get boot(): IBoot {
        return this._boot;
    }

    set boot(boot: IBoot) {
        this._boot = boot;
    }

    get consul(): Consul {
        return this._consul;
    }

    set consul(consul: Consul) {
        this._consul = consul;
    }

    get consulConfig(): IConsulConfig {
        return this._consulConfig;
    }

    set consulConfig(consulConfig: IConsulConfig) {
        this._consulConfig = consulConfig;
    }

    get consulService(): IConsulService {
        return this._consulService;
    }

    set consulService(consulService: IConsulService) {
        this._consulService = consulService;
    }

    get loadbalance(): ILoadbalance {
        return this._loadbalance;
    }

    set loadbalance(loadbalance: ILoadbalance) {
        this._loadbalance = loadbalance;
    }

    get logger(): ILogger {
        return this._logger;
    }

    set logger(logger: ILogger) {
        this._logger = logger;
    }

    get gateway(): IGateway {
        return this._gateway;
    }

    set gateway(gateway: IGateway) {
        this._gateway = gateway;
    }

    get memcached(): IMemcached {
        return this._memcached;
    }

    set memcached(memcached: IMemcached) {
        this._memcached = memcached;
    }

    get axios(): AxiosInstance {
        return this._axios;
    }

    set axiosConfig(axiosConfig: AxiosRequestConfig) {
        this._axios = axios.create(axiosConfig);
    }

    public getContainer(): NestContainer {
        return this._app ? (this._app as any).container : void 0;
    }
}
