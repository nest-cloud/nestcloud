import * as path from 'path';

import { ILoadbalancer, IServer } from '@nestcloud/common';
import { RandomRule } from './rules';
import { Server } from './server';
import { ServerState } from './server-state';
import { IRule } from './interfaces/rule.interface';
import { ILoadbalanerOptions } from './interfaces/loadbalancer-options.interface';
import { RuleInitException } from './exceptions/rule-init.exception';

export class Loadbalancer implements ILoadbalancer {
    private readonly INTERVAL_RULES = {
        RandomRule: 'random.rule',
        RoundRobinRule: 'round-robin.rule',
        WeightedResponseTimeRule: 'weighted-response-time.rule',
    };
    private readonly id: string;
    private readonly name: string;
    servers: Server[];
    private rule: IRule;

    constructor(options: ILoadbalanerOptions) {
        this.id = options.id;
        this.name = options.name || options.id;
        this.servers = this.initialServers(options.servers);
        if (typeof options.ruleCls === 'function' && options.ruleCls.prototype.constructor) {
            this.rule = new (options.ruleCls as any)(this);
        } else if (typeof options.ruleCls === 'string' && options.ruleCls) {
            let modulePath;
            if (this.INTERVAL_RULES[options.ruleCls]) {
                modulePath = path.resolve(__dirname, './rules', this.INTERVAL_RULES[options.ruleCls]);
            } else if (options.customRulePath) {
                modulePath = path.resolve(options.customRulePath, options.ruleCls);
            } else {
                throw new RuleInitException(
                    'The loadbalancer rule name is not correct or the custom rule path is empty',
                );
            }

            try {
                const module = require(modulePath);
                for (const key in module) {
                    if (module.hasOwnProperty(key)) {
                        this.rule = new module[key]();
                        break;
                    }
                }
            } catch (e) {
                throw new RuleInitException(
                    'Rule module not found, maybe the custom rule path is not correct',
                    e.stack,
                );
            }
        } else {
            this.rule = new RandomRule();
        }
        this.rule.init(this);
    }

    chooseService(): IServer {
        if (!this.rule) {
            throw new Error('The rule is not exist.');
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
