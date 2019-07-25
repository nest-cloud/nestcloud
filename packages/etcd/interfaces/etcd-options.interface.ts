import { IOptions } from 'etcd3';

export interface IEtcdOptions {
    dependencies?: string[];
    etcd?: IOptions;
}
