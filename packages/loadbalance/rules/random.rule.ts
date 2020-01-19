import { get } from 'lodash';
import { Random } from 'random-js';
import { ILoadbalancer } from '@nestcloud/common';
import { Server } from '../server';
import { Rule } from '../interfaces/rule.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomRule implements Rule {
    private readonly random = new Random();
    private loadbalancer: ILoadbalancer;

    init(loadbalancer: ILoadbalancer) {
        this.loadbalancer = loadbalancer;
    }

    choose(): Server {
        let server = null;

        while (true) {
            const reachableServers = this.loadbalancer.servers.filter(server => server.state.isAlive());
            const allServers = this.loadbalancer.servers;
            const upCount = reachableServers.length;
            const serverCount = allServers.length;

            if (upCount === 0 || serverCount === 0) {
                return null;
            }

            const index = this.random.integer(0, serverCount - 1);
            server = reachableServers[index];

            if (server === null) {
                continue;
            }

            if (get(server, 'state') && server.state.isAlive()) {
                return server;
            }

            server = null;
        }
    }
}
