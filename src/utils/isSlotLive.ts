import {Slot} from '../interfaces/Slot';
import {Element} from 'xml-js';

export const isSlotAlive = (slot: Slot): boolean => {
    const schedule = slot.elements!.find((element: Element) => element.name === 'schedule');
    const enabled = slot.elements!.find((element: Element) => element.name === 'enabled-flag');
    let startDate: boolean | Date = false;
    let endDate: boolean | Date = false;

    if (
        enabled &&
        enabled.elements &&
        enabled.elements.length &&
        enabled.elements[0].text !== 'true'
    ) {
        // return early if enabled is false
        return false;
    }

    if (
        schedule &&
        schedule.elements &&
        schedule.elements.length
    ) {
        for (const time of schedule!.elements!) {

            if (time.name === 'start-date') {
                startDate = new Date(String(time!.elements![0].text));
            }

            if (time.name === 'end-date') {
                endDate = new Date(String(time!.elements![0].text));
            }
        }
    } else {
        // if schedule is false and enabled is true
        return true;
    }
    // if endDate exists and its now less than the current time
    const isNow: boolean = startDate !== false && startDate.getTime() < Date.now();
    const isOver: boolean = endDate !== false && endDate.getTime() <= Date.now();
    const isFuture: boolean = startDate !== false && startDate.getTime() >= Date.now();

    if (isOver) {
        return false;
    }

    return isNow || isFuture;
};