import { IServerState } from '@nestcloud/common';

export const PASSING = 'passing';

export const WARNING = 'warning';

export const CRITICAL = 'critical';

export class ServerState implements IServerState {
    status: string;
    totalRequests: number = 0;
    activeRequestsCount: number = 0;
    weight: number = -1;
    responseTimeAvg: number = 0;
    responseTimeMax: number = 0;
    activeRequestsCountTimeout: number = 10;
    lastActiveRequestsCountChangeTimestamp: number = 0;
    firstConnectionTimestamp: number = 0;
    lastConnectionFailedTimestamp: number = null;
    lastConnectionFailedMessage: string = '';
    serverFailureCounts: number = 0;

    constructor() {
        this.status = CRITICAL;
        this.activeRequestsCount = 0;
        this.weight = -1;
    }

    getActiveRequestsCount(currentTime?: number) {
        if (!currentTime) {
            currentTime = new Date().getTime();
        }
        const count = this.activeRequestsCount;
        if (count === 0) {
            return 0;
        } else if (
            currentTime - this.lastActiveRequestsCountChangeTimestamp > this.activeRequestsCountTimeout * 1000 ||
            count < 0
        ) {
            return (this.activeRequestsCount = 0);
        } else {
            return count;
        }
    }

    isAlive() {
        return this.status !== CRITICAL;
    }

    incrementServerFailureCounts() {
        if (!this.serverFailureCounts) {
            this.serverFailureCounts = 0;
        }

        return ++this.serverFailureCounts;
    }

    incrementTotalRequests() {
        if (!this.totalRequests) {
            this.totalRequests = 0;
        }

        return ++this.totalRequests;
    }

    incrementServerActiveRequests() {
        if (!this.activeRequestsCount) {
            this.activeRequestsCount = 0;
        }

        this.lastActiveRequestsCountChangeTimestamp = new Date().getTime();
        return ++this.activeRequestsCount;
    }

    decrementServerActiveRequests() {
        if (!this.activeRequestsCount) {
            return (this.activeRequestsCount = 0);
        }

        this.lastActiveRequestsCountChangeTimestamp = new Date().getTime();
        return --this.activeRequestsCount;
    }

    noteConnectionFailedTime(message = '') {
        this.lastConnectionFailedTimestamp = new Date().getTime();
        this.lastConnectionFailedMessage = message;
        this.status = CRITICAL;
    }

    noteFirstConnectionTime() {
        if (!this.firstConnectionTimestamp) {
            this.firstConnectionTimestamp = new Date().getTime();
        }
    }

    noteResponseTime(time) {
        this.weight = time - this.responseTimeAvg;
        this.responseTimeAvg = (this.responseTimeAvg * (this.totalRequests - 1) + time) / this.totalRequests;
        this.responseTimeMax = Math.max(this.responseTimeMax, time);
    }
}
