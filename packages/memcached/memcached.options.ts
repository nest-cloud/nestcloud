export interface Options {
    dependencies?: string[];

    uri?: string[];
    /**
     * maxKeySize: 250, the maximum key size allowed.
     */
    maxKeySize?: number;

    /**
     * maxExpiration: 2592000, the maximum expiration time of keys (in seconds).
     */
    maxExpiration?: number;

    /**
     * maxValue: 1048576, the maximum size of a value.
     */
    maxValue?: number;

    /**
     * poolSize: 10, the maximum size of the connection pool.
     */
    poolSize?: number;

    /**
     * algorithm: md5, the hashing algorithm used to generate the hashRing values.
     */
    algorithm?: string;

    /**
     * reconnect: 18000000, the time between reconnection attempts (in milliseconds).
     */
    reconnect?: number;

    /**
     * timeout: 5000, the time after which Memcached sends a connection timeout (in milliseconds).
     */
    timeout?: number;

    /**
     * retries: 5, the number of socket allocation retries per request.
     */
    retries?: number;

    /**
     * failures: 5, the number of failed-attempts to a server before it is regarded as 'dead'.
     */
    failures?: number;

    /**
     * retry: 30000, the time between a server failure and an attempt to set it up back in service.
     */
    retry?: number;

    /**
     * remove: false, if true, authorizes the automatic removal of dead servers from the pool.
     */
    remove?: boolean;

    /**
     * failOverServers: undefined, an array of server_locations to replace servers that fail and that are removed from the consistent hashing scheme.
     */
    failOverServers?: string[];

    /**
     * keyCompression: true, whether to use md5 as hashing scheme when keys exceed maxKeySize.
     */
    keyCompression?: boolean;

    /**
     * idle: 5000, the idle timeout for the connections.
     */
    idle?: number;
}
