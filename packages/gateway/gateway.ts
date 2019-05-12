import { Loadbalance } from '@nestcloud/consul-loadbalance';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as HttpProxy from 'http-proxy';
import { IGateway, IConsulConfig } from '@nestcloud/common';

import { IRoute } from './interfaces/route.interface';
import { IProxyOptions } from './interfaces/proxy-options.interface';

export class Gateway implements IGateway {
    private readonly proxy: HttpProxy;
    private readonly proxyOptions: IProxyOptions;
    private readonly lb: Loadbalance;
    protected readonly config: IConsulConfig;
    private routeMap = {};

    constructor(proxyOptions: IProxyOptions, lb: Loadbalance, routes: IRoute[], config?: IConsulConfig) {
        this.lb = lb;
        routes.forEach(route => (this.routeMap[route.id] = route));
        this.config = config;
        this.proxyOptions = Object.assign({}, proxyOptions, {
            prependPath: true,
            ignorePath: true,
        });
        this.proxy = HttpProxy.createProxyServer({});
    }

    public updateRoutes(routes: IRoute[], sync: boolean = true) {
        this.routeMap = {};
        routes.forEach(route => (this.routeMap[route.id] = route));
        if (sync && this.config) {
            this.config.set('loadbalance.rules', routes);
        }
    }

    forward(req: Request, res: Response, id: string) {
        const route = this.routeMap[id] as IRoute;
        if (!route) {
            throw new NotFoundException('No route config found in gateway config files, please check it.');
        }
        if (route.uri.indexOf('lb://') === 0) {
            const service = route.uri.replace('lb://', '');
            const server = this.lb.choose(service);
            if (!server) {
                throw new InternalServerErrorException(`No available server can handle this request`);
            }
            const target = `${ this.proxyOptions.secure ? 'https' : 'http' }://${ server.address }:${ server.port }${
                req.url
                }`;
            this.proxy.web(req, res, {
                target,
                prependPath: true,
                ignorePath: true,
            }, (err: any, req, res) => {
                try {
                    res.writeHead(500, {
                        'Content-Type': 'application/json',
                    });
                } catch (ignore) {
                }

                try {
                    if (err && err.code === 'ECONNREFUSED') {
                        server.state.noteConnectionFailedTime();
                    }
                } catch (ignore) {
                }

                res.end(JSON.stringify({ message: err.message, status: 500 }));
            });
        } else if (route.uri.indexOf('http://') === 0 || route.uri.indexOf('https://') === 0) {
            const target = route.uri;
            this.proxy.web(req, res, { target }, (err: any, req, res) => {
                try {
                    res.writeHead(500, {
                        'Content-Type': 'application/json',
                    });
                } catch (ignore) {
                }

                res.end(JSON.stringify({ message: err.message, status: 500 }));
            });
        }
    }
}
