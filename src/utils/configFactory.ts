/// <reference path="../types/jsonfile/index.d.ts" />
import { ConfigConstructor, ConfigInterface, ConfigOutput, KeyPair } from '../interfaces/Config';
// @ts-ignore
import * as jsonfile from 'jsonfile';

export const configFactory = (
    ctor: ConfigConstructor,
    { toKeep, toRemove, siteSpecificKey, keepAlive, inputPath, outputPath }: ConfigInterface
) => {
    return new ctor(toKeep, toRemove, siteSpecificKey, keepAlive, inputPath, outputPath);
};

export class Config implements ConfigInterface {
    constructor(
        public toKeep: KeyPair[],
        public toRemove: KeyPair[],
        public siteSpecificKey: string,
        public keepAlive: boolean,
        public inputPath: string,
        public outputPath: ConfigOutput
    ) {}
}

export const createConfig = (configInput: ConfigInterface, configOutputPath: string): Promise<void> => {
    const configOutput = configFactory(Config, configInput);
    return  jsonfile.writeFile(configOutputPath, configOutput, { spaces: 2 });
}

