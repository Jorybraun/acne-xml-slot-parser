export interface KeyPair {
    key: string,
    value: string
}

export interface ConfigOutput {
    keepPath: string;
    removePath: string;
}

export interface ConfigInterface {
    toKeep: KeyPair[];
    toRemove: KeyPair[];
    siteSpecificKey: string;
    keepAlive: boolean;
    inputPath: string;
    outputPath: ConfigOutput;
}

export interface ConfigConstructor {
    new  (
        toRemove: KeyPair[],
        toKeep: KeyPair[],
        siteSpecificKey: string,
        keepAlive: boolean,
        inputPath: string,
        outputPath: ConfigOutput
    ): ConfigInterface
}