import * as MemcachedClient from 'memcached';
import * as HashRing from 'hashring';

import { IMemcachedOptions } from './interfaces/memcached-options.interface';

export class Memcached {
    private hashRing;
    private readonly clients = new Map<string, MemcachedClient>();

    constructor(uri: MemcachedClient.Location, options: IMemcachedOptions) {
        let servers = [];
        if (typeof uri === 'string') {
            servers = [uri];
        } else {
            servers = uri as string[];
        }
        servers = servers.map(server => {
            if (!server.match(/(.+):(\d+)$/)) {
                server = server + ':11211';
            }
            return server;
        });
        this.hashRing = new HashRing(servers, 'md5', {
            'compatibility': 'ketama',
            'default port': 11211,
        });
        servers.forEach(server => {
            this.clients.set(server, new MemcachedClient(server, options));
        });

        setInterval(() => {
            for (const key of this.clients.keys()) {
                const client = this.clients.get(key);
                client.get('test', (err, data) => {
                    if (err) {
                        return this.hashRing.remove(key);
                    }
                    if (!this.hashRing.has(key)) {
                        this.hashRing.add(key);
                    }
                });
            }
        }, options.healthCheckInterval || 10000);
    }

    async touch(key: string, lifetime?: number) {
        return new Promise((resolve, reject) => {
            this.choose(key).touch(key, lifetime, err => (err ? reject(err) : resolve()));
        });
    }

    async get(key: string) {
        return new Promise((resolve, reject) => {
            this.choose(key).get(key, (err, data) => (err ? reject(err) : resolve(data)));
        });
    }

    async gets(key: string) {
        return new Promise((resolve, reject) => {
            this.choose(key).gets(key, (err, data) => (err ? reject(err) : resolve(data)));
        });
    }

    async getMulti(keys: string[]) {
        const data = {};
        await Promise.all(keys.map(async key => {
            data[key] = await this.get(key);
        }));
        return data;
    }

    async set(key: string, value: any, lifetime?: number) {
        return new Promise((resolve, reject) => {
            this.choose(key).set(key, value, lifetime, err => (err ? reject(err) : resolve()));
        });
    }

    async replace(key: string, value: any, lifetime?: number) {
        return new Promise((resolve, reject) => {
            this.choose(key).replace(key, value, lifetime, err => (err ? reject(err) : resolve()));
        });
    }

    async cas(key: string, value: any, lifetime: string, cas: number) {
        return new Promise((resolve, reject) => {
            this.choose(key).cas(key, value, lifetime, cas, err => (err ? reject(err) : resolve()));
        });
    }

    async append(key: string, value: any) {
        return new Promise((resolve, reject) => {
            this.choose(key).append(key, value, err => (err ? reject(err) : resolve()));
        });
    }

    async prepend(key: string, value: any) {
        return new Promise((resolve, reject) => {
            this.choose(key).append(key, value, err => (err ? reject(err) : resolve()));
        });
    }

    async incr(key: string, amount: number) {
        return new Promise((resolve, reject) => {
            this.choose(key).incr(key, amount, err => (err ? reject(err) : resolve()));
        });
    }

    async decr(key: string, amount: number) {
        return new Promise((resolve, reject) => {
            this.choose(key).decr(key, amount, err => (err ? reject(err) : resolve()));
        });
    }

    async del(key: string) {
        return new Promise((resolve, reject) => {
            this.choose(key).del(key, err => (err ? reject(err) : resolve()));
        });
    }

    on(event: MemcachedClient.EventNames, callback) {
        for (const client of this.clients.values()) {
            client.on(event, callback);
        }
    }

    private choose(key: string): MemcachedClient {
        const server = this.hashRing.get(key);
        return this.clients.get(server);
    }
}
