import {Slot} from "../interfaces/Slot";
import {recursiveSearch, convertToXML, exportXMLToFile, filterXML, isSlotAlive} from "../";
import {
    curriedCheckForContentId,
} from "../checkContentAssetForSiteSpecific";

describe('filterXML', () => {

    it('should return json', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot: Slot) => {
            return false;
        });

        expect(filtered.keep.elements![0].elements).toHaveLength(0);
        expect(filtered.keep).toMatchSnapshot();
    });

    it('should filter results based upon callback', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot: Slot) => {
            return slot.attributes!['slot-id'] === 'slot-15';
        });

        expect(filtered.keep.elements![0].elements!.length).toBe(15);
        expect(filtered.keep).toMatchSnapshot();
    })
});

describe('recursiveSearch', () => {

    it('should find key in object', () => {
        const testObject = { batman: 'batman' };

        expect(recursiveSearch(testObject, (slot) => {
            return slot.batman === 'batman'
        })).toBe(true);
    });

    it('should find and object nested inside of an object', () => {
        const testObject = { batman: { robin: 'robin' }};
        expect(recursiveSearch(testObject, (slot) => {
           return slot['robin'] === 'robin'
        })).toBe(true);
    });

    it('accepts a callback and filters based on callback', () => {
        const testObject = {
            batman: {
                robin: [ { '$': { joker: 'joker' }} ],
                soup: 'warm'
            },
            'random-variable': {
                'content-id': 'acne_se_shop--customer-service'
            }
        };

        expect (recursiveSearch(testObject, (slot) => {
            if (slot['content-id']) {
                return slot['content-id'].includes('acne_jp');
            }
        })).toBe(false);

        expect (recursiveSearch(testObject, (test) => {
            if (test['content-id']) {
                return test['content-id']!.includes('acne_se');
            }
        })).toBe(true);
    });

    it('should object nested in array', () => {
        const testObject = {
            batman: {
                robin: [ { '$': { joker: 'joker' }} ],
                soup: 'warm'
            }
        };
        expect(recursiveSearch(testObject, (slot) => {
            return slot['nothere'] === 'false'
        })).toBe(false);
        expect(recursiveSearch(testObject, (slot) => {
            return slot['soup'] === 'warm'
        })).toBe(true);
        expect(recursiveSearch(testObject, (slot) => {
            return slot['joker'] === 'joker'
        })).toBe(true);
    });
});

describe('integration of filterXML with recursiveSearch',  () => {
    it('should return correct slots', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot) => recursiveSearch(slot, (test) => {
            return test['slot-id'] === 'slot-15'
        }));

        expect(filtered.keep.elements![0].elements).toHaveLength(15);
        expect(filtered.remove.elements![0].elements).toHaveLength(1319);
        expect(filtered.keep).toMatchSnapshot();
    })
});

describe('convertToXML', () => {
    it('should be xml', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot) => recursiveSearch(slot, (slot) => {
            return slot['slot-id'] === 'slot-15'
        }));
        expect(convertToXML(filtered.keep)).toMatchSnapshot();
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

describe ('checkContentAssetsForSiteSpecific', () => {
    it('should check content Slot for acne_se', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot: Slot) => {
            return recursiveSearch(slot, curriedCheckForContentId('acne_se'))
        });
        expect(filtered.keep.elements![0].elements).toHaveLength(5)
    })
});

describe ('isSlotAlive', () => {
    it ('should return if slot is currently alive it should return true', () => {
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
        expect (isSlotAlive(slot1)).toBe(true);
        expect (isSlotAlive(slot2)).toBe(true);
    });

    it ('should fail if the slot is expired', () => {
        const slot = {
            elements: [
                { name: 'schedule', elements: [ { name: 'start-date', elements: [  { text: '2018-08-08T08:00:00.000Z' } ] }, { name: 'end-date', elements: [{ text: '2018-08-09T08:00:00.000Z' }] } ] }
            ]
        };

        expect (isSlotAlive(slot)).toBe(false)
    });

    it ('should return true if the slot will be alive in the future', () => {
        const slot = {
            elements: [
                { name: 'schedule', elements: [ { name: 'start-date', elements: [  { text: '2018-11-08T08:00:00.000Z' } ] } ] }
            ]
        };

        expect (isSlotAlive(slot)).toBe(true)
    });

    it ('should filter all the dead slots in coordination with filterXML', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot: Slot) => {
            const hasKey = recursiveSearch(slot, (test) => {
                return test['slot-id'] === 'slot-15';
            });

            if (hasKey) {
                return isSlotAlive(slot);
            }

            return false
        });

        expect (filtered.keep.elements![0].elements!.length).toBe(9)
    });


});