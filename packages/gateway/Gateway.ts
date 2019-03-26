import { Loadbalance } from '@nestcloud/consul-loadbalance';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as HttpProxy from 'http-proxy';

import { Route } from './Options';
import { ProxyOptions } from './ProxyOptions';

export class Gateway {
    private readonly proxy: HttpProxy;
    private readonly proxyOptions: ProxyOptions;
    private readonly lb: Loadbalance;
    private readonly routeMap = {};

    constructor(proxyOptions: ProxyOptions, lb: Loadbalance, routes: Route[]) {
        this.lb = lb;
        routes.forEach(route => this.routeMap[route.id] = route);
        this.proxyOptions = Object.assign({}, proxyOptions, {
            prependPath: true,
            ignorePath: true
        });
        this.proxy = HttpProxy.createProxyServer({});
        this.proxy.on('error', function (err, req, res) {
            try {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });
            } catch (ignore) {
            }

            res.end(JSON.stringify({ message: err.message, status: 500 }));
        });
    }

    forward(req: Request, res: Response, id: string) {
        const route = this.routeMap[id] as Route;
        if (!route) {
            throw new NotFoundException('No route config found in gateway config files, please check it.');
        }
        if (route.uri.indexOf('lb://') === 0) {
            const service = route.uri.replace('lb://', '');
            const server = this.lb.choose(service);
            if (!server) {
                throw new InternalServerErrorException(`No available server can handle this request`);
            }
            const target = `${this.proxyOptions.secure ? 'https' : 'http'}://${server.address}:${server.port}${req.url}`;
            this.proxy.web(req, res, {
                target,
                prependPath: true,
                ignorePath: true
            });
        } else if (route.uri.indexOf('http://') === 0 || route.uri.indexOf('https://') === 0) {
            const target = route.uri;
            this.proxy.web(req, res, { target });
        }
    }
}
