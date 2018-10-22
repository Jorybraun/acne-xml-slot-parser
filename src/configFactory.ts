const fs = require('fs');
const jsonfile = require('jsonfile');

interface KeyPair {
    [key: string]: string;
}

interface ConfigOutput {
    keepPath: string;
    removePath: string;
}

interface ConfigInterface {
    toKeep: KeyPair[];
    toRemove: KeyPair[];
    keepAlive: boolean;
    inputPath: string;
    outputPath: ConfigOutput
}

interface ConfigConstructor {
    new  (
        toRemove: KeyPair[],
        toKeep: KeyPair[],
        keepAlive: boolean,
        inputPath: string,
        outputPath: ConfigOutput
    ): ConfigInterface
}

export const configFactory = (
    ctor: ConfigConstructor,
    toKeep: KeyPair[],
    toRemove: KeyPair[],
    keepAlive: boolean,
    inputPath: string,
    outputPath: ConfigOutput
) => {
    return new ctor(toRemove, toKeep, keepAlive, inputPath, outputPath)
};

export class Config implements ConfigInterface {
    constructor(
        public toKeep: KeyPair[],
        public toRemove: KeyPair[],
        public keepAlive: boolean,
        public inputPath: string,
        public outputPath: ConfigOutput
    ) {}
}

export const createConfig = (
    toKeep: KeyPair[] = [{ 'key': 'this is an example' }],
    toRemove: KeyPair[] = [{ 'key': 'this is an example' }],
    keepAlive: boolean = false,
    inputPath: string = '.please input a input path here',
    outputPath: ConfigOutput = {
        keepPath: '.please input a path here',
        removePath: '.please input a path here'
    }
): Promise<ConfigInterface> => {
    const config = configFactory(Config, toKeep, toRemove, keepAlive, inputPath, outputPath)
    return jsonfile.writeFile('./config.json', config, { spaces: 2 });
}