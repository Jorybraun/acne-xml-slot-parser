import {Slot} from "./interfaces/Slot";

export type CheckSlot<T> = (slot: Slot, ...args: (any)[]) => T

export const checkForContentId: CheckSlot<boolean> = (slot: Slot, value: string): boolean => {
    if (slot.name === 'content-asset'
        && typeof slot.attributes !== 'undefined'
        && typeof slot.attributes['content-id'] !== 'undefined') {
        const contentId = slot.attributes['content-id'];
        if (typeof contentId === 'string')
        {
            return contentId.includes(value)
        }
    }
    return false
}

export const curySlots = (fn: CheckSlot<boolean>) => (...args: (any)[]) => (slot: Slot) => fn(slot, ...args);

// using partial application to store cb in clojure
export const curriedCheckForContentId = curySlots(checkForContentId);