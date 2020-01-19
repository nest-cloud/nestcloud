export const NO_SCHEDULER_FOUND = (schedulerName: string, name?: string) =>
    name
        ? `No ${schedulerName} was found with the given name (${name}). Check that you created one with a decorator or with the create API.`
        : `No ${schedulerName} was found. Check your configuration.`;

export const DUPLICATE_SCHEDULER = (schedulerName: string, name: string) =>
    `${schedulerName} with the given name (${name}) already exists. Ignored.`;

export const TRY_LOCK_FAILED = (name?: string) =>
    name
        ? `Acquire lock with the given name ${name} failed. Ignored`
        : `Acquire lock failed. Ignored`;

export const RELEASE_LOCK_ERROR = (name?: string) =>
    name
        ? `Release lock with the given name ${name} failed.`
        : `Release lock failed. Ignored`;

export const JOB_EXECUTE_ERROR = (name: string) =>
    `Job ${name} execute error: `;
