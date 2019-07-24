import * as TypeormModule from '@nestjs/typeorm';

interface Connection {
    getRepository(target: any): any;

    getCustomRepository(target: any): any;
}

export function components(...components: any[]) {
    const results = [];
    components.forEach(component => {
        if (typeof component === 'function') {
            results.push(component);
        } else if (!!(typeof component === 'object' && component.provide)) {
            results.push(component);
        } else if (typeof component === 'object') {
            for (const key in component) {
                if (!component.hasOwnProperty(key)) {
                    continue;
                }
                results.push(component[key]);
            }
        }
    });
    return results;
}

export function repositories(...repositories: any[]) {
    const results = [];
    repositories.forEach(repo => {
        if (typeof repo === 'function') {
            results.push(getCustomRepository(repo.name, repo));
        } else if (typeof repo === 'object') {
            for (const key in repo) {
                if (!repo.hasOwnProperty(key)) {
                    continue;
                }
                results.push(getCustomRepository(repo[key].name, repo[key]));
            }
        }
    });

    return results;
}

export function getRepository(name: string, entity) {
    const module: typeof TypeormModule = require('@nestjs/typeorm');
    return {
        provide: name,
        useFactory: (connection: Connection) => connection.getRepository(entity),
        inject: [module.getConnectionToken()],
    };
}

export function getCustomRepository(name: string, repo) {
    const module: typeof TypeormModule = require('@nestjs/typeorm');
    return {
        provide: name,
        useFactory: (connection: Connection) => connection.getCustomRepository(repo),
        inject: [module.getConnectionToken()],
    };
}
