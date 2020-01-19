export interface HealthCheck {
    check(): Promise<void>;
}
