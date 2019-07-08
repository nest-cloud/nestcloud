export interface IBrakesConfig {
    /**
     * to use for name of circuit. This is mostly used for reporting on stats.
     */
    name?: string;

    /**
     *  to use for group of circuit. This is mostly used for reporting on stats.
     */
    group?: string;

    /**
     * time in ms that a specific bucket should remain active.
     */
    bucketSpan?: number;

    /**
     * interval in ms that brakes should emit a snapshot event.
     */
    statInterval?: number;

    /**
     * array<number> that defines the percentile levels that should be calculated on the stats object
     * (i.e. 0.9 for 90th percentile).
     */
    percentiles?: number[];

    /**
     * # of buckets to retain in a rolling window.
     */
    bucketNum?: number;

    /**
     *  time in ms that a circuit should remain broken
     */
    circuitDuration?: number;

    /**
     * number of requests to wait before testing circuit health
     */
    waitThreshold?: number;

    /**
     * % threshold for successful calls. If the % of successful calls dips below this threshold the circuit will break
     * timeout: time in ms before a service call will timeout
     */
    threshold?: number;

    /**
     * function that returns true if an error should be considered a failure
     * (receives the error object returned by your command.)
     * This allows for non-critical errors to be ignored by the circuit breaker
     */
    isFailure?: () => boolean;

    /**
     * time in ms interval between each execution of health check function
     */
    healthCheckInterval?: number;

    event?: (name: string, ...params) => void;

    healthCheck?: boolean;

    timeout?: number;
}