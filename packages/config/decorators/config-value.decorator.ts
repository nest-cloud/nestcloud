import 'reflect-metadata';
import { Store } from '../store';

export const ConfigValue = (path?: string, defaultValue?: any): PropertyDecorator => {
    return (target: any, propertyName: string | Symbol) => {
        const attributeName = propertyName as string;
        const configPath = path || attributeName;

        Store.watch(configPath, value => {
            if (value !== void 0) {
                target[attributeName] = value;
            } else if (defaultValue !== void 0) {
                target[attributeName] = defaultValue;
            }
        });
        const value = Store.get(configPath, defaultValue);
        if (value !== void 0) {
            target[attributeName] = value;
        }
    };
};
