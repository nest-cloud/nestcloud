export interface IHealthCheck {
    check(): Promise<void>;
}
