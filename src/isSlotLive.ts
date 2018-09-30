import {Slot} from './interfaces/Slot';
import {Element} from 'xml-js';

export const isSlotAlive = (slot: Slot): boolean => {
    const schedule = slot.elements!.find((element: Element) => element.name === 'schedule');
    let startDate: boolean | Date = false;
    let endDate: boolean | Date = false;

    if (schedule && schedule.elements) {
        for (const time of schedule!.elements!) {

            if (time.name === 'start-date') {
                startDate = new Date(String(time!.elements![0].text));
            }

            if (time.name === 'end-date') {
                endDate = new Date(String(time!.elements![0].text));
            }
        }
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