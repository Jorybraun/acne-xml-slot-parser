
export const recursiveSearch = (obj: { [key: string]: any }, key: string, value: any, cb: (obj: {}, value: any) => boolean): boolean => {
    let found = false;
    // check the value again a callback to make function more versatile
    if (cb(obj[key], value)) { return true }

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