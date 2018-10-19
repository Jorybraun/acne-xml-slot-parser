import { createConfig, configFactory, Config } from "../configFactory";
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
            Config,
            [{'bob': 'archer'}],
            [{'bob': 'archer'}],
            true,
            './file.xml',
            {
                keepPath: './file',
                removePath: './remove'
            }
        );
        expect(config).toMatchSnapshot()
    });

    it('should create a config file', () => {
        createConfig(
            [{'bob': 'archer'}],
            [{'bob': 'archer'}],
            true,
            './file.xml',
            {
                keepPath: './file',
                removePath: './remove'
            }
        )
        .then(() => {
            const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
            expect(config).toMatchSnapshot();
            fs.unlinkSync('./config.json');
        })
    });
})