import { filterXML } from '../filterXML'
import {Slot} from "../interfaces/Slot";
import { recursiveSearch } from "../recursiveSearch";
import {convertToXML, exportXMLToFile} from "../convertToXML";

describe('filterXML', () => {

    it('should return json', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot: Slot) => {
            return false
        });

        expect(filtered.elements[0].elements).toHaveLength(0)
        expect(filtered).toMatchSnapshot()
    });

    it('should filter results based upon callback', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot: Slot) => {
            return slot.attributes['slot-id'] === 'slot-15'
        });

        expect(filtered.elements[0].elements.length).toBe(15)
        expect(filtered).toMatchSnapshot()
    })
});

describe('recursiveSearch', () => {

    it ('should find key in object', () => {
        const testObject = { batman: 'batman' }
        expect(recursiveSearch(testObject, 'batman', 'batman')).toBe(true)
    });

    it ('should find and object nested inside of an object', () => {
        const testObject = { batman: { robin: 'robin' }}
        expect(recursiveSearch(testObject, 'robin', 'robin')).toBe(true)
    });

    it('should object nested in array', () => {
        const testObject = {
            batman: {
                robin: [ { '$': { joker: 'joker' }} ],
                soup: 'warm'
            }
        };

        expect(recursiveSearch(testObject, 'soup', 'warm')).toBe(true);
        expect(recursiveSearch(testObject, 'joker', 'joker')).toBe(true);
    });
});

describe('integration of filterXML with recursiveSearch',  () => {
    it ('should return correct slots', async () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot) => recursiveSearch(slot, 'slot-id', 'slot-15'))

        expect(filtered.elements[0].elements).toHaveLength(15)
        expect(filtered).toMatchSnapshot()
    })
});

describe('convertToXML', () => {
    it('should be xml', () => {
        const filtered = filterXML(`${__dirname}/home.xml`, (slot) => recursiveSearch(slot, 'slot-id', 'slot-15'))
        expect(convertToXML(filtered)).toMatchSnapshot()
    })
});

describe('exportXMLtoFIle', () => {
    const fs = require('fs')

    it('should export xml to file', () => {
        const testPath = `${__dirname}/slots.xml`;
        const testString = 'this is a test';
        exportXMLToFile(testPath, testString);
        const file = fs.readFileSync(`${__dirname}/slots.xml`, 'utf-8')
        expect(file).toBe(testString)

        fs.unlinkSync(testPath)
    })
})