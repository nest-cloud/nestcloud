export function toList<T extends any>(object): T[] {
    const result = [];
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            result.push(key);
        }
    }
    return result;
}

export function toValueList<T extends any>(object): T[] {
    const result = [];
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            result.push(object[key]);
        }
    }
    return result;
}
