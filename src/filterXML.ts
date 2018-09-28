import * as fs from 'fs';
import * as convert from 'xml-js';
import {Slot} from './interfaces/Slot';

export const filterXML = (path: string, cb: (arg: Slot) => Boolean): Slot => {
    const file = fs.readFileSync(path, 'utf-8');
    const json: Slot = convert.xml2js(file, {ignoreComment: true, alwaysChildren: true});

    const clone = Object.assign({}, json);
    const filteredSlots = [];

    for (const slot of json.elements[0].elements) {
        if (cb(slot)) {
            // delete the slot
            filteredSlots.push(slot);
        }
    }

    clone.elements[0].elements = filteredSlots;
    return clone;
};