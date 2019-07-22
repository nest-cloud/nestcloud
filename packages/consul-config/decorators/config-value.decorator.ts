import 'reflect-metadata';
import { Store } from '../store';

export const ConfigValue = (path?: string, defaultValue?: any): PropertyDecorator => {
    return (target: any, propertyName: string | Symbol) => {
        const attributeName = propertyName as string;
        const configPath = path || attributeName;

        Store.watch(configPath, value => {
            target[attributeName] = value === void 0 ? defaultValue : value;
        });
        target[attributeName] = Store.get(configPath, defaultValue);
    };
};
