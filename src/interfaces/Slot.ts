import {Attributes, Element, ElementCompact} from "xml-js";

interface SlotAttributes extends Attributes {
    'slot-id'?: string
    context?: string
    'context-id'?: string
    'configuration-id'?: string
    'assigned-to-site'?: 'true'|'false'
}

export interface Slot extends Element, ElementCompact {
    attributes?: SlotAttributes
}

export interface FilteredPayload {
    keep: Slot,
    remove: Slot
}

export type CheckSlot<T> = (slot: Slot, ...args: (any)[]) => T