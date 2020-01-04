export interface KubernetesOptions {
    inject?: string[];
    config?: string | any;
    cluster?: KubernetesCluster;
    user?: KubernetesUser;
}

export interface KubernetesCluster {
    readonly name: string;
    readonly caData?: string;
    caFile?: string;
    readonly server: string;
    readonly skipTLSVerify: boolean;
}

export interface KubernetesUser {
    readonly name: string;
    readonly certData?: string;
    certFile?: string;
    readonly exec?: any;
    readonly keyData?: string;
    keyFile?: string;
    readonly authProvider?: any;
    readonly token?: string;
    readonly username?: string;
    readonly password?: string;
}
