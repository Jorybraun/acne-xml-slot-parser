
export const recursiveSearch = (obj: { [key: string]: any }, key: string, value: any): boolean => {
    let found = false;
    if (obj[key] === value) { return true }

    for (const x in obj) {
        let result = false;
        if (typeof obj[x] == 'object') {
            result = recursiveSearch(obj[x], key, value);
        }

        if (result === true) {
            found = true;
        }
    }

    return found
};