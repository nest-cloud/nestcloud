import * as MemcachedClient from 'memcached';

import { IMemcachedOptions } from './interfaces/memcached-options.interface';

export class Memcached {
    private readonly client: MemcachedClient;

    constructor(uri: MemcachedClient.Location, options: IMemcachedOptions) {
        this.client = new MemcachedClient(uri, options);
    }

    async touch(key: string, lifetime?: number) {
        return new Promise((resolve, reject) => {
            this.client.touch(key, lifetime, err => (err ? reject(err) : resolve()));
        });
    }

    async get(key: string) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, data) => (err ? reject(err) : resolve(data)));
        });
    }

    async gets(key: string) {
        return new Promise((resolve, reject) => {
            this.client.gets(key, (err, data) => (err ? reject(err) : resolve(data)));
        });
    }

    async getMulti(keys: string[]) {
        return new Promise((resolve, reject) => {
            this.client.getMulti(keys, (err, data) => (err ? reject(err) : resolve(data)));
        });
    }

    async set(key: string, value: any, lifetime?: number) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, lifetime, err => (err ? reject(err) : resolve()));
        });
    }

    async replace(key: string, value: any, lifetime?: number) {
        return new Promise((resolve, reject) => {
            this.client.replace(key, value, lifetime, err => (err ? reject(err) : resolve()));
        });
    }

    async cas(key: string, value: any, lifetime: string, cas: number) {
        return new Promise((resolve, reject) => {
            this.client.cas(key, value, lifetime, cas, err => (err ? reject(err) : resolve()));
        });
    }

    async append(key: string, value: any) {
        return new Promise((resolve, reject) => {
            this.client.append(key, value, err => (err ? reject(err) : resolve()));
        });
    }

    async prepend(key: string, value: any) {
        return new Promise((resolve, reject) => {
            this.client.append(key, value, err => (err ? reject(err) : resolve()));
        });
    }

    async incr(key: string, amount: number) {
        return new Promise((resolve, reject) => {
            this.client.incr(key, amount, err => (err ? reject(err) : resolve()));
        });
    }

    async decr(key: string, amount: number) {
        return new Promise((resolve, reject) => {
            this.client.decr(key, amount, err => (err ? reject(err) : resolve()));
        });
    }

    async del(key: string) {
        return new Promise((resolve, reject) => {
            this.client.del(key, err => (err ? reject(err) : resolve()));
        });
    }

    on(event: MemcachedClient.EventNames, callback) {
        this.client.on(event, callback);
    }
}
