export interface IServerState {
    status: string;
    totalRequests: number;
    activeRequestsCount: number;
    weight: number;
    responseTimeAvg: number;
    responseTimeMax: number;
    activeRequestsCountTimeout: number;
    lastActiveRequestsCountChangeTimestamp: number;
    firstConnectionTimestamp: number;
    lastConnectionFailedTimestamp: number;
    serverFailureCounts: number;

    getActiveRequestsCount(currentTime?: number): number;

    isAlive(): boolean;

    incrementServerFailureCounts(): number;

    incrementTotalRequests(): number;

    incrementServerActiveRequests(): number;

    decrementServerActiveRequests(): number;

    noteConnectionFailedTime(): void;

    noteFirstConnectionTime(): void;

    noteResponseTime(time: number): void;
}
