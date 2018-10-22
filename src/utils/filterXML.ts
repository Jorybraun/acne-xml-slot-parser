import * as fs from 'fs';
import * as convert from 'xml-js';
import {FilteredPayload, Slot} from '../interfaces/Slot';

const deepClone = (obj: {}) => {
    return JSON.parse(JSON.stringify(obj))
}

export const filterXML = (path: string, cb: (arg: Slot) => Boolean): FilteredPayload => {
    const file = fs.readFileSync(path, 'utf-8');
    const json: Slot = convert.xml2js(file, {ignoreComment: true, alwaysChildren: true});

    const keepClone = deepClone(json);
    const removeClone = deepClone(json);
    const keepSlots = [];
    const removeSlots = [];

    for (const slot of json.elements![0].elements!) {
        if (cb(slot)) {
            keepSlots.push(slot);
        } else {
            removeSlots.push(slot);
        }
    }
    keepClone.elements![0].elements = keepSlots;
    removeClone.elements![0].elements = removeSlots;
    return {
        keep: keepClone,
        remove: removeClone
    }
};