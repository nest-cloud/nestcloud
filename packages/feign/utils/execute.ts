export const execute = async (invoked) => {
    if (invoked instanceof Promise) {
        return await invoked;
    }
    return invoked;
};
