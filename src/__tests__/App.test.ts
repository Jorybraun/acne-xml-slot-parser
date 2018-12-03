import {App} from "../App";
import * as fs from 'fs';

describe('App', () => {

    describe('#constuctor', () => {
        it('should set the initial state', () => {
            const config = {
                toKeep: [],
                toRemove: [],
                siteSpecificKey: 'acne_se',
                keepAlive: true,
                inputPath: './path',
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            }

            const app = new App(config);
            expect(app.config).toEqual(config);
        });
    });

    describe('#getConfig', () => {
        it ('should throw error if config doesn\'t exist', async () => {
            try {
                await App.getConfig('./example.config.json')
            } catch (err) {
                expect(err.message).toBe('cant find config exists please change the name or call createConfigTemplate')
            }
        });

        it('should find config if config exists', async () => {
            const configTemplate = {
                toKeep: [],
                toRemove: [],
                siteSpecificKey: 'acne_se',
                keepAlive: true,
                inputPath: './path',
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            };

            await App.createConfigTemplate(configTemplate, './example.config.json');
            const res = (await App.getConfig('./example.config.json'));
            expect(res).toEqual(configTemplate);
            fs.unlinkSync('./example.config.json')
        })
    });

    describe('#createConfigTemplate', () => [
        it('should take a template and create config file based upon the file name', async () => {
            const templateLocation = './example.config.json';
            const configTemplate = {
                toKeep: [],
                toRemove: [],
                siteSpecificKey: 'acne_se',
                keepAlive: true,
                inputPath: './path',
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            };
            await App.createConfigTemplate(configTemplate, './example.config.json');
            expect(fs.existsSync('./example.config.json')).toBe(true);
            fs.unlinkSync(templateLocation)
        })
    ]);

    describe('#checkSlotForValues', () => {
        it ('should take a slot and check against key pairs', () => {
            const app = new App({
                toKeep: [],
                toRemove: [],
                siteSpecificKey: 'acne_se',
                keepAlive: true,
                inputPath: './path',
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            });
            const testSlot = {
                'content-id': 'acne_se'
            };

            expect(app.checkSlotForValues(testSlot, [{ key: 'content-id', value: 'acne_se' }])).toBe(true)

        });
    });

    describe('#filter', () => {
        it('should keep all slots', () => {
            const config = {
                toKeep: [],
                toRemove: [],
                siteSpecificKey: '',
                keepAlive: false,
                inputPath: `${__dirname}/testData/home.xml`,
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            };

            const app = new App(config);
            const filtered = app.filterXML();
            expect(filtered.keep.elements![0].elements!).toHaveLength(1334);
            expect(filtered.remove.elements![0].elements).toHaveLength(0);
        });

        it('should remove only keep slot-15', () => {
            const config = {
                toKeep: [],
                toRemove: [{ key: 'slot-id',  value: 'slot-15' }],
                siteSpecificKey: '',
                keepAlive: false,
                inputPath: `${__dirname}/testData/home.xml`,
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            };

            const app = new App(config);
            const filtered = app.filterXML();
            expect(filtered.remove.elements![0].elements).toHaveLength(15)
        });

        it('should only keep slot-15', () => {
            const config = {
                    toKeep: [{ key: 'slot-id', value: 'slot-15' }],
                    toRemove: [],
                    siteSpecificKey: '',
                    keepAlive: false,
                    inputPath: `${__dirname}/testData/home.xml`,
                    outputPath: {
                        keepPath: './keep.xml',
                        removePath: './remove.xml'
                    }
                };

            const app = new App(config);
            const filtered = app.filterXML();
            expect(filtered.keep.elements![0].elements!.length).toBe(15);
        });

        it('should only remove site specific keys', () => {
            const config = {
                toKeep: [],
                toRemove: [],
                siteSpecificKey: 'acne_se',
                keepAlive: false,
                inputPath: `${__dirname}/testData/home.xml`,
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            };

            const app = new App(config);
            const filtered = app.filterXML();
            expect(filtered.remove.elements![0].elements).toHaveLength(5);
        });

        it('should remove a slot if it contains a keep value and a remove a value', () => {
            const config = {
                toKeep: [ { key: 'slot-id',  value: 'slot-15' } ],
                toRemove: [
                    { key: 'context-id', value: 'woman-eyewear' },
                    { key: 'context-id', value: 'man-eyewear' }
                ],
                siteSpecificKey: '',
                keepAlive: false,
                inputPath: `${__dirname}/testData/slot15.xml`,
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            };

            const app = new App(config);
            const filtered = app.filterXML();
            expect(filtered.remove.elements![0].elements).toHaveLength(2);
        });

        it('should remove a slot if it contains a keep value and a remove a value', () => {
            const config = {
                toKeep: [ { key: 'slot-id',  value: 'slot-15' } ],
                toRemove: [
                    { key: 'context-id', value: 'woman-eyewear' },
                    { key: 'context-id', value: 'man-eyewear' }
                ],
                siteSpecificKey: '',
                keepAlive: false,
                inputPath: `${__dirname}/testData/home.xml`,
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            };

            const app = new App(config);
            const filtered = app.filterXML();
            expect(filtered.keep.elements![0].elements).toHaveLength(13);
        });

        it('should remove a slot if it contains a keep value and a remove a value', () => {
            const config = {
                toKeep: [ { key: 'slot-id',  value: 'slot-15' } ],
                toRemove: [
                    { key: 'context-id', value: 'woman-eyewear' },
                    { key: 'context-id', value: 'man-eyewear' }
                ],
                siteSpecificKey: '',
                keepAlive: true,
                inputPath: `${__dirname}/testData/home.xml`,
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            };

            const app = new App(config);
            const filtered = app.filterXML();
            expect(filtered.keep.elements![0].elements).toHaveLength(9);
        });

        it(`should remove filter programatically 
            and return alive slots that don\'t contain 
            sitespecific keys and remove values`, () => {
            const config = {
                toKeep: [ { key: 'slot-id',  value: 'slot-15' } ],
                toRemove: [
                    { key: 'context-id', value: 'woman-eyewear' },
                    { key: 'context-id', value: 'man-eyewear' }
                ],
                siteSpecificKey: 'jeans-w',
                keepAlive: true,
                inputPath: `${__dirname}/testData/home.xml`,
                outputPath: {
                    keepPath: './keep.xml',
                    removePath: './remove.xml'
                }
            };

            const app = new App(config);
            const filtered = app.filterXML();
            expect(filtered.keep.elements![0].elements).toHaveLength(7);
        });
    })
});