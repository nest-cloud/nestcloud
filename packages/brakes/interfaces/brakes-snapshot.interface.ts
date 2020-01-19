export interface BrakesSnapshot {
    name: string;
    group: string;
    time: number;
    open: boolean;
    circuitDuration: number;
    threshold: number;
    waitThreshold: number;
    stats: any;
}
