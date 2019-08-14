import * as os from 'os';

export const getIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        if (!interfaces.hasOwnProperty(devName)) {
            continue;
        }

        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (
                alias.family === 'IPv4' &&
                alias.address !== '127.0.0.1' &&
                !alias.internal
            ) {
                return alias.address;
            }
        }
    }
};
