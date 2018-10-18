import {Slot} from "../interfaces/Slot";
import { recursiveSearch, convertToXML, exportXMLToFile, filterXML, isSlotAlive } from "../";
import has = Reflect.has;

describe('filterXML', () => {

    it('should return json', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot: Slot) => {
            return false;
        });

        expect(filtered.elements![0].elements).toHaveLength(0);
        expect(filtered).toMatchSnapshot();
    });

    it('should filter results based upon callback', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot: Slot) => {
            return slot.attributes!['slot-id'] === 'slot-15';
        });

        expect(filtered.elements![0].elements!.length).toBe(15);
        expect(filtered).toMatchSnapshot();
    })
});

describe('recursiveSearch', () => {

    it ('should find key in object', () => {
        const testObject = { batman: 'batman' };
        expect(recursiveSearch(testObject, 'batman', 'batman')).toBe(true);
    });

    it ('should find and object nested inside of an object', () => {
        const testObject = { batman: { robin: 'robin' }};
        expect(recursiveSearch(testObject, 'robin', 'robin')).toBe(true);
    });

    it ('accepts a callback and filters based on callback', () => {
        const testObject = {
            batman: {
                robin: [ { '$': { joker: 'joker' }} ],
                soup: 'warm'
            },
            'random-variable': {
                'content-id': 'acne_se_shop--customer-service'
            }
        };

        expect(recursiveSearch(testObject, 'content-id', 'acne_se', (test, value) => {
            return test.includes('acne_jp');
        })).toBe(false);

        expect(recursiveSearch(testObject, 'content-id', 'acne_jp', (test, value) => {
            return test.includes(value);
        })).toBe(false);

        expect(recursiveSearch(testObject, 'content-id', 'acne_se', (test, value) => {
            return test.includes(value);
        })).toBe(true);
    });

    it ('should object nested in array', () => {
        const testObject = {
            batman: {
                robin: [ { '$': { joker: 'joker' }} ],
                soup: 'warm'
            }
        };
        expect(recursiveSearch(testObject, 'nothere', 'false')).toBe(false);
        expect(recursiveSearch(testObject, 'soup', 'warm')).toBe(true);
        expect(recursiveSearch(testObject, 'joker', 'joker')).toBe(true);
    });
});

describe('integration of filterXML with recursiveSearch',  () => {
    it ('should return correct slots', async () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot) => recursiveSearch(slot, 'slot-id', 'slot-15'));

        expect(filtered.elements![0].elements).toHaveLength(15);
        expect(filtered).toMatchSnapshot();
    })
});

describe('convertToXML', () => {
    it('should be xml', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot) => recursiveSearch(slot, 'slot-id', 'slot-15'));
        expect(convertToXML(filtered)).toMatchSnapshot();
    })
});

describe('exportXMLtoFIle', () => {
    const fs = require('fs');

    it('should export xml to file', () => {
        const testPath = `${__dirname}/slots.xml`;
        const testString = 'this is a test';
        exportXMLToFile(testPath, testString);
        const file = fs.readFileSync(`${__dirname}/slots.xml`, 'utf-8');
        expect(file).toBe(testString);
        fs.unlinkSync(testPath);
    })
});

describe('isSlotAlive', () => {
    it('should return if slot is currently alive it should return true', () => {
        const slot1 = {
            elements: [
                { name: 'schedule', elements: [ { name: 'start-date', elements: [  { text: '2018-08-08T08:00:00.000Z' } ] }, { name: 'end-date', elements: [{ text: '2018-11-09T08:00:00.000Z' }] } ] }
            ]
        };

        const slot2 = {
            elements: [
                { name: 'schedule', elements: [ { name: 'start-date', elements: [  { text: '2018-08-08T08:00:00.000Z' } ] } ] }
            ]
        };
        expect(isSlotAlive(slot1)).toBe(true);
        expect(isSlotAlive(slot2)).toBe(true);
    });

    it('should fail if the slot is expired', () => {
        const slot = {
            elements: [
                { name: 'schedule', elements: [ { name: 'start-date', elements: [  { text: '2018-08-08T08:00:00.000Z' } ] }, { name: 'end-date', elements: [{ text: '2018-08-09T08:00:00.000Z' }] } ] }
            ]
        };

        expect(isSlotAlive(slot)).toBe(false)
    });

    it('should return true if the slot will be alive in the future', () => {
        const slot = {
            elements: [
                { name: 'schedule', elements: [ { name: 'start-date', elements: [  { text: '2018-11-08T08:00:00.000Z' } ] } ] }
            ]
        };

        expect(isSlotAlive(slot)).toBe(true)
    });

    it('should filter all the dead slots in coordination with filterXML', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot: Slot) => {
            const hasKey = recursiveSearch(slot, 'slot-id', 'slot-15');

            if (hasKey) {
                return isSlotAlive(slot);
            }

            return false
        });

        expect(filtered!.elements![0].elements!.length).toBe(9)
    });
});