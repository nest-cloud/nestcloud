import { Server } from './server';
import { Observable } from 'rxjs';

export class GrpcDelegate<T extends {}> {
    constructor(
        private readonly node: Server,
        private readonly service: T,
    ) {
    }

    execute(method: string, ...args: any[]): Observable<any> {
        if (this.node) {
            this.node.state.incrementServerActiveRequests();
            this.node.state.incrementTotalRequests();
            if (!this.node.state.firstConnectionTimestamp) {
                this.node.state.noteFirstConnectionTime();
            }
        }

        const startTime = new Date().getTime();
        return new Observable(observer => {
            const observable: Observable<any> = this.service[method](...args);
            observable.subscribe({
                error: (err) => {
                    if (this.node) {
                        this.node.state.decrementServerActiveRequests();
                        this.node.state.incrementServerFailureCounts();
                    }
                    observer.error(err);
                },
                complete: () => {
                    if (this.node) {
                        const endTime = new Date().getTime();
                        this.node.state.noteResponseTime(endTime - startTime);
                        this.node.state.decrementServerActiveRequests();
                    }
                    observer.complete();
                },
                next: (data) => {
                    observer.next(data);
                },
            });
        });
    }
}
