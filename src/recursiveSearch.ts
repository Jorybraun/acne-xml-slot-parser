import {Slot} from "./interfaces/Slot";
import {CheckSlot} from "./checkContentAssetForSiteSpecific";

export const recursiveSearch = (slot: { [key: string]: any },
                                cb: (slot: Slot) => CheckSlot<boolean> | boolean) => {
    let found = false;

    if (cb(slot)) {
        return true
    }

    for (const x in slot) {
        let result = false;
        // if its an object search deeper
        if (typeof slot[x] == 'object') {
            // recursively search again
            result = recursiveSearch(slot[x], cb);
        }

        if (result === true) {
            // if we find the value return early
            found = true;
        }
    }

    return found
};