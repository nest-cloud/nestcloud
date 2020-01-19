import {
    IConsul,
    Acl,
    Agent,
    Catalog,
    Event,
    Health,
    Kv,
    Session,
    Status,
    Lock,
    Watch,
    CommonOptions,
} from '@nestcloud/common';

export class Consul implements IConsul {
    acl: Acl;
    agent: Agent;
    catalog: Catalog;
    event: Event;
    health: Health;
    kv: Kv;
    session: Session;
    status: Status;

    lock(opts: LockOptions): Lock {
        return undefined;
    }

    watch(opts: WatchOptions): Watch {
        return undefined;
    }
}

interface WatchOptions {
    method: Function;
    options?: CommonOptions & { key?: string };
    backoffFactor?: number;
    backoffMax?: number;
    maxAttempts?: number;
}

interface LockOptions {
    key: string;
    session?: Object | string;
    value?: string | Buffer;
    lockwaittime?: string;
    lockretrytime?: string;
}
