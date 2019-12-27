import * as _ from 'lodash';

export const objectToMap = object => {
    const result = {};
    parseObjectToMap(result, object);

    return result;
};

export const mapToObject = map => {
    const result = {};
    for (const key in map) {
        if (!map.hasOwnProperty(key)) {
            continue;
        }

        _.set(result, key, map[key]);
    }

    return result;
};

function parseObjectToMap(mapper, object, path?) {
    if (!mapper) {
        mapper = {};
    }

    for (const key in object) {
        if (!object.hasOwnProperty(key)) {
            continue;
        }
        let newPath;
        if (!path) {
            newPath = key;
        } else {
            newPath = path + '.' + key;
        }

        if (!object.hasOwnProperty(key)) {
            continue;
        }

        if (_.isArray(object[key])) {
            mapper[newPath] = object[key];
            parseArray(mapper, object[key], newPath);
        } else if (_.isObject(object[key])) {
            mapper[newPath] = object[key];
            parseObjectToMap(mapper, object[key], newPath);
        } else {
            mapper[newPath] = object[key];
        }
    }
}

function parseArray(mapper, array, path) {
    array.forEach((item, index) => {
        const newPath = path + '[' + index + ']';
        if (_.isObject(item)) {
            parseObjectToMap(mapper, item, newPath);
        } else if (_.isArray(item)) {
            parseArray(mapper, item, newPath);
        } else {
            mapper[newPath] = item;
        }
    });
}
