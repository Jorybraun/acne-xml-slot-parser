import { createConfig, configFactory, Config } from "../utils/configFactory";
import * as fs from 'fs';

const testConfig = {
    toKeep: [ { bob: 'archer' } ],
    toRemove: [ { bob: 'archer' } ],
    keepAlive: true,
    inputPath: './file.xml',
    outputPath: { keepPath: './file', removePath: './remove' }
}

describe('configFactory', () => {

    it('should take in paramaters and return a config', () => {
        const config = configFactory(
            Config, {
                toRemove: [{ key: 'bob',  value: 'archer'}],
                toKeep: [{ key: 'bob', value: 'archer'}],
                siteSpecificKey: 'acne_se',
                keepAlive: true,
                inputPath: './file.xml',
                outputPath: {
                    keepPath: './file',
                    removePath: './remove'
                }
            }
        );
        expect(config).toMatchSnapshot()
    });

    it('should create a config file', () => {
        createConfig( {
                toRemove: [{ key: 'bob',  value: 'archer'}],
                toKeep: [{ key: 'bob', value: 'archer'}],
                siteSpecificKey: 'acne_se',
                keepAlive: true,
                inputPath: './file.xml',
                outputPath: {
                    keepPath: './file',
                    removePath: './remove'
                }
            }, './example.config.json'
        )
        .then(() => {
            const config = JSON.parse(fs.readFileSync('./example.config.json', 'utf-8'));
            expect(config).toMatchSnapshot();
            fs.unlinkSync('./example.config.json');
        })
    });
})