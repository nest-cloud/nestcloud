import { get } from 'lodash';
import { RoundRobinRule } from "./round-robin.rule";
import { Server } from "../server";

export class WeightedResponseTimeRule extends RoundRobinRule {
    constructor() {
        super();
    }

    choose(): Server {
        let count = 0;
        let server = null;

        while (server === null && count++ < 10) {
            const reachableServers = this.loadbalancer.servers.filter(server => server.state.isAlive());
            const allServers = this.loadbalancer.servers;
            const upCount = reachableServers.length;
            const serverCount = allServers.length;

            if (upCount === 0 || serverCount === 0) {
                return null;
            }

            if (reachableServers.filter(server => server.state.firstConnectionTimestamp).length === 0) {
                return super.choose();
            }
            const nextServerIndex = this.incrementAndGetModulo(serverCount);
            reachableServers.sort((a, b) => a.state.weight - b.state.weight);
            server = reachableServers[nextServerIndex];

            if (server === null) {
                continue;
            }

            if (get(server, 'state') && server.state.isAlive()) {
                return server;
            }

            server = null;
        }
        const servers = this.loadbalancer.servers;
        if (servers.filter(server => server.state.firstConnectionTimestamp).length === 0) {
            return super.choose();
        }
        servers.sort((a, b) => a.state.weight - b.state.weight);
        return servers[0];
    }
}
