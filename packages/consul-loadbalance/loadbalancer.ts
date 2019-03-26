import * as path from 'path';

import { ILoadbalancer } from './loadbalancer.interface';
import { IRule, RandomRule } from './rules';
import { Server } from './server';
import { ServerState } from './stats/server.state';

export class Loadbalancer implements ILoadbalancer {
    private readonly INTERVAL_RULES = ['RandomRule', 'RoundRobinRule', 'WeightedResponseTimeRule'];
    private readonly PATH_RE = /node_modules\/.+/;
    private readonly id: string;
    private readonly name: string;
    servers: Server[];
    private rule: IRule;

    constructor(options: { id: string; name?: string; servers?: Server[]; ruleCls?; }) {
        this.id = options.id;
        this.name = options.name || options.id;
        this.servers = this.initialServers(options.servers);
        if (typeof options.ruleCls === 'function' && options.ruleCls.prototype.constructor) {
            this.rule = new options.ruleCls(this);
        } else if (typeof options.ruleCls === 'string' && options.ruleCls) {
            let modulePath = path.resolve(__dirname.replace(this.PATH_RE, ''), options.ruleCls);
            if (this.INTERVAL_RULES.indexOf(options.ruleCls) !== -1) {
                modulePath = path.resolve(__dirname, '../rules', options.ruleCls);
            }

            const module = require(modulePath);
            for (const key in module) {
                if (module.hasOwnProperty(key)) {
                    this.rule = new module[key]();
                    break;
                }
            }
        } else {
            this.rule = new RandomRule();
        }
        this.rule.init(this);
    }

    chooseService() {
        if (!this.rule) {
            throw new Error("The rule is not exist.");
        }

        return this.rule.choose();
    }

    updateRule(RuleCls) {
        if (typeof RuleCls === 'function' && RuleCls.prototype.constructor) {
            this.rule = new RuleCls(this);
            this.rule.init(this);
        }
    }

    addServer(server: Server) {
        if (server) {
            this.servers.push(this.initialServer(server));
        }
    }

    removeServer(serverId: string) {
        if (serverId) {
            this.servers = this.servers.filter(server => server.id !== serverId);
        }
    }

    private initialServers(servers: Server[]): Server[] {
        if (!servers) {
            return [];
        }
        return servers.map(server => this.initialServer(server));
    }

    private initialServer(server: Server): Server {
        if (!server.address || !server.port) {
            throw new Error('Service does not has address or port');
        }

        if (!server.state) {
            server.state = new ServerState();
        }
        return server;
    }
}