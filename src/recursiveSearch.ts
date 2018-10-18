
export const recursiveSearch = (obj: { [key: string]: any }, key: string, value: any, cb?: (test: any, against: any) => boolean): boolean => {
    let found = false;
    // check the value through callback to make function more versatile
    const test = obj[key];
    // check if value is undefined
    if (test) {
        if (cb) {
            if (cb(test, value)) { return true }
        } else {
            if (test === value) { return true }
        }
    }

    for (const x in obj) {
        let result = false;
        // if its an object search deeper
        if (typeof obj[x] == 'object') {
            // recursively search again
            result = recursiveSearch(obj[x], key, value, cb);
        }

        if (result === true) {
            // if we find the value return early
            found = true;
        }
    }

    return found
};